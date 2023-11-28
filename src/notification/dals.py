from typing import List

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.notification.models import Notification, NotificationType
from src.planet.models import Planet
from src.task.models import Task


class NotificationDAL:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create(self, user_id: int,
                     notification_type: NotificationType,
                     task: Task = None,
                     planet: Planet = None) -> Notification:
        notify = Notification(user_id=user_id,
                              task_id=task.id if task else None,
                              planet_id=planet.id if planet else None,
                              is_read=False,
                              type=notification_type)
        self.db_session.add(notify)
        await self.db_session.commit()
        return notify

    async def get_notifications(self, user_id: int) -> List[Notification]:
        notifications = await self.db_session.scalars(
            select(Notification)
            .where(
                Notification.user_id == user_id
            )
        )
        return list(notifications)

    async def get_notification(self, notification_id: int) -> Notification:
        notification = await self.db_session.scalar(
            select(Notification)
            .where(
                Notification.id == notification_id
            )
        )
        if notification:
            return notification
        raise HTTPException(
            status_code=404, detail=f'Notification with id {notification_id} not found')

    async def read_notification(self, notification: Notification) -> Notification:
        notification.is_read = True
        await self.db_session.commit()
        await self.db_session.refresh(notification)
        return notification
