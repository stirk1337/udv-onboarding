import datetime
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
    employees: Mapped[List['Employee']] = (
        relationship(secondary='employee_planet', back_populates='planets'))
    task: Mapped[List['Task']] = relationship(
        back_populates='planet', cascade='all, delete')
    curator_id: Mapped[int] = mapped_column(
        ForeignKey('curator.id', ondelete='CASCADE')
    )
    curator: Mapped['Curator'] = relationship(
        back_populates='planet')


class EmployeePlanet(Base):
    __tablename__ = 'employee_planet'

    employee_id: Mapped[int] = mapped_column(
        ForeignKey('employee.id', ondelete='CASCADE'), primary_key=True
    )
    planet_id: Mapped[int] = mapped_column(
        ForeignKey('planet.id', ondelete='CASCADE'), primary_key=True
    )
