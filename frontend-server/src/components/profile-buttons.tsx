import { UserRoles } from "../types";
import { useAppDispatch, useAppSelector } from "./hooks";
import { logOutAction } from "./store/api-actions/post-actions";

type ProfileButtonsProps = {
    onClickLinks: () => void;
    onClickProgress: () => void;
    onClickAchievements: () => void;
    onClickEdit: () => void;
    userName: string
    role: UserRoles
}

function ProfileButtons({onClickEdit, onClickLinks, onClickProgress, onClickAchievements, userName, role}: ProfileButtonsProps) {
    const dispatch = useAppDispatch()

    return (     
        <div className="profile-buttons">
            <p className="user-name">{userName} <img className="edit-profile" onClick={onClickEdit} src="/edit-image.svg" alt=""></img> </p>
            {role !== 'curator' &&
                <div className="flex">
                    <button onClick={onClickAchievements}>
                        <img src="/achievments-icon.svg" alt="" width={57} height={52}></img>
                        <p>Достижения</p>
                    </button>
                    <button onClick={onClickProgress}>
                        <img src="/progress-icon.svg" alt="" width={57} height={52}></img>
                        <p>Прогресс</p>
                    </button>
                </div>}
            <div className="flex">
                <button onClick={onClickLinks}>
                    <img src="/useful-links-icon.svg" alt="" width={57} height={52}></img>
                    <p>Полезные ссылки</p>
                </button>
                <button onClick={() => dispatch(logOutAction())}>
                    <img src="/exit-icon.svg" alt="" width={57} height={52}></img>
                    <p>Выход</p>
                </button>
            </div>
        </div>
     );
}

export default ProfileButtons;