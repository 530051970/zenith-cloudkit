import * as cdk from 'aws-cdk-lib';
import { Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { AuthorizationType, LambdaIntegration, RestApi, TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { AllowedMethods, Distribution, OriginAccessIdentity, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { AccountRecovery, AdvancedSecurityMode, CfnUserPoolUser, UserPool, UserPoolClient, VerificationEmailStyle } from 'aws-cdk-lib/aws-cognito';
import { CanonicalUserPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Code, DockerImageCode, DockerImageFunction, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { execSync } from 'child_process';
import { Construct } from 'constructs';
import { SolutionInfo } from './constant';
import { createZenithCloudkitParameters } from './parameter';
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

    // Create a Cognito User Pool
    this.userPool = new UserPool(this, `${SolutionInfo.SOLUTION_SHORT_NAME}UserPool`, {
      selfSignUpEnabled: true,
      signInAliases: { username: true },
      signInCaseSensitive: false,
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.DESTROY,
      userVerification: {
        emailStyle: VerificationEmailStyle.LINK,
      },
      advancedSecurityMode: AdvancedSecurityMode.ENFORCED,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
    });

    // Create a Cognito App Client
    const userPoolClient = new UserPoolClient(this, `${SolutionInfo.SOLUTION_SHORT_NAME}UserPoolClient`, {
      userPool:this.userPool,
      generateSecret: false, // Optional: Set to true if you need a client secret
    });

    const parameters = createZenithCloudkitParameters(this)

    // Add initialUser
    const initialUserName = parameters.params.initialUserName;
    const initialUserEmail = parameters.params.initialUserEmail;
    const initialPassword = parameters.params.initialPassword;
    new CfnUserPoolUser(this, 'AdminUser', {
      userPoolId: this.userPool.userPoolId,
      username: initialUserName,
      desiredDeliveryMediums: ['EMAIL'],
      forceAliasCreation: false,
      messageAction: 'SUPPRESS',
      userAttributes: [
        {
          name: 'email',
          value: initialUserEmail,
        },
        {
          name: 'email_verified',
          value: 'true',
        },
      ],
    });

    new AwsCustomResource(
      this,
      'AwsCustomResource-ForcePassword',
      {
        onCreate: {
          service: 'CognitoIdentityServiceProvider',
          action: 'adminSetUserPassword',
          parameters: {
            UserPoolId: this.userPool.userPoolId,
            Username: 'cuihubin@amazon.com',
            Password: initialPassword,
            Permanent: true,
          },
          physicalResourceId: PhysicalResourceId.of(
            `AwsCustomResource-ForcePassword-${initialUserName}`,
          ),
        },
        policy: AwsCustomResourcePolicy.fromSdkCalls({
          resources: AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
        installLatestAwsSdk: true,
      },
    );

    // // Create a Lambda function to create the admin user
    // const createAdminUserLambda = new Function(this, 'CreateAdminUserLambda', {
    //   runtime: lambda.Runtime.NODEJS_14_X,
    //   handler: 'index.handler',
    //   code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
    //   environment: {
    //     USER_POOL_ID: userPool.userPoolId,
    //     ADMIN_EMAIL: 'admin@example.com',  // Replace with your admin email
    //     ADMIN_PASSWORD: 'Admin1234!',      // Replace with your admin password (should comply with password policy)
    //   },
    // });

    // // Grant the Lambda function permissions to administer the User Pool
    // userPool.grantAdminCreateUser(createAdminUserLambda);
    // userPool.grant(createAdminUserLambda, 'cognito-idp:AdminAddUserToGroup');

    // // Create a custom resource to trigger the Lambda function after the User Pool is created
    // const provider = new cr.Provider(this, 'CreateAdminUserProvider', {
    //   onEventHandler: createAdminUserLambda,
    // });

    // new cdk.CustomResource(this, 'CreateAdminUserResource', { 
    //   serviceToken: provider.serviceToken 
    // });

    const apiFunction = new DockerImageFunction(this, 'APIFunction', {
      code: DockerImageCode.fromImageAsset('source/api/biz'),
      environment: {
        userPoolId: this.userPool.userPoolId,
        userPoolClientId: userPoolClient.userPoolClientId
      }
    });

    const authFunction = new Function(this, 'AuthFunction', {
      functionName: 'AuthFunction',
      description: `${SolutionInfo.SOLUTION_FULL_NAME}AuthFunction`,
      runtime: Runtime.PYTHON_3_9,
      handler: 'auth.main.handler',
      code: Code.fromAsset(path.join(__dirname, '../source/api/auth'), { exclude: ['venv', 'pytest'] }),
      memorySize: 3008,
      timeout: Duration.seconds(20),
      // role: this.apiRole,
      // layers: [this.apiLayer],
      environment: {
        userPoolId: this.userPool.userPoolId,
        userPoolClientId: userPoolClient.userPoolClientId
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
