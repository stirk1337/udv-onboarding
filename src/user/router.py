from fastapi import APIRouter, Depends
from fastapi_users import FastAPIUsers
from pydantic import BaseModel, EmailStr

from src.auth.auth import auth_backend
from src.auth.manager import get_user_manager
from src.auth.models import User
from src.auth.router import Response401


router = APIRouter(
    prefix='/user',
    tags=['User']
)

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

current_user = fastapi_users.current_user()


class UserOut(BaseModel):
    id: int
    email: EmailStr


@router.get('/get_current_user_info',
            response_model=UserOut,
            responses={401: {'model': Response401}})
async def get_current_user_info(user: User = Depends(current_user)) -> UserOut:
    return UserOut(id=user.id, email=user.email)
