from typing import List

from fastapi import HTTPException
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.auth.models import User
from src.user.models import (Curator, Employee, EmployeeStatus, Product,
                             ProductRole)


class CuratorDAL:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create_curator(self, user: User) -> Curator:
        new_curator = Curator(user_id=user.id)
        self.db_session.add(new_curator)
        await self.db_session.commit()
        return new_curator

    async def get_curator_by_user(self, user: User) -> Curator:
        return await self.db_session.scalar(
            select(Curator)
            .where(Curator.user_id == user.id)
        )

    async def get_curator_with_employees(self, user: User) -> Curator:
        return await self.db_session.scalar(
            select(Curator)
            .where(Curator.user_id == user.id)
            .options(
                selectinload(Curator.employee)
            )
        )


class EmployeeDAL:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def get_employee_by_id(self, employee_id: int) -> Employee:
        employee = await self.db_session.get(Employee, employee_id)
        if employee is None:
            raise HTTPException(
                status_code=404, detail=f'Employee with id {employee_id} not found')
        return employee

    async def get_employee_by_id_with_user(self, employee_id: int) -> Employee:
        employee = await self.db_session.scalar(
            select(Employee)
            .where(Employee.id == employee_id)
            .options(selectinload(Employee.user))
        )
        if employee is None:
            raise HTTPException(
                status_code=404, detail=f'Employee with id {employee_id} not found')
        return employee

    async def get_employees_by_product_and_product_role(self,
                                                        product: Product,
                                                        product_role: ProductRole) -> List[Employee]:
        query = select(Employee).options(selectinload(Employee.user))

        if product is not None:
            query = query.where(Employee.product == product)

        if product_role is not None:
            query = query.where(and_(Employee.product_role == product_role))

        return list(await self.db_session.scalars(query))

    async def create_employee(self, user: User,
                              curator_id: int = None,
                              product: Product = Product.eplat4m,
                              product_role: ProductRole = ProductRole.backend) -> Employee:
        """Create employee connected to user"""

        new_employee = Employee(user_id=user.id,
                                curator_id=curator_id,
                                product=product,
                                employee_status=EmployeeStatus.invited,
                                product_role=product_role,
                                udv_coins=0)

        self.db_session.add(new_employee)
        await self.db_session.flush()
        await self.db_session.commit()

        employee = await self.db_session.scalar(
            select(Employee)
            .where(Employee.id == new_employee.id)
            .options(selectinload(Employee.user))
        )

        return employee

    async def get_employees_by_curator(self, curator: Curator) -> List[Employee]:
        employees = await self.db_session.scalars(
            select(Employee)
            .where(Employee.curator_id == curator.id)
            .options(selectinload(Employee.user))
        )
        return list(employees)

    async def get_employee_by_user(self, user: User) -> Employee:
        employee = await self.db_session.scalar(
            select(Employee)
            .where(Employee.user_id == user.id)
        )
        if employee is None:
            raise HTTPException(
                status_code=404, detail=f'Employee with that user {user} not found')
        return employee

    async def get_employees_by_ids(self, ids: List[int]) -> List[Employee]:
        employees = await self.db_session.scalars(
            select(Employee)
            .where(Employee.id.in_(ids))
            .options(
                selectinload(Employee.user)
            )
        )
        return list(employees)

    async def disable_employee(self, employee: Employee) -> Employee:
        employee.employee_status = EmployeeStatus.disabled
        employee.user.is_active = False
        await self.db_session.commit()
        await self.db_session.refresh(employee)
        return employee

    async def enable_employee(self, employee: Employee,
                              curator_id: int) -> Employee:
        employee.employee_status = EmployeeStatus.active
        employee.user.is_active = True
        employee.curator_id = curator_id
        await self.db_session.commit()
        return employee
