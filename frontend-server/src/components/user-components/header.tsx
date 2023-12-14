import { useEffect, useState } from "react";
import Notifications from "../notifications";
import ProfileButtons from "../profile-buttons";
import ProgressBarComponent from "./progress-bar";
import UsefulLinks from "./useful-links";
import Achievements from "./achievements";
import Progress from "./progress";
import ImageCropper from "../image-cropper";
import { useAppSelector } from "../hooks";
import { BACKEND_URL } from "../services/api";
import { getEmployeePlanets, getNotifications } from "../store/api-actions/get-actions";
import { store } from "../store";
import { Link } from "react-router-dom";
import EditProfile from "../edit-profile";

function Header() {

    const [isVisibleProfileButtons, setVisibleProfileButtons] = useState(false)
    const [isVisibleUsefulLinks, setVisibleUsefulLinks] = useState(false)
    const [isVisibleProgress, setVisibleProgress] = useState(false)
    const [isVisibleNotification, setVisibleNotification] = useState(false)
    const [isVisibleAchievements, setVisibleAchievements] = useState(false)
    const [isVisibleEditImage, setVisibleEditImage] = useState(false)
    const [isVisibleBackdrop, setVisibleBackdrop] = useState(false)
    const [isVisibleProfileEdit, setVisibleProfileEdit] = useState(false)

    const userData = useAppSelector((state) => state.userData);
    const notifications = useAppSelector((state) => state.notifications);
    const percentage = useAppSelector((state) => state.percentage);
    const notReadNotifications = notifications.filter(notification => !notification.is_read).length
    const navigate = '/' + userData.role

    useEffect(() => {
        store.dispatch(getNotifications())
        store.dispatch(getEmployeePlanets())
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
        setVisibleProgress(false);
        setVisibleNotification(false);
        setVisibleAchievements(false);
        setVisibleEditImage(false);
        setVisibleProfileEdit(false);
    }




    return ( 
        <header>
            <div className="logo">
                <Link to={navigate}><img src="/logo.svg" alt="udv group space exploration" width={210} height={40}></img></Link>
            </div>
            <div className="progress-bar">
                <p>Прогресс: {percentage}%</p>
                <ProgressBarComponent percentage={percentage}/>
            </div>
            <div className="flex notification-profile-block">
                <div>
                    <button className="notifications" onClick={()=>NotificationClickHandler(true)}>
                        <img src="/notifications-icon.svg" alt="Кнопка уведомлений"></img>
                        {notReadNotifications !== 0 && <div className="notifications-number">{notReadNotifications > 9 ? '9+' : notReadNotifications}</div>}
                    </button>
                </div>
                <div>
                    <button className="profile-logo" onClick={()=>profileClickHandler(true)}>
                        <img src={userData.image_url ? BACKEND_URL + '/' + userData.image_url : "/profile-logo.png"} alt="Профиль" width={53} height={53}></img>
                    </button>
                </div>
            </div>
            {isVisibleNotification && <Notifications notificationsList={notifications} onClickExit={()=>NotificationClickHandler(false)}/>}
            {isVisibleProfileButtons && <ProfileButtons role={userData.role} userName={userData.name} onClickEditProfile={()=>editProfileClickHandler(true)} onClickLinks={()=>linksClickHandler(true)} onClickProgress={()=>ProgressClickHandler(true)} onClickAchievements={()=>AchievementsClickHandler(true)}/>}
            {isVisibleAchievements && <Achievements onClickExit={()=>AchievementsClickHandler(false)}/>}
            {isVisibleUsefulLinks && <UsefulLinks onClickExit={()=>linksClickHandler(false)}/>}
            {isVisibleProgress && <Progress onClickExit={()=>ProgressClickHandler(false)}/>}
            {isVisibleEditImage && <ImageCropper onClickExit={()=>editImageClickHandler(false)}/>}
            {isVisibleProfileEdit && <EditProfile userData={userData} onClickExit={()=>editProfileClickHandler(false)} onClickEdit={()=>editImageClickHandler(true)}/>}
            {isVisibleBackdrop && <div onClick={closeDialog} className={isVisibleProfileButtons || isVisibleNotification ? "backdrop without-color" : "backdrop"}></div>}
        </header>
     );
}

export default Header;