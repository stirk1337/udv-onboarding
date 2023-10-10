from fastapi_users.db import SQLAlchemyBaseUserTable
from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from src.db import Base


class User(SQLAlchemyBaseUserTable[int], Base):
    """
       Represents a user in the database.

       Attributes:
           id (int): The unique identifier for the user.
           email (str): The email address of the user.
           hashed_password (str): The hashed password of the user.
           is_active (bool): Indicates whether the user is active.
           is_superuser (bool): Indicates whether the user has superuser privileges.
           is_verified (bool): Indicates whether the user's email address is verified.

       """
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True
    )
    email: Mapped[str] = mapped_column(
        String(length=320), unique=True, index=True, nullable=False
    )
    hashed_password: Mapped[str] = mapped_column(
        String(length=1024), nullable=False
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    is_verified: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
