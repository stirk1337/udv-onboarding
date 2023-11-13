from typing import List

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.planet.models import Planet
from src.task.models import Task, TaskDifficulty, TaskStatus


class TaskDAL:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def get_task_by_id(self, task_id: int) -> Task:
        task = await self.db_session.get(Task, task_id)
        if task is None:
            raise HTTPException(
                status_code=404, detail=f'Task with id {task_id} not found')
        return task

    async def get_task_with_planet(self, task_id: int) -> Task:
        task = await self.db_session.scalar(
            select(Task)
            .where(Task.id == task_id)
            .options(
                selectinload(Task.planet)
                .selectinload(Planet.employees)
            )
        )
        if task is None:
            raise HTTPException(
                status_code=404, detail=f'Task with id {task_id} not found')
        return task

    async def create_task(self, name: str,
                          description: str,
                          file_link: str,
                          task_difficulty: TaskDifficulty,
                          planet: Planet) -> Task:
        new_task = Task(name=name,
                        description=description,
                        file_link=file_link,
                        task_difficulty=task_difficulty,
                        task_status=TaskStatus.in_progress,
                        planet_id=planet.id)
        self.db_session.add(new_task)
        await self.db_session.commit()
        return new_task

    async def create_empty_task(self, planet: Planet):
        new_task = Task(planet_id=planet.id)
        self.db_session.add(new_task)
        await self.db_session.commit()
        return new_task

    async def get_tasks_by_planet(self, planet: Planet) -> List[Task]:
        tasks = await self.db_session.scalars(
            select(Task)
            .where(Task.planet_id == planet.id)
        )
        return list(tasks)

    async def patch_task(self, task: Task,
                         name: str,
                         description: str,
                         file_link: str,
                         task_difficulty: TaskDifficulty) -> Task:
        task.name = name
        task.description = description
        task.file_link = file_link
        task.task_difficulty = task_difficulty
        await self.db_session.commit()
        await self.db_session.refresh(task)
        return task

    async def delete_task(self, task: Task):
        await self.db_session.delete(task)
        await self.db_session.commit()

    async def answer_on_task(self, task: Task,
                             answer: str) -> None:
        task.employee_answer = answer
        task.task_status = TaskStatus.being_checked
        await self.db_session.commit()
        await self.db_session.refresh(task)

    async def check_task(self, task: Task, accept: bool) -> None:
        task.task_status = TaskStatus.completed if accept else TaskStatus.in_progress
        await self.db_session.commit()
        await self.db_session.refresh(task)
