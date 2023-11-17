import datetime
from typing import Optional

from pydantic import BaseModel

from src.task.models import Task, TaskStatus


class TaskInCreate(BaseModel):
    name: Optional[str]
    description: Optional[str]


class TaskInUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]


class TaskInAnswer(BaseModel):
    answer: str


class TaskInCheck(BaseModel):
    accept: bool


class TaskOut(BaseModel):
    id: int
    name: Optional[str]
    description: Optional[str]
    planet_id: int
    employee_answer: Optional[str]
    task_status: TaskStatus
    created_at: datetime.datetime
    updated_at: datetime.datetime

    @staticmethod
    def parse(task: Task):
        return TaskOut(id=task.id,
                       name=task.name,
                       description=task.description,
                       planet_id=task.planet_id,
                       employee_answer=task.employee_answer,
                       task_status=task.task_status,
                       created_at=task.created_at,
                       updated_at=task.updated_at)
