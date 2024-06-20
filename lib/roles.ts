import { Effect, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { SolutionInfo } from "./constant";

export const creatDescribeSubnetsRole = (scope: Construct) => {
    const apiRole = new Role(scope, 'APIRole', {
      roleName: `${SolutionInfo.SOLUTION_FULL_NAME}DescribeSubnetsRole`, //Name must be specified
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    const allStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'ec2:DescribeSubnets',
      ],
      resources: ['*'],
    });
    apiRole.addToPolicy(allStatement);

    return apiRole;
  }