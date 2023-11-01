import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from src.admin import add_admin_views
from src.auth.router import include_auth_routers
from src.db import Base, get_async_session  # noqa: F401
from src.startup import start_up
from src.task.router import router as task_router
from src.user.router import router as user_router

tags_metadata = [
    {
        'name': 'auth',
        'description': 'Всё связанное с авторизацией. Важно! '
                       'Если регистрировать Сотрудника (Employee), '
                       'через данные пути у него будет отсуствовать (NULL VALUE) куратор (Curator)! ',
    },
    {
        'name': 'user',
        'description': 'Пути для управления Сотрудниками (Employee) и Кураторами (Curator)',
    },
    {
        'name': 'task',
        'description': 'Пути для управления Планетами (Planet) и Задачами (Task)',
    },
]

app = FastAPI(title='UDV Onboarding API',
              description='Документация API',
              version='0.0.1',
              contact={
                  'name': 'Рамиль Мавлютов',
                  'url': 'https://t.me/stirk1337',
                  'email': 'stirk-delovoy@mail.ru',
              },
              openapi_tags=tags_metadata
              )

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
    await start_up()


log_config = uvicorn.config.LOGGING_CONFIG
log_config['formatters']['access']['fmt'] = \
    '%(asctime)s - %(levelname)s - %(message)s'
log_config['formatters']['default']['fmt'] = \
    '%(asctime)s - %(levelname)s - %(message)s'

add_admin_views(app)

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000,
                log_config=log_config, root_path='/api/v1/')
