import logging
import boto3
import json
import traceback
# import requests
import os
import pymysql
import cfnresponse

logger = logging.getLogger('init_db')
logger.setLevel(logging.INFO)
request_type_list = ["Create","Update","Delete"]


def lambda_handler(event, context):
    logger.info(event)
    try:
        request_type = event['RequestType']
        if request_type not in request_type_list:
            # send_response(event,"FAILED","request type not in list")
            cfnresponse.send(event, context, cfnresponse.FAILED, {"Message": "request type not in list"})
            return

        if request_type == 'Create':
            on_create(event)
        elif request_type == 'Update':
            on_update(event)
        elif request_type == 'Delete':
            on_delete(event)
        # send_response(event)
        cfnresponse.send(event, context, cfnresponse.SUCCESS, {})
    except Exception:
        error_msg = traceback.format_exc()
        logger.exception(error_msg.replace("\n", "\r"))
        # send_response(event, "FAILED" ,error_msg)
        cfnresponse.send(event, context, cfnresponse.FAILED, {"Message": error_msg})


# def send_response(event, response_status = "SUCCESS", reason = "OK"):
#     response_url = event['ResponseURL']
#     response_body = {}
#     response_body['Status'] = response_status
#     response_body['PhysicalResourceId'] = event['PhysicalResourceId'] if 'PhysicalResourceId' in event else event['LogicalResourceId']
#     response_body['StackId'] = event['StackId']
#     response_body['RequestId'] = event['RequestId']
#     response_body['LogicalResourceId'] = event['LogicalResourceId']
#     response_body['Reason'] = reason

#     json_response_body = json.dumps(response_body)

#     headers = {
#         'content-type': '',
#         'content-length': str(len(json_response_body))
#     }
#     response = requests.put(response_url,
#                             data=json_response_body,
#                             headers=headers)
#     return response


def on_create(event):
    main(event,"whole")


def on_update(event):
    logger.info("Got Update")
    # main(event,"1.0.0-1.0.1")
    # main(event,"1.0.1-1.0.2")
    # main(event,"1.0.x-1.1.0")
    # main(event,"1.1.0-1.1.2")


def on_delete(event):
    logger.info("Got Delete")


def __get_sql_files(path):
    files = []
    filenames = os.listdir(path)
    for filename in filenames:
        if filename.endswith(".sql"):
            files.append(f"{path}/{filename}")
    list.sort(files)
    return files


def __exec_file(cursor, sql_file):
    logger.info(f"exec file:{sql_file}")
    with open(sql_file, 'r') as f:
        full_sql = f.read()
    all_sql = full_sql.split(";")
    for sql in all_sql:
        sql = sql.strip()
        if sql == "":
            continue
        cursor.execute(sql)


def __check_version(cursor, path):
    if path == 'whole':
        logger.info('Whole install')
        return True
    sql = 'select value from version'
    check = True
    to_version = path.split("-")[1]
    logger.info(f"To Version:{to_version}")
    cursor.execute(sql)
    results = cursor.fetchall()
    for row in results:
        if row[0] == to_version:
            check = False
            break
    logger.info(f"Check result:{check}")
    return check


def main(event,path):
    secret_id = os.getenv("SecretId")
    secrets_client = boto3.client('secretsmanager')
    secret_response = secrets_client.get_secret_value(SecretId=secret_id)
    secrets = json.loads(secret_response['SecretString'])
    db = pymysql.connect(host=secrets['host'],
                         port=secrets['port'],
                         user=secrets['username'],
                         password=secrets['password'],
                         database=secrets['dbname'])
    db.autocommit(True)
    cursor = db.cursor()
    try:
        check_result = __check_version(cursor, path)
        if not check_result:
            logger.info(f"The upgrade script({path}) is currently included.")
            return
        sql_files = __get_sql_files(path)
        for sql_file in sql_files:
            __exec_file(cursor, sql_file)
    finally:
        cursor.close()
        db.close()
