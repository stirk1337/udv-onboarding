from fastapi import Depends, HTTPException, status

from src.auth.models import Role, User
from src.auth.router import fastapi_users

current_user = fastapi_users.current_user(active=True)


async def curator_user(user: User = Depends(current_user)) -> User:
    if user.role == Role.curator or user.is_superuser:
        return user
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)


async def employee_user(user: User = Depends(current_user)) -> User:
    if user.role == Role.employee:
        return user
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
