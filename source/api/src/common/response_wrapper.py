import os
import json
import sys
from typing import Optional, Generic, TypeVar
from fastapi import Response
from fastapi.responses import JSONResponse
from pydantic.generics import GenericModel
# from common.enum import MessageEnum
import logging

from common.enum import MessageEnum
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from .constant import const

logger = logging.getLogger(const.LOGGER_API)
T = TypeVar("T")


class BaseResponse(GenericModel, Generic[T]):
    status: str
    code: int
    message: Optional[str]
    data: Optional[T] = None

    class Config:
        from_attributes = True


class DbWrapper:

    def __init__(self, status, data, code, message):
        self.status = status
        self.data = data
        self.code = code
        self.message = message


# Be called when a correct response is returned, e.g.resp_ok（data=xxxx)
def resp_ok(data,
            code: int = MessageEnum.BIZ_DEFAULT_OK.get_code(),
            message: str = MessageEnum.BIZ_DEFAULT_OK.get_msg()) -> DbWrapper:
    return DbWrapper(const.RESPONSE_SUCCESS, data, code, message)


# Be called when a exception response is returned, e.g.resp_ng（code=XXX, message=XXXXX)
def resp_err(code: int = MessageEnum.BIZ_DEFAULT_ERR.get_code(),
             message: str = MessageEnum.BIZ_DEFAULT_ERR.get_msg(),
             ref: list = None) -> Response:
    logger.debug('END >>> RESPONSE FAILED')
    headers = {}
    if os.getenv(const.MODE) == const.MODE_DEV:
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Credentials': 'true'
        }
    return JSONResponse(
        content={
            'status': const.RESPONSE_FAIL,  # success|fail
            'code': code,
            'message': message,
            'ref': ref,
        },
        headers=headers,
    )


class S3WrapEncoder(json.JSONEncoder):
    def convert(self, obj, properties: list[str]):
        fields = {}
        for field in [x for x in dir(obj) if not x.startswith('_') and x != 'metadata' and x in properties]:
            data = obj.__getattribute__(field)
            try:
                json.dumps(data)
                fields[field] = data
            except TypeError:
                fields[field] = None
        return fields
