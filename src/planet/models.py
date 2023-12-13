import datetime
import enum
from typing import List

from sqlalchemy import Boolean, ForeignKey, Integer, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base


class PlanetImage(enum.Enum):
    planet1 = 'planet1'
    planet2 = 'planet2'
    planet3 = 'planet3'
    planet4 = 'planet4'
    planet5 = 'planet5'
    planet6 = 'planet6'
    planet7 = 'planet7'
    planet8 = 'planet8'
    planet9 = 'planet9'
    planet10 = 'planet10'
    planet11 = 'planet11'
    planet12 = 'planet12'
    planet13 = 'planet13'
    planet14 = 'planet14'
    planet15 = 'planet15'
    planet16 = 'planet16'
    planet17 = 'planet17'
    planet18 = 'planet18'
    planet19 = 'planet19'


class Planet(Base):
    __tablename__ = 'planet'

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True
    )
    name: Mapped[str] = mapped_column(
        String(length=100), nullable=False
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
    created_at: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now())")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now())"), onupdate=text("TIMEZONE('utc', now())")
    )
    notifications: Mapped[List['Notification']
                          ] = relationship(back_populates='planet', cascade='all, delete')
    is_first_day: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    image: Mapped[PlanetImage]
    pos: Mapped[int] = mapped_column(
        Integer, default=1000000, nullable=False
    )


class EmployeePlanet(Base):
    __tablename__ = 'employee_planet'

    employee_id: Mapped[int] = mapped_column(
        ForeignKey('employee.id', ondelete='CASCADE'), primary_key=True
    )
    planet_id: Mapped[int] = mapped_column(
        ForeignKey('planet.id', ondelete='CASCADE'), primary_key=True
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now())")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now())"), onupdate=text("TIMEZONE('utc', now())")
    )
