from tests.conftest import (client, create_planet, create_task, login_curator1,
                            login_curator2, login_employee1, login_employee2,
                            patch_task)


def test_create_task():
    create = create_planet('planet', login_curator1)
    task = create_task(planet_id=create.json()['id'], name='1')
    assert task.json()['name'] == '1'


def test_create_empty_task():
    create = create_planet('planet', login_curator1)
    task = client.post('/task/create_empty_task',
                       params={
                           'planet_id': create.json()['id']
                       },
                       cookies=dict(login_curator1().cookies))
    assert task.json()['planet_id'] == create.json()['id']


def test_get_created_task():
    create = create_planet('planet', login_curator1)
    task = create_task(planet_id=create.json()['id'], name='2')
    get_task = client.get('/task/get_task',
                          params={
                              'task_id': task.json()['id']
                          },
                          cookies=dict(login_curator1().cookies))
    assert get_task.json()['name'] == '2'


def test_get_created_tasks():
    create = create_planet('planet', login_curator1)
    create_task(planet_id=create.json()['id'], name='2')
    get_tasks = client.get('/task/get_tasks',
                           params={
                               'planet_id': create.json()['id']
                           },
                           cookies=dict(login_curator1().cookies))
    assert len(get_tasks.json()) >= 1


def test_get_task_that_doenst_exist():
    get_task = client.get('/task/get_task',
                          params={
                              'task_id': '133333'
                          },
                          cookies=dict(login_curator1().cookies))
    assert get_task.status_code == 404


def test_get_task_with_no_rights_employee():
    create = create_planet('planet', login_curator1)
    task = create_task(planet_id=create.json()['id'], name='3')
    get_task = client.get('/task/get_task',
                          params={
                              'task_id': task.json()['id']
                          },
                          cookies=dict(login_employee2().cookies))
    assert get_task.status_code == 403


def test_get_task_with_no_rights_curator():
    create = create_planet('planet', login_curator1)
    task = create_task(planet_id=create.json()['id'], name='4')
    get_task = client.get('/task/get_task',
                          params={
                              'task_id': task.json()['id']
                          },
                          cookies=dict(login_curator2().cookies))
    assert get_task.status_code == 403


def test_patch_task():
    create = create_planet('planet', login_curator1)
    task = create_task(planet_id=create.json()['id'], name='4')
    patch = patch_task(task_id=task.json()[
        'id'], name='xd1337', login=login_curator1)
    assert patch.json()['name'] == 'xd1337'


def test_patch_task_that_doesnt_exist():
    patch = patch_task(task_id=1338, name='xd1337')
    assert patch.status_code == 404


def test_patch_task_with_no_rights():
    create = create_planet('planet', login_curator1)
    task = create_task(planet_id=create.json()['id'], name='4')
    patch = patch_task(task_id=task.json()[
        'id'], name='xd1337', login=login_curator2)
    assert patch.status_code == 403


def test_delete_task():
    create = create_planet('planet', login_curator1)
    task = create_task(planet_id=create.json()['id'], name='4')
    delete_task = client.delete('/task/delete_task',
                                params={
                                    'task_id': task.json()['id'],
                                },
                                cookies=dict(login_curator1().cookies)
                                )
    assert delete_task.json()['file_link'] == task.json()['file_link']


def test_delete_task_that_doesnt_exist():
    delete_task = client.delete('/task/delete_task',
                                params={
                                    'task_id': '9865',
                                },
                                cookies=dict(login_curator1().cookies)
                                )
    assert delete_task.status_code == 404


def test_delete_task_with_no_rights():
    create = create_planet('planet', login_curator1)
    task = create_task(planet_id=create.json()['id'], name='4')
    delete_task = client.delete('/task/delete_task',
                                params={
                                    'task_id': task.json()['id'],
                                },
                                cookies=dict(login_curator2().cookies)
                                )
    assert delete_task.status_code == 403


def test_answer_task_employee1():
    create = create_planet('planet', login_curator1)
    client.patch('/planet/add_employees_to_planet',
                 json={
                     'employee_ids': [1]
                 },
                 params={
                     'planet_id': create.json()['id']
                 },
                 cookies=dict(login_curator1().cookies))
    task = create_task(planet_id=create.json()['id'], name='5')
    answer_task = client.patch('/task/answer_task',
                               params={
                                   'task_id': task.json()['id'],
                                   'answer': 'this_is_answer',
                               },
                               cookies=dict(login_employee1().cookies))
    assert answer_task.json()['employee_answer'] == 'this_is_answer'


def test_answer_task_employee_with_no_rights():
    create = create_planet('planet', login_curator1)
    task = create_task(planet_id=create.json()['id'], name='5')
    answer_task = client.patch('/task/answer_task',
                               params={
                                   'task_id': task.json()['id'],
                                   'answer': 'this_is_answer',
                               },
                               cookies=dict(login_employee2().cookies))
    assert answer_task.status_code == 403


def test_check_task_accept():
    create = create_planet('planet', login_curator1)
    task = create_task(planet_id=create.json()['id'], name='6')
    check_task = client.patch('/task/check_task',
                              params={
                                  'task_id': task.json()['id'],
                                  'accept': True
                              },
                              cookies=dict(login_curator1().cookies))
    assert check_task.json()['task_status'] == 'completed'


def test_check_task_decline():
    create = create_planet('planet', login_curator1)
    task = create_task(planet_id=create.json()['id'], name='7')
    check_task = client.patch('/task/check_task',
                              params={
                                  'task_id': task.json()['id'],
                                  'accept': False
                              },
                              cookies=dict(login_curator1().cookies))
    assert check_task.json()['task_status'] == 'in_progress'


def test_check_task_with_no_rights():
    create = create_planet('planet', login_curator1)
    task = create_task(planet_id=create.json()['id'], name='8')
    check_task = client.patch('/task/check_task',
                              params={
                                  'task_id': task.json()['id'],
                                  'accept': False
                              },
                              cookies=dict(login_curator2().cookies))
    assert check_task.status_code == 403
