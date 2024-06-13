import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy, Stack } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi, TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { AllowedMethods, Distribution, OriginAccessIdentity, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { CanonicalUserPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Code, DockerImageCode, DockerImageFunction, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { execSync } from 'child_process';
import { Construct } from 'constructs';
import { SolutionInfo } from './constant';
import path = require('path');
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface ApiProps {
  // readonly vpc: IVpc;
  readonly bucketName: string;
  // readonly rdsClientSecurityGroup: SecurityGroup;
  // readonly customDBSecurityGroup: SecurityGroup;
  // readonly oidcIssuer: string;
  // readonly oidcClientId: string;
}
export class ZenithCloudkitStack extends Stack {
  readonly apiFunction: Function;
  // private apiRole: Role;
  // private apiLayer: LayerVersion;
  // private code: AssetCode;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const websiteBucket = new Bucket(this, `${SolutionInfo.SOLUTION_SHORT_NAME}WebsiteBucket`, {
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });
    // this.apiRole = this.createRole();
    // this.apiLayer = this.createLayer();
    // this.code = Code.fromAsset(path.join(__dirname, '../source/api/src'), { exclude: ['venv', 'pytest'] });

    // this.apiFunction = this.createFunction('API', 'main.handler', 900);
  
    // Grant access to CloudFront
    const cloudfrontOAI = new OriginAccessIdentity(this, 'CloudFront-OAI', {
      comment: `OriginAccessIdentity (OAI) for ${id}`
    });

    websiteBucket.addToResourcePolicy(new PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [websiteBucket.arnForObjects('*')],
      principals: [new CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }));

    const distribution = new Distribution(this, `${SolutionInfo.SOLUTION_SHORT_NAME}Distribution`, {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(websiteBucket, { originAccessIdentity: cloudfrontOAI }),
        compress: true,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      },
      errorResponses:[
        {
          responsePagePath:'/index.html',
          responseHttpStatus:200,
          httpStatus:403
        }
      ]
    });

    new BucketDeployment(this, 'portal_deploy', {
      memoryLimit: 512,
      sources: [this.genWebAssets()],
      destinationBucket: websiteBucket,
    });

    const dockerFunction = new DockerImageFunction(this, 'DockerFunction', {
      code: DockerImageCode.fromImageAsset('source/api/src'),
    });

    // 创建 HTTP API Gateway
    const gateway = new RestApi(this, `${SolutionInfo.SOLUTION_SHORT_NAME}Api`, {
      restApiName: `${SolutionInfo.SOLUTION_SHORT_NAME}Api`,
      description: `${SolutionInfo.SOLUTION_SHORT_NAME}Api`
    });

    const apiIntegration = new LambdaIntegration(dockerFunction);

    const api = gateway.root.addResource('api');

    // 创建Lambda Authorizer函数
    const authorizerFunction = new Function(this, 'AuthorizerFunction', {
      runtime: Runtime.PYTHON_3_9,
      code: Code.fromAsset('source/api/src/lambda/authorizer'),
      handler: 'main.handler',
    });

    // 创建Lambda Authorizer
    const authorizer = new TokenAuthorizer(this, 'MyAuthorizer', {
      handler: authorizerFunction,
    });
    api.addMethod('GET', apiIntegration, {
      authorizer,
    }); 
   

    new cdk.CfnOutput(this, 'portURL', {
      value: distribution.distributionDomainName,
    });
  }

  private genWebAssets(){
    const sourceDir = path.join(__dirname, '../source/app');
    execSync(`cd ${sourceDir} && rm -rf build && npm i && npm run build`);
    return Source.asset(`${sourceDir}/build`)
  }

}
