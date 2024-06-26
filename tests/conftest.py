import asyncio
from typing import AsyncGenerator

import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

from config import settings
from main import app
from src.auth.models import Role, User
from src.db import Base, get_async_session
from src.email.email import fm
from src.user.models import Curator

DATABASE_URL_TEST = str(settings.postgres_test)

engine_test = create_async_engine(DATABASE_URL_TEST, poolclass=NullPool)
async_session_maker = sessionmaker(
    engine_test, class_=AsyncSession, expire_on_commit=False)

fm.config.SUPPRESS_SEND = 1


async def override_get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


app.dependency_overrides[get_async_session] = override_get_async_session


@pytest.fixture(autouse=True, scope='session')
async def prepare_database():
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture(scope='session')
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


client = TestClient(app)


@pytest.fixture(scope='session')
async def ac() -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient(app=app, base_url='http://test') as a_client:
        yield a_client


@pytest.fixture(scope='session', autouse=True)
async def test_create_superuser_for_testing():
    async with async_session_maker() as session:
        user = User(name='admin',
                    hashed_password='$2b$12$kux3iBRaygMI7cruS2k/EeRvikcFCgKeVJTdxzWSfu9znH09aHuSC',  # adminadmin
                    email='admin@admin.ru',
                    is_superuser=True,
                    is_verified=True,
                    is_active=True,
                    role=Role.curator)
        session.add(user)
        await session.commit()
        curator = Curator(user_id=user.id)
        session.add(curator)
        await session.commit()


@pytest.fixture(scope='session', autouse=True)
def test_register_curator1(email: str = 'curator1@ussc.com'):
    superuser = login_superuser()
    return client.post('/user/register_new_curator',
                       json={
                           'email': email,
                           'name': 'Curator1',
                           'password': 'password'
                       },
                       headers={
                           'Authorization': f'Bearer {superuser}'
                       })


@pytest.fixture(scope='session', autouse=True)
def test_register_curator2():
    superuser = login_superuser()
    return client.post('/user/register_new_curator',
                       json={
                           'email': 'curator2@ussc.com',
                           'name': 'Curator2',
                           'password': 'password'
                       },
                       headers={
                           'Authorization': f'Bearer {superuser}'
                       })


@pytest.fixture(scope='session', autouse=True)
def test_register_employee1():
    curator1 = login_curator1()
    return client.post('/user/register_new_employee',
                       json={
                           'email': 'employee1@ussc.com',
                           'name': 'Employee1',
                           'product': 'datapk_industrial_kit',
                           'product_role': 'backend',
                           'password': 'password'
                       },
                       headers={
                           'Authorization': f'Bearer {curator1}'
                       })


@pytest.fixture(scope='session', autouse=True)
def test_register_employee2():
    curator2 = login_curator2()
    return client.post('/user/register_new_employee',
                       json={
                           'email': 'employee2@ussc.com',
                           'name': 'Employee2',
                           'product': 'eplat4m',
                           'product_role': 'frontend',
                           'password': 'password'
                       },
                       headers={
                           'Authorization': f'Bearer {curator2}'
                       })


def login_superuser():
    request = client.post('/auth/jwt/login', data={
        'username': 'admin@admin.ru',
        'password': 'adminadmin'
    })
    return request.json()['access_token']


def login_curator1():
    request = client.post('/auth/jwt/login', data={
        'username': 'curator1@ussc.com',
        'password': 'password'
    })
    return request.json()['access_token']


def login_curator2():
    request = client.post('/auth/jwt/login', data={
        'username': 'curator2@ussc.com',
        'password': 'password'
    })
    return request.json()['access_token']


def login_employee1():
    request = client.post('/auth/jwt/login', data={
        'username': 'employee1@ussc.com',
        'password': 'password'
    })
    return request.json()['access_token']


def login_employee2():
    request = client.post('/auth/jwt/login', data={
        'username': 'employee2@ussc.com',
        'password': 'password'
    })
    return request.json()['access_token']


def register_employee(email: str,
                      product: str = 'datapk_industrial_kit',
                      product_role: str = 'backend'):
    return client.post('/user/register_new_employee',
                       json={
                           'email': email,
                           'name': 'Employee1',
                           'product': product,
                           'product_role': product_role,
                           'password': 'password'
                       },
                       headers={
                           'Authorization': f'Bearer {login_curator1()}'
                       })


def create_planet(name: str = 'no name', login=login_curator1):  # delegate
    return client.post('/planet/create_planet',
                       json={
                           'name': name,
                           'image': 'planet1',
                       },
                       headers={
                           'Authorization': f'Bearer {login()}'
                       })


def create_task(planet_id: int,
                name: str = '123',
                description: str = '123',
                login=login_curator1
                ):
    return client.post('/task/create_task',
                       params={
                           'planet_id': planet_id
                       },
                       json={
                           'name': name,
                           'description': description,
                           'image': 'octopus1'
                       },
                       headers={
                           'Authorization': f'Bearer {login()}'
                       })


def patch_task(task_id: int,
               name: str = '123',
               description: str = '123',
               login=login_curator1
               ):
    return client.patch('/task/update_task',
                        json={
                            'name': name,
                            'description': description,
                        },
                        params={
                            'task_id': task_id
                        },
                        headers={
                            'Authorization': f'Bearer {login()}'
                        })


def register_curator(email: str):
    return client.post('/user/register_new_curator',
                       json={
                           'email': email,
                           'name': 'Curator',
                           'password': 'password'
                       },
                       headers={
                           'Authorization': f'Bearer {login_superuser()}'
                       })
