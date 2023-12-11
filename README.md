# Сервис для онбординга новых сотрудников UDV Group
![udv_space_logo](https://github.com/stirk1337/udv-onboarding/assets/63664630/6d67bcf9-b2d2-4bec-aa33-22e20766a4c1)

## Назначение
* Прохождение сотрудником онбординга первого дня и части последующего адаптационного периода 
* Отслеживание куратором выполнения задач по онбордингу
* Отслеживание HR выполнения задач по онбордингу

## Документация

http://localhost/api/v1/docs 

## Админка

http://localhost/api/v1/admin

## Тесты

coverage run -m pytest  

coverage report


## dont forget  
убрать cors  
убрать 60 sec cookie
admin aut-register in startup.py
make password verify harder in manager.py
