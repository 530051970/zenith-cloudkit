import * as cdk from 'aws-cdk-lib';
import { CustomResource, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { AuthorizationType, LambdaIntegration, RestApi, TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { AllowedMethods, Distribution, OriginAccessIdentity, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { CanonicalUserPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Code, DockerImageCode, DockerImageFunction, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { execSync } from 'child_process';
import { Construct } from 'constructs';
import { Cognito } from './cognito';
import { SolutionInfo } from './constant';
import { Network } from './network';
import { createCognitoParameters } from './parameter';
import { Rds } from './rds';
import { creatDescribeSubnetsRole } from './roles';
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
  readonly userPool?: UserPool
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

    const cognito = new Cognito(this, 'Cognito', {
      inputParams: createCognitoParameters(this)
    })

    // Lookup the default VPC
    const defaultVpc = Vpc.fromLookup(this, 'DefaultVpc', {
      isDefault: true,
    });

    const describeSubnetsLambda = new Function(this, 'DescribeSubnetsFunction', {
      runtime: Runtime.PYTHON_3_9,
      code: Code.fromAsset('source/api/biz/lambda/calcCidrBlocks'),
      handler: 'main.handler',
      role: creatDescribeSubnetsRole(this)
      }
    )
    const describeSubnetsProvider = new Provider(this, 'DescribeSubnetsProvider', {
      onEventHandler: describeSubnetsLambda,
    });

    const describeSubnetsResource = new CustomResource(this, 'DescribeSubnetsResource', {
      serviceToken: describeSubnetsProvider.serviceToken,
      properties: {
        VpcId: defaultVpc.vpcId,
      },
    });

    const network = new Network(this, 'Network', {
      vpc: defaultVpc,
      cidrBlock: describeSubnetsResource.getAttString('NextCidrBlock'),
      nextCidrBlock: describeSubnetsResource.getAttString('NextNextCidrBlock')
    });

    const rds = new Rds(this, 'RDS', {
      vpc: defaultVpc,
      privateSubnets: defaultVpc.privateSubnets
    });

    // rds.addDependency(network)
    rds.node.addDependency(network);

    const apiFunction = new DockerImageFunction(this, 'APIFunction', {
      code: DockerImageCode.fromImageAsset('source/api/biz'),
      vpc: defaultVpc,
      securityGroups: [rds.clientSecurityGroup],
      environment: {
        userPoolId: cognito.userPool.userPoolId,
        userPoolClientId: cognito.userPoolClient.userPoolClientId
      }
    });

    const authFunction = new Function(this, 'AuthFunction', {
      functionName: 'AuthFunction',
      description: `${SolutionInfo.SOLUTION_FULL_NAME}AuthFunction`,
      runtime: Runtime.PYTHON_3_9,
      handler: 'main.handler',
      code: Code.fromAsset(path.join(__dirname, '../source/api/auth'), { exclude: ['venv', 'pytest'] }),
      memorySize: 3008,
      timeout: Duration.seconds(20),
      environment: {
        userPoolId: cognito.userPool.userPoolId,
        userPoolClientId: cognito.userPoolClient.userPoolClientId
      }
    });

    // 创建 HTTP API Gateway
    const gateway = new RestApi(this, `${SolutionInfo.SOLUTION_SHORT_NAME}Api`, {
      restApiName: `${SolutionInfo.SOLUTION_SHORT_NAME}Api`,
      description: `${SolutionInfo.SOLUTION_SHORT_NAME}Api`,
      deployOptions:{
        stageName: 'dev'
      }
    });

    const apiIntegration = new LambdaIntegration(apiFunction);
    const authIntegration = new LambdaIntegration(authFunction);

    const api = gateway.root.addResource('api');
    const authApi = gateway.root.addResource('auth');

    // 创建Lambda Authorizer函数
    const authorizerFunction = new Function(this, 'AuthorizerFunction', {
      runtime: Runtime.PYTHON_3_9,
      code: Code.fromAsset('source/api/biz/lambda/authorizer'),
      handler: 'main.handler',
    });

    // 创建Lambda Authorizer
    const authorizer = new TokenAuthorizer(this, 'MyAuthorizer', {
      handler: authorizerFunction,
    });
    api.addMethod('GET', apiIntegration, {
      authorizer,
    }); 
    api.addMethod('POST', apiIntegration, {
      authorizer,
    });
    authApi.addMethod('GET', authIntegration, {
      authorizationType: AuthorizationType.NONE,
    });
    
    

    new cdk.CfnOutput(this, 'portURL', {
      value: distribution.distributionDomainName,
    });
  }

  private genWebAssets(){
    const sourceDir = path.join(__dirname, '../source/app');
    execSync(`cd ${sourceDir} && sudo rm -rf build && npm i && npm run build`);
    return Source.asset(`${sourceDir}/build`)
  }

}
