from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import current_user
from src.auth.models import User
from src.db import get_async_session
from src.notification.dals import NotificationDAL
from src.notification.validators import ShowNotification

router = APIRouter(prefix='/notification',
                   tags=['notification'])


@router.get('/get_notifications')
async def get_notifications(user: User = Depends(current_user),
                            session: AsyncSession = Depends(get_async_session)) -> List[ShowNotification]:
    """Get your notifications. Rights: employee or curator"""
    notification_dal = NotificationDAL(session)
    notifications = await notification_dal.get_notifications(user.id)
    return [ShowNotification.parse(notification) for notification in notifications]


@router.patch('/read_notification')
async def read_notification(notification_id: int,
                            user: User = Depends(current_user),
                            session: AsyncSession = Depends(get_async_session)) -> ShowNotification:
    """Read your notification. Rights: you must have this notification"""
    notification_dal = NotificationDAL(session)
    notification = await notification_dal.get_notification(notification_id)
    if notification.user_id == user.id:
        notification = await notification_dal.read_notification(notification)
        return ShowNotification.parse(notification)
    raise HTTPException(status_code=403, detail='Forbidden')