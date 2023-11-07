import contextlib
from secrets import token_urlsafe
from typing import Optional, Union

from fastapi import Depends, Request
from fastapi_users import (BaseUserManager, IntegerIDMixin, exceptions, models,
                           schemas)
from fastapi_users.exceptions import (InvalidPasswordException,
                                      UserAlreadyExists)
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings
from src.auth.models import Role, User
from src.auth.schemas import UserCreate
from src.auth.utils import get_user_db
from src.db import get_async_session
from src.user.dals import CuratorDAL

SECRET = settings.secret


class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def on_after_register(self,
                                user: User,
                                request: Optional[Request] = None) -> None:
        print(f'User {user} registered')

    async def validate_password(
            self,
            password: str,
            user: Union[UserCreate, User],
    ) -> None:
        if len(password) < 8:
            raise InvalidPasswordException(
                reason='Password should be at least 8 characters'
            )
        if user.email in password:
            raise InvalidPasswordException(
                reason='Password should not contain e-mail'
            )

    async def create(
            self,
            user_create: schemas.UC,
            safe: bool = False,
            request: Optional[Request] = None,
    ) -> models.UP:
        await self.validate_password(user_create.password, user_create)

        existing_user = await self.user_db.get_by_email(user_create.email)
        if existing_user is not None:
            raise exceptions.UserAlreadyExists()

        user_dict = (
            user_create.create_update_dict()
            if safe
            else user_create.create_update_dict_superuser()
        )
        password = user_dict.pop('password')
        user_dict['hashed_password'] = self.password_helper.hash(password)
        created_user = await self.user_db.create(user_dict)
        await self.on_after_register(created_user, request)

        return created_user

    async def on_after_forgot_password(
            self, user: User, token: str, request: Optional[Request] = None
    ) -> None:
        print(f'User {user.id} has forgot their password. Reset token: {token}')  # noqa: E501

    async def on_after_reset_password(self, user: User, request: Optional[Request] = None):
        pass


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)


get_async_session_context = contextlib.asynccontextmanager(get_async_session)
get_user_db_context = contextlib.asynccontextmanager(get_user_db)
get_user_manager_context = contextlib.asynccontextmanager(get_user_manager)


async def create_user(session: AsyncSession,
                      email: str,
                      password: str = token_urlsafe(16),
                      is_superuser: bool = False,
                      role: Role = Role.employee,
                      name: str = 'SomeUser') -> Optional[User]:
    try:
        if password is None:
            password = token_urlsafe(16)
        async with get_user_db_context(session) as user_db:
            async with get_user_manager_context(user_db) as user_manager:
                user = await user_manager.create(
                    UserCreate(
                        email=email, password=password, is_superuser=is_superuser, role=role, name=name
                    )
                )
                if user.role == Role.curator:
                    curator_dal = CuratorDAL(session)
                    await curator_dal.create_curator(user)
                    await session.commit()
                print(f'User created {user}')
                print(f'Password: {password}')
                return user
    except UserAlreadyExists:
        print(f'User {email} already exists')


async def create_user_without_depends(email: str, password: str = token_urlsafe(16), is_superuser: bool = False,
                                      role: Role = Role.employee, name: str = 'SomeUser') -> Optional[User]:
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
                    return user
    except UserAlreadyExists:
        print(f'User {email} already exists')
