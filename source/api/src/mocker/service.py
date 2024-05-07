import boto3
import pandas
import logging
import random
import pymysql
from typing import List, Union
from io import BytesIO
from .schemas import RDSMocker, JDBCMocker, CopyS3Bucket, Hudi2S3Mocker, JsonMocker, CSVMocker
from faker import Faker
from sqlalchemy.types import (BOOLEAN, CHAR, DATE, DATETIME, DECIMAL, INT, SMALLINT, TEXT, TIME, TIMESTAMP, String)
from sqlalchemy import create_engine
from .column_generator.address import generate_chinese_address
from .column_generator.personal import generate_cnid
from .column_generator.personal import generate_cell
from .column_generator.personal import generate_passport
from .column_generator.vehicle import generate_licenseplate
from .column_generator.personal import generate_landline
from .column_generator.personal import generate_zhcn_name
from .column_generator.personal import generate_pinyin_name
from .column_generator.region import generate_region
from .column_generator.personal import generate_english_name
from .column_generator.personal import generate_personal_basic_info
from .column_generator.financial import generate_savings_account
from .column_generator.financial import generate_financial_basic
from .column_generator.random import generate_random_chinese
from .column_generator.date import generate_date
from .loader.loader import (load_us_address_dict,
                            load_cn_address_dict,
                            load_cnid_dict,
                            load_landline_dict,
                            load_cn_name_dict,
                            load_region_dict,
                            load_en_name_dict,
                            load_chinese_sentence_list,
                            load_english_sentence_list
                            )

logger = logging.getLogger("tools")
fake = Faker(locale='zh_CN')
# random_types = [INT,
#                 String(length=255),
#                 TEXT,
#                 DATETIME,
#                 DECIMAL,
#                 SMALLINT,
#                 CHAR,
#                 DATE,
#                 TIME,
#                 TIMESTAMP]
random_types = ["int",
                "string",
                "text",
                "datetime",
                "decimal",
                "smallint",
                "char",
                "date",
                "time",
                "timestamp"]
probabilities = [0.25, 0.2, 0.1, 0.25, 0.04,  0.04,  0.03, 0.05, 0.01, 0]
column_generation_mapping = dict()
column_generation_mapping["cn_address"] = generate_chinese_address.generate_multiple_cn_address
column_generation_mapping["cnid"] = generate_cnid.generate_multiple_cnid
column_generation_mapping["cn_cellphone"] = generate_cell.generate_multiple_cellphone_number
column_generation_mapping["passport"] = generate_passport.generate_multiple_passport_number
column_generation_mapping["cn_car_license"] = generate_licenseplate.generate_multiple_license_plate_number
column_generation_mapping["cn_landline"] = generate_landline.generate_multiple_landline_phone_number
column_generation_mapping["cn_name"] = generate_zhcn_name.generate_multiple_name_zhcn
column_generation_mapping["pinyin_name"] = generate_pinyin_name.generate_multiple_name_pinyin
column_generation_mapping["region"] = generate_region.generate_multiple_region
column_generation_mapping["en_name"] = generate_english_name.generate_multiple_name_us
column_generation_mapping["cn_savings_account"] = generate_savings_account.generate_multiple_savings_account
column_generation_mapping["cn_random"] = generate_random_chinese.generate_multiple_random_text_from_sentence
column_generation_mapping["date"] = generate_date.generate_multiple_date
column_generation_mapping["count"] = generate_personal_basic_info.generate_counts
column_generation_mapping["price"] = generate_financial_basic.generate_multiple_price
column_generation_mapping["email"] = generate_personal_basic_info.generate_multiple_email
column_generation_mapping["ipv4"] = generate_personal_basic_info.generate_multiple_ipv4address
column_generation_mapping["cvv"] = generate_financial_basic.generate_multiple_cvv

load_data_mapping = dict()
load_data_mapping["cn_address"] = load_cn_address_dict
load_data_mapping["us_address"] = load_us_address_dict
load_data_mapping["cnid"] = load_cnid_dict
load_data_mapping["cn_landline"] = load_landline_dict
load_data_mapping["cn_name"] = load_cn_name_dict
load_data_mapping["pinyin_name"] = load_cn_name_dict
load_data_mapping["region"] = load_region_dict
load_data_mapping["en_name"] = load_en_name_dict
load_data_mapping["cn_random"] = load_chinese_sentence_list
load_data_mapping["en_random"] = load_english_sentence_list

schema = [{"column_name": "cn_name", "type": String(length=255), "column_content": {"cn_name": 0.7}, "shuffle_column": True}, 
          {"column_name": "cn_address", "type": String(length=255), "column_content": {"cn_address": 0.7}, "shuffle_column": True},
          {"column_name": "cnid", "type": String(length=255), "column_content": {"cnid": 0.7}, "shuffle_column": True},
          {"column_name": "cn_cellphone", "type": String(length=255), "column_content": {"cn_cellphone": 0.7}, "shuffle_column": True},
          {"column_name": "passport", "type": String(length=255), "column_content": {"passport": 0.7}, "shuffle_column": True},
          {"column_name": "cn_car_license", "type": String(length=255), "column_content": {"cn_car_license": 0.7}, "shuffle_column": True},
          {"column_name": "cn_landline", "type": String(length=255), "column_content": {"cn_landline": 0.7}, "shuffle_column": True},
          {"column_name": "pinyin_name", "type": String(length=255), "column_content": {"pinyin_name": 0.7}, "shuffle_column": True},
          {"column_name": "region", "type": String(length=255), "column_content": {"region": 0.7}, "shuffle_column": True},
          {"column_name": "en_name", "type": String(length=255), "column_content": {"en_name": 0.7}, "shuffle_column": True},
          {"column_name": "cn_savings_account", "type": String(length=255), "column_content": {"cn_savings_account": 0.7}, "shuffle_column": True},
          {"column_name": "cn_random", "type": String(length=255), "column_content": {"cn_random": 0.7}, "shuffle_column": True},
          {"column_name": "date", "type": String(length=255), "column_content": {"date": 0.7}, "shuffle_column": True},
          {"column_name": "count", "type": String(length=255), "column_content": {"count": 0.7}, "shuffle_column": True},
          {"column_name": "price", "type": String(length=255), "column_content": {"price": 0.7}, "shuffle_column": True},
          {"column_name": "email", "type": String(length=255), "column_content": {"email": 0.7}, "shuffle_column": True},
          {"column_name": "ipv4", "type": String(length=255), "column_content": {"ipv4": 0.7}, "shuffle_column": True},
          {"column_name": "cvv", "type": String(length=255), "column_content": {"cvv": 0.7}, "shuffle_column": True}]

default_fields = ["cn_address",
                 "cnid",
                 "cn_cellphone",
                 "passport",
                 "cn_car_license",
                 "cn_landline",
                 "cn_name",
                 "pinyin_name",
                 "region",
                 "en_name",
                 "cn_savings_account",
                 "cn_random",
                 "date",
                 "count",
                 "price",
                 "email",
                 "ipv4",
                 "cvv"]

def gen_data_2_jdbc(mock: JDBCMocker):
    # rds_client = boto3.client('rds',
    #                           aws_access_key_id=mock.access_key,
    #                           aws_secret_access_key=mock.secret_key,
    #                           region_name=mock.region)
    # response = rds_client.describe_db_instances(DBInstanceIdentifier=mock.instance_id)
    # db_endpoint = response['DBInstances'][0]['Endpoint']['Address']
    required_fields = mock.required_fields if mock.required_fields else default_fields
    table_schema = __general_data_schema(required_fields, mock.column_num_per_table)
    __create_database(mock, None)
    return __create_table_data(table_schema, mock, None)

def gen_data_2_rds(mock: RDSMocker):
    rds_client = boto3.client('rds',
                              aws_access_key_id=mock.access_key,
                              aws_secret_access_key=mock.secret_key,
                              region_name=mock.region)
    response = rds_client.describe_db_instances(DBInstanceIdentifier=mock.instance_id)
    db_endpoint = response['DBInstances'][0]['Endpoint']['Address']
    required_fields = mock.required_fields if mock.required_fields else default_fields
    table_schema = __general_data_schema(required_fields, mock.column_num_per_table)
    __create_database(mock, db_endpoint)
    return __create_table_data(table_schema, mock, db_endpoint)

def __create_database(mock: Union[RDSMocker, JDBCMocker], db_endpoint):
    # conn = pymysql.connect(host="localhost" if db_endpoint else mock.url, user=mock.db_username, password=mock.db_password,
    #                        port=3306, connect_timeout=5)
    conn = pymysql.connect(host=db_endpoint if db_endpoint else mock.url, user=mock.db_username, password=mock.db_password,
                           port=mock.port, connect_timeout=5)
    # create database if not exists
    # TODO:DB existed? exit:continue
    with conn.cursor() as cur:
        cur.execute(f"CREATE DATABASE IF NOT EXISTS {mock.db_name} CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci")
    conn.commit()
    conn.close()

def __general_data_schema(required_fields: List[str], field_num: int):
    data_schema = []
    if required_fields:
        # print(f"required_fields===== is {required_fields}")
        data_schema = [item for item in schema if item["column_name"] in required_fields]
        # print(f"data_schema===== is {data_schema}")
    if field_num:
        other_column_num = field_num - len(required_fields)
        # print(f"other_column_num is {other_column_num}")
        if other_column_num > 0:
            for i in range(other_column_num):
                type_random = random.choices(random_types, probabilities)[0]
                data_schema.append({"column_name": f"random_column_{i+1}", "type": type_random, "column_content": {f"{type_random}_random_column_{i+1}": 0.7}, "shuffle_column": True})
    return data_schema

def __create_table_data(table_schema, mock: Union[RDSMocker, JDBCMocker], db_endpoint):
    db_connection_str = f'mysql+pymysql://{mock.db_username}:{mock.db_password}@{db_endpoint if db_endpoint else mock.url}:{mock.port}/{mock.db_name}?charset=utf8mb4&collation=utf8mb4_general_ci'
    # db_connection_str = f'mysql+pymysql://{mock.db_username}:{mock.db_password}@localhost:3306/{mock.db_name}'
    db_connection = create_engine(db_connection_str)
    required_source_data = load_required_source_data(table_schema)

    if mock.table_num == 1:
        insert_data_2_table(table_schema, db_connection, mock.table_name_prefix, required_source_data, mock.row_num_per_table)
    else:
        for i in range(mock.table_num):
            insert_data_2_table(table_schema, db_connection, f"{mock.table_name_prefix}_{i+1}", required_source_data, mock.row_num_per_table) 
            
    return {
        'statusCode': 200,
        'body': f"Data mock completed! Total {mock.table_num} tables, each table has {mock.column_num_per_table} columns, {mock.row_num_per_table} rows "
    }

def insert_data_2_table(table_schema, db_connection, table: str, required_source_data, row_num_per_table):
    dtype={obj["column_name"]: __convert_str_2_sql_type(obj.get("type")) for obj in table_schema}
    print(f"dtype is========= {dtype}")
    df = pandas.DataFrame(generate_dataframe(row_num_per_table, table_schema, required_source_data))
    df.to_sql(table, con=db_connection, if_exists='replace', index=False, dtype=dtype)  
    print(f"{table} data inserted successfully !!") 

def __convert_str_2_sql_type(type_str: str or None):
    type_mapping_dict= {
        "int": INT,
        "string": String(length=255),
        "text": TEXT,
        "datetime": DATETIME,
        "decimal": DECIMAL,
        "smallint": SMALLINT,
        "char": CHAR,
        "date": DATE,
        "time": TIME,
        "timestamp": TIMESTAMP
    }
    return type_mapping_dict.get(type_str) if type_mapping_dict.get(type_str) else type_str
    

def generate_dataframe(rows, table_schema, required_source_data, generate_label=False):
    # print(f"table_schema is {table_schema}")
    raw_data_dict = dict()
    for _, column in enumerate(table_schema):
        combined_column, combined_column_label = [], []
        for entity_type, entity_type_percent in column["column_content"].items():
            if entity_type not in required_source_data:
                # print(f"{entity_type} not in required_source_data")
                if entity_type in column_generation_mapping:
                    entity_type_content = column_generation_mapping[entity_type](int(rows * entity_type_percent))
                else:
                    # print(f"{entity_type} not in column_generation_mapping")
                    random_type = entity_type.split("_")[0]
                    # print(f"random_type is {random_type}")
                    entity_type_content = []
                    for i in range(int(rows * entity_type_percent)):
                        entity_type_content.append(gen_random_value(random_type))
            else:
                # print(f"{entity_type} in required_source_data")
                if entity_type in column_generation_mapping:
                    entity_type_content = column_generation_mapping[entity_type](int(rows * entity_type_percent), required_source_data[entity_type])
                else:
                    pass
            combined_column.extend(entity_type_content)
            if generate_label:
                combined_column_label.extend([entity_type] * int(rows * entity_type_percent))
        shuffle_random_seed = random.randint(1, 1000000)

        # print(f"combined_column is {combined_column}")
        filled_list = fill_list(combined_column, rows)
        if column["shuffle_column"]:
            filled_list = shuffle_list(filled_list, shuffle_random_seed)
        raw_data_dict[column["column_name"]] = filled_list

        if generate_label:
            filled_list_label = fill_list(combined_column_label, rows)
            if column["shuffle_column"]:
                filled_list_label = shuffle_list(filled_list_label, shuffle_random_seed)
            raw_data_dict[column["column_name"] + "_label"] = filled_list_label
    return raw_data_dict

# Extend the input list to num_rows by adding empty strings inside
def fill_list(input_list, num_rows):

    if len(input_list) > num_rows:
        print("Exceeding num of rows. Please check the args.")
        input_list = input_list[:num_rows]
    else:
        empty_list_size = num_rows - len(input_list)
        empty_list = [None] * empty_list_size
        input_list.extend(empty_list)

    return input_list

def shuffle_list(input_list, random_seed):
    random.seed(random_seed)
    random.shuffle(input_list)
    return input_list

def load_required_source_data(schema):
    required_source_data = dict()
    for _, column in enumerate(schema):
        for entity_type, _ in column["column_content"].items():
            if entity_type in load_data_mapping.keys():
                if entity_type not in required_source_data.keys():
                    required_source_data[entity_type] = load_data_mapping[entity_type]()
            else:
                print(f"{entity_type}-{type(entity_type)}!!!!")
                # required_source_data[entity_type] = gen_random_value(entity_type)
    return required_source_data

def gen_random_value(random_type: str):
    if random_type == "int":
        return fake.pyint()
    elif random_type == "string":
        return fake.pystr()
    elif random_type == "text":
        return fake.text(max_nb_chars=20)
    elif random_type == "datetime":
        return fake.date_time()
    # elif random_type == "BOOLEAN":
    #     return fake.boolean()
    elif random_type == "decimal":
        return fake.pydecimal(left_digits=3, right_digits=3, positive=True)
    elif random_type == "smallint":
        return fake.random_int(min=0, max=128)
    elif random_type == "char":
        return fake.random_element()
    elif random_type == "date":
        return fake.date()
    elif random_type == "time":
        return fake.time()
    elif random_type == "timestamp":
        return fake.unix_time()
    else:
        return None

def copy_s3_bucket(mock: CopyS3Bucket):
    sts_client = boto3.client('sts')
    assumed_role = sts_client.assume_role(
        RoleArn=f"arn:aws-cn:iam::{mock.destination_account_id}:role/copy_s3_from_other_account",
        RoleSessionName="CopyS3Bucket"
    )
    destination_s3_client = boto3.client(
        's3',
        aws_access_key_id=assumed_role['Credentials']['AccessKeyId'],
        aws_secret_access_key=assumed_role['Credentials']['SecretAccessKey'],
        aws_session_token=assumed_role['Credentials']['SessionToken'],
        region_name=mock.destination_region
    )
    source_s3_client = boto3.client('s3')
    k=int(mock.source_prefix)
    for i in range(int(mock.source_prefix),5000):
        print(f"start to copy {i}...")
        response = source_s3_client.list_objects_v2(Bucket=mock.source_bucket, Prefix=str(i))
        print(f"find objects {len(response.get('Contents', []))}")
        for obj in response.get('Contents', []):
            source_key = obj['Key']
            # destination_key = source_key.replace(str(i), mock.destination_prefix, 1)  # Replace source prefix with destination prefix
            destination_key = source_key
            destination_s3_client.copy_object(
                Bucket=mock.destination_bucket,
                CopySource={'Bucket': mock.source_bucket, 'Key': source_key},
                Key=destination_key
            )
            print(f"copy object {mock.source_bucket}-{source_key} to {mock.destination_bucket}-{destination_key}")
            
#     # 初始化 Spark 会话            
# def gen_hudi_2_s3(mocker: Hudi2S3):
#     spark = SparkSession.builder.appName("GenHudiToS3") \
#             .config("spark.driver.bindAddress", "127.0.0.1") \
#             .config("spark.jars", "lib/hudi-spark-bundle_2.12-0.14.0.jar") \
#             .getOrCreate()
    
#     sc = spark.sparkContext
#     sc.setLogLevel("INFO")
    
#     # 示例数据生成
#     data = {'id': [1, 2],
#             'name': ['John Doe', 'Jane Doe'],
#             'city': ['New York', 'San Francisco'],
#             'timestamp': [datetime.now(), datetime.now()]}
    
#     # 创建 pandas DataFrame
#     pandas_df = pandas.DataFrame(data)
#     spark_df = spark.createDataFrame(pandas_df)
#     hudi_options = {
#         "hoodie.table.name": mocker.hudi_table_name_prefix,
#         "hoodie.datasource.write.operation": "upsert",
#         "hoodie.datasource.write.recordkey.field": "id",
#         "hoodie.datasource.write.partitionpath.field": "city",
#         "hoodie.datasource.write.precombine.field": "timestamp",
#         "hoodie.datasource.write.table.name": mocker.hudi_table_name_prefix,
#         "hoodie.datasource.write.table.type": "COPY_ON_WRITE"
#     }
#     # print(f"hudi_options is {hudi_options}")
#     # 写入到 Hudi 表
#     spark_df.write.format("org.apache.hudi").options(**hudi_options).mode("append").save(f"s3://sdp-uat-hudi/{mocker.hudi_table_name_prefix}/")
    
#     # # 关闭 Spark 会话
#     spark.stop()


def gen_csv_2_s3(mock: CSVMocker):
    required_fields = mock.required_fields if mock.required_fields else default_fields
    csv_schema = __general_data_schema(required_fields, mock.column_num_per_csv)
    print(f"csv_schema is {csv_schema}")
    required_source_data = load_required_source_data(csv_schema)
    # print(f"csv_schema is {csv_schema}")
    data = generate_dataframe(mock.row_num_per_csv, csv_schema, required_source_data)
    # print(f"data is {data}")
    print(f"data ===>>>>>>>> is:{data}")
    df = pandas.DataFrame(data)
    if mock.csv_num == 1:
        df.to_csv(f'{mock.csv_name_prefix}.csv', index=False, encoding='utf_8_sig')
    else:
        for i in range(mock.csv_num):
            df.to_csv(f'{mock.csv_name_prefix}_{i+1}.csv', index=False, encoding='utf_8_sig')

def gen_json_2_s3(mock: JsonMocker):
    required_fields = mock.required_fields if mock.required_fields else default_fields
    csv_schema = __general_data_schema(required_fields, mock.field_num_per_item)
    required_source_data = load_required_source_data(csv_schema)
    df = pandas.DataFrame(generate_dataframe(mock.item_num_per_json, csv_schema, required_source_data))
    df.to_csv('example.csv', index=False)

def gen_csv_2_local(mock: CSVMocker):
    required_fields = mock.required_fields if mock.required_fields else default_fields
    csv_schema = __general_data_schema(required_fields, mock.column_num_per_csv)
    required_source_data = load_required_source_data(csv_schema)
    df = pandas.DataFrame(generate_dataframe(mock.row_num_per_csv, csv_schema, required_source_data))
    if mock.csv_num == 1:
        df.to_csv(f'{mock.csv_name_prefix}.csv', index=False)
    else:
        for i in range(mock.csv_num):
            df.to_csv(f'{mock.csv_name_prefix}_{i+1}.csv', index=False)

def gen_json_2_local(mock: JsonMocker):
    required_fields = mock.required_fields if mock.required_fields else default_fields
    csv_schema = __general_data_schema(required_fields, mock.field_num_per_item)
    required_source_data = load_required_source_data(csv_schema)
    df = pandas.DataFrame(generate_dataframe(mock.item_num_per_json, csv_schema, required_source_data))
    df.to_csv('example.csv', index=False)


def gen_data_2_redshift(mock: JsonMocker):
    required_fields = mock.required_fields if mock.required_fields else default_fields
    csv_schema = __general_data_schema(required_fields, mock.field_num_per_item)
    required_source_data = load_required_source_data(csv_schema)
    df = pandas.DataFrame(generate_dataframe(mock.item_num_per_json, csv_schema, required_source_data))
    df.to_csv('example.csv', index=False)