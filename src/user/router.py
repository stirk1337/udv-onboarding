from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dals import UserDAL
from src.auth.dependencies import curator_user, current_user
from src.auth.manager import create_user
from src.auth.models import Role, User
from src.auth.router import current_superuser
from src.db import get_async_session
from src.email.email import EmailBody, EmailSchema, send_register_email
from src.planet.dals import PlanetDAL
from src.request_codes import (curator_responses, employee_responses,
                               responses, user_responses)
from src.user.dals import CuratorDAL, EmployeeDAL
from src.user.models import EmployeeStatus
from src.user.validators import (CuratorInCreate, CuratorOut, EmployeeIdItem,
                                 EmployeeInCreate, EmployeeOut, UserInUpdate,
                                 UserOut)

router = APIRouter(
    prefix='/user',
    tags=['user']
)


@router.get('/get_current_user_info',
            responses=responses)
async def get_current_user_info(user: User = Depends(current_user)) -> UserOut:
    """Get current user info. Rights: authorized"""
    return UserOut.parse(user)


@router.get('/get_employee_profile_by_user_id',
            responses=user_responses,
            dependencies=[Depends(current_user)])
async def get_employee_profile(user_id: int,
                               session: AsyncSession = Depends(get_async_session)) -> EmployeeOut:
    employee_dal = EmployeeDAL(session)
    user_dal = UserDAL(session)
    user = await user_dal.get_user_by_id(user_id)
    employee = await employee_dal.get_employee_by_user_with_curator(user)
    return EmployeeOut.parse(employee)


@router.get('/get_curator_profile_by_curator_id',
            responses=curator_responses,
            dependencies=[Depends(current_user)])
async def get_curator_profile(curator_id: int,
                              session: AsyncSession = Depends(get_async_session)) -> CuratorOut:
    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_id_with_user(curator_id)
    return CuratorOut.parse(curator)


@router.patch('/edit_user_profile',
              responses=responses)
async def patch_user_profile(user_in_update: UserInUpdate,
                             user: User = Depends(current_user),
                             session: AsyncSession = Depends(get_async_session)) -> UserOut:
    """Change user info. Rights: curator, employee. Contact: max length 100"""
    user_dal = UserDAL(session)
    user = await user_dal.patch_profile(user, user_in_update.contact)
    return UserOut.parse(user)


@router.get('/get_employees',
            responses=responses)
async def get_curator_employees(user: User = Depends(curator_user),
                                session: AsyncSession = Depends(get_async_session)) -> List[EmployeeOut]:
    """Get employees linked to curator. Rights: curator"""
    employee_dal = EmployeeDAL(session)
    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)
    employees = await employee_dal.get_employees_by_curator(curator)
    employees = [EmployeeOut.parse(employee) for employee in employees
                 if employee.employee_status != EmployeeStatus.disabled]
    return employees


@router.post('/register_new_curator',
             dependencies=[Depends(current_superuser)],
             responses=responses)
async def register_curator(curator_in: CuratorInCreate,
                           session: AsyncSession = Depends(get_async_session)) -> UserOut:
    created_user_data = await create_user(session=session,
                                          email=curator_in.email,
                                          name=curator_in.name,
                                          role=Role.curator,
                                          password=curator_in.password)
    if created_user_data is None:
        raise HTTPException(status_code=409, detail='User already exists')
    # emails = [(EmailBody(email=user.email, body={'email': user.email}))]
    # await send_register_email(EmailSchema(emails=emails))
    user = created_user_data[0]
    return UserOut.parse(user)


@router.post('/register_new_employee')
async def create_new_employee(employee_in: EmployeeInCreate,
                              user: User = Depends(curator_user),
                              session: AsyncSession = Depends(
                                  get_async_session)) -> EmployeeOut:
    """Create new employee linked to curator or re-activate old employee with curator.
     Rights: curator, employee must be disabled"""
    employee_dal = EmployeeDAL(session)
    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)

    created_user_data = await create_user(session=session,
                                          email=employee_in.email,
                                          name=employee_in.name,
                                          role=Role.employee,
                                          password=employee_in.password)
    employee_user = None
    password = None
    if created_user_data:
        employee_user = created_user_data[0]
        password = created_user_data[1]
    if employee_user:
        employee = await employee_dal.create_employee(
            employee_user,
            curator.id,
            employee_in.product,
            employee_in.product_role)
    else:  # if user already exists
        user_dal = UserDAL(session)
        password = 'Вы были повторны приглашены на сайт. Пароль остаётся тем же.'
        employee_user = await user_dal.get_user_by_email(employee_in.email)
        if employee_user.role == Role.curator:
            raise HTTPException(
                status_code=409, detail=f'User with email {employee_in.email} is curator')
        employee = await employee_dal.get_employee_by_user(employee_user)
        if employee.employee_status == EmployeeStatus.disabled:
            await employee_dal.enable_employee(employee, curator.id)
        else:
            raise HTTPException(
                status_code=403, detail=f'Employee with email {employee_in.email} is active.')

    planet_dal = PlanetDAL(session)
    first_day_planets = await planet_dal.get_first_day_planets()
    for planet in first_day_planets:
        await planet_dal.add_employees_to_planet(planet, [employee])
    emails = [(EmailBody(email=employee_user.email,
                         body={
                             'user': employee_user,
                             'password': password,
                             'curator': user
                         }))]
    await send_register_email(EmailSchema(emails=emails))
    return EmployeeOut.parse(employee)


@router.patch('/disable_employee',
              responses=employee_responses)
async def disable_employee_by_id(employee_in: EmployeeIdItem,
                                 session: AsyncSession = Depends(
                                     get_async_session),
                                 user: User = Depends(curator_user)) -> EmployeeOut:
    """Disable employee by its id. Rights: curator, you must be linked to this employee"""
    employee_dal = EmployeeDAL(session)
    employee = await employee_dal.get_employee_by_id_with_user(employee_in.employee_id)
    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)
    if curator.id == employee.curator_id:  # if curator linked to this employee
        await employee_dal.disable_employee(employee)
        return EmployeeOut.parse(employee)
    raise HTTPException(status_code=403, detail='Forbidden')
