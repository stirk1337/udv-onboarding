import Notification from "./notification";
import { NotificationData } from "../mocks/notifications";

function Notifications() {
    return ( 
        <div className="notification-block">
            <div className="read-all-notifications">
                <img src="/ring-bell.svg" alt="Пометить как прочитанное"></img>
                <p>Уведомления</p>
            </div>
            <div className="notification-list">
                {NotificationData.map((notification) => <Notification key={notification.id} id={notification.id} avatar={notification.avatar} sender={notification.sender} data={notification.data} date={notification.date} checked={notification.checked}/>)}
            </div>
        </div>
     );
}

export default Notifications;