import os
from datetime import datetime
from .constant import const
import re

def before_exec(conn, clause, multi_params, params):
    if len(multi_params) > 0:
        for current_params in multi_params:
            __handle_params(clause, current_params)
    else:
        __handle_params(clause, params)


def __handle_params(clause, params):
    if str(clause).startswith('INSERT'):
        params['create_by'] = os.getenv(const.USER, const.USER_DEFAULT_NAME)
        params['create_time'] = datetime.utcnow()
    if str(clause).startswith('UPDATE'):
        # 编写正则表达式
        pattern = r'\bmodify_by\b'
        if re.search(pattern, str(clause)):
            params['modify_time'] = datetime.utcnow()
        else:
            params['modify_by'] = params['modify_by'] if ('modify_by' in params) else os.getenv(const.USER, const.USER_DEFAULT_NAME)
            params['modify_time'] = datetime.utcnow()
