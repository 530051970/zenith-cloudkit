import logging.config
# from jose import jwt
from fastapi import FastAPI
from mangum import Mangum
from fastapi_pagination import add_pagination
from mocker.main import router as mocker_router
from bot.main import router as bot_router

logger = logging.getLogger(__name__)

token_list = []
app = FastAPI()

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