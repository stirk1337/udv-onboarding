import uuid

import aiofiles
from fastapi import APIRouter, Depends, FastAPI, HTTPException, UploadFile
from fastapi_users import FastAPIUsers
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.auth import auth_backend
from src.auth.dals import UserDAL
from src.auth.manager import get_user_manager
from src.auth.models import User
from src.db import get_async_session
from src.user.validators import UserOut

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

current_superuser = fastapi_users.current_user(active=True, superuser=True)
current_user = fastapi_users.current_user()


def include_auth_routers(app: FastAPI) -> None:
    app.include_router(
        fastapi_users.get_auth_router(auth_backend),
        prefix='/auth/jwt',
        tags=['auth'],
    )

    app.include_router(
        fastapi_users.get_reset_password_router(),
        prefix='/auth',
        tags=['auth'],
    )


router = APIRouter(prefix='/auth',
                   tags=['auth'])


@router.patch('/update_image')
async def update_avatar(file: UploadFile,
                        user: User = Depends(current_user),
                        session: AsyncSession = Depends(get_async_session)) -> UserOut:
    file_path = 'static/avatars/'
    if file.content_type not in ['image/jpeg', 'image/png']:
        raise HTTPException(400, detail='Invalid document type')
    try:
        contents = await file.read()
        file_extension = file.filename.split('.')[-1]
        file.filename = f'{uuid.uuid4()}.{file_extension}'
        async with aiofiles.open(f'{file_path}{file.filename}', 'wb') as f:
            await f.write(contents)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=400, detail='There was an error uploading the file') from e
    finally:
        await file.close()
    user_dal = UserDAL(session)
    user = await user_dal.patch_avatar(user, f'{file_path}{file.filename}')
    return UserOut.parse(user)
