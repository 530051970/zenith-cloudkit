import { Effect, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { SolutionInfo } from "./constant";

export const creatLambdaRole = (scope: Construct) => {
    const lambdaRole = new Role(scope, 'LambdaRole', {
      roleName: `${SolutionInfo.SOLUTION_FULL_NAME}LambdaRole`, //Name must be specified
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    const describeSubnetsStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'ec2:DescribeSubnets',
      ],
      resources: ['*'],
    });
    lambdaRole.addToPolicy(describeSubnetsStatement);

    const logLambdaStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents'
      ],
      resources: ['*'],
    });
    lambdaRole.addToPolicy(logLambdaStatement);

    return lambdaRole;
  }
