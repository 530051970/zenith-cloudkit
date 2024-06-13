from typing import Optional
from pydantic import BaseModel

class BaseMocker(BaseModel):
    account_id: Optional[str]
    region: Optional[str]
    access_key: Optional[str]
    secret_key: Optional[str]    

class RDSMocker(BaseMocker):
    url: Optional[str]
    instance_id: Optional[str]
    port: Optional[int]
    db_username: Optional[str]
    db_password: Optional[str]
    db_name: Optional[str]
    required_fields: Optional[list[str]]
    table_num: Optional[int]
    column_num_per_table: Optional[int]
    row_num_per_table: Optional[int]
    table_name_prefix: Optional[str]

class JDBCMocker(BaseModel):
    url: Optional[str]
    port: Optional[int]
    db_username: Optional[str]
    db_password: Optional[str]
    db_name: Optional[str]
    required_fields: Optional[list[str]]
    table_num: Optional[int]
    column_num_per_table: Optional[int]
    row_num_per_table: Optional[int]
    table_name_prefix: Optional[str]

class JsonMocker(BaseMocker):
    instance_id: Optional[str]
    db_port: Optional[int]
    db_username: Optional[str]
    db_password: Optional[str]
    db_name: Optional[str]
    required_fields: Optional[list[str]]
    json_num: Optional[int]
    item_num_per_json: Optional[int]
    field_num_per_item: Optional[int]
    json_name_prefix: Optional[str]

class RedShiftMocker(BaseMocker):
    instance_id: Optional[str]
    db_port: Optional[int]
    db_username: Optional[str]
    db_password: Optional[str]
    db_name: Optional[str]
    required_fields: Optional[list[str]]
    json_num: Optional[int]
    item_num_per_json: Optional[int]
    field_num_per_item: Optional[int]
    json_name_prefix: Optional[str]

class CSVMocker(BaseMocker):
    bucket: Optional[str]
    key: Optional[str]
    required_fields: Optional[list[str]]
    csv_num: Optional[int]
    column_num_per_csv: Optional[int]
    row_num_per_csv: Optional[int]
    csv_name_prefix: Optional[str]

class CopyS3Bucket(BaseModel):
    source_bucket: Optional[str]
    source_prefix: Optional[str]
    destination_bucket: Optional[str]
    destination_prefix: Optional[str]
    destination_account_id: Optional[str]
    destination_region: Optional[str]

class Hudi2S3Mocker(BaseMocker):
    bucket: Optional[str]
    key: Optional[str]
    hudi_table_name_prefix: Optional[str]
    hudi_table_num: int
    hudi_table_rows: int
    hudi_table_cols: int

class Csv2S3Mocker(BaseMocker):
    bucket: Optional[str]
    key: Optional[str]


class JSONMocker(BaseMocker):
    bucket: Optional[str]
    key: Optional[str]
 
