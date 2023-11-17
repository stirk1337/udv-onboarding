# from tests.conftest import (client, login_curator1, register_curator,
#                             register_employee)
#
#
# def test_register_curator():
#     response = register_curator('test@ussc.com')
#     assert response.status_code == 200
#     assert response.json()['email'] == 'test@ussc.com'
#
#
# def test_send_reset_token_for_curator1():
#     response = client.post('/auth/forgot-password', json={
#         'email': 'curator1@ussc.com',
#     })
#     assert response.status_code == 202
#
#
# def test_register_curator_with_wrong_email():
#     response = register_curator('test')
#     assert response.status_code == 422
#
#
# def test_login_curator():
#     response = login_curator1()
#     assert response.status_code == 204
#
#
# def test_login_wrong_credentials():
#     response = client.post('/auth/jwt/login', data={
#         'username': 'there_is_no_such-user@ussc.com',
#         'password': 'this_is_password'
#     })
#     assert response.status_code == 400
#
#
# def test_register_employee():
#     response = register_employee('test2@ussc.com')
#     assert response.status_code == 200
#     assert response.json()['product_role'] == 'backend'
#
#
# def test_register_employee_with_wrong_product():
#     response = register_employee(
#         'test3@ussc.com', product='there_is_no_such_product')
#     assert response.status_code == 422
#
#
# def test_register_employee_with_wrong_product_role():
#     response = register_employee(
#         'test3@ussc.com', product_role='there_is_no_such_product_role')
#     assert response.status_code == 422
#
#
# def test_get_curator_linked_to_employee():
#     response = client.get('/user/get_employees',
#                           cookies=dict(login_curator1().cookies))
#
#     assert response.status_code == 200
#     assert len(response.json()) > 1  # has linked employees
#
#
# def test_disable_employee():
#     create_employee = register_employee('test3@ussc.com')
#     employee_id = create_employee.json()['id']
#     disable = client.patch('/user/disable_employee',
#                            json={
#                                'employee_id': employee_id
#                            },
#                            cookies=dict(login_curator1().cookies))
#     assert disable.status_code == 200
#     assert disable.json()['id'] == employee_id
#
#
# def test_logout():
#     response = client.post(
#         '/auth/jwt/logout', cookies=dict(login_curator1().cookies))
#     assert response.status_code == 204
#
#
# def test_unauthorized_logout():
#     response = client.post('/auth/jwt/logout')
#     assert response.status_code == 401
#
#
# def test_get_current_user_info():
#     response = client.get('/user/get_current_user_info',
#                           cookies=dict(login_curator1().cookies))
#     assert response.status_code == 200
