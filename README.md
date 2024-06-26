# Сервис для онбординга новых сотрудников UDV Group
![udv_space_logo](https://github.com/stirk1337/udv-onboarding/assets/63664630/6d67bcf9-b2d2-4bec-aa33-22e20766a4c1)  
https://udv.group/

## Назначение
* Прохождение сотрудником онбординга первого дня и части последующего адаптационного периода 
* Отслеживание куратором выполнения задач по онбордингу
* Отслеживание HR выполнения задач по онбордингу

## Требования
* понятный и удобный интерфейс
* Soft UI (мягкий дизайн)
* брендовый стиль UDV
* интерактивность 
* высокая скорость открытия страницы
* адаптивность
* кроссбраузерность
* кроссплатформенность
* надежность и устойчивость
* поддержка версии для слабовидящих

## Технический стек
* React, Typescript
* HTML, CSS
* Ubuntu Linux
* Restful Json
* PostgreSQL
* Python, FastAPI
* SQLAlchemy, Alembic
* Pytest, Coverage
* CI/CD Github Actions
* Docker

## Настройка и запуск
Вам нужно установить Nginx, Python3, NodeJS, PostgreSQL. 
  
Запустите СУБД PostgreSQL и сконфигурируйте ее.  

Запустите Nginx и сконфируруйте его согласно nginx.conf
  
Для запуска Python сервера сконфигурируйте все настройки в .env (есть пример в .env.example).  
  
В корневой директории
```console
root@udv-group:~$ python3 main.py
```

В директории frontend-server
```console
root@udv-group:~$ npm run dev
```
## Docker-compose
Так же возможен запуск через Docker. Установите его.

В корневой директории
```console
root@udv-group:~$ docker-compose up
```

## Документация http://localhost/api/v1/docs 
![image](https://github.com/stirk1337/udv-onboarding/assets/63664630/638c016f-750f-4224-8c8a-9c093afdc0a8)  


## Админка http://localhost/api/v1/admin
![image](https://github.com/stirk1337/udv-onboarding/assets/63664630/35a0bdb5-2fc4-49ff-bf54-85aac3a5a18c)  

## Тесты

В корневой директории
```console
root@udv-group:~$ coverage run -m pytest
root@udv-group:~$ coverage report
```
