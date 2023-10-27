import enum

from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column

from src.db import Base


class Product(enum.Enum):
    DATAPK_INDUSTRIAL_KIT = 'datapk_industrial_kit'
    INDUSTRIAL_FIREWALL = 'industrial_firewall'
    INDUSTRIAL_HONEYPOT = 'industrial_honeypot'
    DATA_DIODE = 'data_diode'
    ITM = 'itm'
    EPLAT4M_PASS = 'eplat4m_pass'
    EPLAT4M_SOAR = 'eplat4m_soar'
    EPLAT4M_SGRC = 'eplat4m_sgrc'
    EPLAT4M_KII = 'eplat4m_kii'
    EPLAT4M = 'eplat4m'
    SIEM = 'siem'


class ProductRole(enum.Enum):
    FRONTEND = 'frontend'
    BACKEND = 'backend'
    ANALYST = 'analyst'
    TEST = 'test'
    DEVOPS = 'devops'


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
