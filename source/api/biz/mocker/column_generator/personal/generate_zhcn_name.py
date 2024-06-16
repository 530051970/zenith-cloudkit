import os, sys
import json

import random
import string

import numpy as np


class name_zhcn(str):

    def __init__(self, name_pinyin):
        super().__init__()
    
    @classmethod
    def generate_name(cls, num_name, cn_name_dict):
        slice_length = len(cn_name_dict) // 100
        random_slice = random.randint(0, 99)
        short_cn_name_dict = cn_name_dict[random_slice*slice_length:(random_slice+1)*slice_length]

        chosen_name_zh = np.random.choice(short_cn_name_dict, size = num_name, replace=True).tolist()

        return chosen_name_zh

def generate_multiple_name_zhcn(num_cnid, cn_name_dict, dest_folder_path = "", save_as_file = False):
    chosen_name_zh = name_zhcn.generate_name(num_cnid, cn_name_dict)

    if save_as_file:
        chosen_name_zh_json = json.dumps(chosen_name_zh, ensure_ascii=False)

        if not os.path.exists(dest_folder_path):
            os.makedirs(dest_folder_path)
        
        with open(os.path.join(dest_folder_path, 'sample_name_zhcn.json'), 'w') as fp:
            fp.write(chosen_name_zh_json)
    
    return chosen_name_zh

if __name__ == "__main__":
    sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))

    from utils import load_source_data
    cn_name_dict = load_source_data.load_cn_name_dict()

    dest_folder_path = "/home/ubuntu/icyxu/data/NLP/SDP/TestGeneration/personal/"
        
    print(generate_multiple_name_zhcn(10, cn_name_dict))