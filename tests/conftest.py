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

DATABASE_URL_TEST = str(settings.postgres_test)

engine_test = create_async_engine(DATABASE_URL_TEST, poolclass=NullPool)
async_session_maker = sessionmaker(
    engine_test, class_=AsyncSession, expire_on_commit=False)


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


def login_superuser():
    return client.post('/auth/jwt/login', data={
        'username': 'admin@admin.ru',
        'password': 'adminadmin'
    })


def login_curator1():
    return client.post('/auth/jwt/login', data={
        'username': 'curator1@ussc.com',
        'password': 'password'
    })


def login_curator2():
    return client.post('/auth/jwt/login', data={
        'username': 'curator2@ussc.com',
        'password': 'password'
    })


def login_employee1():
    return client.post('/auth/jwt/login', data={
        'username': 'employee1@ussc.com',
        'password': 'password'
    })


def login_employee2():
    return client.post('/auth/jwt/login', data={
        'username': 'employee2@ussc.com',
        'password': 'password'
    })


def register_employee(email: str,
                      product: str = 'datapk_industrial_kit',
                      product_role: str = 'backend'):
    return client.post('/user/register_new_employee',
                       params={
                           'email': email,
                           'name': 'Employee1',
                           'product': product,
                           'product_role': product_role,
                           'password': 'password'
                       },
                       cookies=dict(login_curator1().cookies))


def create_planet(name: str = 'no name', login=login_curator1):  # delegate
    return client.post('/planet/create_planet', params={
        'name': name,
    }, cookies=dict(login().cookies))


def create_task(planet_id: int,
                name: str = '123',
                description: str = '123',
                file_link: str = 'http://localhost/api/v1/docs#/task/create_new_task_task_create_task_post',
                task_difficulty: str = 'easy',
                login=login_curator1
                ):
    return client.post('/task/create_task',
                       params={
                           'name': name,
                           'description': description,
                           'file_link': file_link,
                           'task_difficulty': task_difficulty,
                           'planet_id': planet_id
                       },
                       cookies=dict(login().cookies))


def patch_task(task_id: int,
               name: str = '123',
               description: str = '123',
               file_link: str = 'http://localhost/api/v1/docs#/task/create_new_task_task_create_task_post',
               task_difficulty: str = 'easy',
               login=login_curator1
               ):
    return client.patch('/task/update_task',
                        params={
                            'task_id': task_id,
                            'name': name,
                            'description': description,
                            'file_link': file_link,
                            'task_difficulty': task_difficulty,
                        },
                        cookies=dict(login().cookies))


def register_curator(email: str):
    return client.post('/user/register_new_curator',
                       params={
                           'email': email,
                           'name': 'Curator',
                           'password': 'password'
                       },
                       cookies=dict(login_superuser().cookies))


@pytest.fixture(scope='session', autouse=True)
def test_register_curator1(email: str = 'curator1@ussc.com'):
    superuser = login_superuser()
    return client.post('/user/register_new_curator',
                       params={
                           'email': email,
                           'name': 'Curator1',
                           'password': 'password'
                       },
                       cookies=dict(superuser.cookies))


@pytest.fixture(scope='session', autouse=True)
def test_register_curator2():
    superuser = login_superuser()
    return client.post('/user/register_new_curator',
                       params={
                           'email': 'curator2@ussc.com',
                           'name': 'Curator2',
                           'password': 'password'
                       },
                       cookies=dict(superuser.cookies))


@pytest.fixture(scope='session', autouse=True)
def test_register_employee1():
    curator1 = login_curator1()
    return client.post('/user/register_new_employee',
                       params={
                           'email': 'employee1@ussc.com',
                           'name': 'Employee1',
                           'product': 'datapk_industrial_kit',
                           'product_role': 'backend',
                           'password': 'password'
                       },
                       cookies=dict(curator1.cookies))


@pytest.fixture(scope='session', autouse=True)
def test_register_employee2():
    curator2 = login_curator2()
    return client.post('/user/register_new_employee',
                       params={
                           'email': 'employee2@ussc.com',
                           'name': 'Employee2',
                           'product': 'eplat4m',
                           'product_role': 'frontend',
                           'password': 'password'
                       },
                       cookies=dict(curator2.cookies))
