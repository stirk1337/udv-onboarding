from fastapi import APIRouter, FastAPI
from fastapi_users import FastAPIUsers

from src.auth.auth import auth_backend
from src.auth.manager import get_user_manager
from src.auth.models import User
from src.auth.schemas import UserRead, UserCreate

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)
current_user = fastapi_users.current_user()

router = APIRouter(
    prefix='/user',
    tags=['User']
)


def include_auth_routers(app: FastAPI) -> None:
    app.include_router(
        fastapi_users.get_auth_router(auth_backend),
        prefix='/auth/jwt',
        tags=['auth'],
    )

    app.include_router(
        fastapi_users.get_register_router(gUserRead, UserCreate),
        prefix='/auth',
        tags=['auth'],
    )

    app.include_router(
        fastapi_users.get_verify_router(UserRead),
        prefix="/auth",
        tags=["auth"],
    )

    app.include_router(
        fastapi_users.get_reset_password_router(),
        prefix="/auth",
        tags=["auth"],
    )
