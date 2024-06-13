import { AuthFlowType, CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

const initiateAuth = async (clientId: string, region: string, username:string, password:string) => {
    const params = {
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: clientId,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        }
    }
    const client = new CognitoIdentityProviderClient({
        region,
    });
    const command = new InitiateAuthCommand(params);
    return await client.send(command);
};

module.exports = { initiateAuth };