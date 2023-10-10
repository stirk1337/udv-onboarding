from fastapi_users import schemas


class UserRead(schemas.BaseUser[int]):
    """
    Represents a user for reading purposes.

    Attributes:
        id (int): The unique identifier for the user.
        email (str): The user's email address.
        is_active (bool): Indicates whether the user is active.
        is_superuser (bool): Indicates whether the user has superuser privileges.

    """


class UserCreate(schemas.BaseUserCreate):
    """
    Represents user creation data.

    Attributes:
        email (str): The email address of the user being created.
        password (str): The password for the user.
        is_active (bool, optional): Indicates whether the user is active (optional).
        is_superuser (bool, optional):
            Indicates whether the user has superuser privileges (optional).

    """


class UserUpdate(schemas.BaseUserUpdate):
    """
    Represents user update data.

    Attributes:
        email (str, optional): The updated email address (optional).
        password (str, optional): The updated password (optional).
        is_active (bool, optional): The updated active status (optional).
        is_superuser (bool, optional): The updated superuser status (optional).

    """
