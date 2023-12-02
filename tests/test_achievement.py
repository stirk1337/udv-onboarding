from tests.conftest import client, login_employee1


def test_get_achievement():
    response = client.get('/achievement/get_achievements',
                          headers={
                              'Authorization': f'Bearer {login_employee1()}'
                          })
    assert len(response.json()) >= 1
