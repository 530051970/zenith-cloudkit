import os, sys
import json

import random
import numpy as np


def generate_multiple_cvv(num_cvv):
    cvv_list = list(map(str, list(np.random.randint(low=0, high=1000, size=(num_cvv,)))))
    filled_cvv = [str(item).zfill(3) for item in cvv_list]
    return filled_cvv

def generate_multiple_price(num_price):
    price_list = list(np.around(np.random.uniform(low=1.0, high=200.0, size=(num_price,)), 5))
    return price_list
    

if __name__ == "__main__":

    dest_folder_path = "/home/ubuntu/icyxu/data/NLP/SDP/TestGeneration/financial/"

