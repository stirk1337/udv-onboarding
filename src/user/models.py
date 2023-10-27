import enum

from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column

from src.db import Base


class Product(enum.Enum):
    DatapkIndustrialKit = 'datapk_industrial_kit'
    IndustrialFirewall = 'industrial_firewall'
    IndustrialHoneypot = 'industrial_honeypot'
    DataDiode = 'data_diode'
    Itm = 'itm'
    Eplat4mPass = 'eplat4m_pass'
    Eplat4mSoar = 'eplat4m_soar'
    Eplat4mSgrc = 'eplat4m_sgrc'
    Eplat4mKii = 'eplat4m_kii'
    Eplat4m = 'eplat4m'
    Siem = 'siem'


class ProductRole(enum.Enum):
    Frontend = 'frontend'
    Backend = 'backend'
    Analyst = 'analyst'
    Test = 'test'
    Devops = 'devops'


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
