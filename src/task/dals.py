from typing import List

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.planet.models import Planet
from src.task.models import EmployeeTask, Task, TaskStatus
from src.user.models import Employee


class TaskDAL:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def get_task_by_id(self, task_id: int) -> Task:
        task = await self.db_session.get(Task, task_id)
        if task is None:
            raise HTTPException(
                status_code=404, detail=f'Task with id {task_id} not found')
        return task

    async def count_task_of_planet(self, planet_id: int) -> int:
        return await self.db_session.scalar(
            select(func.count())
            .where(Task.planet_id == planet_id)
            .select_from(Task)
        )

    async def get_task_with_planet_employees(self, task_id: int) -> Task:
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

    async def get_employee_task(self, task: Task,
                                employee: Employee) -> EmployeeTask:
        return await self.db_session.scalar(
            select(EmployeeTask)
            .where(EmployeeTask.task_id == task.id and EmployeeTask.employee_id == employee.id)
        )

    async def get_employee_task_for_check(self, employee: Employee) -> List[EmployeeTask]:
        employee_tasks = await self.db_session.scalars(
            select(EmployeeTask)
            .where(EmployeeTask.employee_id == employee.id and EmployeeTask.task_status == TaskStatus.being_checked)
        )
        return list(employee_tasks)

    async def create_task(self, name: str,
                          description: str,
                          planet: Planet) -> Task:
        new_task = Task(name=name,
                        description=description,
                        planet_id=planet.id,
                        employees=planet.employees)
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
                         description: str) -> Task:
        task.name = name
        task.description = description
        await self.db_session.commit()
        await self.db_session.refresh(task)
        return task

    async def delete_task(self, task: Task):
        await self.db_session.delete(task)
        await self.db_session.commit()

    async def answer_task(self, task: Task,
                          employee: Employee,
                          answer: str) -> EmployeeTask:
        employee_task = await self.get_employee_task(task, employee)
        employee_task.employee_answer = answer
        employee_task.task_status = TaskStatus.being_checked
        await self.db_session.commit()
        await self.db_session.refresh(employee_task)
        return employee_task

    async def check_task(self, task: Task,
                         employee: Employee,
                         task_status: TaskStatus) -> EmployeeTask:
        employee_task = await self.get_employee_task(task, employee)
        employee_task.task_status = task_status
        await self.db_session.commit()
        await self.db_session.refresh(employee_task)
        return employee_task
