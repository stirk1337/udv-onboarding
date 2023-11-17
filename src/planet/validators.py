from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from src.planet.models import Planet
from src.user.router import EmployeeOut


class PlanetIn(BaseModel):
    name: Optional[str]


class ShowPlanet(BaseModel):
    id: int
    name: Optional[str]
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
    name: Optional[str]
    curator_id: int
    created_at: datetime
    updated_at: datetime
    employees: List[EmployeeOut]

    @staticmethod
    def parse(planet: Planet):
        employees = [EmployeeOut.parse(employee)
                     for employee in planet.employees]
        return ShowPlanetWithEmployees(id=planet.id,
                                       name=planet.name,
                                       curator_id=planet.curator_id,
                                       created_at=planet.created_at,
                                       updated_at=planet.updated_at,
                                       employees=employees
                                       )


class ShowPlanetWithEmployeesAndTaskCount(BaseModel):
    id: int
    name: Optional[str]
    curator_id: int
    created_at: datetime
    updated_at: datetime
    employees: List[EmployeeOut]
    task_count: int

    @staticmethod
    def parse(planet: Planet, task_count: int):
        employees = [EmployeeOut.parse(employee)
                     for employee in planet.employees]
        return ShowPlanetWithEmployeesAndTaskCount(id=planet.id,
                                                   name=planet.name,
                                                   curator_id=planet.curator_id,
                                                   created_at=planet.created_at,
                                                   updated_at=planet.updated_at,
                                                   employees=employees,
                                                   task_count=task_count
                                                   )
