from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.models import User
from src.user.models import Curator, Employee


class CuratorDAL:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create_curator(self, user: User) -> Curator:
        new_curator = Curator(user_id=user.id)
        self.db_session.add(new_curator)
        await self.db_session.flush()
        await self.db_session.commit()
        return new_curator


class EmployeeDAL:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create_employee(self, user: User) -> Employee:
        pass
