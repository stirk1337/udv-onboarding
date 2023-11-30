from tests.conftest import (client, create_planet, create_task, login_curator1,
                            login_employee1)


def test_invite_to_planet():
    create = create_planet('xd', login_curator1)
    client.patch('/planet/add_employees_to_planet',
                 json={
                     'employee_ids': [1]
                 },
                 params={
                     'planet_id': create.json()['id']
                 },
                 headers={
                     'Authorization': f'Bearer {login_curator1()}'
                 })
    response = client.get('/notification/get_notifications',
                          headers={
                              'Authorization': f'Bearer {login_employee1()}'
                          })
    assert response.json()[-1]['planet_id'] == create.json()['id']


def test_create_new_task():
    create = create_planet('xd', login_curator1)
    client.patch('/planet/add_employees_to_planet',
                 json={
                     'employee_ids': [1]
                 },
                 params={
                     'planet_id': create.json()['id']
                 },
                 headers={
                     'Authorization': f'Bearer {login_curator1()}'
                 })
    task = create_task(planet_id=create.json()['id'], name='1337')
    response = client.get('/notification/get_notifications',
                          headers={
                              'Authorization': f'Bearer {login_employee1()}'
                          })
    assert response.json()[-1]['task_id'] == task.json()['id']


def test_answer_task():
    create = create_planet('planet', login_curator1)
    client.patch('/planet/add_employees_to_planet',
                 json={
                     'employee_ids': [1]
                 },
                 params={
                     'planet_id': create.json()['id']
                 },
                 headers={
                     'Authorization': f'Bearer {login_curator1()}'
                 })
    task = create_task(planet_id=create.json()['id'], name='5')
    client.patch('/task/answer_task',
                 params={
                     'task_id': task.json()['id'],
                 },
                 json={
                     'answer': 'this_is_answer',
                 },
                 headers={
                     'Authorization': f'Bearer {login_employee1()}'
                 })
    response = client.get('/notification/get_notifications',
                          headers={
                              'Authorization': f'Bearer {login_employee1()}'
                          })
    assert response.json()[-1]['task_id'] == task.json()['id']


def test_check_task_accept():
    create = create_planet('planet', login_curator1)
    client.patch('/planet/add_employees_to_planet',
                 json={
                     'employee_ids': [1]
                 },
                 params={
                     'planet_id': create.json()['id']
                 },
                 headers={
                     'Authorization': f'Bearer {login_curator1()}'
                 })
    task = create_task(planet_id=create.json()['id'], name='1337')
    client.patch('/task/answer_task',
                 params={
                     'task_id': task.json()['id'],
                 },
                 json={
                     'answer': 'this_is_answer',
                 },
                 headers={
                     'Authorization': f'Bearer {login_employee1()}'
                 })
    client.patch('/task/check_task',
                 params={
                     'task_id': task.json()['id'],
                     'employee_id': 1,
                 },
                 json={
                     'task_status': 'completed'
                 },
                 headers={
                     'Authorization': f'Bearer {login_curator1()}'
                 })
    response = client.get('/notification/get_notifications',
                          headers={
                              'Authorization': f'Bearer {login_employee1()}'
                          })
    assert response.json()[-1]['task_id'] == task.json()['id']


def test_check_task_decline():
    create = create_planet('planet', login_curator1)
    client.patch('/planet/add_employees_to_planet',
                 json={
                     'employee_ids': [1]
                 },
                 params={
                     'planet_id': create.json()['id']
                 },
                 headers={
                     'Authorization': f'Bearer {login_curator1()}'
                 })
    task = create_task(planet_id=create.json()['id'], name='1337')
    client.patch('/task/answer_task',
                 params={
                     'task_id': task.json()['id'],
                 },
                 json={
                     'answer': 'this_is_answer',
                 },
                 headers={
                     'Authorization': f'Bearer {login_employee1()}'
                 })
    client.patch('/task/check_task',
                 params={
                     'task_id': task.json()['id'],
                     'employee_id': 1,
                 },
                 json={
                     'task_status': 'in_progress'
                 },
                 headers={
                     'Authorization': f'Bearer {login_curator1()}'
                 })
    response = client.get('/notification/get_notifications',
                          headers={
                              'Authorization': f'Bearer {login_employee1()}'
                          })
    assert response.json()[-1]['task_id'] == task.json()['id']
