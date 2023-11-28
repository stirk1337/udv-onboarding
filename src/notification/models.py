import datetime
import enum

from sqlalchemy import Boolean, Enum, ForeignKey, Integer, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base


class NotificationType(enum.Enum):
    answer = 'answer'
    accept = 'accept'
    decline = 'decline'
    new = 'new'
    invited = 'invited'


class Notification(Base):
    __tablename__ = 'notification'

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey('user.id', ondelete='CASCADE')
    )
    user: Mapped['User'] = relationship(back_populates='notifications')
    task_id: Mapped[int] = mapped_column(
        ForeignKey('task.id', ondelete='CASCADE'), nullable=True
    )
    task: Mapped['Task'] = relationship(back_populates='notifications')
    planet_id: Mapped[int] = mapped_column(
        ForeignKey('planet.id', ondelete='CASCADE'), nullable=True
    )
    planet: Mapped['Planet'] = relationship(back_populates='notifications')
    created_at: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now())")
    )
    is_read: Mapped[bool] = mapped_column(
        Boolean, default=False
    )
    type: Mapped[NotificationType] = mapped_column(
        Enum(NotificationType), nullable=False
    )
