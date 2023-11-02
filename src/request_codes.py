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


class PlanetResponse404(BaseModel):
    detail: str = 'Planet with provided id not found'


responses = {
    401: {'model': Response401},
    403: {'model': Response403},
}

planet_responses = {
    401: {'model': Response401},
    403: {'model': Response403},
    404: {'model': PlanetResponse404}
}
