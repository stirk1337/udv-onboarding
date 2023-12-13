import { useNavigate } from "react-router-dom";
import { getPlanetTasks } from "./store/api-actions/get-actions";
import { useAppDispatch } from "./hooks";
import { NotificationCuratorData, Planet, PlanetTask, UserData, UserOnPlanetData } from "../types";
import { readNotification } from "./store/api-actions/patch-action";
import { BACKEND_URL } from "./services/api";

type NotificationProps = {
    id: number,
    data: string,
    date: string,
    checked:boolean,
    task: PlanetTask,
    planet: NotificationCuratorData,
    employee: UserOnPlanetData
    onClickExit: () => void
}

export enum NotificationTextByType {
    accept = 'Проверил этап',
    new = 'Новая задача появилась в блоке',
    invited = 'Пригласил вас на блок',
    decline = 'Отклонил этап',
    answer = 'Отправил этап на проверку'
}



function Notification({id, data, date, checked, task, planet, employee, onClickExit}: NotificationProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const convertedDate = date.split('T')[0].split('-');
    const convertedTime = date.split('T')[1].split(':');
    const avatar = employee ? employee.image_url : planet.curator.image_url
    const senderName = employee ? employee.name : planet.curator.name


    function notificationClickHandle(){
        if(task && !employee){
            navigate(`/employee/planet/${planet.id}/${task.id}`)
        }
        else if(!employee){
            dispatch(getPlanetTasks(planet.id))
        }
        else{
            navigate(`/curator/tasks-for-verification/${String(planet.id) + String(task.id)}`)
        }
        if(!checked){
            dispatch(readNotification(id))
        }
        onClickExit()
    }

    function getTextByType(type: string){
        if(type === 'new'){
            console.log(id)
            return `${NotificationTextByType.new} "${task.name}"`
        }
        else if(type === 'accept'){
            return `${NotificationTextByType.accept} "${task.name}"`
        }
        else if(type === 'invited'){
            return `${NotificationTextByType.invited} "${planet.name}"`
        }
        else if(type === 'decline'){
            return `${NotificationTextByType.decline} "${task.name}"`
        }
        else if(type === 'answer'){
            return `${NotificationTextByType.answer} "${task.name}"`
        }
    }

    return ( 
        <div onClick={notificationClickHandle} className="notification-item">
            <img src={avatar ? BACKEND_URL + '/' + avatar : "/profile-logo.png"} alt="аватар" width={33} height={33}></img>
            <div className="notification-data">
                <p className="notification-data-text"><b>{senderName + ' '}</b>{getTextByType(data)}</p>
                <div className="notification-date">
                    <p>{`${Number(convertedTime[0])}:${convertedTime[1]} ${convertedDate[2]}.${convertedDate[1]}.${convertedDate[0]}`}</p>
                </div>
                {!checked && <div className="not-checked"></div>}
            </div>
        </div>
    );
}

export default Notification;