from enum import Enum, unique


# system             1000 ~ 1099
# user               1100 ~ 1199
# data-source        1200 ~ 1299
# catalog            1300 ~ 1399
# template           1400 ~ 1499
# discovery-job      1500 ~ 1599
# query              1600 ~ 1699
@unique
class MessageEnum(Enum):
    # system
    BIZ_UNKNOWN_ERR = {1000: "An application error occurred and has been logged to CloudWatch Logs"}
    BIZ_DEFAULT_OK = {1001: "Operation succeeded"}
    BIZ_DEFAULT_ERR = {1002: "Operation failed"}
    BIZ_INVALID_TOKEN = {1003: "Invalid token"}
    BIZ_TIMEOUT_TOKEN = {1004: "Timeout token"}
    BIZ_ITEM_NOT_EXISTS = {1005: "The item does not exist"}

    def get_code(self):
        return list(self.value.keys())[0]

    def get_msg(self):
        return list(self.value.values())[0]
