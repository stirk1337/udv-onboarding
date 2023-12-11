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
- React
Язык гипертекстовой разметки HTML
Формальный язык описания внешнего вида CSS
Операционная система Ubuntu Linux
Протокол сеансов HTTPS
Протокол передачи данных RESTful (json)
RabbitMQ - программный брокер сообщений на основе стандарта AMQP

База данных PostgreSQL
Язык программирования SQL
Операционная система Ubuntu Linux		
Язык разработки Python
Python-фреймворк FastAPI
ASGI сервер для запуска асинхронного приложения FastAPI
Python-библиотека для генерации SQL запросов SQLAlchemy
Python-библиотека для контроля версий СУБД Alembic
Операционная система Ubuntu Linux
Протокол сеансов HTTPS
Протокол передачи данных RESTful (json)
Python-библиотеки для тестирования Pytest и Coverage
Система непрерывной интеграции CI/CD Github Actions
ПО для автоматизации развёртывания тестовых стендов Docker
Система контроля версий Git
Хостинг репозитория Git: Github

## Документация

http://localhost/api/v1/docs 

## Админка

http://localhost/api/v1/admin

## Тесты

В корневой директории
```console
root@udv-group:~$ coverage run -m pytest
root@udv-group:~$ coverage report
```
