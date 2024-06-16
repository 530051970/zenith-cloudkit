import os, sys
import json

import random
import string

class RandomENText(str):

    def __init__(self, random_text):
        super().__init__()
    
    @classmethod
    def generate_en_random_text(cls, english_common_sentence_list):
        random_text = ""

        random_sentence = random.choice(english_common_sentence_list)
        try:
            random_word_count = random.randint(1, len(random_sentence))
        except:
            print(random_sentence)
            print(len(random_sentence))
            sys.exit(0)
        start_index = random.randint(0, len(random_sentence) - random_word_count)
        substring = random_sentence[start_index:start_index+random_word_count]

        return substring

def generate_multiple_en_random_text(num_random_text, english_common_sentence_list, dest_folder_path = "", save_as_file = False):
    random_text_list = []

    for i in range(num_random_text):
        random_text = RandomENText.generate_en_random_text(english_common_sentence_list)
        random_text_list.append(random_text)
    
    if save_as_file:
        random_text_json = json.dumps(random_text_list, ensure_ascii=False)

        if not os.path.exists(dest_folder_path):
            os.makedirs(dest_folder_path)

        with open(os.path.join(dest_folder_path, "sample_random_text.json"), 'w') as fp:
            fp.write(random_text_json)
    
    return random_text_list

if __name__ == "__main__":
    sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))

    from utils import load_source_data
    english_common_sentence_list = load_source_data.load_english_sentence_list()

    dest_folder_path = "/home/ubuntu/icyxu/data/NLP/SDP/TestGeneration/random/"
        
    # print(generate_multiple_random_text(10, english_common_word_list))
    print(generate_multiple_en_random_text(10, english_common_sentence_list))