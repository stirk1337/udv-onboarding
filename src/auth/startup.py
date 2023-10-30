import contextlib

from fastapi_users.exceptions import UserAlreadyExists

from src.auth.manager import get_user_manager
from src.auth.models import Role
from src.auth.schemas import UserCreate
from src.auth.utils import get_user_db
from src.db import get_async_session

get_async_session_context = contextlib.asynccontextmanager(get_async_session)
get_user_db_context = contextlib.asynccontextmanager(get_user_db)
get_user_manager_context = contextlib.asynccontextmanager(get_user_manager)


async def create_user(email: str, password: str, is_superuser: bool = False,
                      role: Role = Role.employee, name: str = 'SomeUser'):
    try:
        async with get_async_session_context() as session:
            async with get_user_db_context(session) as user_db:
                async with get_user_manager_context(user_db) as user_manager:
                    user = await user_manager.create(
                        UserCreate(
                            email=email, password=password, is_superuser=is_superuser, role=role, name=name
                        )
                    )
                    print(f'User created {user}')
    except UserAlreadyExists:
        print(f'User {email} already exists')
