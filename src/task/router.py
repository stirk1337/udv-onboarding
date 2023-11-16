from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import curator_user, current_user
from src.db import get_async_session
from src.planet.dependencies import have_planet
from src.planet.models import Planet
from src.request_codes import planet_responses, task_responses
from src.task.dals import TaskDAL
from src.task.dependencies import have_task
from src.task.models import Task
from src.task.validators import TaskOut

router = APIRouter(prefix='/task',
                   tags=['task'])


@router.get('/get_task',
            responses=task_responses)
async def get_task_by_id(task: Task = Depends(have_task)) -> TaskOut:
    """Get task by task id. Rights: you must have this task (employee or curator)"""
    return TaskOut.parse(task)


@router.get('/get_tasks',
            responses=planet_responses)
async def get_tasks_by_planet_id(session: AsyncSession = Depends(get_async_session),
                                 planet: Planet = Depends(have_planet)) -> List[TaskOut]:
    """Get tasks by planet id. Rights: you must have this planet (employee or curator)"""
    task_dal = TaskDAL(session)
    tasks = await task_dal.get_tasks_by_planet(planet)
    tasks = [TaskOut.parse(task) for task in tasks]
    tasks = sorted(tasks, key=lambda x: x.id)
    return tasks


@router.post('/create_task',
             responses=planet_responses,
             dependencies=[Depends(curator_user)])
async def create_new_task(name: Optional[str] = None,
                          description: Optional[str] = None,
                          session: AsyncSession = Depends(get_async_session),
                          planet: Planet = Depends(have_planet)) -> TaskOut:
    """Create task linked to planet. Rights: curator, you must have this planet"""
    task_dal = TaskDAL(session)
    task = await task_dal.create_task(name, description, planet)
    return TaskOut.parse(task)


@router.patch('/update_task',
              responses=task_responses,
              dependencies=[Depends(curator_user)])
async def patch_task(name: str,
                     description: str,
                     session: AsyncSession = Depends(get_async_session),
                     task: Task = Depends(have_task)) -> TaskOut:
    """Update task info by its id. Rights: curator, you must have this task"""
    task_dal = TaskDAL(session)
    task = await task_dal.patch_task(task, name, description)
    return TaskOut.parse(task)


@router.delete('/delete_task',
               dependencies=[Depends(curator_user)],
               responses=task_responses)
async def delete_task_by_id(session: AsyncSession = Depends(get_async_session),
                            task: Task = Depends(have_task)) -> TaskOut:
    """Delete task by its id. Rights: curator, you must have this task"""
    task_dal = TaskDAL(session)
    await task_dal.delete_task(task)
    return TaskOut.parse(task)


@router.patch('/answer_task',
              dependencies=[Depends(current_user)],
              responses=task_responses)
async def answer_on_task_by_its_id(answer: str,
                                   session: AsyncSession = Depends(
                                       get_async_session),
                                   task: Task = Depends(have_task)) -> TaskOut:
    """Answer on your task. Rights: employee or curator, you must have this task"""
    task_dal = TaskDAL(session)
    await task_dal.answer_on_task(task, answer)
    return TaskOut.parse(task)


@router.patch('/check_task',
              responses=task_responses,
              dependencies=[Depends(curator_user)])
async def check_task_by_its_id(
        accept: bool,
        session: AsyncSession = Depends(get_async_session),
        task: Task = Depends(have_task)) -> TaskOut:
    """Check competed employee task by its id. Rights: curator, you must have this task"""
    task_dal = TaskDAL(session)
    await task_dal.check_task(task, accept)
    return TaskOut.parse(task)
