from src.auth.manager import create_user
from src.auth.models import Role


async def start_up():
    await create_user('admin@admin.ru', 'adminadmin', True, role=Role.curator)
