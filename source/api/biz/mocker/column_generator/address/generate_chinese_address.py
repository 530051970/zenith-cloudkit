import os, sys
import json

import random
from tqdm import tqdm

class Address(str):

    def __init__(self, address):
        super().__init__()
    
    @classmethod
    def generate_cn_address(cls, address_dict):
        level3_data = address_dict['level3_data']
        level4_data = address_dict['level4_data']
        valid_road_list = address_dict['valid_road_list']
        valid_community_list = address_dict['valid_community_list']
        valid_building_list = address_dict['valid_building_list']

        address_seg_list = []
        # Get random province id excluding HKT
        random_province_id = random.randint(0, 30)
        address_seg_list.append(level3_data[random_province_id]["region"])

        random_city_id = random.randint(0, len(level3_data[random_province_id]["regionEntitys"]) - 1)
        address_seg_list.append(level3_data[random_province_id]["regionEntitys"][random_city_id]["region"])

        try:
            random_district_id = random.randint(0, len(level3_data[random_province_id]["regionEntitys"][random_city_id]["regionEntitys"]) - 1)
            address_seg_list.append(level3_data[random_province_id]["regionEntitys"][random_city_id]["regionEntitys"][random_district_id]["region"])
        except:
            # No district for this city.
            # print(address_seg_list)
            pass
        
        address_format = random.randint(0, 1)
        if address_format == 0:
            random_road_str = random.choice(valid_road_list)
            address_seg_list.append(random_road_str)
            random_road_id = random.randint(1, 200)
            address_seg_list.append(str(random_road_id) + '号')
        else:
            random_street_str = random.choice(level4_data).split(',')[-1]
            address_seg_list.append(random_street_str)

            for one_level_data in [valid_community_list, valid_building_list]:
                random_level_str = random.choice(one_level_data)
                address_seg_list.append(random_level_str)

        return ''.join(address_seg_list)

def generate_multiple_cn_address(num_address, address_dict, dest_folder_path = "", save_as_file = False):
    address_list = []

    for i in range(num_address):
        random_address = Address.generate_cn_address(address_dict)
        address_list.append(random_address)
    
    if save_as_file:
        address_json = json.dumps(address_list, ensure_ascii=False)

        if not os.path.exists(dest_folder_path):
            os.makedirs(dest_folder_path)

        with open(os.path.join(dest_folder_path, "sample_address.json"), 'w') as fp:
            fp.write(address_json)
    
    return address_list

if __name__ == "__main__":
    sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))

    from utils import load_source_data
    address_dict = load_source_data.load_cn_address_dict()

    # dest_folder_path = "/home/ubuntu/icyxu/data/NLP/SDP/TestGeneration/address/"
        
    generated_address = generate_multiple_cn_address(10, address_dict)
    print(generated_address)
