import datetime
from enum import Enum

from sqlalchemy import ForeignKey, Integer, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base


class TaskStatus(Enum):
    in_progress = 'in_progress'
    being_checked = 'being_checked'
    completed = 'completed'


class TaskDifficulty(Enum):
    easy = 'easy'
    medium = 'medium'
    hard = 'hard'


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
    planet: Mapped['Planet'] = relationship(
        back_populates='task')
    created_at: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now())")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now())")
    )
    employee_answer: Mapped[str] = mapped_column(
        String(1000), nullable=True
    )
