from typing import List

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import curator_user, employee_user
from src.auth.models import User
from src.db import get_async_session
from src.notification.models import NotificationType
from src.notification.notification import send_notifications_with_emails
from src.planet.dependencies import have_planet
from src.planet.models import Planet
from src.request_codes import planet_responses, responses, task_responses
from src.task.dals import TaskDAL
from src.task.dependencies import have_task
from src.task.models import Task, TaskImage, TaskStatus
from src.task.validators import (EmployeeTaskOut, TaskInAnswer,
                                 TaskInChangePos, TaskInCheck, TaskInCreate,
                                 TaskInUpdate, TaskOut, TaskOutForChecking,
                                 TaskOutForEmployee)
from src.user.dals import CuratorDAL, EmployeeDAL
from src.user.dependencies import have_employee
from src.user.models import Employee

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
    sorted_tasks = sorted(tasks, key=lambda x: x.pos)
    return sorted_tasks


@router.get('/get_tasks_with_status',
            responses=planet_responses)
async def get_tasks_by_planet_id_with_status(session: AsyncSession = Depends(get_async_session),
                                             planet: Planet = Depends(
                                                 have_planet),
                                             user: User = Depends(employee_user)) -> List[TaskOutForEmployee]:
    """Get tasks for employee (with employee information) by planet id.
    Rights: you must have this planet (employee)"""
    task_dal = TaskDAL(session)
    employee_dal = EmployeeDAL(session)
    employee = await employee_dal.get_employee_by_user(user)
    tasks = await task_dal.get_tasks_by_planet(planet)
    employee_tasks = [await task_dal.get_employee_task(task, employee) for task in tasks]
    tasks = [TaskOutForEmployee.parse(task, employee_task)
             for task, employee_task in zip(tasks, employee_tasks)]
    sorted_tasks = sorted(tasks, key=lambda x: x.pos)
    return sorted_tasks


@router.get('/get_tasks_being_checked',
            responses=responses)
async def get_tasks_that_need_check(session: AsyncSession = Depends(get_async_session),
                                    user: User = Depends(curator_user)) -> List[TaskOutForChecking]:
    """Get tasks that need to be checked. Rights: curator"""
    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_with_employees(user)
    task_dal = TaskDAL(session)
    employee_dal = EmployeeDAL(session)
    employees_tasks_for_each_employee = [await task_dal.get_employee_task_for_check(employee)
                                         for employee in curator.employee]
    all_employees_tasks = []
    for employee_task_for_one in employees_tasks_for_each_employee:
        for employee_task in employee_task_for_one:
            all_employees_tasks.append(employee_task)
    seq = [TaskOutForChecking.parse(await task_dal.get_task_by_id(employee_task.task_id),
                                    await employee_dal.get_employee_by_id_with_user(employee_task.employee_id),
                                    employee_task) for employee_task in all_employees_tasks]
    return seq


@router.post('/create_task',
             responses=planet_responses)
async def create_new_task(task_in: TaskInCreate,
                          background_tasks: BackgroundTasks,
                          session: AsyncSession = Depends(get_async_session),
                          planet: Planet = Depends(have_planet),
                          user: User = Depends(curator_user)) -> TaskOut:
    """Create task linked to planet. Rights: curator, you must have this planet"""
    task_dal = TaskDAL(session)
    task = await task_dal.create_task(task_in.name, task_in.description, planet,
                                      task_in.image if task_in.image else TaskImage.octopus1)
    employee_dal = EmployeeDAL(session)
    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)
    employees = await employee_dal.get_employees_by_curator(curator)
    background_tasks.add_task(send_notifications_with_emails,
                              user,
                              [employee.user for employee in employees],
                              planet,
                              NotificationType.new,
                              session,
                              task)
    return TaskOut.parse(task)


@router.patch('/update_task',
              responses=task_responses,
              dependencies=[Depends(curator_user)])
async def patch_task(task_in: TaskInUpdate,
                     session: AsyncSession = Depends(get_async_session),
                     task: Task = Depends(have_task)) -> TaskOut:
    """Update task info by its id. Rights: curator, you must have this task"""
    task_dal = TaskDAL(session)
    task = await task_dal.patch_task(task, task_in.name, task_in.description)
    return TaskOut.parse(task)


@router.patch('/change_task_pos',
              responses=task_responses,
              status_code=200,
              dependencies=[Depends(curator_user)])
async def change_task_position(task_in: TaskInChangePos,
                               session: AsyncSession = Depends(
                                   get_async_session),
                               task: Task = Depends(have_task)):
    """Endpoint for re-pos a task. This high value operation will re-pos all your tasks by one provided task.
    Rights: curator"""
    task_dal = TaskDAL(session)
    tasks = await task_dal.get_tasks_by_planet(task.planet)
    sorted_tasks = sorted(tasks, key=lambda x: x.pos)

    if task_in.new_pos < 0 or task_in.new_pos >= len(sorted_tasks):
        raise HTTPException(status_code=409,
                            detail=f'Wrong position: {task_in.new_pos}. Value must be in range [0, len(tasks))')

    await task_dal.reorder_tasks_by_task(sorted_tasks, task, task_in.new_pos)
    return {'detail': 'success'}


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
              responses=task_responses)
async def answer_on_task_by_its_id(task_in: TaskInAnswer,
                                   background_tasks: BackgroundTasks,
                                   session: AsyncSession = Depends(
                                       get_async_session),
                                   task: Task = Depends(have_task),
                                   user: User = Depends(employee_user)) -> EmployeeTaskOut:
    """Answer on your task. Rights: employee, you must have this task"""
    task_dal = TaskDAL(session)
    employee_dal = EmployeeDAL(session)
    employee = await employee_dal.get_employee_by_user_with_curator(user)
    employee_task = await task_dal.answer_task(task, employee, task_in.answer)
    background_tasks.add_task(send_notifications_with_emails,
                              user,
                              [employee.curator.user],
                              task.planet,
                              NotificationType.answer,
                              session,
                              task,
                              employee)
    return EmployeeTaskOut.parse(employee_task)


@router.patch('/check_task',
              responses=task_responses)
async def check_task_by_its_id(task_in: TaskInCheck,
                               task_id: int,
                               background_tasks: BackgroundTasks,
                               session: AsyncSession = Depends(
                                   get_async_session),
                               employee: Employee = Depends(have_employee),
                               user: User = Depends(curator_user)) -> EmployeeTaskOut:
    """Check competed employee task by its id. Rights: curator, you must have this task"""
    task_dal = TaskDAL(session)
    task = await task_dal.get_task_with_planet_employees(task_id)
    employee_task = await task_dal.check_task(task, employee, task_in.task_status)
    notify_type = NotificationType.accept if task_in.task_status == TaskStatus.completed else NotificationType.decline
    background_tasks.add_task(send_notifications_with_emails,
                              user,
                              [employee.user],
                              task.planet,
                              notify_type,
                              session,
                              task)
    return EmployeeTaskOut.parse(employee_task)
