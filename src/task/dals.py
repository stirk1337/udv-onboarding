from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.models import User
from src.task.models import Planet
from src.user.models import Curator


class PlanetDAL:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create_planet(self, name: str, user: User) -> Planet:
        statement = select(Curator).where(Curator.user_id == user.id)
        result = await self.db_session.execute(statement)
        curator = result.scalars().one()
        new_planet = Planet(name=name,
                            curator_id=curator.id)
        self.db_session.add(new_planet)
        await self.db_session.flush()
        await self.db_session.commit()
        return new_planet


class TaskDAL:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session
