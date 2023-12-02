from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.achievement.validators import ShowAchievement
from src.auth.dependencies import employee_user
from src.auth.models import User
from src.db import get_async_session
from src.request_codes import responses
from src.task.dals import TaskDAL
from src.task.models import TaskStatus
from src.user.dals import EmployeeDAL
from src.user.models import Employee

router = APIRouter(prefix='/achievement', tags=['achievement'])

achievements_data = [
    {
        'name': 'Первый шаг',
        'description': 'Отправить 1 этап на проверку',
        'condition': lambda employee: employee.send_task_count >= 1
    },
    {
        'name': 'Боец',
        'description': 'Отправить на проверку 15 этапов',
        'condition': lambda employee: employee.send_task_count >= 15
    },
    {
        'name': 'Герой',
        'description': 'Отправить на проверку 30 этапов',
        'condition': lambda employee: employee.send_task_count >= 30
    },
    {
        'name': 'Легенда',
        'description': 'Отправить на проверку 50 этапов',
        'condition': lambda employee: employee.send_task_count >= 50
    },
    {
        'name': 'SUCCESS!',
        'description': 'Получить статус «проверено» на любом этапе',
        'condition': lambda employee: employee.complete_task_count >= 1
    },
]


def check_count_achievement_completion(achievement_data: dict, employee: Employee) -> ShowAchievement:
    condition = achievement_data['condition']
    return ShowAchievement.parse(name=achievement_data['name'],
                                 description=achievement_data['description'],
                                 completed=condition(employee))


@router.get('/get_achievements', responses=responses)
async def get_achievements(user: User = Depends(employee_user),
                           session: AsyncSession = Depends(get_async_session)) -> List[ShowAchievement]:
    """Get your achievements status. Rights: employee"""
    employee_dal = EmployeeDAL(session)
    employee = await employee_dal.get_employee_by_user_with_planets(user)
    task_dal = TaskDAL(session)
    planets = employee.planets
    first_day_count = sum(1 for planet in planets if planet.is_first_day)
    user_achievements = []

    for achievement_data in achievements_data:  # count achievements
        achievement = check_count_achievement_completion(
            achievement_data, employee)
        user_achievements.append(achievement)

    for planet in planets:  # automated achievements
        tasks = await task_dal.get_tasks_by_planet(planet)
        employee_tasks = [await task_dal.get_employee_task(task, employee) for task in tasks]
        completed_task_count = len(list(filter(lambda x: x == TaskStatus.completed,
                                               [x.task_status for x in employee_tasks])))
        status = len(employee_tasks) == completed_task_count
        if status and planet.is_first_day:  # count of completed first day planets
            first_day_count -= 1

        user_achievements.append(
            ShowAchievement.parse(
                name=f'Первый день: {planet.name}' if planet.is_first_day else f'Покоритель планеты «{planet.name}»',
                description=f'Получить статус «проверено» на всех этапах планеты «{planet.name}»' if planet.is_first_day else f'Пройти планету «{planet.name}»',
                completed=status
            )
        )

    user_achievements.append(
        ShowAchievement.parse(
            name='Боевое крещение',
            description='Пройти все планеты «Онбординга первого дня»',
            completed=first_day_count == 0
        )
    )

    return user_achievements
