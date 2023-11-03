from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import AnyHttpUrl, BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import curator_user, current_user
from src.db import get_async_session
from src.planet.dals import PlanetDAL
from src.request_codes import planet_responses, responses
from src.task.dals import TaskDAL
from src.task.models import TaskDifficulty

router = APIRouter(prefix='/task',
                   tags=['task'])


class TaskOut(BaseModel):
    id: int
    name: str
    description: str
    file_link: AnyHttpUrl
    task_difficulty: TaskDifficulty
    planet_id: int


@router.get('/get_tasks',
            dependencies=[Depends(current_user)],
            responses=planet_responses)
async def get_tasks_by_planet_id(planet_id: int,
                                 session: AsyncSession = Depends(get_async_session)) -> List[TaskOut]:
    planet_dal = PlanetDAL(session)
    planet = await planet_dal.get_planet_by_id(planet_id)

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
                     planet_id=task.planet_id) for task in tasks
             ]
    return tasks


@router.post('/create_task', responses=planet_responses,
             dependencies=[Depends(curator_user)])
async def create_new_task(name: str,
                          description: str,
                          file_link: AnyHttpUrl,
                          task_difficulty: TaskDifficulty,
                          planet_id: int,
                          session: AsyncSession = Depends(get_async_session)) -> TaskOut:
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
                   planet_id=task.planet_id)


@router.delete('/delete_task',
               dependencies=[Depends(curator_user)],
               responses=responses)
async def delete_task_by_id(task_id: int,
                            session: AsyncSession = Depends(get_async_session)):
    task_dal = TaskDAL(session)
    await task_dal.delete_task(task_id)
    return {'detail': 'success'}
