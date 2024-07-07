from fastapi import APIRouter

from common.response_wrapper import BaseResponse

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/", response_model=BaseResponse)
def root():
    return {"message": "Welcome to zenith-clodkit User API!"}