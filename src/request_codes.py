from pydantic import BaseModel


class Response401(BaseModel):
    detail: str = 'Unauthorized'


class Response403(BaseModel):
    detail: str = 'Forbidden'


responses = {
    401: {'model': Response401},
    403: {'model': Response403}
}
