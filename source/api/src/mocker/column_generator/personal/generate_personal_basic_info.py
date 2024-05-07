import os
import sys
import random
import string

def generate_multiple_email(num_emails):
    random_emails = []
    for i in range(num_emails):
        extensions = ['com']
        domains = ['gmail','yahoo','comcast','verizon','charter','hotmail','outlook','frontier']

        winext = extensions[random.randint(0,len(extensions)-1)]
        windom = domains[random.randint(0,len(domains)-1)]

        acclen = random.randint(1,20)

        winacc = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(acclen))

        finale = winacc + "@" + windom + "." + winext
        # print(finale)
        random_emails.append(finale)
    return random_emails

def generate_multiple_ipv4address(num_ip_address):
    ip_address_list = []

    for i in range(num_ip_address):
        one_ip_list = []
        for section in range(4):
            one_ip_list.append(str(random.randint(0, 255)))
        ip_address_list.append('.'.join(one_ip_list))
    return ip_address_list

def generate_counts(num_counts):
    count_list = []
    for i in range(num_counts):
        count_list.append(i+1)
    return count_list
