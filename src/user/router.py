import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import curator_user, current_user
from src.auth.manager import create_user
from src.auth.models import Role, User
from src.db import get_async_session
from src.request_codes import details, employee_responses, responses
from src.user.dals import CuratorDAL, EmployeeDAL
from src.user.models import EmployeeStatus, Product, ProductRole

router = APIRouter(
    prefix='/user',
    tags=['user']
)


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: Role


class EmployeeOut(BaseModel):
    id: int
    name: str
    email: str
    product: Product
    product_role: ProductRole
    employee_status: EmployeeStatus
    created_at: datetime.datetime


@router.get('/get_current_user_info',
            response_model=UserOut,
            responses=responses)
async def get_current_user_info(user: User = Depends(current_user)) -> UserOut:
    """Get current user info. Rights: authorized"""
    return UserOut(id=user.id, name=user.name, email=user.email, role=user.role)


@router.get('/get_employees',
            responses=responses)
async def get_curator_employees(user: User = Depends(curator_user),
                                session: AsyncSession = Depends(get_async_session)) -> List[EmployeeOut]:
    """Get employees linked to curator. Rights: curator"""
    employee_dal = EmployeeDAL(session)
    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)
    employees = await employee_dal.get_employees_by_curator(curator)
    employees = [EmployeeOut(id=employee.id,
                             name=employee.user.name,
                             email=employee.user.email,
                             product=employee.product,
                             product_role=employee.product_role,
                             employee_status=employee.employee_status,
                             created_at=employee.created_at) for employee in employees]
    return employees


@router.post('/create_new_employee')
async def create_new_employee(email: EmailStr,
                              name: str,
                              product: Product,
                              product_role: ProductRole,
                              user: User = Depends(curator_user),
                              session: AsyncSession = Depends(get_async_session)) -> EmployeeOut:
    """Create new employee linked to curator. Rights: curator"""
    employee_user = await create_user(email=email, name=name, role=Role.employee)
    if employee_user is None:
        raise HTTPException(status_code=400, detail=details[400])
    employee_dal = EmployeeDAL(session)
    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)
    employee = await employee_dal.create_employee(employee_user, curator.id, product, product_role)
    return EmployeeOut(id=employee.id,
                       name=employee.user.name,
                       email=employee.user.email,
                       product=employee.product,
                       product_role=employee.product_role,
                       employee_status=employee.employee_status,
                       created_at=employee.created_at)


@router.patch('/disable_employee',
              responses=employee_responses)
async def disable_employee_by_id(employee_id: int,
                                 session: AsyncSession = Depends(
                                     get_async_session),
                                 user: User = Depends(curator_user)) -> EmployeeOut:
    """Disable employee by its id. Rights: curator, you must be linked to this employee"""
    employee_dal = EmployeeDAL(session)
    employee = await employee_dal.get_employee_by_id_with_user(employee_id)

    if employee is None:
        raise HTTPException(
            status_code=404, detail=f'Employee with id {employee_id} not found')

    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)
    if curator.id == employee.curator_id:  # if curator linked to this employee
        await employee_dal.disable_employee(employee)
        return EmployeeOut(id=employee.id,
                           name=employee.user.name,
                           email=employee.user.email,
                           product=employee.product,
                           product_role=employee.product_role,
                           employee_status=employee.employee_status,
                           created_at=employee.created_at)
    raise HTTPException(status_code=403, detail='Forbidden')


@router.patch('/enable_employee',
              responses=employee_responses)
async def enable_employee_by_id(employee_id: int,
                                session: AsyncSession = Depends(
                                    get_async_session),
                                user: User = Depends(curator_user)) -> EmployeeOut:
    """Enable employee by its id. Rights: curator, you must be linked to this employee"""
    employee_dal = EmployeeDAL(session)
    employee = await employee_dal.get_employee_by_id_with_user(employee_id)

    if employee is None:
        raise HTTPException(
            status_code=404, detail=f'Employee with id {employee_id} not found')

    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)
    if curator.id == employee.curator_id:  # if curator linked to this employee
        await employee_dal.enable_employee(employee)
        return EmployeeOut(id=employee.id,
                           name=employee.user.name,
                           email=employee.user.email,
                           product=employee.product,
                           product_role=employee.product_role,
                           employee_status=employee.employee_status,
                           created_at=employee.created_at)
    raise HTTPException(status_code=403, detail='Forbidden')
