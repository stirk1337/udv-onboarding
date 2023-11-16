from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from src.planet.models import Planet
from src.task.validators import TaskOut
from src.user.router import EmployeeOut


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


class ShowPlanetWithEmployeesAndTasks(BaseModel):
    id: int
    name: Optional[str]
    curator_id: int
    created_at: datetime
    updated_at: datetime
    employees: List[EmployeeOut]
    tasks: List[TaskOut]

    @staticmethod
    def parse(planet: Planet):
        employees = [EmployeeOut.parse(employee)
                     for employee in planet.employees]
        tasks = [TaskOut.parse(task) for task in planet.task]
        tasks = sorted(tasks, key=lambda x: x.id)
        return ShowPlanetWithEmployeesAndTasks(id=planet.id,
                                               name=planet.name,
                                               curator_id=planet.curator_id,
                                               created_at=planet.created_at,
                                               updated_at=planet.updated_at,
                                               employees=employees,
                                               tasks=tasks
                                               )
