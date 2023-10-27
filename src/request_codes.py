from pydantic import BaseModel


class Response401(BaseModel):
    detail: str = 'Unauthorized'


responses = {
    401: {'model': Response401}
}
