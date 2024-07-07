import boto3

ec2 = boto3.client('ec2')

def calculate_next_cidr_block(cidr_blocks):    
    subnet_ip=''
    subnet_size=0
    cidr0_parts = list()
    max_subnet = 0
    print(f"cidr_blocks is {cidr_blocks}")
    index = -1
    if len(cidr_blocks) > 1:
        cidr0_parts = list(map(int, cidr_blocks[0].split('/')[0].split('.')))
        cidr1_parts = list(map(int, cidr_blocks[1].split('/')[0].split('.')))
        for i in range(4):
            if cidr0_parts[i] != cidr1_parts[i]:
                index = i
                break

    if index == -1:
        index = 2  # Default to the third octet for /24 subnets
    for cidr in cidr_blocks:
        if isinstance(cidr, str):
            subnet_ip, subnet_size = cidr.split('/')
            subnet_ip_parts = list(map(int, subnet_ip.split('.')))
            subnet_num = subnet_ip_parts[index]
            if subnet_num > max_subnet:
                max_subnet = subnet_num
        else:
            print(f"Invalid CIDR block: {cidr}")

    next_subnet = max_subnet + 16
    if next_subnet >= 256:
        raise ValueError("Exceeded available CIDR blocks")
    
    new_ip_parts = cidr0_parts.copy()
    new_ip_parts[index] = next_subnet

    new_ip_parts_next = cidr0_parts.copy()
    new_ip_parts_next[index] = next_subnet + 16

    res= f"{new_ip_parts[0]}.{new_ip_parts[1]}.{new_ip_parts[2]}.{new_ip_parts[3]}/{subnet_size}"
    res_next= f"{new_ip_parts_next[0]}.{new_ip_parts_next[1]}.{new_ip_parts_next[2]}.{new_ip_parts_next[3]}/{subnet_size}"
    return res, res_next

def handler(event, context):
    vpc_id = 'vpc-06aa8a31cae08df34'
    response = ec2.describe_subnets(Filters=[{'Name': 'vpc-id', 'Values': [vpc_id]}])
    subnets = response['Subnets']
    cidr_blocks = [subnet['CidrBlock'] for subnet in subnets]

    next_cidr_block, next_next_cidr_block = calculate_next_cidr_block(cidr_blocks)
    return {
        'PhysicalResourceId': vpc_id,
        'Data': {
            'NextCidrBlock': next_cidr_block,
            'NextNextCidrBlock': next_next_cidr_block
        }
    }
