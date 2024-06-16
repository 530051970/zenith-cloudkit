import os, sys
import json

import random

class LandlinePhoneNumber(str):

    def __init__(self, landline_phone_number):
        super().__init__()
        self.network_operator = landline_phone_number[0:3]
    
    @classmethod
    def generate_landline_phone_number(cls, landline_dict):

        random_operator_number = random.choice(landline_dict)["ID"]
        random_number = str(random.randint(0, 99999999)).zfill(8)

        connection_type = random.randint(1, 3)
        if connection_type == 1:
            return random_operator_number + '-' + random_number
        elif connection_type == 2:
            return random_operator_number + ' ' + random_number
        elif connection_type == 3:
            return '(' + random_operator_number + ')' + random_number
        else:
            raise Exception("Unexpected Connection.")

def generate_multiple_landline_phone_number(num_sample, landline_dict, dest_folder_path = "", save_as_file = False):
    landline_phone_number_list = []

    for i in range(num_sample):
        random_landline_phone_number = LandlinePhoneNumber.generate_landline_phone_number(landline_dict) # 随机生成座机号
        landline_phone_number_list.append(random_landline_phone_number)
    
    if save_as_file:
    
        landline_phone_number_json = json.dumps(landline_phone_number_list, ensure_ascii=False)

        if not os.path.exists(dest_folder_path):
            os.makedirs(dest_folder_path)

        with open(os.path.join(dest_folder_path, "sample_landline_cn.json"), 'w') as fp:
            fp.write(landline_phone_number_json)
    
    return landline_phone_number_list

if __name__ == "__main__":
    sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))

    from utils import load_source_data
    landline_dict = load_source_data.load_landline_dict()

    dest_folder_path = "/home/ubuntu/icyxu/data/NLP/SDP/TestGeneration/personal/"
        
    print(generate_multiple_landline_phone_number(10, landline_dict))
