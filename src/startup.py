from src.auth.manager import create_user
from src.auth.models import Role


async def start_up():
    await create_user('admin@admin.ru', 'admin', True, role=Role.curator)
