import os, sys
import json

import random
import string

import numpy as np
import pinyin


class NamePinyin(str):

    def __init__(self, name_pinyin):
        super().__init__()
    
    @classmethod
    def generate_name_pinyin(cls, num_name, cn_name_dict):
        name_pinyin_list = []
        slice_length = len(cn_name_dict) // 100
        random_slice = random.randint(0, 99)
        short_cn_name_dict = cn_name_dict[random_slice*slice_length:(random_slice+1)*slice_length]

        chosen_name_zh = np.random.choice(short_cn_name_dict, size = num_name, replace=True).tolist()
        for name_zh in chosen_name_zh:
            name_pinyin_raw = pinyin.get(name_zh, format="strip", delimiter=" ")
            name_pinyin_raw_list = name_pinyin_raw.split(" ")
            name_pinyin_list.append(name_pinyin_raw_list[0].capitalize() + ' ' + ''.join(name_pinyin_raw_list[1:]).capitalize())

        return name_pinyin_list

def generate_multiple_name_pinyin(num_cnid, cn_name_dict, dest_folder_path = "", save_as_file = False):
    name_pinyin_list = NamePinyin.generate_name_pinyin(num_cnid, cn_name_dict)

    if save_as_file:
        name_pinyin_json = json.dumps(name_pinyin_list, ensure_ascii=False)

        if not os.path.exists(dest_folder_path):
            os.makedirs(dest_folder_path)

        with open(os.path.join(dest_folder_path, 'sample_name_pinyin.json'), 'w') as fp:
            fp.write(name_pinyin_json)
        
    
    return name_pinyin_list

if __name__ == "__main__":
    sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))

    from utils import load_source_data
    cn_name_dict = load_source_data.load_cn_name_dict()

    dest_folder_path = "/home/ubuntu/icyxu/data/NLP/SDP/TestGeneration/personal/"
        
    print(generate_multiple_name_pinyin(10, cn_name_dict))
    generate_multiple_name_pinyin(10000, cn_name_dict, dest_folder_path, False)