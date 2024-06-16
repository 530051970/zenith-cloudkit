import { CfnParameter } from 'aws-cdk-lib';
import { Construct } from 'constructs';


export interface ZenithCloudKitProps {
  readonly initialUserName: string;
  readonly initialUserEmail: string;
  readonly initialPassword: string;

}

export function createZenithCloudkitParameters(scope: Construct): {
  metadata: {
    [key: string]: any;
  };
  params: ZenithCloudKitProps;
} {
  const zenithCloukKitParamsGroup = [];

  const initialUserNameParam = new CfnParameter(scope, 'InitialUserName', {
    description: 'Initial user name.',
    type: 'String',
    allowedPattern: '^\\w+([-+.]\\w+)*$',
    default: 'primary',
  });

  const initialUserEmailParam = new CfnParameter(scope, 'InitialUserEmail', {
    description: 'Initial user email.',
    type: 'String',
    // allowedPattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    default: 'primary',
  });

  const initialPasswordParam = new CfnParameter(scope, 'InitialPassword', {
    description: 'Initial password.',

    type: 'String',
  });

  zenithCloukKitParamsGroup.push({
    Label: { default: 'Initial User Information' },
    Parameters: [
      initialUserNameParam.logicalId,
      initialUserEmailParam.logicalId,
      initialPasswordParam.logicalId,
    ],
  });

  const initialUserNameParamLabels = {
    [initialUserNameParam.logicalId]: {
      default: 'Initial User Name',
    },
  };

  const initialUserEmailParamLabels = {
    [initialUserEmailParam.logicalId]: {
      default: 'Initial User Email',
    },
  };

  const initialPasswordParamLabels = {
    [initialPasswordParam.logicalId]: {
      default: 'Initial User Password',
    },
  };

  

  const metadata = {
    'AWS::CloudFormation::Interface': {
      ParameterGroups: [
        ...zenithCloukKitParamsGroup,
      ],
      ParameterLabels: {
        ...initialUserNameParamLabels,
        ...initialUserEmailParamLabels,
        ...initialPasswordParamLabels,
      },
    },
  };

  return {
    metadata,
    params: {
      initialUserName: initialUserNameParam.valueAsString,
      initialUserEmail: initialUserEmailParam.valueAsString,
      initialPassword: initialPasswordParam.valueAsString,
    },
  };

  // readonly initialUserName: string;
  // readonly initialUserEmail: string;
  // readonly InitialPassword: string;

}