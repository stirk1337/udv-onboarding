from pydantic import BaseModel

details = {
    401: 'Unauthorized',
    403: 'Forbidden',
    400: 'REGISTER_USER_ALREADY_EXISTS',
}


class Response401(BaseModel):
    detail: str = details[401]


class Response403(BaseModel):
    detail: str = details[403]


class Response400(BaseModel):
    detail: str = details[400]


responses = {
    401: {'model': Response401},
    403: {'model': Response403},
}
