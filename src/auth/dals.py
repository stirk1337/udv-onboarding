import os

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.models import User


class UserDAL:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def get_user_by_email(self, email: str) -> User:
        user = await self.db_session.scalar(
            select(User)
            .where(User.email == email)
        )
        return user

    async def get_user_by_id(self, user_id: int) -> User:
        user = await self.db_session.get(User, user_id)
        if user is None:
            raise HTTPException(
                status_code=404, detail=f'User with id {user_id} not found')
        return user

    async def patch_profile(self, user: User, contact: str) -> User:
        user.contact = contact
        await self.db_session.commit()
        await self.db_session.refresh(user)
        return user

    async def patch_avatar(self, user: User, image_url: str) -> User:
        if user.image_url is not None and os.path.exists(user.image_url):
            os.remove(user.image_url)
        else:
            print('The file does not exist')
        user.image_url = image_url
        await self.db_session.commit()
        await self.db_session.refresh(user)
        return user
