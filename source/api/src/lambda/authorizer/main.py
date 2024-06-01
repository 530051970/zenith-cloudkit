import logging
import os
import json

logger = logging.getLogger('api')
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    """
    Those configration will be needed by portal UI.
    """

    body = {
        "aws_project_region": os.getenv('aws_project_region', ''),
        "aws_api_endpoint": os.getenv('aws_api_endpoint', '/api'),
        "aws_authenticationType": os.getenv('aws_authenticationType', 'AUTH_TYPE.OPENID_CONNECT'),
        "aws_oidc_issuer": os.getenv('aws_oidc_issuer', ''),
        "aws_oidc_client_id": os.getenv('aws_oidc_client_id', ''),
        "aws_oidc_customer_domain": os.getenv('aws_oidc_customer_domain', ''),
        "aws_oidc_logout": os.getenv('aws_oidc_logout', ''),
        "aws_cognito_region": os.getenv('aws_cognito_region', ''),
        "aws_user_pools_id": os.getenv('aws_user_pools_id', ''),
        "aws_user_pools_web_client_id": os.getenv('aws_user_pools_web_client_id', ''),
        "version": os.getenv('version', 'v1.0.0'),
        "backend_url": os.getenv('backend_url', ''),
        "expired": os.getenv('expired', 12)
    }

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body)
    }
