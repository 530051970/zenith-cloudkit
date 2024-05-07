import os, sys
import json

import random

operator_list = ["ChinaMobile", "ChinaUnicom", "ChinaTelecom"]
operator_dict = {"ChinaMobile": ["134", "135", "136", "137", "138", "139", "147", "150", "151", "152", "157", "158", "159", 
            "165", "172", "178", "182", "183", "184", "187", "188", "198"], 
            "ChinaUnicom": ["130", "131", "132", "145", "155", "156", "166", "171", "175", "176", "185", "186"], 
            "ChinaTelecom": ["133", "149", "153", "173", "177", "180", "181", "189", "199"]}

class CellphoneNumber(str):

    def __init__(self, cellphone_number):
        super().__init__()
        self.network_operator = cellphone_number[0:3]
    
    @classmethod
    def generate_cellphone_number(cls):
        random_operator = operator_list[random.randint(0, 2)]
        random_operator_number = random.choice(operator_dict[random_operator])

        random_number = str(random.randint(0, 99999999)).zfill(8)

        return random_operator_number + random_number

def generate_multiple_cellphone_number(num_cnid, dest_folder_path = "", save_as_file = False):
    cellphone_number_list = []

    for i in range(num_cnid):
        random_cellphone_number = CellphoneNumber.generate_cellphone_number() # 随机生成手机号
        cellphone_number_list.append(random_cellphone_number)
    
    if save_as_file:
        cellphone_number_json = json.dumps(cellphone_number_list, ensure_ascii=False)

        if not os.path.exists(dest_folder_path):
            os.makedirs(dest_folder_path)

        with open(os.path.join(dest_folder_path, "sample_cellphone.json"), 'w') as fp:
            fp.write(cellphone_number_json)
    
    return cellphone_number_list

if __name__ == "__main__":

    dest_folder_path = "/home/ubuntu/icyxu/data/NLP/SDP/TestGeneration/personal/"
        
    sample_cellphone_number_list = generate_multiple_cellphone_number(10, dest_folder_path, False)
    print(sample_cellphone_number_list)

    # for key, item in operator_dict.items():
    #     print(key, len(item))