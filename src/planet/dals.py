from typing import List

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.auth.models import User
from src.planet.models import Planet, PlanetImage
from src.task.models import Task
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

    async def get_first_day_planets(self) -> List[Planet]:
        planets = await self.db_session.scalars(
            select(Planet)
            .where(Planet.is_first_day)
            .options(
                selectinload(Planet.employees)
            )
        )
        return list(planets)

    async def get_planets_for_curator(self, curator: Curator) -> List[Planet]:
        planets = await self.db_session.scalars(
            select(Planet)
            .where(Planet.curator_id == curator.id)
        )
        return list(planets)

    async def get_planets_for_curator_with_tasks_and_employees(self, curator: Curator) -> List[Planet]:
        planets = await self.db_session.scalars(
            select(Planet)
            .where(Planet.curator_id == curator.id)
            .options(
                selectinload(Planet.employees)
                .selectinload(Employee.user),
                selectinload(Planet.task)
            )
        )
        return list(planets)

    async def get_planet_by_id(self, planet_id: int) -> Planet:
        planet = await self.db_session.get(Planet, planet_id)
        if planet is None:
            raise HTTPException(
                status_code=404, detail=f'Planet with id {planet_id} not found')
        return planet

    async def create_planet(self, name: str, user: User, is_first_day: bool, image: PlanetImage) -> Planet:
        curator = await self.db_session.scalar(
            select(Curator)
            .where(Curator.user_id == user.id)
        )
        new_planet = Planet(name=name,
                            curator_id=curator.id,
                            is_first_day=is_first_day,
                            image=image)
        self.db_session.add(new_planet)
        await self.db_session.commit()
        return new_planet

    async def reorder_planets_by_planet(self, planets: List[Planet], planet: Planet, new_pos: int):
        planets.remove(planet)
        planets.insert(new_pos, planet)
        for index, plan in enumerate(planets):
            plan.pos = index
        await self.db_session.commit()

    async def get_planet_with_employees(self, planet_id: int) -> Planet:
        planet = await self.db_session.scalar(
            select(Planet)
            .where(Planet.id == planet_id)
            .options(
                selectinload(Planet.employees)
                .selectinload(Employee.user),
            )
        )
        if planet is None:
            raise HTTPException(
                status_code=404, detail=f'Planet with id {planet_id} not found')
        return planet

    async def get_planet_with_employee_task_table(self, planet_id: int) -> Planet:
        planet = await self.db_session.scalar(
            select(Planet)
            .where(Planet.id == planet_id)
            .options(
                selectinload(Planet.employees)
                .selectinload(Employee.user),
                selectinload(Planet.task)
                .selectinload(Task.employees)
            )
        )
        if planet is None:
            raise HTTPException(
                status_code=404, detail=f'Planet with id {planet_id} not found')
        return planet

    async def add_employees_to_planet(self, planet: Planet, employees: List[Employee]) -> Planet:
        planet.employees = list(set(planet.employees + employees))
        planet_employee_task = await self.get_planet_with_employee_task_table(planet.id)
        for task in planet_employee_task.task:
            task.employees = planet.employees
        await self.db_session.commit()
        await self.db_session.refresh(planet)
        return planet

    async def exclude_employee_from_planet(self, planet: Planet, employee: Employee) -> Planet:
        if employee in planet.employees:
            planet.employees.remove(employee)
            await self.db_session.commit()
            await self.db_session.refresh(planet)
        return planet

    async def patch_planet(self, planet: Planet, name: str) -> Planet:
        planet.name = name
        await self.db_session.commit()
        await self.db_session.refresh(planet)
        return planet

    async def delete_planet(self, planet_id: int):
        planet = await self.db_session.scalar(
            select(Planet)
            .where(Planet.id == planet_id)
        )
        if planet:
            await self.db_session.delete(planet)
            await self.db_session.commit()
