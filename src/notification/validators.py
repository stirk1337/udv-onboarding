from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from src.notification.models import Notification, NotificationType
from src.planet.validators import ShowPlanetWithCurator
from src.task.validators import TaskOut
from src.user.validators import EmployeeOut


class ShowNotification(BaseModel):
    id: int
    task: Optional[TaskOut]
    planet: Optional[ShowPlanetWithCurator]
    created_at: datetime
    is_read: bool
    notification_type: NotificationType
    employee: Optional[EmployeeOut]

    @staticmethod
    def parse(notification: Notification):
        return ShowNotification(id=notification.id,
                                task=TaskOut.parse(
                                    notification.task) if notification.task else None,
                                planet=ShowPlanetWithCurator.parse(
                                    notification.planet) if notification.planet else None,
                                created_at=notification.created_at,
                                is_read=notification.is_read,
                                notification_type=notification.type,
                                employee=EmployeeOut.parse(notification.employee) if notification.employee_id else None)
