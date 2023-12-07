from src.email.email import fm
from tests.conftest import (client, create_planet, create_task, login_curator1,
                            login_employee1)

fm.config.SUPPRESS_SEND = 1


def test_send_register_employee_email():
    with fm.record_messages() as outbox:
        response = client.post('/user/register_new_employee',
                               json={
                                   'email': 'some_email@mail.ru',
                                   'name': 'Employee1',
                                   'product': 'eplat4m',
                                   'product_role': 'backend',
                                   'password': 'passwordpassword'
                               },
                               headers={
                                   'Authorization': f'Bearer {login_curator1()}'
                               })
        assert response.status_code == 200
        assert len(outbox) == 1


# def test_send_register_curator_email():
#     with fm.record_messages() as outbox:
#         response = client.post('/user/register_new_curator',
#                                json={
#                                    'email': 'some_email2@mail.ru',
#                                    'name': 'Employee1',
#                                    'password': 'passwordpassword'
#                                },
#                                headers={
#                                    'Authorization': f'Bearer {login_superuser()}'
#                                })
#         assert response.status_code == 200
#         assert len(outbox) == 1


def test_send_invite_to_planet():
    with fm.record_messages() as outbox:
        create = create_planet('planet', login_curator1)
        response = client.patch('/planet/add_employees_to_planet',
                                json={
                                    'employee_ids': [1]
                                },
                                params={
                                    'planet_id': create.json()['id']
                                },
                                headers={
                                    'Authorization': f'Bearer {login_curator1()}'
                                })
        assert response.json()['id'] == create.json()['id']
        assert len(outbox) == 1


def test_send_create_new_task():
    with fm.record_messages() as outbox:
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
        create_task(planet_id=create.json()['id'], name='5')
        assert len(outbox) >= 2


def test_send_answer_task():
    with fm.record_messages() as outbox:
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
        assert len(outbox) >= 3


def test_send_check_task_accept():
    with fm.record_messages() as outbox:
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
        assert len(outbox) >= 4


def test_send_check_task_decline():
    with fm.record_messages() as outbox:
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
        assert len(outbox) >= 4
