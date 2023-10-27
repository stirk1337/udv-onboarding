import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from src.auth.router import include_auth_routers
from src.db import Base  # noqa: F401
from src.user.router import router as user_router

app = FastAPI(title='UDV onboarding API')

include_auth_routers(app)
app.include_router(user_router)

log_config = uvicorn.config.LOGGING_CONFIG
log_config['formatters']['access']['fmt'] = \
    '%(asctime)s - %(levelname)s - %(message)s'
log_config['formatters']['default']['fmt'] = \
    '%(asctime)s - %(levelname)s - %(message)s'

origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000,
                log_config=log_config, root_path='/api/v1/')
