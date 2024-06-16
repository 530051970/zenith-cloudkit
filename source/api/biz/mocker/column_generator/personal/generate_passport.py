import os, sys
import json

import random
import string

class Passport(str):

    def __init__(self, passport_number):
        super().__init__()
    
    @classmethod
    def generate_passport_number(cls):
        random_passport_region = random.randint(1, 10)
        if random_passport_region <= 5:
            random_num_char = 1
            random_passport_number = "E"
        elif random_passport_region <= 6:
            random_num_char = 2
            random_passport_number = "E" + random.choice(string.ascii_letters).capitalize()
        else:
            random_passport_number = ""

            random_num_char = random.randint(0, 2)
            for i in range(random_num_char):
                random_passport_number = random_passport_number + random.choice(string.ascii_letters).capitalize()

        random_number = str(random.randint(0, pow(10, 9 - random_num_char)-1)).zfill(9 - random_num_char)

        return random_passport_number + random_number

def generate_multiple_passport_number(num_cnid, dest_folder_path = "", save_as_file = False):
    passport_number_list = []

    for i in range(num_cnid):
        random_passport_number = Passport.generate_passport_number() # 随机生成护照
        passport_number_list.append(random_passport_number)
    
    if save_as_file:
        passport_number_json = json.dumps(passport_number_list, ensure_ascii=False)

        if not os.path.exists(dest_folder_path):
            os.makedirs(dest_folder_path)

        with open(os.path.join(dest_folder_path, "sample_passport.json"), 'w') as fp:
            fp.write(passport_number_json)
    
    return passport_number_list

if __name__ == "__main__":

    dest_folder_path = "/home/ubuntu/icyxu/data/NLP/SDP/TestGeneration/personal/"
        
    print(generate_multiple_passport_number(10))