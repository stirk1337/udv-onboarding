from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import current_user
from src.auth.models import Role, User
from src.db import get_async_session
from src.planet.dals import PlanetDAL
from src.planet.models import Planet
from src.user.dals import CuratorDAL, EmployeeDAL


async def have_planet(planet_id: int,
                      user: User = Depends(current_user),
                      session: AsyncSession = Depends(get_async_session)) -> Planet:
    planet_dal = PlanetDAL(session)
    planet = await planet_dal.get_planet_with_employees(planet_id)
    if user.role == Role.curator:
        curator_dal = CuratorDAL(session)
        curator = await curator_dal.get_curator_by_user(user)
        if planet.curator_id == curator.id:
            return planet
    elif user.role == Role.employee:
        employee_dal = EmployeeDAL(session)
        employee = await employee_dal.get_employee_by_user(user)
        if employee in planet.employees:
            return planet
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
