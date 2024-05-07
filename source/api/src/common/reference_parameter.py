import os
import boto3
import logging
from common.constant import const

logger = logging.getLogger(const.LOGGER_API)
caller_identity = boto3.client('sts').get_caller_identity()
admin_account_id = caller_identity.get('Account')
admin_region = boto3.session.Session().region_name
admin_bucket_name = os.getenv(const.PROJECT_BUCKET_NAME, f"{const.ADMIN_BUCKET_NAME_PREFIX}-{admin_account_id}-{admin_region}")
partition = caller_identity['Arn'].split(':')[1]
url_suffix = const.URL_SUFFIX_CN if partition == const.PARTITION_CN else ''
public_account_id = const.PUBLIC_ACCOUNT_ID_CN if partition == const.PARTITION_CN else const.PUBLIC_ACCOUNT_ID_GLOBAL
