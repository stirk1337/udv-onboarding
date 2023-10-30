from fastapi import Depends, HTTPException, status
from fastapi_users import FastAPIUsers

from src.auth.auth import auth_backend
from src.auth.manager import get_user_manager
from src.auth.models import Role, User

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

current_user = fastapi_users.current_user()


async def curator_user(user: User = Depends(current_user)) -> User:
    if user.role == Role.curator:
        return user
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
