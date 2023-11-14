import { useState } from "react"
import { NotificationData } from "../../mocks/notifications"
import Notifications from "../notifications"
import ProfileButtons from "../profile-buttons"
import { Link, useLocation } from "react-router-dom"

function CuratorHeader() {
    const [isVisibleProfileButtons, setVisibleProfileButtons] = useState(false)
    const [isVisibleUsefulLinks, setVisibleUsefulLinks] = useState(false)
    const [isVisibleProgress, setVisibleProgress] = useState(false)
    const [isVisibleNotification, setVisibleNotification] = useState(false)
    const [isVisibleAchievements, setVisibleAchievements] = useState(false)

    const location = useLocation().pathname

    const notReadNotifications = NotificationData.filter(notification => !notification.checked).length
    
    function profileClickHandler(){
        setVisibleProfileButtons(!isVisibleProfileButtons); 
    }

    function linksClickHandler(){
        setVisibleUsefulLinks(!isVisibleUsefulLinks); 
    }

    function ProgressClickHandler(){
        setVisibleProgress(!isVisibleProgress);
    }

    function NotificationClickHandler(){
        setVisibleNotification(!isVisibleNotification);
    }

    function AchievementsClickHandler(){
        setVisibleAchievements(!isVisibleAchievements);
    }


    return ( 
        <header>
            <div className="logo">
                <img src="/logo.svg" alt="udv group space exploration" width={210} height={40}></img>
            </div>
            <nav className="header-nav">
                <Link className={location === '/curator' ? 'active' : ''} to={"/curator"}>Конструктор задач</Link>
                <Link className={location === '/curator/tasks-for-verification' ? 'active' : ''} to={"/curator/tasks-for-verification"}>Задачи на проверку</Link>
                <Link className={location === '/curator/personal' ? 'active' : ''} to={"/curator/personal"}>Сотрудники</Link>
            </nav>
            <div className="flex notification-profile-block">
                <div>
                    <button className="notifications" onClick={NotificationClickHandler}>
                        <img src="/notifications-icon.svg" alt="Кнопка уведомлений"></img>
                        {notReadNotifications !== 0 && <div className="notifications-number">{notReadNotifications}</div>}
                    </button>
                </div>
                <div>
                    <button onClick={profileClickHandler}>
                        <img src="/profile-logo.png" alt="Профиль" width={53} height={53}></img>
                    </button>
                </div>
            </div>
            {isVisibleNotification && <Notifications/>}
            {isVisibleProfileButtons && <ProfileButtons onClickLinks={linksClickHandler} onClickProgress={ProgressClickHandler} onClickAchievements={AchievementsClickHandler}/>}
        </header>
    );
}

export default CuratorHeader;