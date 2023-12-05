from src.email.email import fm
from tests.conftest import (client, login_curator1, login_employee1,
                            register_curator, register_employee)

fm.config.SUPPRESS_SEND = 1


def test_register_curator():
    response = register_curator('test@ussc.com')
    assert response.status_code == 200
    assert response.json()['email'] == 'test@ussc.com'


def test_send_reset_token_for_curator1():
    response = client.post('/auth/forgot-password', json={
        'email': 'curator1@ussc.com',
    })
    assert response.status_code == 202


def test_register_curator_with_wrong_email():
    response = register_curator('test')
    assert response.status_code == 422


def test_login_curator():
    response = login_curator1()
    assert isinstance(response, str)


def test_login_wrong_credentials():
    response = client.post('/auth/jwt/login', data={
        'username': 'there_is_no_such-user@ussc.com',
        'password': 'this_is_password'
    })
    assert response.status_code == 400


def test_register_employee():
    response = register_employee('test2@ussc.com')
    assert response.status_code == 200
    assert response.json()['product_role'] == 'backend'


def test_register_employee_with_wrong_product():
    response = register_employee(
        'test3@ussc.com', product='there_is_no_such_product')
    assert response.status_code == 422


def test_register_employee_with_wrong_product_role():
    response = register_employee(
        'test3@ussc.com', product_role='there_is_no_such_product_role')
    assert response.status_code == 422


def test_get_curator_linked_to_employee():
    response = client.get('/user/get_employees',
                          headers={
                              'Authorization': f'Bearer {login_curator1()}'
                          })

    assert response.status_code == 200
    assert len(response.json()) >= 1  # has linked employees


def test_disable_employee():
    create_employee = register_employee('test3@ussc.com')
    employee_id = create_employee.json()['id']
    disable = client.patch('/user/disable_employee',
                           json={
                               'employee_id': employee_id
                           },
                           headers={
                               'Authorization': f'Bearer {login_curator1()}'
                           })
    assert disable.status_code == 200
    assert disable.json()['id'] == employee_id


def test_logout():
    response = client.post(
        '/auth/jwt/logout', headers={
            'Authorization': f'Bearer {login_curator1()}'
        })
    assert response.status_code == 204


def test_unauthorized_logout():
    response = client.post('/auth/jwt/logout')
    assert response.status_code == 401


def test_get_current_user_info():
    response = client.get('/user/get_current_user_info',
                          headers={
                              'Authorization': f'Bearer {login_curator1()}'
                          })
    assert response.status_code == 200


def test_get_employee_profile():
    user = client.get('/user/get_current_user_info',
                      headers={
                          'Authorization': f'Bearer {login_employee1()}'
                      })
    response = client.get('/user/get_employee_profile_by_user_id',
                          headers={
                              'Authorization': f'Bearer {login_employee1()}'
                          },
                          params={
                              'user_id': user.json()['id']
                          })
    assert response.status_code == 200


def test_get_curator_profile_by_curator_id():
    user = client.get('/user/get_current_user_info',
                      headers={
                          'Authorization': f'Bearer {login_employee1()}'
                      })
    employee_profile = client.get('/user/get_employee_profile_by_user_id',
                                  headers={
                                      'Authorization': f'Bearer {login_employee1()}'
                                  },
                                  params={
                                      'user_id': user.json()['id']
                                  })
    response = client.get('/user/get_curator_profile_by_curator_id',
                          headers={
                              'Authorization': f'Bearer {login_employee1()}'
                          },
                          params={
                              'curator_id': employee_profile.json()['curator_id']
                          })
    assert response.status_code == 200


def test_edit_profile():
    response = client.patch('/user/edit_user_profile',
                            headers={
                                'Authorization': f'Bearer {login_employee1()}'
                            },
                            params={
                                'contact': '123'
                            })
    assert response.json()['contact'] == '123'
