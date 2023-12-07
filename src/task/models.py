import datetime
import enum
from typing import List

from sqlalchemy import Enum, ForeignKey, Integer, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base


class TaskStatus(enum.Enum):
    in_progress = 'in_progress'
    being_checked = 'being_checked'
    completed = 'completed'


class TaskImage(enum.Enum):
    octopus1 = 'octopus1'
    octopus2 = 'octopus2'
    octopus3 = 'octopus3'
    octopus4 = 'octopus4'
    octopus5 = 'octopus5'
    octopus6 = 'octopus6'
    octopus7 = 'octopus7'
    octopus8 = 'octopus8'
    octopus9 = 'octopus9'
    octopus10 = 'octopus10'


class Task(Base):
    __tablename__ = 'task'

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True
    )
    name: Mapped[str] = mapped_column(
        String(length=100), nullable=True
    )
    description: Mapped[str] = mapped_column(
        String(length=1000000), nullable=True
    )
    planet_id: Mapped[int] = mapped_column(
        ForeignKey('planet.id', ondelete='CASCADE')
    )
    planet: Mapped['Planet'] = relationship(
        back_populates='task')
    employees: Mapped[List['Employee']] = (
        relationship(secondary='employee_task', back_populates='tasks'))
    created_at: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now())")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now())"), onupdate=text("TIMEZONE('utc', now())")
    )
    notifications: Mapped[List['Notification']
                          ] = relationship(back_populates='task')
    image: Mapped[TaskImage]


class EmployeeTask(Base):
    __tablename__ = 'employee_task'

    employee_id: Mapped[int] = mapped_column(
        ForeignKey('employee.id', ondelete='CASCADE'), primary_key=True
    )
    task_id: Mapped[int] = mapped_column(
        ForeignKey('task.id', ondelete='CASCADE'), primary_key=True
    )
    employee_answer: Mapped[str] = mapped_column(
        String(1000), nullable=True
    )
    task_status: Mapped[TaskStatus] = mapped_column(
        Enum(TaskStatus), nullable=False, default=TaskStatus.in_progress
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now())")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now())"), onupdate=text("TIMEZONE('utc', now())")
    )
