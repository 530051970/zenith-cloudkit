#!/usr/bin/env python
# -*- coding: utf-8 -*-

import random
import re
# 导入某个模块的部分类或方法
from datetime import datetime, timedelta

import json
import os, sys

# 十五位身份证号表达式
ID_NUMBER_15_REGEX = r"^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$"

# 十八位身份证号表达式 identity_util
ID_NUMBER_18_REGEX = r"^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$"

class IdNumber(str):

    def __init__(self, id_number):
        super().__init__()
        self.id = id_number
        self.area_id = int(self.id[0:6])
        self.birth_year = int(self.id[6:10])
        self.birth_month = int(self.id[10:12])
        self.birth_day = int(self.id[12:14])

    def get_area_name(self):
        """根据区域编号取出区域名称"""
        return cnid_dict[self.area_id]

    def get_birthday(self):
        """通过身份证号获取出生日期"""
        return "{0}-{1}-{2}".format(self.birth_year, self.birth_month, self.birth_day)

    def get_age(self):
        """通过身份证号获取年龄"""
        now = (datetime.now() + timedelta(days=1))
        year, month, day = now.year, now.month, now.day

        if year == self.birth_year:
            return 0
        else:
            if self.birth_month > month or (self.birth_month == month and self.birth_day > day):
                return year - self.birth_year - 1
            else:
                return year - self.birth_year

    def get_sex(self):
        """通过身份证号获取性别， 女生：0，男生：1"""
        return int(self.id[16:17]) % 2

    def get_check_digit(self):
        """通过身份证号获取校验码"""
        check_sum = 0
        for i in range(0, 17):
            check_sum += ((1 << (17 - i)) % 11) * int(self.id[i])
        check_digit = (12 - (check_sum % 11)) % 11
        if check_digit < 10:
            return check_digit
        else:
            return 'x' if random.randint(0, 3) == 0 else 'X'

    @classmethod
    def verify_id(cls, id_number):
        """校验身份证是否正确"""
        if re.match(ID_NUMBER_18_REGEX, id_number):
            check_digit = cls(id_number).get_check_digit()
            return str(check_digit) == id_number[-1]
        else:
            return bool(re.match(ID_NUMBER_15_REGEX, id_number))

    @classmethod
    def generate_id(cls, cnid_dict):

        # 随机生成一个区域码(6位数)
        id_number = str(random.choice(list(cnid_dict.keys())))
        # 限定出生日期范围(8位数)
        start, end = datetime.strptime("1950-01-01", "%Y-%m-%d"), datetime.strptime("2022-12-30", "%Y-%m-%d")
        birth_days = datetime.strftime(start + timedelta(random.randint(0, (end - start).days + 1)), "%Y%m%d")
        id_number += str(birth_days)
        # 顺序码(2位数)
        id_number += str(random.randint(10, 99))
        # 性别码(1位数)
        random_sex = random.randint(0, 1)  # 随机生成男(1)或女(0)
        id_number += str(random.randrange(random_sex, 10, step=2))
        # 校验码(1位数)
        return id_number + str(cls(id_number).get_check_digit())

def generate_multiple_cnid(num_cnid, cnid_dict, dest_folder_path = "", save_as_file = False):
    cnid_list = []
    for i in range(num_cnid): 
        random_id = IdNumber.generate_id(cnid_dict) # 随机生成身份证号
        cnid_list.append(random_id)
    
    if save_as_file:
        cnid_json = json.dumps(cnid_list, ensure_ascii=False)

        if not os.path.exists(dest_folder_path):
            os.makedirs(dest_folder_path)

        with open(os.path.join(dest_folder_path, 'sample_cnid.json'), 'w') as fp:
            fp.write(cnid_json)
    
    return cnid_list

if __name__ == '__main__':
    sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))

    from utils import load_source_data
    cnid_dict = load_source_data.load_cnid_dict()

    dest_folder_path = "/home/ubuntu/icyxu/data/NLP/SDP/TestGeneration/personal/"
        
    sample_cnid_list = generate_multiple_cnid(10, cnid_dict)
    print(sample_cnid_list)

    
    # random_sex = random.randint(0, 1)  # 随机生成男(1)或女(0) 
    # random_id = IdNumber.generate_id(random_sex) # 随机生成身份证号
    # print(random_id)  # 随机生成身份证号
    # print(IdNumber(random_id).area_id)  # 地址编码:410326
    # print(IdNumber(random_id).get_area_name())  # 地址:河南省洛阳市汝阳县
    # print(IdNumber(random_id).get_birthday())  # 生日:1995-7-10
    # print(IdNumber(random_id).get_age())  # 年龄:23(岁)
    # print(IdNumber(random_id).get_sex())  # 性别:1(男)
    # print(IdNumber(random_id).get_check_digit())  # 校验码:7
    # print(IdNumber.verify_id(random_id))  # 检验身份证是否正确:False
