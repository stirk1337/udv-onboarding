from datetime import datetime
from typing import List

from pydantic import BaseModel

from src.planet.models import Planet
from src.user.router import EmployeeOut


class ShowPlanet(BaseModel):
    id: int
    name: str
    curator_id: int
    created_at: datetime
    updated_at: datetime

    @staticmethod
    def parse(planet: Planet):
        return ShowPlanet(id=planet.id,
                          name=planet.name,
                          curator_id=planet.curator_id,
                          created_at=planet.created_at,
                          updated_at=planet.updated_at)


class ShowPlanetWithEmployees(BaseModel):
    id: int
    name: str
    curator_id: int
    created_at: datetime
    updated_at: datetime
    employees: List[EmployeeOut]

    @staticmethod
    def parse(planet: Planet):
        employees = [EmployeeOut(id=employee.id,
                                 name=employee.user.name,
                                 email=employee.user.email,
                                 product=employee.product,
                                 product_role=employee.product_role,
                                 employee_status=employee.employee_status,
                                 created_at=employee.created_at) for employee in
                     planet.employees]
        return ShowPlanetWithEmployees(id=planet.id,
                                       name=planet.name,
                                       curator_id=planet.curator_id,
                                       created_at=planet.created_at,
                                       updated_at=planet.updated_at,
                                       employees=employees
                                       )
