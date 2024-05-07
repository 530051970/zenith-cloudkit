import os, sys
import json

import random

possible_ids = ["436", "966", "888", "940", "870", "685", "609", "629", "602", "968", "433", "405", "422", 
                     "303", "601", "589", "552", "456", "438", "664", "412", "434", "421", "442", "185", "695", 
                     "620", "911", "621", "843", "504", "548", "524", "526", "998", "955", "694", "990", "623", 
                     "905", "512", "989", "909", "103", "688", "603", "984", "622", "472", "566", "410", "900", 
                     "690", "624", "683", "627", "985", "625", "999", "468", "427", "415", "666", "402"]
id_source = {"UnionPay": ["62"],
            "AmericanExpress": ["34", "37"],
            "MasterCard": ["51", "52", "53", "54", "55"],
            "Visa": ["40", "41", "42", "43", "44", "45", "46", "47", "48", "49"]}


decimal_decoder = lambda s: int(s, 10)
decimal_encoder = lambda i: str(i)

def luhn_sum_mod_base(string, base=10, decoder=decimal_decoder):
    # Adapted from http://en.wikipedia.org/wiki/Luhn_algorithm
    digits = list(map(decoder, string))
    return (sum(digits[::-2]) +
        sum(list(map(lambda d: sum(divmod(2*d, base)), digits[-2::-2])))) % base
    

def generate(string, base=10, encoder=decimal_encoder, decoder=decimal_decoder):

    d = luhn_sum_mod_base(string + encoder(0), base=base, decoder=decoder)
    if d != 0:
        d = base - d
    return encoder(d)

class SavingsAccount(str):

    def __init__(self):
        super().__init__()
    
    @classmethod
    def generate_savings_account(cls):
        savings_account_number = []

        union_id = random.choice(possible_ids)
        total_length = random.choice([12, 16, 17, 19])

        random_number = str(random.randint(0, pow(10, total_length - 4) - 1)).zfill(total_length - 4)
        
        luhn_digit = generate(union_id+random_number)
        return union_id + random_number + luhn_digit

def generate_multiple_savings_account(num_sample, dest_folder_path = "", save_as_file = False):
    savings_account_list = []
    # len_set = set()

    for i in range(num_sample):
        random_savings_account = SavingsAccount.generate_savings_account() # 随机生成储蓄卡
        # len_set.add(len(random_savings_account))
        savings_account_list.append(random_savings_account)
    
    # print(len_set)
    if save_as_file:
        savings_account_json = json.dumps(savings_account_list, ensure_ascii=False)

        if not os.path.exists(dest_folder_path):
            os.makedirs(dest_folder_path)

        with open(os.path.join(dest_folder_path, "sample_savings_account.json"), 'w') as fp:
            fp.write(savings_account_json)
    
    return savings_account_list

if __name__ == "__main__":

    dest_folder_path = "/home/ubuntu/icyxu/data/NLP/SDP/TestGeneration/financial/"
        
    sample_savings_account_list = generate_multiple_savings_account(10, dest_folder_path, False)
    print(sample_savings_account_list)
