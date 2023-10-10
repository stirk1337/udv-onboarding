from tests.conftest import client


def test_register():
    response = client.post('/auth/register', json={
        'email': 'test7@example.com',
        'password': 'string',
        'is_active': True,
        'is_superuser': False,
        'is_verified': False,
    })

    assert response.status_code == 201


def test_register_login():
    response = client.post('/auth/register', json={
        'email': 'test10@example.com',
        'password': 'string',
        'is_active': True,
        'is_superuser': False,
        'is_verified': False,
    })

    response = client.post('/auth/jwt/login', data={
        'username': 'test10@example.com',
        'password': 'string'
    })

    assert response.status_code == 204


def test_register_login_logout():
    response = client.post('/auth/jwt/logout')

    assert response.status_code == 401

    response = client.post('/auth/register', json={
        'email': 'test10@example.com',
        'password': 'string',
        'is_active': True,
        'is_superuser': False,
        'is_verified': False,
    })

    response = client.post('/auth/jwt/login', data={
        'username': 'test10@example.com',
        'password': 'string'
    })
    response = client.post('/auth/jwt/logout', cookies=dict(response.cookies))

    assert response.status_code == 204
