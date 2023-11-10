from tests.conftest import (client, create_planet, login_curator1,
                            login_curator2, login_employee1, login_employee2)


def test_create_planet():
    response = create_planet(name='planet')
    assert response.json()['name'] == 'planet'


def test_create_planet_with_no_rights():
    response = create_planet(name='planet2', login=login_employee1)
    assert response.status_code == 403


def test_get_planets():
    create_planet('test_get_planets', login_curator1)
    response = client.get('/planet/get_planets',
                          cookies=dict(login_curator1().cookies))
    assert response.json()[-1]['name'] == 'test_get_planets'


def test_create_and_get_planet_by_id():
    create = create_planet('planet', login_curator1)
    get_planet = client.get('/planet/get_planet',
                            params={
                                'planet_id': create.json()['id']
                            },
                            cookies=dict(login_curator1().cookies))
    assert get_planet.json()['name'] == 'planet'


def test_create_and_update_planet_by_id():
    create = create_planet('planet', login_curator1)
    update_planet = client.patch('/planet/update_planet', params={
        'planet_id': create.json()['id'],
        'name': '1337'
    }, cookies=dict(login_curator1().cookies))

    assert update_planet.json()['name'] == '1337'


def test_create_and_delete_planet():
    create = create_planet('planet', login_curator1)
    response = client.delete('planet/delete_planet', params={
        'planet_id': create.json()['id']
    }, cookies=dict(login_curator1().cookies))
    assert response.status_code == 200


def test_add_employee1_to_created_planet():
    create = create_planet('planet', login_curator1)
    response = client.post('/planet/add_employees_to_planet',
                           json={
                               'employee_ids': [1]
                           },
                           params={
                               'planet_id': create.json()['id']
                           },
                           cookies=dict(login_curator1().cookies))
    assert response.json()['id'] == create.json()['id']


def test_get_planets_by_employee1():
    response = client.get('/planet/get_planets',
                          cookies=dict(login_employee1().cookies))
    assert response.status_code == 200
    assert len(response.json()) >= 1


def test_get_planet_that_doesnt_exists():
    response = client.get('/planet/get_planet',
                          params={
                              'planet_id': 123123
                          },
                          cookies=dict(login_employee1().cookies))
    assert response.status_code == 404


def test_patch_planet_that_doesnt_exists():
    response = client.patch('/planet/update_planet',
                            params={
                                'planet_id': 123123,
                                'name': '123'
                            },
                            cookies=dict(login_curator1().cookies))
    assert response.status_code == 404


def test_delete_planet_that_doesnt_exists():
    response = client.delete('/planet/delete_planet',
                             params={
                                 'planet_id': 123123,
                                 'name': '123'
                             },
                             cookies=dict(login_curator1().cookies))
    assert response.status_code == 404


def test_patch_planet_with_no_rights():
    create = create_planet('planet', login_curator1)
    response = client.patch('/planet/update_planet',
                            params={
                                'planet_id': create.json()['id'],
                                'name': '123'
                            },
                            cookies=dict(login_curator2().cookies))
    assert response.status_code == 403


def test_delete_planet_with_no_rights():
    create = create_planet('planet', login_curator1)
    response = client.delete('/planet/delete_planet',
                             params={
                                 'planet_id': create.json()['id']
                             },
                             cookies=dict(login_curator2().cookies))
    assert response.status_code == 403


def test_get_planet_with_no_rights():
    create = create_planet('planet', login_curator1)
    client.post('/planet/add_employees_to_planet',
                json={
                    'employee_ids': [1]
                },
                params={
                    'planet_id': create.json()['id']
                },
                cookies=dict(login_curator1().cookies))
    response = client.get('/planet/get_planet',
                          params={
                              'planet_id': create.json()['id']
                          },
                          cookies=dict(login_employee2().cookies))
    assert response.status_code == 403
