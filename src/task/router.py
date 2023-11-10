from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import AnyHttpUrl, BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import curator_user, current_user
from src.auth.models import Role, User
from src.db import get_async_session
from src.planet.dals import PlanetDAL
from src.request_codes import planet_responses, task_responses
from src.task.dals import TaskDAL
from src.task.models import TaskDifficulty, TaskStatus
from src.user.dals import CuratorDAL, EmployeeDAL

router = APIRouter(prefix='/task',
                   tags=['task'])


class TaskOut(BaseModel):
    id: int
    name: str
    description: str
    file_link: AnyHttpUrl
    task_difficulty: TaskDifficulty
    planet_id: int
    employee_answer: Optional[str]
    task_status: TaskStatus


@router.get('/get_task',
            responses=task_responses)
async def get_task_by_id(task_id: int,
                         session: AsyncSession = Depends(get_async_session),
                         user: User = Depends(current_user)) -> TaskOut:
    """Get task by task id. Rights: you must have this task (employee or curator)"""
    task_dal = TaskDAL(session)
    task = await task_dal.get_task_by_id(task_id)

    if task is None:
        raise HTTPException(
            status_code=404, detail=f'Task with id {task_id} not found')

    planet_dal = PlanetDAL(session)
    planet = await planet_dal.get_planet_with_employees(task.planet_id)

    if user.role == Role.curator:  # check if you are curator and you have this task
        curator_dal = CuratorDAL(session)
        curator = await curator_dal.get_curator_by_user(user)
        if planet.curator_id == curator.id:
            return task

    elif user.role == Role.employee:  # check if you are employee and you have this task
        employee_dal = EmployeeDAL(session)
        employee = await employee_dal.get_employee_by_user(user)
        if employee in planet.employees:
            return task

    raise HTTPException(status_code=403, detail='Forbidden')


@router.get('/get_tasks',
            responses=planet_responses)
async def get_tasks_by_planet_id(planet_id: int,
                                 session: AsyncSession = Depends(
                                     get_async_session),
                                 user: User = Depends(current_user)) -> List[TaskOut]:
    """Get tasks by planet id. Rights: you must have this planet (employee or curator)"""
    planet_dal = PlanetDAL(session)
    planet = await planet_dal.get_planet_with_employees(planet_id)

    if planet is None:
        raise HTTPException(
            status_code=404, detail=f'Planet with id {planet_id} not found')

    task_dal = TaskDAL(session)
    tasks = await task_dal.get_tasks_by_planet(planet)
    tasks = [TaskOut(id=task.id,
                     name=task.name,
                     description=task.description,
                     file_link=AnyHttpUrl(task.file_link),
                     task_difficulty=task.task_difficulty,
                     planet_id=task.planet_id,
                     employee_answer=task.employee_answer,
                     task_status=task.task_status) for task in tasks
             ]

    if user.role == Role.curator:  # check if you are curator and you have this planet
        curator_dal = CuratorDAL(session)
        curator = await curator_dal.get_curator_by_user(user)
        if planet.curator_id == curator.id:
            return tasks

    elif user.role == Role.employee:  # check if you are employee and you have this planet
        employee_dal = EmployeeDAL(session)
        employee = await employee_dal.get_employee_by_user(user)
        if employee in planet.employees:
            return tasks

    raise HTTPException(status_code=403, detail='Forbidden')


@router.post('/create_task', responses=planet_responses,
             dependencies=[Depends(curator_user)])
async def create_new_task(name: str,
                          description: str,
                          file_link: AnyHttpUrl,
                          task_difficulty: TaskDifficulty,
                          planet_id: int,
                          session: AsyncSession = Depends(get_async_session)) -> TaskOut:
    """Create task linked to planet. Rights: curator, you must have this planet"""
    planet_dal = PlanetDAL(session)
    planet = await planet_dal.get_planet_by_id(planet_id)
    if planet is None:
        raise HTTPException(
            status_code=404, detail=f'Planet with id {planet_id} not found')
    task_dal = TaskDAL(session)
    task = await task_dal.create_task(name, description, str(file_link), task_difficulty, planet)
    return TaskOut(id=task.id,
                   name=task.name,
                   description=task.description,
                   file_link=task.file_link,
                   task_difficulty=task.task_difficulty,
                   planet_id=task.planet_id,
                   employee_answer=task.employee_answer,
                   task_status=task.task_status)


@router.patch('/update_task',
              responses=task_responses)
async def patch_task(task_id: int,
                     name: str,
                     description: str,
                     file_link: AnyHttpUrl,
                     task_difficulty: TaskDifficulty,
                     session: AsyncSession = Depends(get_async_session),
                     user: User = Depends(curator_user)) -> TaskOut:
    """Update task info by its id. Rights: curator, you must have this task"""
    task_dal = TaskDAL(session)
    task = await task_dal.get_task_with_planet(task_id)

    if task is None:
        raise HTTPException(
            status_code=404, detail=f'Task with {task_id} not found')

    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)
    if curator.id == task.planet.curator_id:
        task = await task_dal.patch_task(task,
                                         name,
                                         description,
                                         str(file_link),
                                         task_difficulty)
        return task
    raise HTTPException(status_code=403, detail='Forbidden')


@router.delete('/delete_task',
               dependencies=[Depends(curator_user)],
               responses=task_responses)
async def delete_task_by_id(task_id: int,
                            session: AsyncSession = Depends(get_async_session),
                            user: User = Depends(curator_user)) -> TaskOut:
    """Delete task by its id. Rights: curator, you must have this task"""
    task_dal = TaskDAL(session)
    task = await task_dal.get_task_with_planet(task_id)

    if task is None:
        raise HTTPException(
            status_code=404, detail=f'Task with {task_id} not found')

    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)
    if curator.id == task.planet.curator_id:
        await task_dal.delete_task(task)
        return TaskOut(id=task.id,
                       name=task.name,
                       description=task.description,
                       file_link=task.file_link,
                       task_difficulty=task.task_difficulty,
                       planet_id=task.planet_id,
                       employee_answer=task.employee_answer,
                       task_status=task.task_status)
    raise HTTPException(status_code=403, detail='Forbidden')


@router.patch('/answer_task',
              dependencies=[Depends(current_user)],
              responses=task_responses)
async def answer_on_task_by_its_id(task_id: int,
                                   answer: str,
                                   session: AsyncSession = Depends(
                                       get_async_session),
                                   user: User = Depends(current_user)) -> TaskOut:
    """Answer on your task. Rights: employee or curator, you must have this task"""
    task_dal = TaskDAL(session)
    task = await task_dal.get_task_by_id(task_id)

    if task is None:
        raise HTTPException(
            status_code=404, detail=f'Task with {task_id} not found')

    planet_dal = PlanetDAL(session)
    planet = await planet_dal.get_planet_with_employees(task.planet_id)

    if user.role == Role.curator:  # check if you are curator and you have this planet
        curator_dal = CuratorDAL(session)
        curator = await curator_dal.get_curator_by_user(user)
        if planet.curator_id == curator.id:
            await task_dal.answer_on_task(task, answer)
            return task

    elif user.role == Role.employee:  # check if you are employee and you have this planet
        employee_dal = EmployeeDAL(session)
        employee = await employee_dal.get_employee_by_user(user)
        if employee in planet.employees:
            await task_dal.answer_on_task(task, answer)
            return task

    raise HTTPException(status_code=403, detail='Forbidden')


@router.patch('/check_task',
              responses=task_responses)
async def check_task_by_its_id(task_id: int,
                               accept: bool,
                               user: User = Depends(curator_user),
                               session: AsyncSession = Depends(get_async_session)) -> TaskOut:
    """Check competed employee task by its id. Rights: curator, you must have this task"""
    task_dal = TaskDAL(session)
    task = await task_dal.get_task_with_planet(task_id)

    if task is None:
        raise HTTPException(
            status_code=404, detail=f'Task with {task_id} not found')

    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)
    if curator.id == task.planet.curator_id:
        await task_dal.check_task(task, accept)
        return TaskOut(id=task.id,
                       name=task.name,
                       description=task.description,
                       file_link=task.file_link,
                       task_difficulty=task.task_difficulty,
                       planet_id=task.planet_id,
                       employee_answer=task.employee_answer,
                       task_status=task.task_status)
    raise HTTPException(status_code=403, detail='Forbidden')