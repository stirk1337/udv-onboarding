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


class TaskResponse400(BaseModel):
    detail: str = 'Task is not in progress, cannot answer'


class EmployeeResponse404(BaseModel):
    detail: str = 'Employee with provided id not found'


class NotificationResponse404(BaseModel):
    detail: str = 'Notification with provided id not found'


class UserResponse404(BaseModel):
    detail: str = 'User with provided id not found'


class CuratorResponse404(BaseModel):
    detail: str = 'Curator with provided id not found'


class AvatarResponse400(BaseModel):
    detail: str = 'There was an error uploading the file. Did you upload png/jpg?'


responses = {
    401: {'model': Response401},
    403: {'model': Response403},
}

user_responses = {
    401: {'model': Response401},
    403: {'model': Response403},
    404: {'model': UserResponse404}
}

curator_responses = {
    401: {'model': Response401},
    403: {'model': Response403},
    404: {'model': CuratorResponse404}
}

avatar_responses = {
    401: {'model': Response401},
    403: {'model': Response403},
    400: {'model': AvatarResponse400}
}

planet_responses = {
    401: {'model': Response401},
    403: {'model': Response403},
    404: {'model': PlanetResponse404}
}

task_responses = {
    401: {'model': Response401},
    403: {'model': Response403},
    404: {'model': TaskResponse404},
    400: {'model': TaskResponse400}
}

employee_responses = {
    401: {'model': Response401},
    403: {'model': Response403},
    404: {'model': EmployeeResponse404}
}

notification_responses = {
    401: {'model': Response401},
    403: {'model': Response403},
    404: {'model': NotificationResponse404}
}
