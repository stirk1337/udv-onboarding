from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import curator_user, current_user
from src.auth.models import Role, User
from src.db import get_async_session
from src.planet.dals import PlanetDAL
from src.request_codes import planet_responses, responses
from src.user.dals import CuratorDAL, EmployeeDAL

router = APIRouter(prefix='/planet',
                   tags=['planet'])


class CreatePlanet(BaseModel):
    name: str


class ShowPlanet(BaseModel):
    id: int
    name: str
    curator_id: int
    created_at: datetime


@router.get('/get_planet',
            responses=planet_responses)
async def get_planet_by_id(planet_id: int,
                           session: AsyncSession = Depends(get_async_session),
                           user: User = Depends(current_user)) -> ShowPlanet:
    """Get planet by its id. Rights: you must have this planet (employee or curator)"""
    planet_dal = PlanetDAL(session)
    planet = await planet_dal.get_planet_with_employees(planet_id)

    if planet is None:
        raise HTTPException(
            status_code=404, detail=f'Planet with id {planet_id} not found')

    show_planet = ShowPlanet(id=planet.id,
                             name=planet.name,
                             curator_id=planet.curator_id,
                             created_at=planet.created_at)

    if user.role == Role.curator:  # check if you are curator and you have this planet
        curator_dal = CuratorDAL(session)
        curator = await curator_dal.get_curator_by_user(user)
        if planet.curator_id == curator.id:
            return show_planet

    elif user.role == Role.employee:  # check if you are employee and you have this planet
        employee_dal = EmployeeDAL(session)
        employee = await employee_dal.get_employee_by_user(user)
        if employee in planet.employees:
            return show_planet

    raise HTTPException(status_code=403, detail='Forbidden')


@router.get('/get_planets', responses=responses)
async def get_planets(user: User = Depends(current_user),
                      session: AsyncSession = Depends(get_async_session)) -> List[ShowPlanet]:
    """Get your planets. Rights: employee or curator"""
    planet_dal = PlanetDAL(session)
    planets = []

    if user.role == Role.curator:  # get planets if you are curator
        curator_dal = CuratorDAL(session)
        curator = await curator_dal.get_curator_by_user(user)
        planets = await planet_dal.get_planets_for_curator(curator)

    elif user.role == Role.employee:  # get planets if you are employee
        employee_dal = EmployeeDAL(session)
        employee = await employee_dal.get_employee_by_user(user)
        planets = await planet_dal.get_planets_for_employee(employee)

    planets = [
        ShowPlanet(id=planet.id,
                   name=planet.name,
                   curator_id=planet.curator_id,
                   created_at=planet.created_at) for planet in planets
    ]
    return planets


@router.post('/create_planet',
             responses=responses)
async def create_planet(body: CreatePlanet, session: AsyncSession = Depends(get_async_session),
                        user: User = Depends(curator_user)) -> ShowPlanet:
    """Create a new planet. Rights: curator"""
    planet_dal = PlanetDAL(session)
    planet = await planet_dal.create_planet(name=body.name, user=user)
    return ShowPlanet(id=planet.id,
                      name=planet.name,
                      curator_id=planet.curator_id,
                      created_at=planet.created_at)


@router.patch('/update_planet',
              responses=planet_responses)
async def patch_planet(planet_id: int,
                       name: str,
                       session: AsyncSession = Depends(get_async_session),
                       user: User = Depends(curator_user)) -> ShowPlanet:
    """Update a planet. Rights: curator, you must have this planet"""
    planet_dal = PlanetDAL(session)
    planet = await planet_dal.get_planet_by_id(planet_id)

    if planet is None:
        raise HTTPException(
            status_code=404, detail=f'Planet with id {planet_id} not found')

    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)
    if curator.id == planet.curator_id:
        planet = await planet_dal.patch_planet(planet, name)
        return ShowPlanet(id=planet.id,
                          name=planet.name,
                          curator_id=planet.curator_id,
                          created_at=planet.created_at)

    raise HTTPException(status_code=403, detail='Forbidden')


class EmployeesIdItem(BaseModel):
    employee_ids: List[int]


@router.post('/add_employees_to_planet',
             responses=planet_responses,
             dependencies=[Depends(curator_user)])
async def set_employee(planet_id: int,
                       ids: EmployeesIdItem,
                       session: AsyncSession = Depends(get_async_session)):
    """Add new employees to a planet. Rights: curator, you must have this planet"""
    planet_dal = PlanetDAL(session)
    employee_dal = EmployeeDAL(session)
    employees = await employee_dal.get_employees_by_ids(ids.employee_ids)
    planet = await planet_dal.add_employees_to_planet(planet_id, employees)
    if planet is None:
        raise HTTPException(
            status_code=404, detail=f'Planet with id {planet_id} not found')
    return ShowPlanet(id=planet.id,
                      name=planet.name,
                      curator_id=planet.curator_id,
                      created_at=planet.created_at)


@router.delete('/delete_planet',
               dependencies=[Depends(curator_user)],
               responses=planet_responses)
async def delete_planet_by_id(planet_id: int,
                              session: AsyncSession = Depends(
                                  get_async_session),
                              user: User = Depends(curator_user)) -> ShowPlanet:
    """Delete a planet. Rights: curator, you must have this planet"""
    planet_dal = PlanetDAL(session)
    planet = await planet_dal.get_planet_by_id(planet_id)

    if planet is None:
        raise HTTPException(
            status_code=404, detail=f'Planet with id {planet_id} not found')

    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)
    if curator.id == planet.curator_id:
        await planet_dal.delete_planet(planet_id)
        return ShowPlanet(id=planet.id,
                          name=planet.name,
                          curator_id=planet.curator_id,
                          created_at=planet.created_at)
    raise HTTPException(status_code=403, detail='Forbidden')
