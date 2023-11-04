from pydantic import BaseModel

details = {
    200: 'success',
    401: 'Unauthorized',
    403: 'Forbidden',
    400: 'REGISTER_USER_ALREADY_EXISTS',
}


class Response200(BaseModel):
    detail: str = 'success'


class Response401(BaseModel):
    detail: str = details[401]


class Response403(BaseModel):
    detail: str = details[403]


class PlanetResponse404(BaseModel):
    detail: str = 'Planet with provided id not found'


class TaskResponse404(BaseModel):
    detail: str = 'Task with provided id not found'


responses = {
    200: {'model': Response200},
    401: {'model': Response401},
    403: {'model': Response403},
}

planet_responses = {
    401: {'model': Response401},
    403: {'model': Response403},
    404: {'model': PlanetResponse404}
}

task_responses = {
    401: {'model': Response401},
    403: {'model': Response403},
    404: {'model': TaskResponse404}
}
