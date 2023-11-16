import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr

from src.auth.models import Role, User
from src.user.models import Employee, EmployeeStatus, Product, ProductRole


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: Role
    image_url: Optional[str] = None

    @staticmethod
    def parse(user: User):
        return UserOut(id=user.id,
                       name=user.name,
                       email=user.email,
                       role=user.role,
                       image_url=user.image_url)


class EmployeeOut(BaseModel):
    id: int
    name: str
    email: str
    product: Product
    product_role: ProductRole
    employee_status: EmployeeStatus
    created_at: datetime.datetime
    updated_at: datetime.datetime

    @staticmethod
    def parse(employee: Employee):
        return EmployeeOut(id=employee.id,
                           name=employee.user.name,
                           email=employee.user.email,
                           product=employee.product,
                           product_role=employee.product_role,
                           employee_status=employee.employee_status,
                           created_at=employee.created_at,
                           updated_at=employee.updated_at)