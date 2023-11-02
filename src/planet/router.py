from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import curator_user
from src.auth.models import User
from src.db import get_async_session
from src.planet.dals import PlanetDAL
from src.request_codes import planet_responses, responses
from src.user.dals import EmployeeDAL

router = APIRouter(prefix='/planet',
                   tags=['planet'])


class CreatePlanet(BaseModel):
    name: str


class ShowPlanet(BaseModel):
    id: int
    name: str
    curator_id: int


@router.post('/create_planet',
             responses=responses)
async def create_planet(body: CreatePlanet, session: AsyncSession = Depends(get_async_session),
                        user: User = Depends(curator_user)) -> ShowPlanet:
    planet_dal = PlanetDAL(session)
    planet = await planet_dal.create_planet(name=body.name, user=user)
    return ShowPlanet(id=planet.id, name=planet.name, curator_id=planet.curator_id)


class EmployeesIdItem(BaseModel):
    employee_ids: List[int]


@router.post('/add_employees_to_planet',
             responses=planet_responses,
             dependencies=[Depends(curator_user)])
async def set_employee(planet_id: int,
                       ids: EmployeesIdItem,
                       session: AsyncSession = Depends(get_async_session)):
    planet_dal = PlanetDAL(session)
    employee_dal = EmployeeDAL(session)
    employees = await employee_dal.get_employees_by_ids(ids.employee_ids)
    planet = await planet_dal.add_employees_to_planet(planet_id, employees)
    if planet is None:
        raise HTTPException(
            status_code=404, detail=f'Planet with id {planet_id} not found')
    return ShowPlanet(id=planet.id,
                      name=planet.name,
                      curator_id=planet.curator_id)
