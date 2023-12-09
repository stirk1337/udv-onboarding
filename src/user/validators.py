import datetime
from typing import List, Optional, Union

from pydantic import BaseModel, EmailStr, field_validator

from src.auth.models import Role, User
from src.user.models import (Curator, Employee, EmployeeStatus, Product,
                             ProductRole)


class UserInUpdate(BaseModel):
    contact: str

    @field_validator('contact')
    @classmethod
    def validate_length(cls, value):
        if len(value) > 100:
            raise ValueError('Too long field: contact')
        return value


class EmployeeIdItem(BaseModel):
    employee_id: int


class EmployeesIdItem(BaseModel):
    employee_ids: List[int]


class CuratorInCreate(BaseModel):
    email: EmailStr
    name: str
    password: Union[str, None] = None

    @field_validator('name')
    @classmethod
    def validate_length(cls, value):
        if len(value) > 100:
            raise ValueError('Too long field: name')
        return value


class EmployeeInCreate(BaseModel):
    email: EmailStr
    name: str
    product: Product
    product_role: ProductRole
    password: Union[str, None] = None

    @field_validator('name')
    @classmethod
    def validate_length(cls, value):
        if len(value) > 100:
            raise ValueError('Too long field: name')
        return value


class CuratorOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: Role
    image_url: Optional[str] = None
    contact: Optional[str] = None

    @staticmethod
    def parse(curator: Curator):
        return CuratorOut(id=curator.id,
                          name=curator.user.name,
                          email=curator.user.email,
                          role=curator.user.role,
                          image_url=curator.user.image_url,
                          contact=curator.user.contact)


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: Role
    image_url: Optional[str] = None
    contact: Optional[str] = None

    @staticmethod
    def parse(user: User):
        return UserOut(id=user.id,
                       name=user.name,
                       email=user.email,
                       role=user.role,
                       image_url=user.image_url,
                       contact=user.contact)


class EmployeeOut(BaseModel):
    id: int
    name: str
    email: str
    product: Product
    product_role: ProductRole
    employee_status: EmployeeStatus
    created_at: datetime.datetime
    updated_at: datetime.datetime
    image_url: Optional[str] = None
    contact: Optional[str] = None
    curator_id: int

    @staticmethod
    def parse(employee: Employee):
        return EmployeeOut(id=employee.id,
                           name=employee.user.name,
                           email=employee.user.email,
                           product=employee.product,
                           product_role=employee.product_role,
                           employee_status=employee.employee_status,
                           created_at=employee.created_at,
                           updated_at=employee.updated_at,
                           image_url=employee.user.image_url,
                           contact=employee.user.contact,
                           curator_id=employee.curator_id)
