from datetime import datetime
from functools import wraps
import time
from pydantic import BaseModel
import os
from typing import Optional
from common.constant import const
import logging

from common.response_wrapper import resp_ok
from fastapi_pagination.bases import RawParams

logger = logging.getLogger(__name__)


def to_raw_params(self) -> RawParams:
    return RawParams(
        limit=self.size,
        offset=self.size * (self.page - 1),
    )


def inject_session(func):

    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        newline_character = "\r"
        # Parameters may contain sensitive information entered by users, such as database connection information,
        # so they will not be output in the production environment
        logger.debug(f"START >>>{newline_character}METHOD: {func.__name__}{newline_character}PARAMS: {kwargs}")
        try:
            # gen_session()
            result = func(*args, **kwargs)
            res = resp_ok(result)
            logger.debug(f"END >>> USED:{round(time.time()-start_time)}ms")
            return res
        finally:
            pass
            # close_session()
    return wrapper


class BaseColumn(BaseModel):
    version: Optional[int]
    create_by: Optional[str]
    modify_by: Optional[str]
    modify_time: Optional[datetime]
    create_time: Optional[datetime]

    class Config:
        from_attributes = True
