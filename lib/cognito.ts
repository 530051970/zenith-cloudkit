/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { RemovalPolicy } from 'aws-cdk-lib';
import { AccountRecovery, AdvancedSecurityMode, CfnUserPoolUser, UserPool, UserPoolClient, VerificationEmailStyle } from 'aws-cdk-lib/aws-cognito';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { SolutionInfo } from './constant';

export interface CognitoProps {
  inputParams: any
}

/**
 * Cognito
 */
export class Cognito extends Construct {

  readonly userPool: UserPool;
  readonly userPoolClient: UserPoolClient;

  // Create a Cognito User Pool
  constructor(scope: Construct, id: string, props?: CognitoProps) {
    super(scope, id);
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
  this.userPoolClient = new UserPoolClient(this, `${SolutionInfo.SOLUTION_SHORT_NAME}UserPoolClient`, {
    userPool:this.userPool,
    generateSecret: false, // Optional: Set to true if you need a client secret
  });

  // const parameters = createZenithCloudkitParameters(this)
  const parameters = props?.inputParams
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
          Username: initialUserName,
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
  )
}
}
