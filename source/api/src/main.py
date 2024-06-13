from datetime import time
import os
import logging.config
# from jose import jwt
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from mangum import Mangum
from common.response_wrapper import resp_err
from common.enum import MessageEnum
from fastapi_pagination import add_pagination
from mocker.main import router as mocker_router
from bot.main import router as bot_router
from common.constant import Const


logging.config.fileConfig('logging.conf', disable_existing_loggers=False)
logger = logging.getLogger(__name__)
# use global list to cache token, we will use DDB in the future.
token_list = []
app = FastAPI()
const = Const()

@app.get("/")
async def root():
    return {"message": "Welcome to zenith-clodkit API!"}

app.include_router(mocker_router)
app.include_router(bot_router)

handler = Mangum(app)
add_pagination(app)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=3999)