import { useEffect, useState } from "react"
import Notifications from "../notifications"
import ProfileButtons from "../profile-buttons"
import { Link, useLocation } from "react-router-dom"
import ImageCropper from "../image-cropper"
import { useAppDispatch, useAppSelector } from "../hooks"
import { BACKEND_URL } from "../services/api"
import UsefulLinks from "../user-components/useful-links"
import { getNotifications, getTasksBeingChecked } from "../store/api-actions/get-actions"
import { store } from "../store"
import EditProfile from "../edit-profile"

function CuratorHeader() {
    const dispatch = useAppDispatch()
    const [isVisibleProfileButtons, setVisibleProfileButtons] = useState(false)
    const [isVisibleUsefulLinks, setVisibleUsefulLinks] = useState(false)
    const [isVisibleNotification, setVisibleNotification] = useState(false)
    const [isVisibleEditImage, setVisibleEditImage] = useState(false)
    const [isVisibleBackdrop, setVisibleBackdrop] = useState(false)
    const [isVisibleProfileEdit, setVisibleProfileEdit] = useState(false)

    const userData = useAppSelector((state) => state.userData);
    const location = useLocation().pathname
    const notifications = useAppSelector((state) => state.notifications);
    const notReadNotifications = notifications.filter(notification => !notification.is_read).length
    const navigate = '/' + userData.role

    useEffect(() => {
        store.dispatch(getNotifications())
      }, [])
    
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
        setVisibleBackdrop(action)
        setVisibleProfileButtons(false);
    }

    function NotificationClickHandler(action: boolean){
        setVisibleNotification(action);
        setVisibleBackdrop(action)
        setVisibleProfileButtons(false);
    }

    function AchievementsClickHandler(action: boolean){
        setVisibleBackdrop(action)
        setVisibleProfileButtons(false);
    }

    function editImageClickHandler(action: boolean){
        setVisibleEditImage(action);
        setVisibleProfileButtons(false);
    }
    
    function editProfileClickHandler(action: boolean){
        setVisibleProfileEdit(action);
        setVisibleBackdrop(action)
        setVisibleProfileButtons(false);
    }

    function closeDialog(){
        setVisibleBackdrop(false)
        setVisibleProfileButtons(false);
        setVisibleUsefulLinks(false);
        setVisibleNotification(false);
        setVisibleEditImage(false);
        setVisibleProfileEdit(false);
    }

    return ( 
        <header>
            <div className="logo">
            <Link to={navigate}><img src="/logo.svg" alt="udv group space exploration" width={210} height={40}></img></Link>
            </div>
            <nav className="header-nav">
                <Link className={location === '/curator' ? 'active' : ''} to={"/curator"}>Конструктор адаптации</Link>
                <Link className={location.split('/')[2] === 'tasks-for-verification' ? 'active' : ''} to={"/curator/tasks-for-verification"} onClick={() => dispatch(getTasksBeingChecked())}>Проверка прохождения</Link>
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
            <Notifications isOpen={isVisibleNotification}  notificationsList={notifications} onClickExit={()=>NotificationClickHandler(false)}/>
            <ProfileButtons isOpen={isVisibleProfileButtons} role={userData.role} userName={userData.name} onClickEditProfile={()=>editProfileClickHandler(true)} onClickLinks={()=>linksClickHandler(true)} onClickProgress={()=>ProgressClickHandler(true)} onClickAchievements={()=>AchievementsClickHandler(true)}/>
            <UsefulLinks isOpen={isVisibleUsefulLinks} onClickExit={()=>linksClickHandler(false)}/>
            <ImageCropper isOpen={isVisibleEditImage} onClickExit={()=>editImageClickHandler(false)}/>
            <EditProfile isOpen={isVisibleProfileEdit} userData={userData} onClickExit={()=>editProfileClickHandler(false)} onClickEdit={()=>editImageClickHandler(true)}/>
            <div style={{
            opacity: !isVisibleBackdrop || (isVisibleProfileButtons || isVisibleNotification) ? "0" : "1",
            transition: "all .5s",
            visibility: !isVisibleBackdrop ? "hidden" : "visible",
          }} onClick={closeDialog} className={isVisibleProfileButtons || isVisibleNotification ? "backdrop without-color" : "backdrop"}></div>
        </header>
    );
}

export default CuratorHeader;