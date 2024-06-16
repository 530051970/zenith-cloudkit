from fastapi import APIRouter
from common.response_wrapper import BaseResponse
from common.request_wrapper import inject_session
from . import schemas, service

router = APIRouter(prefix="/mocker", tags=["mocker"])

@router.post("/data_2_rds", response_model=BaseResponse)
@inject_session
def data_2_rds(mock: schemas.RDSMocker):
    return service.gen_data_2_rds(mock)

@router.post("/data_2_jdbc", response_model=BaseResponse)
@inject_session
def data_2_jdbc(mock: schemas.JDBCMocker):
    return service.gen_data_2_jdbc(mock)

@router.post("/data_2_redshift", response_model=BaseResponse)
@inject_session
def data_2_redshift(mock: schemas.RedShiftMocker):
    return service.gen_data_2_redshift(mock)

@router.post("/csv_2_s3", response_model=BaseResponse)
@inject_session
def csv_2_s3(mock: schemas.CSVMocker):
    return service.gen_csv_2_s3(mock)

@router.post("/json_2_s3", response_model=BaseResponse)
@inject_session
def json_2_s3(mock: schemas.JSONMocker):
    return service.gen_json_2_s3(mock)

# @router.post("/hudi_2_s3", response_model=BaseResponse)
# @inject_session
# def hudi_2_s3(mock: schemas.Hudi2S3Mocker):
#     return service.gen_hudi_2_s3(mock)

@router.post("/csv_2_local", response_model=BaseResponse)
@inject_session
def csv_2_local(mock: schemas.CSVMocker):
    return service.gen_csv_2_local(mock)

@router.post("/json_2_local", response_model=BaseResponse)
@inject_session
def json_2_local(mock: schemas.JSONMocker):
    return service.gen_json_2_local(mock)

# @router.post("/hudi_2_local", response_model=BaseResponse)
# @inject_session
# def hudi_2_local(mock: schemas.Hudi2S3Mocker):
#     return service.gen_hudi_2_local(mock)

# {
#   "source_bucket": "qy-test-1000logs",
#   "source_prefix": "",
#   "destination_bucket": "sdp-uat-logs",
#   "destination_prefix": "",
#   "destination_account_id": "640463273335",
#   "destination_region": "cn-northwest-1"
# }
@router.post("/copy_s3_folder", response_model=BaseResponse)
@inject_session
def copy_s3_folder(mock: schemas.CopyS3Bucket):
    return service.copy_s3_bucket(mock)