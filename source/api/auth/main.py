import logging.config
from mangum import Mangum

from fastapi import FastAPI, HTTPException, Request
from datetime import datetime, timedelta
import jwt
import requests
from jwt import PyJWKClient 

logger = logging.getLogger(__name__)

token_list = []
authApp = FastAPI()

@authApp.get("/")
async def root():
    return {"message": "Welcome to zenith-clodkit Auth API!"}

@authApp.post("/verifyToken")
async def verify_token_main(request: Request, jwks_url):
    authorization_header = request.headers.get('Authorization')
    if not authorization_header:
        raise HTTPException(status_code=400, detail="Missing Authorization header")
    
    token = authorization_header.split()[1]  # Bearer token
    decoded_token = __verify_token(token, jwks_url)
    if decoded_token:
        return {"isValid": True, "payload": decoded_token}
    else:
        raise HTTPException(status_code=401, detail="Invalid token")

handler = Mangum(authApp)
# add_pagination(app)

def __verify_token(token, jwks_url, auth_info):
    response = requests.get(jwks_url)
    jwks = response.json()
    try:
        headers = jwt.get_unverified_header(token)
        kid = headers['kid']
        jwk_client = PyJWKClient(jwks_url)
        signing_key = jwk_client.get_signing_key_from_jwt(token)
        public_key = signing_key.key
        decoded_token = jwt.decode(token, public_key, algorithms=['RS256'], audience='your-audience', issuer='your-issuer')
        return decoded_token
    except jwt.ExpiredSignatureError:
        __refresh_token(auth_info)
        return None
    except jwt.InvalidTokenError:
        print('Invalid token')
        return None

def __refresh_token(auth_info):
    tokens = {
        "access_token": None,
        "refresh_token": auth_info.tokens["refresh_token"],
        "expires_at": datetime.utcnow()
    }
    response = requests.post(
        auth_info.token_url,
        data={
            "grant_type": "refresh_token",
            "client_id": auth_info.client_id,
            "client_secret": auth_info.client_secret,
            "refresh_token": auth_info.tokens["refresh_token"]
        }
    )
    if response.status_code == 200:
        token_data = response.json()
        tokens["access_token"] = token_data["access_token"]
        tokens["refresh_token"] = token_data.get("refresh_token", auth_info.tokens["refresh_token"])
        tokens["expires_at"] = datetime.utcnow() + timedelta(seconds=token_data["expires_in"])
    else:
        raise HTTPException(status_code=401, detail="Failed to refresh token")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(authApp, host="127.0.0.1", port=3998)