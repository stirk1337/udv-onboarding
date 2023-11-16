from fastapi import FastAPI
from sqladmin import Admin, ModelView

from src.auth.models import User
from src.db import engine
from src.planet.models import EmployeePlanet, Planet
from src.task.models import Task
from src.user.models import Curator, Employee


class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.name,
                   User.email, User.role,
                   User.is_active, User.is_superuser,
                   User.is_verified]


class EmployeeAdmin(ModelView, model=Employee):
    column_list = [Employee.id, Employee.user_id,
                   Employee.curator_id, Employee.product,
                   Employee.product_role]


class CuratorAdmin(ModelView, model=Curator):
    column_list = [Curator.id, Curator.user_id]


class PlanetAdmin(ModelView, model=Planet):
    column_list = [Planet.id, Planet.name,
                   Planet.task, Planet.employees,
                   Planet.created_at, Planet.updated_at]


class TaskAdmin(ModelView, model=Task):
    column_list = [Task.id, Task.name,
                   Task.description, Task.task_status,
                   Task.planet_id, Task.planet,
                   Task.updated_at, Task.created_at]


class EmployeePlanetAdmin(ModelView, model=EmployeePlanet):
    column_list = [EmployeePlanet.planet_id,
                   EmployeePlanet.employee_id]


def add_admin_views(app: FastAPI) -> None:
    admin = Admin(app, engine)
    admin.add_view(UserAdmin)
    admin.add_view(EmployeeAdmin)
    admin.add_view(CuratorAdmin)
    admin.add_view(PlanetAdmin)
    admin.add_view(TaskAdmin)
    admin.add_view(EmployeePlanetAdmin)
