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

    response = client.post('/user/register_new_curator',
                           params={
                               'email': 'test2222@ussc.com',
                               'name': 'Anna',
                               'password': 'this_is_password'
                           },
                           cookies=dict(response.cookies))

    assert response.status_code == 200


def send_reset_token_for_curator():
    response = client.post('/auth/forgot-password', json={
        'email': 'test2222@ussc.com',
    })
    assert response.status_code == 202


def test_register_curator_with_wrong_email():
    response = client.post('/auth/jwt/login', data={
        'username': 'admin@admin.ru',
        'password': 'adminadmin'
    })

    response = client.post('/user/register_new_curator',
                           params={
                               'email': 'xd',
                               'name': 'Anna2',
                           },
                           cookies=dict(response.cookies))

    assert response.status_code == 422


def test_login_curator():
    response = client.post('/auth/jwt/login', data={
        'username': 'test2222@ussc.com',
        'password': 'this_is_password'
    })
    assert response.status_code == 204


def test_login_wrong_credentials():
    response = client.post('/auth/jwt/login', data={
        'username': 'there_is_no_such-user@ussc.com',
        'password': 'this_is_password'
    })
    assert response.status_code == 400


def test_register_employee():
    response = client.post('/auth/jwt/login', data={
        'username': 'test2222@ussc.com',
        'password': 'this_is_password'
    })

    response = client.post('/user/register_new_employee',
                           params={
                               'email': 'employee@ussc.ru',
                               'name': 'Employee',
                               'product': 'datapk_industrial_kit',
                               'product_role': 'backend',
                               'password': 'this_is_password'
                           },
                           cookies=dict(response.cookies))

    assert response.status_code == 200


def test_logout():
    response = client.post('/auth/jwt/login', data={
        'username': 'test2222@ussc.com',
        'password': 'this_is_password'
    })

    response = client.post('/auth/jwt/logout', cookies=dict(response.cookies))

    assert response.status_code == 204


def test_unauthorized_logout():
    response = client.post('/auth/jwt/logout')

    assert response.status_code == 401


def test_get_current_user_info():
    response = client.post('/auth/jwt/login', data={
        'username': 'test2222@ussc.com',
        'password': 'this_is_password'
    })

    response = client.get('/user/get_current_user_info',
                          cookies=dict(response.cookies))

    assert response.status_code == 200
