from fastapi import status, FastAPI, Request
from fastapi.exceptions import RequestValidationError
import os
from common.enum import MessageEnum
from common.constant import const
import logging
from .response_wrapper import resp_err

import traceback

logger = logging.getLogger(const.LOGGER_API)


def biz_exception(app: FastAPI):
    # customize request validation error
    @app.exception_handler(RequestValidationError)
    async def val_exception_handler(req: Request, rve: RequestValidationError, code: int = status.HTTP_400_BAD_REQUEST):
        lst = []
        for error in rve.errors():
            lst.append('{}=>{}'.format('.'.join(error['loc']), error['msg']))
        return resp_err(code, ' , '.join(lst))

    # customize business error
    @app.exception_handler(BizException)
    async def biz_exception_handler(req: Request, exc: BizException):
        return resp_err(exc.code, exc.message, exc.ref)

    # system error
    @app.exception_handler(Exception)
    async def exception_handler(req: Request, exc: Exception):
        if isinstance(exc, BizException):
            return
        error_msg = traceback.format_exc()
        if os.getenv(const.MODE) != const.MODE_DEV:
            error_msg = error_msg.replace("\n", "\r")
        logger.error(error_msg)
        return resp_err(MessageEnum.BIZ_UNKNOWN_ERR.get_code(),
                        MessageEnum.BIZ_UNKNOWN_ERR.get_msg())


class BizException(Exception):
    def __init__(self,
                 code: int = MessageEnum.BIZ_DEFAULT_ERR.get_code(),
                 message: str = MessageEnum.BIZ_DEFAULT_ERR.get_msg(),
                 ref: list = None):
        self.code = code
        self.message = message
        self.ref = ref
