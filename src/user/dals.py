from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.models import User
from src.user.models import Curator, Employee, Product, ProductRole


class CuratorDAL:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create_curator(self, user: User) -> Curator:
        new_curator = Curator(user_id=user.id)
        self.db_session.add(new_curator)
        await self.db_session.commit()
        return new_curator

    async def get_curator_by_user(self, user: User) -> Curator:
        curator = await self.db_session.scalar(
            select(Curator)
            .where(Curator.user_id == user.id)
        )
        return curator


class EmployeeDAL:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create_employee(self, user: User,
                              curator_id: int = None,
                              product: Product = Product.eplat4m,
                              product_role: ProductRole = ProductRole.backend) -> Employee:
        """Create employee connected to user"""

        new_employee = Employee(user_id=user.id,
                                curator_id=curator_id,
                                product=product,
                                product_role=product_role,
                                udv_coins=0)

        self.db_session.add(new_employee)
        await self.db_session.commit()
        return new_employee

    async def get_employees_by_ids(self, ids: List[int]) -> List[Employee]:
        employees = await self.db_session.scalars(
            select(Employee)
            .where(Employee.id.in_(ids))
        )
        return list(employees)
