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
    notifications = await notification_dal.get_notifications_with_info(user.id)
    sorted_notifications = sorted(notifications, key=lambda x: (
        x.is_read, -x.created_at.timestamp()))
    return [ShowNotification.parse(notification) for notification in sorted_notifications]


@router.patch('/read_notification', status_code=200)
async def read_notification(notification_id: int,
                            user: User = Depends(current_user),
                            session: AsyncSession = Depends(get_async_session)):
    """Read your notification. Rights: you must have this notification"""
    notification_dal = NotificationDAL(session)
    notification = await notification_dal.get_notification(notification_id)
    if notification.user_id == user.id:
        await notification_dal.read_notification(notification)
        return None
    raise HTTPException(status_code=403, detail='Forbidden')


@router.patch('/read_all_notifications')
async def read_all_notifications(user: User = Depends(current_user),
                                 session: AsyncSession = Depends(get_async_session)):
    """Read your notification. Rights: you must have this notification"""
    notification_dal = NotificationDAL(session)
    await notification_dal.read_all_notifications(user.id)
