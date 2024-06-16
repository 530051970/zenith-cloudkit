"""
Manage constants for the API module
"""
class _Const:
    """
    constants Class
    """
    class ConstError(TypeError):
        """constants  error"""
        def __init__(self, msg):
            super().__init__(msg)

    def __setattr__(self, name, value):
        if name in self.__dict__:
            err = self.ConstError(f"Can't change const.{name}")
            raise err
        # if not name.isupper():
        #     err = self.ConstError(f"Const name {name} is not all uppercase")
        #     raise err
        self.__dict__[name] = value
    
    def __init__(self):
        self.logger_api = "api"
        self.response_success = "success"
        self.response_fail = "fail"
        self.http_header_authorization = "Authorization"
        self.execlude_path_list = ['/', '/docs', '/openapi.json']
        self.user = "user"


const = _Const()