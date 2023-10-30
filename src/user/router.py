from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr

from src.auth.models import User
from src.auth.router import fastapi_users
from src.request_codes import responses

router = APIRouter(
    prefix='/user',
    tags=['User']
)

current_user = fastapi_users.current_user()


class UserOut(BaseModel):
    id: int
    email: EmailStr


@router.get('/get_current_user_info',
            response_model=UserOut,
            responses=responses)
async def get_current_user_info(user: User = Depends(current_user)) -> UserOut:
    return UserOut(id=user.id, email=user.email)
