from src.auth.models import Role, User
from tests.conftest import async_session_maker, client


async def test_create_superuser_for_testing():  # it isn't test! refactor need
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


def test_register_curator():
    response = client.post('/auth/jwt/login', data={
        'username': 'admin@admin.ru',
        'password': 'adminadmin'
    })
    response = client.post('/auth/register',
                           json={
                               'email': 'test2222@ussc.com',
                               'password': 'adminka1337',
                               'name': 'Anna',
                               'role': 'curator'
                           },
                           cookies=dict(response.cookies))

    assert response.status_code == 201


def test_register_with_wrong_role():
    response = client.post('/auth/jwt/login', data={
        'username': 'admin@admin.ru',
        'password': 'adminadmin'
    })
    response = client.post('/auth/register',
                           json={
                               'email': 'artem-yakunin@mail.ru',
                               'password': 'this_is_a_good_password',
                               'name': 'Artem Yakunin',
                               'role': 'adminka'
                           },
                           cookies=dict(response.cookies))

    assert response.status_code == 422


def test_register_with_wrong_email():
    response = client.post('/auth/jwt/login', data={
        'username': 'admin@admin.ru',
        'password': 'adminadmin'
    })
    response = client.post('/auth/register',
                           json={
                               'email': 'xd',
                               'password': 'this_is_a_good_password',
                               'name': 'Artem Yakunin',
                               'role': 'administrator'
                           },
                           cookies=dict(response.cookies))

    assert response.status_code == 422


def test_login_as_curator():
    response = client.post('/auth/jwt/login', data={
        'username': 'admin@admin.ru',
        'password': 'adminadmin'
    })

    response = client.post('/auth/register',
                           json={
                               'email': 'xd@mail.ru',
                               'password': 'curator_password',
                               'name': 'Artem Yakunin',
                               'role': 'curator'
                           },
                           cookies=dict(response.cookies))

    response = client.post('/auth/jwt/login', data={
        'username': 'xd@mail.ru',
        'password': 'curator_password'
    })

    assert response.status_code == 204


def test_login_wrong_credentials():
    response = client.post('/auth/jwt/login', data={
        'username': 'there_is_no_such_user@example.com',
        'password': 'some_password'
    })

    assert response.status_code == 400


def test_logout():
    response = client.post('/auth/jwt/login', data={
        'username': 'xd@mail.ru',
        'password': 'curator_password'
    })

    response = client.post('/auth/jwt/logout', cookies=dict(response.cookies))

    assert response.status_code == 204


def test_unauthorized_logout():
    response = client.post('/auth/jwt/logout')

    assert response.status_code == 401
