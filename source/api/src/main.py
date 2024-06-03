from fastapi import FastAPI
from mocker.main import router as mocker_router

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Welcome to zenith-clodkit API!"}

app.include_router(mocker_router)