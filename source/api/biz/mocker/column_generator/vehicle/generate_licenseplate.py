import os, sys
import json

import random

provinces = "京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽赣粤青藏川宁琼"
valid_cities = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
char_and_int = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'

num_provinces = len(provinces)
num_valid_cities = len(valid_cities)
num_char_and_int = len(char_and_int)

class LicensePlateNumber(str):

    def __init__(self, license_plate_number):
        super().__init__()
    
    @classmethod
    def generate_license_plate_number(cls):
        license_plate_number = ""

        add_space = random.randint(0, 1)
        license_plate_number = license_plate_number + provinces[random.randint(0, num_provinces-1)] + valid_cities[random.randint(0, num_valid_cities-1)] + ' '*add_space
        for i in range(5):
            license_plate_number = license_plate_number + char_and_int[random.randint(0, num_char_and_int-1)]

        return license_plate_number

def generate_multiple_license_plate_number(num_cnid, dest_folder_path = "", save_as_file = False):
    license_plate_number_list = []

    for i in range(num_cnid):
        random_license_plate_number = LicensePlateNumber.generate_license_plate_number() 
        license_plate_number_list.append(random_license_plate_number)
    
    if save_as_file:
        license_plate_number_json = json.dumps(license_plate_number_list, ensure_ascii=False)

        if not os.path.exists(dest_folder_path):
            os.makedirs(dest_folder_path)

        with open(os.path.join(dest_folder_path, "sample_licenseplate.json"), 'w') as fp:
            fp.write(license_plate_number_json)
    
    return license_plate_number_list

if __name__ == "__main__":

    dest_folder_path = "/home/ubuntu/icyxu/data/NLP/SDP/TestGeneration/vehicle/"
        
    print(generate_multiple_license_plate_number(1000, dest_folder_path, True))