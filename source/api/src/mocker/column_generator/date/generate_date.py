import os, sys
import json
import time

import random

class Date(str):

    def __init__(self):
        super().__init__()
    
    @classmethod
    def generate_date(cls, start, end, time_format, prop):
        """Get a time at a proportion of a range of two formatted times.

        start and end should be strings specifying times formatted in the
        given format (strftime-style), giving an interval [start, end].
        prop specifies how a proportion of the interval to be taken after
        start.  The returned time will be in the specified format.
        """

        stime = time.mktime(time.strptime(start, time_format))
        etime = time.mktime(time.strptime(end, time_format))

        ptime = stime + prop * (etime - stime)

        return time.strftime(time_format, time.localtime(ptime))

def generate_multiple_date(num_sample, start_date = "2008-1-1 1:30 PM", end_date = "2019-1-1 4:50 AM", time_format = '%Y-%m-%d %I:%M %p', dest_folder_path = "", save_as_file = False):
    date_list = []

    for i in range(num_sample):
        random_date = Date.generate_date(start_date, end_date, time_format, random.random())
        date_list.append(random_date)
    
    if save_as_file:
        date_json = json.dumps(date_list, ensure_ascii=False)

        if not os.path.exists(dest_folder_path):
            os.makedirs(dest_folder_path)

        with open(os.path.join(dest_folder_path, "sample_date.json"), 'w') as fp:
            fp.write(date_json)
    
    return date_list

if __name__ == "__main__":

    dest_folder_path = "/home/ubuntu/icyxu/data/NLP/SDP/Date/"
        
    dates = generate_multiple_date(10, "2008-1-1 1:30 PM", "2019-1-1 4:50 AM", '%Y-%m-%d %I:%M %p', dest_folder_path, False)

    print(dates)

    # for key, item in operator_dict.items():
    #     print(key, len(item))