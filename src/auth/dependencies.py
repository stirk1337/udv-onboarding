from fastapi import Depends, HTTPException, status

from src.auth.models import Role, User
from src.auth.router import fastapi_users

current_user = fastapi_users.current_user()


async def curator_user(user: User = Depends(current_user)) -> User:
    if user.role == Role.curator:
        return user
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
