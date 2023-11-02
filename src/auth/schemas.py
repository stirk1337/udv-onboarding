from fastapi_users import schemas
from pydantic import Field

from src.auth.models import Role


class UserRead(schemas.BaseUser[int]):
    pass


class UserCreate(schemas.BaseUserCreate):
    name: str = Field(examples=['Иванов Иван Игоревич'])
    role: Role = Field(examples=['curator'])

    model_config = {
        'json_schema_extra': {
            'examples': [
                {
                    'email': 'astafieva@example.com',
                    'password': 'string',
                    'name': 'Астафьева Анна Викторовна',
                    'role': 'curator || employee'
                },
                {
                    'email': 'vovag@example.com',
                    'password': 'string',
                    'name': 'Гришмановский Владимир Андреевич',
                    'role': 'employee'
                }
            ]
        }
    }


class UserUpdate(schemas.BaseUserUpdate):
    pass
