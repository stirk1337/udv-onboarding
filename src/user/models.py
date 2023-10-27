import enum

from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column

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


class Curator(Base):
    __tablename__ = 'curator'

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey('user.id', ondelete='CASCADE')
    )


class Employee(Base):
    __tablename__ = 'employee'

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey('user.id', ondelete='CASCADE')
    )
    curator_id = mapped_column(
        ForeignKey('curator.id', ondelete='SET NULL')
    )
    product: Mapped[Product]
    product_role_id: Mapped[ProductRole]
    udv_coins: Mapped[int] = mapped_column(
        Integer
    )
