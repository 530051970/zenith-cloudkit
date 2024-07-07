import * as cdk from 'aws-cdk-lib';
import { CustomResource, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { LambdaIntegration, MethodLoggingLevel, RestApi, TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway';
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
import { creatLambdaRole } from './roles';
import path = require('path');
import apigateway = require('aws-sdk/clients/apigateway');

export interface ApiProps {
  readonly bucketName: string;
}
export class ZenithCloudkitStack extends Stack {
  readonly apiFunction: Function;
  readonly userPool?: UserPool
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const websiteBucket = new Bucket(this, `${SolutionInfo.SOLUTION_SHORT_NAME}WebsiteBucket`, {
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });
  
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

    const lambdaRole = creatLambdaRole(this)

    const describeSubnetsLambda = new Function(this, 'DescribeSubnetsFunction', {
      runtime: Runtime.PYTHON_3_9,
      code: Code.fromAsset(path.join(__dirname, '../source/api/lambda/calcCidrBlocks')),
      handler: 'main.handler',
      role: lambdaRole
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

    rds.node.addDependency(network);

    const apiFunction = new DockerImageFunction(this, 'APIFunction', {
      code: DockerImageCode.fromImageAsset('source/api/biz'),
      vpc: defaultVpc,
      securityGroups: [rds.clientSecurityGroup],
      role: lambdaRole,
      environment: {
        userPoolId: cognito.userPool.userPoolId,
        userPoolClientId: cognito.userPoolClient.userPoolClientId
      }
    });

    const gateway = new RestApi(this, `${SolutionInfo.SOLUTION_SHORT_NAME}Api`, {
      restApiName: `${SolutionInfo.SOLUTION_SHORT_NAME}Api`,
      description: `${SolutionInfo.SOLUTION_SHORT_NAME}Api`,
      deployOptions:{
        stageName: 'dev',
        loggingLevel: MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        metricsEnabled: true
      }
    });

    const apiIntegration = new LambdaIntegration(apiFunction);

    const api = gateway.root.addResource('api');

    const authorizerFunction = new Function(this, 'NEWAuthorizerFunction', {
      runtime: Runtime.PYTHON_3_9,
      code: Code.fromAsset(path.join(__dirname, '../source/api/lambda/authorizer')),
      handler: 'main.handler',
      role: lambdaRole,
      environment: {
        LOG_LEVEL: 'info'
      }
    });

    const authorizer = new TokenAuthorizer(this, 'MyAuthorizer', {
      handler: authorizerFunction,
    });
    api.addMethod('GET', apiIntegration, {
      authorizer,
    }); 
    api.addMethod('POST', apiIntegration, {
      authorizer,
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
