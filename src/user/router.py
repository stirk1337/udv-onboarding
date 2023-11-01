import asyncio

from fastapi import APIRouter, Depends, HTTPException
from httpx import AsyncClient
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import curator_user
from src.auth.manager import create_user
from src.auth.models import Role, User
from src.auth.router import fastapi_users
from src.db import get_async_session
from src.request_codes import details, responses
from src.user.dals import CuratorDAL, EmployeeDAL
from src.user.models import Product, ProductRole

router = APIRouter(
    prefix='/user',
    tags=['user']
)

current_user = fastapi_users.current_user()


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: Role


@router.get('/get_current_user_info',
            response_model=UserOut,
            responses=responses)
async def get_current_user_info(user: User = Depends(current_user)) -> UserOut:
    return UserOut(id=user.id, name=user.name, email=user.email, role=user.role)


class EmployeeOut(BaseModel):
    id: int
    product: Product
    product_role: ProductRole


@router.post('/create_new_employee')
async def create_new_employee(email: EmailStr,
                              name: str,
                              product: Product,
                              product_role: ProductRole,
                              user: User = Depends(curator_user),
                              session: AsyncSession = Depends(get_async_session)) -> EmployeeOut:
    employee_user = await create_user(email=email, name=name, role=Role.employee)
    if employee_user is None:
        raise HTTPException(status_code=400, detail=details[400])
    employee_dal = EmployeeDAL(session)
    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)
    employee = await employee_dal.create_employee(employee_user, curator.id, product, product_role)

    async def request(client: AsyncClient, reset_email: EmailStr):  # send password reset token
        await client.post('http://localhost:8000/auth/forgot-password',
                          json={'email': reset_email},
                          headers={'Content-Type': 'application/json'})

    async with AsyncClient() as cli:
        task = request(cli, employee_user.email)
        await asyncio.gather(task)

    return EmployeeOut(id=employee.id,
                       product=employee.product,
                       product_role=employee.product_role)
