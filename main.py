import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from src.admin import add_admin_views
from src.auth.router import include_auth_routers
from src.auth.startup import create_user
from src.db import Base, get_async_session  # noqa: F401
from src.task.router import router as task_router
from src.user.router import router as user_router

app = FastAPI(title='UDV onboarding API')

include_auth_routers(app)
app.include_router(user_router)
app.include_router(task_router)

origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.on_event('startup')
async def startup_event():
    await create_user('admin@mail.ru', 'admin', True)


add_admin_views(app)

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000, root_path='/api/v1')
