import datetime
from typing import Optional

from pydantic import BaseModel, field_validator

from src.task.models import EmployeeTask, Task, TaskImage, TaskStatus
from src.user.models import Employee
from src.user.validators import EmployeeOut


class TaskInCreate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    image: Optional[TaskImage]

    @field_validator('name')
    def validate_length_name(cls, value):
        if len(value) > 100:
            raise ValueError('Too long field: name')
        return value

    @field_validator('description')
    def validate_length_description(cls, value):
        if len(value) > 1000000:
            raise ValueError('Too long field: description')
        return value


class TaskInUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]

    @field_validator('name')
    def validate_length_name(cls, value):
        if len(value) > 100:
            raise ValueError('Too long field: name')
        return value

    @field_validator('description')
    def validate_length_description(cls, value):
        if len(value) > 1000000:
            raise ValueError('Too long field: description')
        return value


class TaskInChangePos(BaseModel):
    new_pos: int


class TaskInAnswer(BaseModel):
    answer: str

    @field_validator('answer')
    def validate_length(cls, value):
        if len(value) > 1000:
            raise ValueError('Too long field: answer')
        return value


class TaskInCheck(BaseModel):
    task_status: TaskStatus
    curator_answer: Optional[str]

    @field_validator('curator_answer')
    def validate_length(cls, value):
        if value is None:
            return value
        if len(value) > 1000:
            raise ValueError('Too long field: curator_answer')
        return value


class TaskOut(BaseModel):
    id: int
    name: Optional[str]
    description: Optional[str]
    planet_id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    image: TaskImage
    pos: int

    @staticmethod
    def parse(task: Task):
        return TaskOut(id=task.id,
                       name=task.name,
                       description=task.description,
                       planet_id=task.planet_id,
                       created_at=task.created_at,
                       updated_at=task.updated_at,
                       image=task.image,
                       pos=task.pos)


class EmployeeTaskOut(BaseModel):
    employee_id: int
    task_id: int
    employee_answer: Optional[str]
    curator_answer: Optional[str]
    task_status: TaskStatus
    created_at: datetime.datetime
    updated_at: datetime.datetime

    @staticmethod
    def parse(employee_task: EmployeeTask):
        return EmployeeTaskOut(employee_id=employee_task.employee_id,
                               task_id=employee_task.task_id,
                               employee_answer=employee_task.employee_answer,
                               curator_answer=employee_task.curator_answer,
                               task_status=employee_task.task_status,
                               created_at=employee_task.created_at,
                               updated_at=employee_task.updated_at)


class TaskOutForEmployee(BaseModel):
    id: int
    name: Optional[str]
    description: Optional[str]
    planet_id: int
    employee_answer: Optional[str]
    curator_answer: Optional[str]
    task_status: TaskStatus
    created_at: datetime.datetime
    updated_at: datetime.datetime
    image: TaskImage
    pos: int

    @staticmethod
    def parse(task: Task, employee_task: EmployeeTask):
        return TaskOutForEmployee(id=task.id,
                                  name=task.name,
                                  description=task.description,
                                  planet_id=task.planet_id,
                                  employee_answer=employee_task.employee_answer,
                                  curator_answer=employee_task.curator_answer,
                                  task_status=employee_task.task_status,
                                  created_at=employee_task.created_at,
                                  updated_at=employee_task.updated_at,
                                  image=task.image,
                                  pos=task.pos)


class TaskOutForChecking(BaseModel):
    id: int
    name: Optional[str]
    description: Optional[str]
    planet_id: int
    employee_answer: Optional[str]
    curator_answer: Optional[str]
    task_status: TaskStatus
    created_at: datetime.datetime
    updated_at: datetime.datetime
    employee: EmployeeOut
    image: TaskImage
    pos: int

    @staticmethod
    def parse(task: Task, employee: Employee, employee_task: EmployeeTask):
        return TaskOutForChecking(id=task.id,
                                  name=task.name,
                                  description=task.description,
                                  planet_id=task.planet_id,
                                  employee_answer=employee_task.employee_answer,
                                  curator_answer=employee_task.curator_answer,
                                  task_status=employee_task.task_status,
                                  created_at=employee_task.created_at,
                                  updated_at=employee_task.updated_at,
                                  employee=EmployeeOut.parse(employee),
                                  image=task.image,
                                  pos=task.pos)
