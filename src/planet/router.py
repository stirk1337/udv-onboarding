from typing import List, Optional, Union

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import curator_user, current_user, employee_user
from src.auth.models import Role, User
from src.db import get_async_session
from src.notification.models import NotificationType
from src.notification.notification import send_notifications_with_emails
from src.planet.dals import PlanetDAL
from src.planet.dependencies import have_planet
from src.planet.models import Planet
from src.planet.validators import (PlanetIn, ShowPlanet,
                                   ShowPlanetWithCompletionStatus,
                                   ShowPlanetWithEmployees,
                                   ShowPlanetWithEmployeesAndTaskCount)
from src.request_codes import employee_responses, planet_responses, responses
from src.task.dals import TaskDAL
from src.task.models import TaskStatus
from src.user.dals import CuratorDAL, EmployeeDAL
from src.user.models import EmployeeStatus, Product, ProductRole
from src.user.validators import EmployeeIdItem, EmployeesIdItem

router = APIRouter(prefix='/planet',
                   tags=['planet'])


@router.get('/get_planet',
            responses=planet_responses)
async def get_planet_by_id(session: AsyncSession = Depends(get_async_session),
                           planet: Planet = Depends(have_planet)) -> ShowPlanetWithEmployeesAndTaskCount:
    """Get planet by its id. Rights: you must have this planet (employee or curator)"""
    planet_dal = PlanetDAL(session)
    planet = await planet_dal.get_planet_with_employees(planet.id)
    task_dal = TaskDAL(session)
    task_count = await task_dal.count_task_of_planet(planet.id)
    return ShowPlanetWithEmployeesAndTaskCount.parse(planet, task_count)


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
    planets = sorted(planets, key=lambda x: x.id)
    return planets


@router.get('/get_employee_planets_by_employee_id', responses=employee_responses)
async def get_employee_planets_by_employee_id(
        employee_id: int,
        user: User = Depends(curator_user),
        session: AsyncSession = Depends(get_async_session)) -> List[ShowPlanetWithCompletionStatus]:
    """Get employee planets by employee id with completion status. Rights: curator"""
    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)
    employee_dal = EmployeeDAL(session)
    employee = await employee_dal.get_employee_by_id(employee_id)
    response = []
    if employee.curator_id == curator.id:
        planet_dal = PlanetDAL(session)
        task_dal = TaskDAL(session)
        planets = await planet_dal.get_planets_for_employee(employee)
        for planet in planets:
            tasks = await task_dal.get_tasks_by_planet(planet)
            employee_tasks = [await task_dal.get_employee_task(task, employee) for task in tasks]
            completed_task_count = len(list(filter(lambda x: x == TaskStatus.completed,
                                                   [x.task_status for x in employee_tasks])))
            response.append(
                ShowPlanetWithCompletionStatus.parse(
                    planet, completed_task_count, len(employee_tasks))
            )
        return response
    raise HTTPException(status_code=403, detail='Forbidden')


@router.get('/get_employee_planets', responses=employee_responses)
async def get_employee_planets(
        user: User = Depends(employee_user),
        session: AsyncSession = Depends(get_async_session)) -> List[ShowPlanetWithCompletionStatus]:
    """Get employee planets with completion status. Rights: employee"""
    employee_dal = EmployeeDAL(session)
    employee = await employee_dal.get_employee_by_user(user)
    response = []
    planet_dal = PlanetDAL(session)
    task_dal = TaskDAL(session)
    planets = await planet_dal.get_planets_for_employee(employee)
    for planet in planets:
        tasks = await task_dal.get_tasks_by_planet(planet)
        employee_tasks = [await task_dal.get_employee_task(task, employee) for task in tasks]
        completed_task_count = len(list(filter(lambda x: x == TaskStatus.completed,
                                               [x.task_status for x in employee_tasks])))
        response.append(
            ShowPlanetWithCompletionStatus.parse(
                planet, completed_task_count, len(employee_tasks))
        )
    return response


@router.post('/create_planet',
             responses=responses)
async def create_planet(planet_in: PlanetIn,
                        is_first_day: Union[bool, None] = False,
                        session: AsyncSession = Depends(get_async_session),
                        user: User = Depends(curator_user),
                        ) -> ShowPlanet:
    """Create a new planet. Rights: curator, superuser (for first day)"""
    if is_first_day and not user.is_superuser:
        raise HTTPException(
            status_code=403, detail='Forbidden. Only superuser can create first day planets')
    planet_dal = PlanetDAL(session)
    employee_dal = EmployeeDAL(session)
    employees = await employee_dal.get_all_employees()
    planet = await planet_dal.create_planet(name=planet_in.name, user=user, is_first_day=is_first_day)
    planet_with_employees = await planet_dal.get_planet_with_employees(planet.id)
    if is_first_day:  # link first day planet to all employees
        await planet_dal.add_employees_to_planet(planet_with_employees, employees)
    return ShowPlanet.parse(planet)


@router.patch('/update_planet',
              responses=planet_responses,
              dependencies=[Depends(curator_user)])
async def patch_planet(planet_in: PlanetIn,
                       session: AsyncSession = Depends(get_async_session),
                       planet: Planet = Depends(have_planet)) -> ShowPlanet:
    """Update a planet. Rights: curator, you must have this planet"""
    planet_dal = PlanetDAL(session)
    planet = await planet_dal.patch_planet(planet, planet_in.name)
    return ShowPlanet.parse(planet)


@router.patch('/add_employees_to_planet',
              responses=planet_responses)
async def set_employee(ids: EmployeesIdItem,
                       background_tasks: BackgroundTasks,
                       session: AsyncSession = Depends(get_async_session),
                       user: User = Depends(curator_user),
                       planet: Planet = Depends(have_planet),) -> ShowPlanetWithEmployees:
    """Add new employees to a planet. Rights: curator, you must have this planet, you must have linked to this
    employees"""
    planet_dal = PlanetDAL(session)
    employee_dal = EmployeeDAL(session)
    employees = await employee_dal.get_employees_by_ids(ids.employee_ids)
    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)
    filtered_employees = list(
        filter(lambda x: x.curator_id == curator.id and x.employee_status != EmployeeStatus.disabled, employees))
    notify_employees = list(set(filtered_employees) - set(planet.employees))
    planet = await planet_dal.add_employees_to_planet(planet, filtered_employees)

    background_tasks.add_task(send_notifications_with_emails,
                              [employee.user for employee in notify_employees],
                              planet,
                              NotificationType.invited,
                              session)
    return ShowPlanetWithEmployees.parse(planet)


class ProductAndProductRoleIn(BaseModel):
    product: Optional[Product] = None
    product_role: Optional[ProductRole] = None


@router.patch('/add_employees_to_planet_by_params',
              responses=planet_responses)
async def set_employee_by_param(product_in: ProductAndProductRoleIn,
                                background_tasks: BackgroundTasks,
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
    employees = await employee_dal.get_employees_by_product_and_product_role(
        product_in.product,
        product_in.product_role)
    filtered_employees = list(
        filter(lambda x: x.curator_id == curator.id and x.employee_status != EmployeeStatus.disabled, employees))
    notify_employees = list(set(filtered_employees) - set(planet.employees))
    planet = await planet_dal.add_employees_to_planet(planet, filtered_employees)

    background_tasks.add_task(send_notifications_with_emails,
                              [employee.user for employee in notify_employees],
                              planet,
                              NotificationType.invited,
                              session)
    return ShowPlanetWithEmployees.parse(planet)


@router.patch('/remove_employee_from_planet',
              responses=planet_responses,
              dependencies=[Depends(curator_user)])
async def exclude_employee(employee_in: EmployeeIdItem,
                           session: AsyncSession = Depends(get_async_session),
                           planet: Planet = Depends(have_planet)) -> ShowPlanetWithEmployees:
    """Delete employee from planet. Rights: curator, you must have this planet"""
    planet_dal = PlanetDAL(session)
    employee_dal = EmployeeDAL(session)
    employee = await employee_dal.get_employee_by_id_with_user(employee_in.employee_id)
    await planet_dal.exclude_employee_from_planet(planet, employee)
    return ShowPlanetWithEmployees.parse(planet)


@router.delete('/delete_planet',
               dependencies=[Depends(curator_user)],
               responses=planet_responses)
async def delete_planet_by_id(session: AsyncSession = Depends(
    get_async_session),
        planet: Planet = Depends(have_planet)) -> ShowPlanet:
    """Delete a planet. Rights: curator, you must have this planet"""
    planet_dal = PlanetDAL(session)
    await planet_dal.delete_planet(planet.id)
    return ShowPlanet.parse(planet)
