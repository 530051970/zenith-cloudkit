# API Introduction
## Run locally
Python version requirement 3.9
### 1. Installation package
```shell
pip install -r requirements.txt
pip install uvicorn
```
### 2. Connect to the database locally
RDS is in a VPC private subnet. You can connect using an SSH tunnel.  
You need to start an EC2 in the public subnet first.
```shell
ssh -i SDPS.pem ec2-user@EC2-IP -Nf -L 6306:xxx.rds.cn-northwest-1.amazonaws.com.cn:6306
```
After setting, the database client tool/program can be accessed using 127.0.0.1:6306.
### 3. Configure database connection information
The program will read the information named `SDPS` in the SecretsManager (default profile).  
You can use the following command to modify the default SecretId.
```shell
export SecretId="NewSecretId"
```
As shown in the following format. Please follow this configuration. Select 'Other type of secret' for Secret type.
```json
{"username":"db username","password":"db password","engine":"mysql","host":"127.0.0.1","port":6306}
```
### 4. Configure development parameters
```shell
export AdminBucketName="Your admin bucket name"
# The two subnets where the API lambda is located
export SubnetIds="subnet-xxxxxx,subnet-xxxxxx"
# Development mode that bypasses authentication
export mode=dev
```
### 5. Run as API role
Firstly, use `aws configure -- profile cn` to configure a user authorization information. This user needs to have `sts:AssumeRole` permission.  
Secondly, modify the trust relationships of the SDPS API role in the Admin account and add the first step user in the principal.  
Thirdly, modify `.aws/config` file and configure the default profile using the following command
```
[default]
region = cn-northwest-1
source_profile = cn
role_arn = arn:aws-cn:iam::{AdminAccountId}:role/SDPSAPIRole-cn-northwest-1
output = json
```
Finally, validate using `aws sts get-caller-identity`. If the returned content contains `arn:aws-cn:sts::{AdminAccountId}:assumed-role/SDPSAPIRole-{Region}`, it indicates that the configuration is correct.
### 6. Starting web services locally
```shell
uvicorn main:app --reload
```
### 7. View API
http://127.0.0.1:8000/docs

## File Naming
| File Name         | Role        |
|------------------|-----------|
| main.py          | controller |
| service.py       | service   |
| schemas.py       | VO        |
| crud.py          | DAO       |
| db/models-xxx.py | DO        |

## Add a module
### 1. Generate DDL sql
Recommend using DataGrip, Place constraints use Inside table mode
### 2. Install omm
```shell
pip install omymodels
```
### 3. Generate models
```shell
omm db.sql -m sqlalchemy -t models_xxx.py
```
### 4. Generate schemas
```shell
omm db.sql -m pydantic --defaults-off -t schemas.py
```
### 5. Coding
Develop controllers, services, dao normally, and modify schemas
### 6. Export API
Add the router for the module to main.py in the root directory

```python
from discovery_job.main import router as discovery_router

app.include_router(discovery_router)
```

### 7. Manual packaging testing
```shell
zip -r api.zip * -x "venv/*" "lambda/*_test.py"
```
Then put this zip file into lambda and run it.

## PyTest
### 1. Installation package
```shell
pip install pytest==7.4.2
pip install pytest-mock==3.11.1
pip install httpx==0.25.0
pip install anyio==3.6.2
```

### 2. Test
```shell
python -m pytest pytest -s
```