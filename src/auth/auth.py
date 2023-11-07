from fastapi_users.authentication import (AuthenticationBackend,
                                          CookieTransport, JWTStrategy)

from config import settings

SECRET = settings.secret

cookie_transport = CookieTransport(
    cookie_max_age=600, cookie_name='udv-onboarding')


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=600)


auth_backend = AuthenticationBackend(
    name='jwt',
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)
