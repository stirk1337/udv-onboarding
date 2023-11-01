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
        await self.db_session.flush()
        await self.db_session.commit()
        return new_curator

    async def get_curator_by_user(self, user: User) -> Curator:
        statement = select(Curator).where(Curator.user_id == user.id)
        result = await self.db_session.execute(statement)
        curator = result.scalars().one()
        return curator


class EmployeeDAL:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    # async def create_user_and_employee(self, curator: User,
    #                                    email: str,
    #                                    name: str,
    #                                    product: Product,
    #                                    product_role: ProductRole,
    #                                    password: str = token_urlsafe(20)) -> Employee:
    #     """Create new user and employee connected to this user"""
    #
    #     new_user = await manager.create_user(email=email,
    #                                          name=name,
    #                                          password=password,
    #                                          role=Role.employee)
    #
    #     new_employee = Employee(user_id=new_user.id,
    #                             curator_id=curator.id,
    #                             product=product,
    #                             product_role=product_role,
    #                             udv_coins=0)
    #
    #     self.db_session.add(new_employee)
    #     await self.db_session.flush()
    #     await self.db_session.commit()
    #     return new_employee

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
        await self.db_session.flush()
        await self.db_session.commit()
        return new_employee
