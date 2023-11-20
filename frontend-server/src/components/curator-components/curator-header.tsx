import { useState } from "react"
import { NotificationData } from "../../mocks/notifications"
import Notifications from "../notifications"
import ProfileButtons from "../profile-buttons"
import { Link, useLocation } from "react-router-dom"
import ImageCropper from "../image-cropper"
import { useAppSelector } from "../hooks"
import { BACKEND_URL } from "../services/api"
import UsefulLinks from "../user-components/useful-links"

function CuratorHeader() {
    const [isVisibleProfileButtons, setVisibleProfileButtons] = useState(false)
    const [isVisibleUsefulLinks, setVisibleUsefulLinks] = useState(false)
    const [isVisibleProgress, setVisibleProgress] = useState(false)
    const [isVisibleNotification, setVisibleNotification] = useState(false)
    const [isVisibleAchievements, setVisibleAchievements] = useState(false)
    const [isVisibleEditImage, setVisibleEditImage] = useState(false)
    const [isVisibleBackdrop, setVisibleBackdrop] = useState(false)

    const userData = useAppSelector((state) => state.userData);
    const location = useLocation().pathname

    const notReadNotifications = NotificationData.filter(notification => !notification.checked).length
    
    function profileClickHandler(action: boolean) {
        setVisibleProfileButtons(action); 
        setVisibleBackdrop(action)
    }

    function linksClickHandler(action: boolean){
        setVisibleUsefulLinks(action); 
        setVisibleBackdrop(action)
        setVisibleProfileButtons(false);
    }

    function ProgressClickHandler(action: boolean){
        setVisibleProgress(action);
        setVisibleBackdrop(action)
        setVisibleProfileButtons(false);
    }

    function NotificationClickHandler(action: boolean){
        setVisibleNotification(action);
        setVisibleBackdrop(action)
        setVisibleProfileButtons(false);
    }

    function AchievementsClickHandler(action: boolean){
        setVisibleAchievements(action);
        setVisibleBackdrop(action)
        setVisibleProfileButtons(false);
    }

    function editImageClickHandler(action: boolean){
        setVisibleEditImage(action);
        setVisibleBackdrop(action)
        setVisibleProfileButtons(false);
    }

    function closeDialog(){
        setVisibleBackdrop(false)
        setVisibleProfileButtons(false);
        setVisibleUsefulLinks(false);
        setVisibleProgress(false);
        setVisibleNotification(false);
        setVisibleAchievements(false);
        setVisibleEditImage(false);
    }


    return ( 
        <header>
            <div className="logo">
            <a href="/"><img src="/logo.svg" alt="udv group space exploration" width={210} height={40}></img></a>
            </div>
            <nav className="header-nav">
                <Link className={location === '/curator' ? 'active' : ''} to={"/curator"}>Конструктор адаптации</Link>
                <Link className={location === '/curator/tasks-for-verification' ? 'active' : ''} to={"/curator/tasks-for-verification"}>Проверка прохождения</Link>
                <Link className={location === '/curator/personal' ? 'active' : ''} to={"/curator/personal"}>Сотрудники</Link>
            </nav>
            <div className="flex notification-profile-block">
                <div>
                    <button className="notifications" onClick={()=>NotificationClickHandler(true)}>
                        <img src="/notifications-icon.svg" alt="Кнопка уведомлений"></img>
                        {notReadNotifications !== 0 && <div className="notifications-number">{notReadNotifications}</div>}
                    </button>
                </div>
                <div>
                    <button className="profile-logo" onClick={()=>profileClickHandler(true)}>
                        <img src={userData.image_url ? BACKEND_URL + '/' + userData.image_url : '/profile-logo.png'} alt="Профиль" width={53} height={53}></img>
                    </button>
                </div>
            </div>
            {isVisibleNotification && <Notifications/>}
            {isVisibleProfileButtons && <ProfileButtons role={userData.role} userName={userData.name} onClickEdit={()=>editImageClickHandler(true)} onClickLinks={()=>linksClickHandler(true)} onClickProgress={()=>ProgressClickHandler(true)} onClickAchievements={()=>AchievementsClickHandler(true)}/>}
            {isVisibleUsefulLinks && <UsefulLinks onClickExit={()=>linksClickHandler(false)}/>}
            {isVisibleEditImage && <ImageCropper onClickExit={()=>editImageClickHandler(false)}/>}
            {isVisibleBackdrop && <div onClick={closeDialog} className={isVisibleProfileButtons || isVisibleNotification ? "backdrop without-color" : "backdrop"}></div>}
        </header>
    );
}

export default CuratorHeader;