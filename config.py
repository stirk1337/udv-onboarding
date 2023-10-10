from pydantic import PostgresDsn, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """ Class with settings and configs for the project """
    model_config = SettingsConfigDict(env_file='.env')

    secret: SecretStr
    postgres: PostgresDsn
    postgres_test: PostgresDsn


settings = Settings()
