import { UserRoles } from "../types";
import { useAppDispatch, useAppSelector } from "./hooks";
import { logOutAction } from "./store/api-actions/post-actions";

type ProfileButtonsProps = {
    onClickLinks: () => void;
    onClickProgress: () => void;
    onClickAchievements: () => void;
    onClickEditProfile: () => void;
    userName: string
    role: UserRoles
}

function ProfileButtons({onClickEditProfile, onClickLinks, onClickProgress, onClickAchievements, userName, role}: ProfileButtonsProps) {
    const dispatch = useAppDispatch()

    return (     
        <div className="profile-buttons">
            <div className="user-name-info">
                <p className="user-name">{userName} </p>
                <button className="exit-button" onClick={() => dispatch(logOutAction())}>
                    <svg width={27} height={22} viewBox="0 0 44 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30.1376 1.99994H2.31934V41.1767C2.31934 44.2674 4.81027 46.7733 7.88299 46.7733H30.1376" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M32.9191 32.7817L41.2646 24.3867M41.2646 24.3867L32.9191 15.9916M41.2646 24.3867H13.4463" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
            <div className="flex">
                    <button onClick={onClickEditProfile}>
                        <img src="/profile-icon.svg" alt="" width={57} height={52}></img>
                        <p>Профиль</p>
                    </button>
                    <button onClick={onClickLinks}>
                        <img src="/useful-links-icon.svg" alt="" width={57} height={52}></img>
                        <p>Полезные ссылки</p>
                    </button>
            </div>
            {role !== 'curator' &&
                <div className="flex">
                    <button onClick={onClickProgress}>
                        <img src="/progress-icon.svg" alt="" width={57} height={52}></img>
                        <p>Прогресс</p>
                    </button>
                    <button onClick={onClickAchievements}>
                        <img src="/achievments-icon.svg" alt="" width={57} height={52}></img>
                        <p>Достижения</p>
                    </button>
                </div>}
        </div>
     );
}

export default ProfileButtons;