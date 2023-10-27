from tests.conftest import client


def test_register_employee():
    response = client.post('/auth/register', json={
        'email': 'test7@example.com',
        'password': 'string',
        'name': 'VovaG',
        'role': 'employee'
    })

    assert response.status_code == 201


def test_register_curator():
    response = client.post('/auth/register', json={
        'email': 'test2222@ussc.com',
        'password': '123',
        'name': 'Anna',
        'role': 'curator'
    })

    assert response.status_code == 201


def test_register_with_wrong_role():
    response = client.post('/auth/register', json={
        'email': 'artem-yakunin@mail.ru',
        'password': '12345',
        'name': 'Artem Yakunin',
        'role': 'administrator'
    })

    assert response.status_code == 422


def test_register_with_wrong_email():
    response = client.post('/auth/register', json={
        'email': 'xd',
        'password': '12345',
        'name': 'Artem Yakunin',
        'role': 'administrator'
    })

    assert response.status_code == 422


def test_login():
    response = client.post('/auth/jwt/login', data={
        'username': 'test7@example.com',
        'password': 'string'
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
        'username': 'test7@example.com',
        'password': 'string'
    })
    response = client.post('/auth/jwt/logout', cookies=dict(response.cookies))

    assert response.status_code == 204


def test_unauthorized_logout():
    response = client.post('/auth/jwt/logout')

    assert response.status_code == 401
