import datetime
import enum
from typing import List

from sqlalchemy import ForeignKey, Integer, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base


class Product(enum.Enum):
    datapk_industrial_kit = 'datapk_industrial_kit'
    industrial_firewall = 'industrial_firewall'
    industrial_honeypot = 'industrial_honeypot'
    data_diode = 'data_diode'
    itm = 'itm'
    eplat4m_pass = 'eplat4m_pass'
    eplat4m_soar = 'eplat4m_soar'
    eplat4m_sgrc = 'eplat4m_sgrc'
    eplat4m_kii = 'eplat4m_kii'
    eplat4m = 'eplat4m'
    siem = 'siem'


class ProductRole(enum.Enum):
    frontend = 'frontend'
    backend = 'backend'
    analyst = 'analyst'
    test = 'test'
    devops = 'devops'


class EmployeeStatus(enum.Enum):
    invited = 'invited'
    active = 'active'
    disabled = 'disabled'


class Curator(Base):
    __tablename__ = 'curator'

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey('user.id', ondelete='CASCADE')
    )
    user: Mapped['User'] = relationship(back_populates='curator')
    employee: Mapped[List['Employee']] = (
        relationship(back_populates='curator'))
    planet: Mapped[List['Planet']] = (
        relationship(back_populates='curator'))


class Employee(Base):
    __tablename__ = 'employee'

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey('user.id', ondelete='CASCADE')
    )
    user: Mapped['User'] = relationship(back_populates='employee')
    curator_id = mapped_column(ForeignKey('curator.id', ondelete='SET NULL'))
    curator: Mapped['Curator'] = relationship(back_populates='employee')
    product: Mapped[Product]
    product_role: Mapped[ProductRole]
    udv_coins: Mapped[int] = mapped_column(
        Integer, default=0
    )
    employee_status: Mapped[EmployeeStatus]
    created_at: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now())")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now())"), onupdate=text("TIMEZONE('utc', now())")
    )
    planets: Mapped[List['Planet']] = (
        relationship(secondary='employee_planet', back_populates='employees'))
    tasks: Mapped[List['Task']] = (
        relationship(secondary='employee_task', back_populates='employees'))
    send_task_count: Mapped[int] = mapped_column(
        Integer, default=0
    )
    complete_task_count: Mapped[int] = mapped_column(
        Integer, default=0
    )
    notifications: Mapped[List['Notification']
                          ] = relationship(back_populates='employee')
