from src.auth.manager import create_user_without_depends
from src.auth.models import Role
from src.db import async_session_maker
from src.user.dals import CuratorDAL


async def start_up():
    await create_super_user()


async def create_super_user():
    user = await create_user_without_depends('admin@admin.ru', 'adminadmin', True, role=Role.curator)
    if user:
        async with async_session_maker() as session:
            curator_dal = CuratorDAL(session)
            await curator_dal.create_curator(user)
