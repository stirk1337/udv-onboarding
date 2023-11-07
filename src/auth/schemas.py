from fastapi_users import schemas
from pydantic import Field

from src.auth.models import Role


class UserRead(schemas.BaseUser[int]):
    pass


class UserCreate(schemas.BaseUserCreate):
    name: str = Field(examples=['Иванов Иван Игоревич'])
    role: Role = Field(examples=['curator', 'employee'])


class UserUpdate(schemas.BaseUserUpdate):
    pass
