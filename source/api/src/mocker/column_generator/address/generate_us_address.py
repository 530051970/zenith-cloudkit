import os, sys
import json

import random
from tqdm import tqdm

class USAddress(str):

    def __init__(self, address):
        super().__init__()
    
    @classmethod
    def generate_us_address(cls, num_us_address, us_address_list):
        random_us_addresses = []
        random_us_addresses_data = random.choices(us_address_list, k = num_us_address)
        for one_address in random_us_addresses_data:
            random_us_addresses.append(one_address[0])

        return random_us_addresses

def generate_multiple_us_address(num_address, us_address_dict, dest_folder_path = "", save_as_file = False):
    address_list = USAddress.generate_us_address(num_address, us_address_dict)
    
    if save_as_file:
        address_json = json.dumps(address_list, ensure_ascii=False)

        if not os.path.exists(dest_folder_path):
            os.makedirs(dest_folder_path)

        with open(os.path.join(dest_folder_path, "sample_us_address.json"), 'w') as fp:
            fp.write(address_json)
    
    return address_list

if __name__ == "__main__":
    sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))

    from utils import load_source_data
    address_dict = load_source_data.load_us_address_dict()

    # dest_folder_path = "/home/ubuntu/icyxu/data/NLP/SDP/TestGeneration/address/"
        
    generated_address = generate_multiple_us_address(10, address_dict)
    print(generated_address)

