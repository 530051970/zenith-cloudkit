export enum AppSyncAuthType {
  OPEN_ID = 'AUTH_TYPE.OPENID_CONNECT',
  AMAZON_COGNITO_USER_POOLS = 'AMAZON_COGNITO_USER_POOLS',
  WITHOUT_AUTH = 'WITHOUT_AUTH'
}

export interface AmplifyConfigType {
  aws_project_region: string;
  aws_api_endpoint: string;
  aws_authenticationType: AppSyncAuthType;
  aws_oidc_issuer: string;
  aws_oidc_client_id: string;
  aws_oidc_customer_domain: string;
  aws_oidc_logout_endpoint: string;
  aws_alb_url: string;
  aws_cognito_region: string;
  aws_user_pools_id: string;
  aws_user_pools_web_client_id: string;
  version: string;
  backend_url: string;
  expired: number;
}
