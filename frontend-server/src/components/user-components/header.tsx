import { useState } from "react";
import Notifications from "../notifications";
import ProfileButtons from "../profile-buttons";
import ProgressBarComponent from "./progress-bar";
import UsefulLinks from "./useful-links";
import { NotificationData } from "../../mocks/notifications";
import Achievements from "./achievements";
import Progress from "./progress";

function Header() {

    const [isVisibleProfileButtons, setVisibleProfileButtons] = useState(false)
    const [isVisibleUsefulLinks, setVisibleUsefulLinks] = useState(false)
    const [isVisibleProgress, setVisibleProgress] = useState(false)
    const [isVisibleNotification, setVisibleNotification] = useState(false)
    const [isVisibleAchievements, setVisibleAchievements] = useState(false)

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
            <div className="progress-bar">
                <p>Первые дни</p>
                <ProgressBarComponent/>
            </div>
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
            {isVisibleAchievements && <Achievements onClickExit={AchievementsClickHandler}/>}
            {isVisibleUsefulLinks && <UsefulLinks onClickExit={linksClickHandler}/>}
            {isVisibleProgress && <Progress onClickExit={ProgressClickHandler}/>}
        </header>
     );
}

export default Header;