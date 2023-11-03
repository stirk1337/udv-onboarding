from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.planet.models import Planet
from src.task.models import Task, TaskDifficulty, TaskStatus


class TaskDAL:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

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

    async def get_tasks_by_planet(self, planet: Planet) -> List[Task]:
        tasks = await self.db_session.scalars(
            select(Task)
            .where(Task.planet_id == planet.id)
        )
        return list(tasks)

    async def delete_task(self, task_id: int):
        task = await self.db_session.scalar(
            select(Task)
            .where(Task.id == task_id)
        )
        if task:
            await self.db_session.delete(task)
            await self.db_session.commit()
