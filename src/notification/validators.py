from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from src.notification.models import Notification, NotificationType


class ShowNotification(BaseModel):
    id: int
    user_id: int
    task_id: Optional[int]
    planet_id: Optional[int]
    created_at: datetime
    is_read: bool
    notification_type: NotificationType

    @staticmethod
    def parse(notification: Notification):
        return ShowNotification(id=notification.id,
                                user_id=notification.user_id,
                                task_id=notification.task_id,
                                planet_id=notification.planet_id,
                                created_at=notification.created_at,
                                is_read=notification.is_read,
                                notification_type=notification.type)
