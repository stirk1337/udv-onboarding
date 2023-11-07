from src.auth.manager import create_user_without_depends
from src.auth.models import Role


async def start_up():
    await create_user_without_depends('admin@admin.ru', 'adminadmin', True, role=Role.curator)
