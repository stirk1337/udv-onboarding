from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import current_user
from src.auth.models import Role, User
from src.db import get_async_session
from src.planet.models import Planet
from src.task.dals import TaskDAL
from src.user.dals import CuratorDAL, EmployeeDAL


async def have_task(task_id: int,
                    user: User = Depends(current_user),
                    session: AsyncSession = Depends(get_async_session)) -> Planet:
    task_dal = TaskDAL(session)
    task = await task_dal.get_task_with_planet(task_id)
    if user.role == Role.curator:
        curator_dal = CuratorDAL(session)
        curator = await curator_dal.get_curator_by_user(user)
        if task.planet.curator_id == curator.id:
            return task
    elif user.role == Role.employee:
        employee_dal = EmployeeDAL(session)
        employee = await employee_dal.get_employee_by_user(user)
        if employee in task.planet.employees:
            return task
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
