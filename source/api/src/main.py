from fastapi import FastAPI
from mocker.main import router as mocker_router

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Welcome to Tools-Fusion!"}

app.include_router(mocker_router)