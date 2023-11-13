import datetime
from typing import Optional

from pydantic import AnyHttpUrl, BaseModel

from src.task.models import Task, TaskStatus


class TaskOut(BaseModel):
    id: int
    name: str
    description: str
    file_link: AnyHttpUrl
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
                       file_link=AnyHttpUrl(task.file_link),
                       task_difficulty=task.task_difficulty,
                       planet_id=task.planet_id,
                       employee_answer=task.employee_answer,
                       task_status=task.task_status,
                       created_at=task.created_at,
                       updated_at=task.updated_at)
