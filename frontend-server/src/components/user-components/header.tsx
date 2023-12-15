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
    const currentPlanetPercentage = useAppSelector((state) => state.currentPlanetPercentage);
    const currentPlanet = useAppSelector((state) => state.currentPlanet);
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


    console.log(currentPlanet)



    return ( 
        <header>
            <div className="logo">
                <Link to={navigate}><img src="/logo.svg" alt="udv group space exploration" width={210} height={40}></img></Link>
            </div>
            <div className="progress-bar">
                <p>{currentPlanet.id === -1? `Прогресс: ${percentage}%` : `${currentPlanet.name.length >= 50 ? currentPlanet.name.slice(0, 45) + '... ' :  currentPlanet.name}: ${currentPlanetPercentage}%`}</p>
                <ProgressBarComponent percentage={currentPlanet.id === -1? percentage : currentPlanetPercentage}/>
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
            {isVisibleNotification && <Notifications isOpen={isVisibleNotification} notificationsList={notifications} onClickExit={()=>NotificationClickHandler(false)}/>}
            <ProfileButtons role={userData.role} isOpen={isVisibleProfileButtons} userName={userData.name} onClickEditProfile={()=>editProfileClickHandler(true)} onClickLinks={()=>linksClickHandler(true)} onClickProgress={()=>ProgressClickHandler(true)} onClickAchievements={()=>AchievementsClickHandler(true)}/>
            <Achievements isOpen={isVisibleAchievements} onClickExit={()=>AchievementsClickHandler(false)}/>
            <UsefulLinks isOpen={isVisibleUsefulLinks} onClickExit={()=>linksClickHandler(false)}/>
            <Progress isOpen={isVisibleProgress} onClickExit={()=>ProgressClickHandler(false)}/>
            <ImageCropper isOpen={isVisibleEditImage} onClickExit={()=>editImageClickHandler(false)}/>
            <EditProfile isOpen={isVisibleProfileEdit} userData={userData} onClickExit={()=>editProfileClickHandler(false)} onClickEdit={()=>editImageClickHandler(true)}/>
            <div style={{
            opacity: !isVisibleBackdrop ? "0" : "1",
            transition: "all .5s",
            visibility: !isVisibleBackdrop ? "hidden" : "visible",
          }} onClick={closeDialog} className={isVisibleProfileButtons || isVisibleNotification ? "backdrop without-color" : "backdrop"}></div>
        </header>
     );
}

export default Header;