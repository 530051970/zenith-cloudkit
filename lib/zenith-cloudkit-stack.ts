import * as cdk from 'aws-cdk-lib';
import { Duration, IgnoreMode, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { AllowedMethods, Distribution, OriginAccessIdentity, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Platform } from 'aws-cdk-lib/aws-ecr-assets';
import { CanonicalUserPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Architecture, DockerImageCode, DockerImageFunction } from 'aws-cdk-lib/aws-lambda';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { SOLUTION_SHORT_NAME } from './constant';
import path = require('path');
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ZenithCloudkitStack extends Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
      // Create an S3 bucket for hosting the static website
      const websiteBucket = new Bucket(this, `${SOLUTION_SHORT_NAME}WebsiteBucket`, {
        // websiteIndexDocument: 'index.html',
        publicReadAccess: false,
        blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        /**
         * The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
         * the new bucket, and it will remain in your account until manually deleted. By setting the policy to
         * DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
         */
        removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
        /**
         * For sample purposes only, if you create an S3 bucket then populate it, stack destruction fails.  This
         * setting will enable full cleanup of the demo.
         */
        autoDeleteObjects: true // NOT recommended for production code
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

    // Frontend Lambda function using Docker image
    const frontendFunction = new DockerImageFunction(this, 'FrontendFunction', {
      // code: DockerImageCode.fromImageAsset('./source/app'),
      memorySize: 2048,
      timeout: Duration.seconds(30),
      code: DockerImageCode.fromImageAsset(path.join(__dirname, './source/app'), {
        file: 'Dockerfile',
        ignoreMode: IgnoreMode.DOCKER,
        platform: Platform.LINUX_AMD64,
      }),
      architecture: Architecture.X86_64,
      // environment: {
      //   AAA: '',
      //   TARGET_BUCKET_NAME: websiteBucket.bucketName // 将目标存储桶名称传递给 Lambda 函数
      // }
    });
    // frontendFunction.

    // 创建 CloudFront 分布
    const distribution = new Distribution(this, `${SOLUTION_SHORT_NAME}MyDistribution`, {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(websiteBucket, { originAccessIdentity: cloudfrontOAI }),
        compress: true,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      }
    });

    // 输出 CloudFront 分布的域名
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.domainName
    });
  

  
      // Backend Lambda function
      // const backendFunction = new Function(this, 'BackendFunction', {
      //   runtime: ,
      //   handler: 'backend.handler',
      //   code: lambda.Code.fromAsset('backend'),
      // });
  
      // // Create a Cognito User Pool
      // const userPool = new UserPool(this, 'UserPool', {
      //   selfSignUpEnabled: true,
      //   signInAliases: { email: true },
      // });
  
      // // Create a Cognito User Pool Client
      // const userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
      //   userPool,
      //   authFlows: { userPassword: true, userSrp: true },
      // });
  
      // // Create an API Gateway REST API
      // const api = new RestApi(this, 'ApiGateway', {
      //   defaultCorsPreflightOptions: {
      //     allowOrigins: Cors.ALL_ORIGINS,
      //     allowMethods: Cors.ALL_METHODS,
      //   },
      // });
  
      // // Create an authorizer using Cognito
      // const authorizer = new CognitoUserPoolsAuthorizer(this, 'CognitoAuthorizer', {
      //   cognitoUserPools: [userPool],
      //   authorizerName: 'CognitoAuthorizer',
      //   identitySource: 'method.request.header.Authorization',
      // });
  
      // // Define API Gateway resources and methods
      // const apiResource = api.root.addResource('myresource');
      // const apiIntegration = new LambdaIntegration(frontendFunction);
      // apiResource.addMethod('GET', apiIntegration, { authorizer });
  
      // Output the CloudFront distribution URL
      new cdk.CfnOutput(this, 'DistributionUrl', {
        value: distribution.distributionDomainName,
      });
    
    
  }
}
