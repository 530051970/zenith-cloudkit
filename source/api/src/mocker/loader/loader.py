import os
import json

import pickle
import sys

cn_address_source_data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "source_data", "address", "ChineseAddressDict")
us_address_source_data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "source_data", "address", "USAddress")
cnid_source_data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "source_data", "personal", "cnid")
name_source_data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "source_data", "personal", "name")
landline_source_data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "source_data", "personal", "phone_number")
cn_random_word_source_data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "source_data", "random", "chinese_words")
cn_random_sentence_source_data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "source_data", "random", "random_sentence")
region_source_data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "source_data", "region")

def read_json(json_filepath):
    with open(json_filepath) as fp:
        json_data = json.load(fp)
    return json_data

def read_pickle(pickle_filepath):
    with open(pickle_filepath, 'rb') as fp:
        pickle_data = pickle.load(fp)
    return pickle_data

def read_txt(txt_filepath):
    with open(txt_filepath) as fp:
        txt_data = fp.read().splitlines() 
    return txt_data

def load_cn_address_dict():
    def process_roads(raw_road_list):
        road_list = [valid_road for valid_road in raw_road_list if (valid_road.endswith('路') or valid_road.endswith('街') or valid_road.endswith('道'))]
        return road_list

    # keep valid community and some villages
    def process_community(raw_community_list):
        valid_community_list = []
        village_list = []
        for raw_community in raw_community_list:
            if raw_community.endswith('社区'):
                valid_community_list.append(raw_community)
            elif raw_community.endswith('社区居委会'):
                valid_community_list.append(raw_community.split('居委会')[0])
            elif raw_community.endswith('村'):
                village_list.append(raw_community)
        
        village_list = village_list[:int(0.2 * len(valid_community_list))]
        valid_community_list.extend(village_list)
        return valid_community_list

    level3_path = os.path.join(cn_address_source_data_path, "level3.json")
    level4_path = os.path.join(cn_address_source_data_path, "level4.txt")
    level5_path = os.path.join(cn_address_source_data_path, "vall.txt")
    level6_path = os.path.join(cn_address_source_data_path, "road.txt")
    level7_path = os.path.join(cn_address_source_data_path, "buil.txt")

    level3_data = read_json(level3_path)
    level4_data = read_txt(level4_path)
    level5_data = read_txt(level5_path)
    valid_community_list = process_community(level5_data)
    level6_data = read_txt(level6_path)
    valid_road_list = process_roads(level6_data)
    valid_building_list = read_txt(level7_path)

    address_dict = dict()
    address_dict['level3_data'] = level3_data
    address_dict['level4_data'] = level4_data
    address_dict['valid_road_list'] = valid_road_list
    address_dict['valid_community_list'] = valid_community_list
    address_dict['valid_building_list'] = valid_building_list

    return address_dict

def load_us_address_dict():
    us_address_dict_path = os.path.join(us_address_source_data_path, "us.p")
    us_address_dict = read_pickle(us_address_dict_path)

    return us_address_dict

def load_cnid_dict():
    cnid_dict_path = os.path.join(cnid_source_data_path, "cnid.json")
    cnid_dict = read_json(cnid_dict_path)
    return cnid_dict

def load_en_name_dict():
    def read_firstname_with_frequency(input_filepath):
        firstnames, freqs = [], []
        with open(input_filepath) as fp:
            firstname_lines = fp.read().splitlines()
        for oneline in firstname_lines:
            split_oneline = oneline.split('\t')
            firstnames.append(split_oneline[0])
            freqs.append(float(split_oneline[1]))
        return firstnames, freqs

    common_surname_filepath = os.path.join(name_source_data_path, "common_en_surnames.txt")
    common_firstname_filepath = os.path.join(name_source_data_path, "common_en_firstnames.json")

    common_surnames = read_txt(common_surname_filepath)
    common_firstname_data = read_json(common_firstname_filepath)
    common_firstnames, firstname_freqs = common_firstname_data['names'], common_firstname_data['probs']
    
    en_name_dict = dict()
    en_name_dict["common_surname_list"] = common_surnames
    en_name_dict["common_firstnames"] = common_firstnames
    en_name_dict["firstname_freqs"] = firstname_freqs

    return en_name_dict

def load_landline_dict():
    landline_filepath = os.path.join(landline_source_data_path, "china_landline_info.json")

    landline_dict = read_json(landline_filepath)
    return landline_dict

def load_cn_name_dict():
    cn_name_filepath = os.path.join(name_source_data_path, "ChineseCommonNames.txt")
    cn_name_dict = read_txt(cn_name_filepath)

    return cn_name_dict

def load_chinese_common_word_list():
    cn_random_filepath = os.path.join(cn_random_word_source_data_path, "chinese_commond_words.txt")
    cn_random_texts_with_pinyin = read_txt(cn_random_filepath)

    chinese_common_word_list = []
    for rawline in cn_random_texts_with_pinyin:
        try:
            chinese_common_word_list.append(rawline.split("\t")[0])
        except Exception as e:
            print(rawline)
            sys.exit(0)

    return chinese_common_word_list

def load_chinese_sentence_list():
    cn_random_filepath = os.path.join(cn_random_sentence_source_data_path, "random_cn_sentence.txt")
    cn_random_sentences = read_txt(cn_random_filepath)

    return cn_random_sentences[:]

def load_english_sentence_list():
    en_random_filepath = os.path.join(cn_random_sentence_source_data_path, "random_en_sentence.txt")
    en_random_sentences = read_txt(en_random_filepath)

    return en_random_sentences[:]

def load_region_dict():
    region_filepath = os.path.join(region_source_data_path, "nation_and_region.json")

    region_dict = read_json(region_filepath)
    return region_dict
