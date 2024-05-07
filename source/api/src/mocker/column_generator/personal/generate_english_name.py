import os, sys
import json

import random

class NameUS(str):

    def __init__(self, name_us):
        super().__init__()
    
    @classmethod
    def generate_name_us(cls, num_name, en_name_dict):
        common_firstnames = en_name_dict["common_firstnames"]
        firstname_freqs = en_name_dict["firstname_freqs"]
        common_surname_list = en_name_dict["common_surname_list"]

        name_us_list = []

        random_firstnames = random.choices(common_firstnames, weights = firstname_freqs, k=num_name)

        random_surnames = random.choices(common_surname_list, k = num_name)

        for i in range(num_name):
            name_us_list.append(random_firstnames[i].capitalize() + ' ' + random_surnames[i].capitalize())

        return name_us_list

def generate_multiple_name_us(num_sample, en_name_dict, dest_folder_path = "", save_as_file = False):
    name_us_list = NameUS.generate_name_us(num_sample, en_name_dict)

    if save_as_file:
        name_us_json = json.dumps(name_us_list, ensure_ascii=False)

        if not os.path.exists(dest_folder_path):
            os.makedirs(dest_folder_path)

        with open(os.path.join(dest_folder_path, "sample_name_en.json"), 'w') as fp:
            fp.write(name_us_json)
    
    return name_us_list

if __name__ == "__main__":
    sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))

    from utils import load_source_data
    en_name_dict = load_source_data.load_en_name_dict()

    dest_folder_path = "/home/ubuntu/icyxu/data/NLP/SDP/TestGeneration/personal/"
        
    print(generate_multiple_name_us(10, en_name_dict))
    # generate_multiple_name_us(10000, en_name_dict, dest_folder_path, True)