from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, field_validator

from src.planet.models import Planet, PlanetImage
from src.user.router import EmployeeOut
from src.user.validators import CuratorOut


class PlanetInCreate(BaseModel):
    name: Optional[str]
    image: Optional[PlanetImage]

    @field_validator('name')
    def validate_length(cls, value):
        if len(value) > 100:
            raise ValueError('Too long field: name')
        return value


class PlanetInUpdate(BaseModel):
    name: Optional[str]

    @field_validator('name')
    def validate_length(cls, value):
        if len(value) > 100:
            raise ValueError('Too long field: name')
        return value


class PlanetInChangePos(BaseModel):
    new_pos: int


class ShowPlanet(BaseModel):
    id: int
    name: Optional[str]
    curator_id: int
    created_at: datetime
    updated_at: datetime
    is_first_day: bool
    image: PlanetImage
    pos: int

    @staticmethod
    def parse(planet: Planet):
        return ShowPlanet(id=planet.id,
                          name=planet.name,
                          curator_id=planet.curator_id,
                          created_at=planet.created_at,
                          updated_at=planet.updated_at,
                          is_first_day=planet.is_first_day,
                          image=planet.image,
                          pos=planet.pos)


class ShowPlanetWithCurator(BaseModel):
    id: int
    name: Optional[str]
    curator: CuratorOut
    created_at: datetime
    updated_at: datetime
    is_first_day: bool
    image: PlanetImage
    pos: int

    @staticmethod
    def parse(planet: Planet):
        return ShowPlanetWithCurator(id=planet.id,
                                     name=planet.name,
                                     curator=CuratorOut.parse(planet.curator),
                                     created_at=planet.created_at,
                                     updated_at=planet.updated_at,
                                     is_first_day=planet.is_first_day,
                                     image=planet.image,
                                     pos=planet.pos)


class ShowPlanetWithCompletionStatus(BaseModel):
    id: int
    name: Optional[str]
    curator_id: int
    created_at: datetime
    updated_at: datetime
    completed: int
    task_count: int
    is_first_day: bool
    image: PlanetImage
    pos: int

    @staticmethod
    def parse(planet: Planet, completed: int, task_count: int):
        return ShowPlanetWithCompletionStatus(id=planet.id,
                                              name=planet.name,
                                              curator_id=planet.curator_id,
                                              created_at=planet.created_at,
                                              updated_at=planet.updated_at,
                                              completed=completed,
                                              task_count=task_count,
                                              is_first_day=planet.is_first_day,
                                              image=planet.image,
                                              pos=planet.pos)


class ShowPlanetWithEmployees(BaseModel):
    id: int
    name: Optional[str]
    curator_id: int
    created_at: datetime
    updated_at: datetime
    employees: List[EmployeeOut]
    is_first_day: bool
    image: PlanetImage
    pos: int

    @staticmethod
    def parse(planet: Planet):
        employees = [EmployeeOut.parse(employee)
                     for employee in planet.employees]
        return ShowPlanetWithEmployees(id=planet.id,
                                       name=planet.name,
                                       curator_id=planet.curator_id,
                                       created_at=planet.created_at,
                                       updated_at=planet.updated_at,
                                       employees=employees,
                                       is_first_day=planet.is_first_day,
                                       image=planet.image,
                                       pos=planet.pos
                                       )


class ShowPlanetWithEmployeesAndTaskCount(BaseModel):
    id: int
    name: Optional[str]
    curator_id: int
    created_at: datetime
    updated_at: datetime
    employees: List[EmployeeOut]
    task_count: int
    is_first_day: bool
    image: PlanetImage
    pos: int

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
                                                   task_count=task_count,
                                                   is_first_day=planet.is_first_day,
                                                   image=planet.image,
                                                   pos=planet.pos
                                                   )
