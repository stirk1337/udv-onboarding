import { ChangeEvent, useEffect, useState } from "react";
import InputComponent from "./input-component";
import { BACKEND_URL } from "./services/api";
import { editUserProfile } from "./store/api-actions/patch-action";
import { useAppDispatch } from "./hooks";
import { UserData } from "../types";

type EditProfileProps = {
    onClickExit: () => void
    onClickEdit: () => void
    userData: UserData
    isOpen: boolean
}

function EditProfile({userData,isOpen, onClickExit, onClickEdit}: EditProfileProps) {
    const dispatch = useAppDispatch()
    const [contact, setContact] = useState(userData.contact || '')
    const [user, setIsUserData] = useState<UserData>(userData)
    const [isUserProfile, setIsUserProfile] = useState(true)

    useEffect(() => {
        setIsUserData(userData)
    }, [userData])

    function contactChangeHandler(evt: ChangeEvent<HTMLInputElement>){
        setContact(evt.target.value)
    }

    function onBlurHandler(){
        dispatch(editUserProfile({contact: contact}))
      }

    function onCuratorClickHandler(){
        if(isUserProfile && userData.curator){
            setIsUserData(userData.curator)
            setContact(userData.curator.contact || '')
            setIsUserProfile(false)
        }
        else{
            setIsUserData(userData)
            setContact(userData.contact)
            setIsUserProfile(true)
        }
    }

    return ( 
        <div className='edit-profile-page' style={{
            opacity: !isOpen ? "0" : "1",
            transition: "all .5s",
            visibility: !isOpen ? "hidden" : "visible",
          }}>
            <div className="edit-profile-page-header">
                <button onClick={onClickExit}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                        <path d="M29 2L2 29M2.00006 2L29 29" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                {isUserProfile ? <p>Ваш профиль</p> : <p>Профиль куратора</p>}
            </div>
            <div className='edit-profile-page-content'>
                <div className="profile-edit-image-data">
                    <img src={user.image_url ? BACKEND_URL + '/' + user.image_url : "/profile-logo.png"} width={197} height={197} alt="аватар"></img>
                    {isUserProfile && <div className="edit-icon-shower">
                        <img onClick={onClickEdit} src="/edit-image.svg" width={122} height={110} alt=""></img>
                    </div>}
                </div>
                <div className="profile-data">
                    <InputComponent name="ФИО" icon='' value={user.name} placeholder='' type='text' disabled={true} onchange={() => {}}/>
                    <InputComponent name="Email" icon='' value={user.email} placeholder='' type="text" disabled={true} onchange={() => {}}/>
                    <InputComponent name="Способ связи" icon='' value={contact} placeholder={contact ? 'telegram, vk' : ''} type="text" disabled={!isUserProfile && true} onchange={contactChangeHandler} onBlur={onBlurHandler}/>
                </div>
            </div>
            {userData.curator && <button className="send-button" onClick={onCuratorClickHandler}>{isUserProfile ? <span>Профиль куратора</span> : <span>Ваш профиль</span>}</button>}
        </div>
     );
}

export default EditProfile;
