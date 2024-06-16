import os, sys
import json

import random

class Region(str):

    def __init__(self):
        super().__init__()
    
    @classmethod
    def generate_region(cls, region_dict):
        random_common_region = random.randint(1, 100)
        if random_common_region > 10:
            return "中国"
        elif random_common_region > 1:
            return random.choice(region_dict["list"][0]["data"])
        else:
            random_char = random.choice(region_dict["list"])
            return random.choice(random_char["data"])

def generate_multiple_region(num_sample, region_dict, dest_folder_path = "", save_as_file = False):
    region_list = []

    for i in range(num_sample):
        random_region = Region.generate_region(region_dict)
        region_list.append(random_region)
    
    if save_as_file:
        region_json = json.dumps(region_list, ensure_ascii=False)

        if not os.path.exists(dest_folder_path):
            os.makedirs(dest_folder_path)

        with open(os.path.join(dest_folder_path, "sample_region.json"), 'w') as fp:
            fp.write(region_json)
    
    return region_list

if __name__ == "__main__":
    sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))

    from utils import load_source_data
    region_dict = load_source_data.load_region_dict()

    dest_folder_path = "/home/ubuntu/icyxu/data/NLP/SDP/Region/"
        
    print(generate_multiple_region(10, region_dict))

    # for key, item in operator_dict.items():
    #     print(key, len(item))