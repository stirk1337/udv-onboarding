import enum
from typing import List

from fastapi_users.db import SQLAlchemyBaseUserTable
from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base


class Role(enum.Enum):
    employee = 'employee'
    curator = 'curator'


class User(SQLAlchemyBaseUserTable[int], Base):
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True
    )
    name: Mapped[str] = mapped_column(
        String(length=100), nullable=False
    )
    email: Mapped[str] = mapped_column(
        String(length=320), unique=True, index=True, nullable=False
    )
    hashed_password: Mapped[str] = mapped_column(
        String(length=1024), nullable=False
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False)
    role: Mapped[Role]
    is_superuser: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    image_url: Mapped[str] = mapped_column(
        String(200), nullable=True
    )
    employee: Mapped[List['Employee']] = relationship(back_populates='user')
    curator: Mapped[List['Curator']] = relationship(back_populates='user')
    notifications: Mapped[List['Notification']
                          ] = relationship(back_populates='user')
