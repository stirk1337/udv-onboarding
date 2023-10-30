import datetime
import enum
from typing import List

from sqlalchemy import ForeignKey, Integer, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base


class Planet(Base):
    __tablename__ = 'planet'

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True
    )
    name: Mapped[str] = mapped_column(
        String(length=100), nullable=False
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now())")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now())")
    )
    employee_planet: Mapped[List['EmployeePlanet']
                            ] = relationship(back_populates='planet')
    task: Mapped[List['Task']] = relationship(back_populates='planet')


class EmployeePlanet(Base):
    __tablename__ = 'employee_planet'

    employee_id: Mapped[int] = mapped_column(
        ForeignKey('employee.id', ondelete='CASCADE'), primary_key=True
    )
    employee: Mapped['Employee'] = relationship(
        back_populates='employee_planet')
    planet_id: Mapped[int] = mapped_column(
        ForeignKey('planet.id', ondelete='CASCADE'), primary_key=True
    )
    planet: Mapped['Planet'] = relationship(back_populates='employee_planet')


class TaskStatus(enum.Enum):
    in_progress = 'in_progress'
    being_checked = 'being_checked'
    completed = 'completed'


class TaskDifficulty(enum.Enum):
    easy = 1
    medium = 2
    hard = 3


class Task(Base):
    __tablename__ = 'task'

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True
    )
    name: Mapped[str] = mapped_column(
        String(length=100), nullable=False
    )
    description: Mapped[str] = mapped_column(
        String(length=1000), nullable=False
    )
    file_link: Mapped[str] = mapped_column(
        String(length=500), nullable=True
    )
    task_status: Mapped[TaskStatus]
    task_difficulty: Mapped['TaskDifficulty']
    planet_id: Mapped[int] = mapped_column(
        ForeignKey('planet.id', ondelete='CASCADE')
    )
    planet: Mapped['Planet'] = relationship(back_populates='task')
    created_at: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now())")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now())")
    )
