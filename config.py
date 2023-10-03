""" File with settings and configs for the project """

from pydantic import PostgresDsn, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env')

    secret: SecretStr
    postgres: PostgresDsn
    postgres_test: PostgresDsn


settings = Settings()
