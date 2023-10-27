from fastapi import FastAPI
from sqladmin import Admin, ModelView

from src.auth.models import User
from src.db import engine
from src.user.models import Curator, Employee


class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.name,
                   User.email, User.role,
                   User.is_active, User.is_superuser,
                   User.is_verified]


class EmployeeAdmin(ModelView, model=Employee):
    column_list = [Employee.id, Employee.user_id,
                   Employee.curator_id, Employee.product,
                   Employee.product_role_id]


class CuratorAdmin(ModelView, model=Curator):
    column_list = [Curator.id, Curator.user_id]


def add_admin_views(app: FastAPI) -> None:
    admin = Admin(app, engine)
    admin.add_view(UserAdmin)
    admin.add_view(EmployeeAdmin)
    admin.add_view(CuratorAdmin)
