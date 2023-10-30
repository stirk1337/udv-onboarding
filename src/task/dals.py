from sqlalchemy.ext.asyncio import AsyncSession

from src.task.models import Planet


class PlanetDAL:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create_planet(self, name: str) -> Planet:
        new_planet = Planet(name=name)
        self.db_session.add(new_planet)
        await self.db_session.flush()
        return new_planet


class TaskDAL:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session
