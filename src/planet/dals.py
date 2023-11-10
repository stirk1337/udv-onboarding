from typing import List, Union

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.auth.models import User
from src.planet.models import Planet
from src.user.models import Curator, Employee


class PlanetDAL:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def get_planets_for_employee(self, employee: Employee) -> List[Planet]:
        employees = await self.db_session.scalar(
            select(Employee)
            .where(Employee.id == employee.id)
            .options(
                selectinload(Employee.planets),
            )
        )
        return list(employees.planets)

    async def get_planets_for_curator(self, curator: Curator) -> List[Planet]:
        planets = await self.db_session.scalars(
            select(Planet)
            .where(Planet.curator_id == curator.id)
        )
        return list(planets)

    async def get_planet_by_id(self, planet_id: int) -> Union[Planet, None]:
        planet = await self.db_session.get(Planet, planet_id)
        return planet

    async def create_planet(self, name: str, user: User) -> Planet:
        curator = await self.db_session.scalar(
            select(Curator)
            .where(Curator.user_id == user.id)
        )
        new_planet = Planet(name=name,
                            curator_id=curator.id)
        self.db_session.add(new_planet)
        await self.db_session.commit()
        return new_planet

    async def get_planet_with_employees(self, planet_id: int):
        planet = await self.db_session.scalar(
            select(Planet)
            .where(Planet.id == planet_id)
            .options(
                selectinload(Planet.employees),
            )
        )
        return planet

    async def add_employees_to_planet(self, planet_id: int, employees: List[Employee]) -> Union[Planet, None]:
        planet = await self.get_planet_with_employees(planet_id)
        if planet is None:
            return None

        planet.employees = list(set(planet.employees + employees))
        await self.db_session.commit()
        return planet

    async def patch_planet(self, planet: Planet, name: str) -> Planet:
        planet.name = name
        await self.db_session.commit()
        return planet

    async def delete_planet(self, planet_id: int):
        planet = await self.db_session.scalar(
            select(Planet)
            .where(Planet.id == planet_id)
        )
        if planet:
            await self.db_session.delete(planet)
            await self.db_session.commit()