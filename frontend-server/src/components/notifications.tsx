import Notification from "./notification";
import { NotificationData } from "../mocks/notifications";
import { NotificationType } from "../types";
import { useAppDispatch } from "./hooks";
import { readAllNotification } from "./store/api-actions/patch-action";

type NotificationsProps = {
    notificationsList: NotificationType[]
    onClickExit: () => void
}

function Notifications({notificationsList, onClickExit}: NotificationsProps){
    const dispatch = useAppDispatch()
    function readAllNotifications(){
        dispatch(readAllNotification())
    }

    return ( 
        <div className="notification-block">
            <div className="read-all-notifications">
                <img src="/ring-bell.svg" alt="Пометить как прочитанное" onClick={readAllNotifications}></img>
                <p>Уведомления</p>
            </div>
            <div className="notification-list">
                {notificationsList.map((notification) => <Notification onClickExit={onClickExit} key={notification.id} task={notification.task} employee={notification.employee} planet={notification.planet} id={notification.id} data={notification.notification_type} date={notification.created_at} checked={notification.is_read}/>)}
            </div>
        </div>
     );
}

export default Notifications;