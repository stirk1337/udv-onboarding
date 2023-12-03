from pydantic import PostgresDsn, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """ Class with settings and configs for the project """
    model_config = SettingsConfigDict(env_file='.env')

    secret: SecretStr
    postgres: PostgresDsn
    postgres_test: PostgresDsn
    smtp_server: str
    smtp_port: int
    mail_username: str
    mail_password: str


settings = Settings()
