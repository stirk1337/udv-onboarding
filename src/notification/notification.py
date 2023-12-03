from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.models import User
from src.email.email import EmailBody, EmailSchema, send_notification_email
from src.notification.dals import NotificationDAL
from src.notification.models import NotificationType
from src.planet.models import Planet
from src.task.models import Task


async def send_notifications_with_emails(users: List[User],
                                         planet: Planet,
                                         notify_type: NotificationType,
                                         session: AsyncSession,
                                         task: Optional[Task] = None):
    emails = []
    notification_dal = NotificationDAL(session)
    for user in users:
        await notification_dal.create(user_id=user.id,
                                      planet=planet,
                                      task=task,
                                      notification_type=notify_type)
        emails.append(EmailBody(email=user.email, body={'email': user.email}))
    await send_notification_email(EmailSchema(emails=emails), notify_type)
