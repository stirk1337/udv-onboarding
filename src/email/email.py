from pathlib import Path
from typing import Any, Dict, List

import aiosmtplib.errors
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr

from config import settings
from src.notification.models import NotificationType


class EmailBody(BaseModel):
    email: EmailStr
    body: Dict[str, Any]


class EmailSchema(BaseModel):
    emails: List[EmailBody]


conf = ConnectionConfig(
    MAIL_USERNAME=settings.mail_username,
    MAIL_PASSWORD=settings.mail_password,
    MAIL_FROM=settings.mail_username,
    MAIL_PORT=settings.smtp_port,
    MAIL_SERVER=settings.smtp_server,
    MAIL_FROM_NAME='UDV Group Onboarding',
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    TEMPLATE_FOLDER=Path(__file__).parent / 'templates'
)

email_templates = {
    NotificationType.answer: 'answer_template.html',
    NotificationType.accept: 'accept_template.html',
    NotificationType.decline: 'decline_template.html',
    NotificationType.new: 'new_template.html',
    NotificationType.invited: 'invited_template.html'
}

email_titles = {
    NotificationType.answer: 'Сотрудник отправил этап на проверку',
    NotificationType.accept: 'Статус вашего этапа изменился',
    NotificationType.decline: 'Статус вашего этапа изменился',
    NotificationType.new: 'Появился новый этап',
    NotificationType.invited: 'Вам назначили новую планету'
}

fm = FastMail(conf)


async def send_register_email(email: EmailSchema) -> None:
    for email_body in email.emails:
        message = MessageSchema(
            subject='Приглашение',
            recipients=[email_body.email],
            template_body=email_body.body,
            subtype=MessageType.html,
        )
        try:
            await fm.send_message(message, template_name='register_template.html')
        except (aiosmtplib.errors.SMTPRecipientsRefused, aiosmtplib.errors.SMTPDataError):
            print(
                f'Email {email_body.email} does not exist. Message will not be sent.')


async def send_notification_email(email: EmailSchema, email_type: NotificationType) -> None:
    for email_body in email.emails:
        message = MessageSchema(
            subject=email_titles[email_type],
            recipients=[email_body.email],
            template_body=email_body.body,
            subtype=MessageType.html,
        )
        try:
            await fm.send_message(message, template_name=email_templates[email_type])
        except (aiosmtplib.errors.SMTPRecipientsRefused, aiosmtplib.errors.SMTPDataError):
            print(
                f'Email {email_body.email} does not exist. Message will not be sent.')
