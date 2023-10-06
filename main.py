import uvicorn
from fastapi import FastAPI

from src.auth.router import include_auth_routers

app = FastAPI()

include_auth_routers(app)


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)