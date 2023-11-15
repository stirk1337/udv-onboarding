from typing import List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import curator_user, current_user
from src.auth.models import Role, User
from src.db import get_async_session
from src.planet.dals import PlanetDAL
from src.planet.dependencies import have_planet
from src.planet.models import Planet
from src.planet.validators import ShowPlanet, ShowPlanetWithEmployees
from src.request_codes import planet_responses, responses
from src.user.dals import CuratorDAL, EmployeeDAL
from src.user.models import Product, ProductRole

router = APIRouter(prefix='/planet',
                   tags=['planet'])


@router.get('/get_planet',
            responses=planet_responses)
async def get_planet_by_id(session: AsyncSession = Depends(get_async_session),
                           planet: Planet = Depends(have_planet)) -> ShowPlanetWithEmployees:
    """Get planet by its id. Rights: you must have this planet (employee or curator)"""
    planet_dal = PlanetDAL(session)
    planet = await planet_dal.get_planet_with_employees(planet.id)
    return ShowPlanetWithEmployees.parse(planet)


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
        ShowPlanet.parse(planet) for planet in planets
    ]
    return planets


@router.post('/create_planet',
             responses=responses)
async def create_planet(name: str, session: AsyncSession = Depends(get_async_session),
                        user: User = Depends(curator_user)) -> ShowPlanet:
    """Create a new planet. Rights: curator"""
    planet_dal = PlanetDAL(session)
    planet = await planet_dal.create_planet(name=name, user=user)
    return ShowPlanet.parse(planet)


@router.patch('/update_planet',
              responses=planet_responses,
              dependencies=[Depends(curator_user)])
async def patch_planet(name: str,
                       session: AsyncSession = Depends(get_async_session),
                       planet: Planet = Depends(have_planet)) -> ShowPlanet:
    """Update a planet. Rights: curator, you must have this planet"""
    planet_dal = PlanetDAL(session)
    planet = await planet_dal.patch_planet(planet, name)
    return ShowPlanet.parse(planet)


class EmployeesIdItem(BaseModel):
    employee_ids: List[int]


@router.patch('/add_employees_to_planet',
              responses=planet_responses)
async def set_employee(ids: EmployeesIdItem,
                       session: AsyncSession = Depends(get_async_session),
                       user: User = Depends(curator_user),
                       planet: Planet = Depends(have_planet)) -> ShowPlanetWithEmployees:
    """Add new employees to a planet. Rights: curator, you must have this planet, you must have linked to this
    employees"""
    planet_dal = PlanetDAL(session)
    employee_dal = EmployeeDAL(session)
    employees = await employee_dal.get_employees_by_ids(ids.employee_ids)
    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)
    filtered_employees = list(
        filter(lambda x: x.curator_id == curator.id, employees))
    planet = await planet_dal.add_employees_to_planet(planet, filtered_employees)
    return ShowPlanetWithEmployees.parse(planet)


@router.patch('/add_employees_to_planet_by_params',
              responses=planet_responses)
async def set_employee_by_param(product: Optional[Product] = None,
                                product_role: Optional[ProductRole] = None,
                                session: AsyncSession = Depends(
                                    get_async_session),
                                user: User = Depends(curator_user),
                                planet: Planet = Depends(have_planet)) -> ShowPlanetWithEmployees:
    """Add new employees to a planet by params (product, product role). Rights: curator, you must have this planet,
    you must have linked to this employees"""
    planet_dal = PlanetDAL(session)
    employee_dal = EmployeeDAL(session)
    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)
    employees = await employee_dal.get_employees_by_product_and_product_role(product, product_role)
    filtered_employees = list(
        filter(lambda x: x.curator_id == curator.id, employees))
    planet = await planet_dal.add_employees_to_planet(planet, filtered_employees)
    return ShowPlanetWithEmployees.parse(planet)


@router.patch('/remove_employee_from_planet',
              responses=planet_responses,
              dependencies=[Depends(curator_user)])
async def exclude_employee(employee_id: int,
                           session: AsyncSession = Depends(get_async_session),
                           planet: Planet = Depends(have_planet)) -> ShowPlanetWithEmployees:
    """Delete employee from planet. Rights: curator, you must have this planet"""
    planet_dal = PlanetDAL(session)
    employee_dal = EmployeeDAL(session)
    employee = await employee_dal.get_employee_by_id_with_user(employee_id)
    await planet_dal.exclude_employee_from_planet(planet, employee)
    return ShowPlanetWithEmployees.parse(planet)


@router.delete('/delete_planet',
               dependencies=[Depends(curator_user)],
               responses=planet_responses)
async def delete_planet_by_id(planet_id: int,
                              session: AsyncSession = Depends(
                                  get_async_session),
                              planet: Planet = Depends(have_planet)) -> ShowPlanet:
    """Delete a planet. Rights: curator, you must have this planet"""
    planet_dal = PlanetDAL(session)
    await planet_dal.delete_planet(planet_id)
    return ShowPlanet.parse(planet)
