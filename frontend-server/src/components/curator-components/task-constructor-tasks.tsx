import { Link } from "react-router-dom";
import { BACKEND_URL } from "../services/api";

type TaskConstructorTasksProps = {
    taskId: number,
    blockId: number
    icon: string,
    name: string,
    date: string,
    isCanDelete?: boolean,
    currentTaskId: boolean,
    onClickElement: (evt: React.MouseEvent<HTMLLIElement>, taskId:number, blockId:number) => void
    onDelete?: (id:number) => void
}

function TaskConstructorTasks({taskId, currentTaskId,  blockId, icon, name, date, isCanDelete=true, onClickElement, onDelete=() => {}}: TaskConstructorTasksProps) {
    const convertedDate = date.split('T')[0].split('-'); 
    const active = currentTaskId && 'active'
    return ( 
        <li onClick={(evt) => onClickElement(evt, taskId, blockId)} className={"selected-block-monster-list-item " + active}>
            <img className="profile-logo" src={icon ? BACKEND_URL + '/' + icon : '/monster-icon.svg'} alt="" width={56} height={56}></img>
            <div className="selected-block-monster-list-item-content">
                <p>{name}</p>
                <p className="date">{`${convertedDate[2]}.${convertedDate[1]}.${convertedDate[0]}`}</p>
            </div>
            {isCanDelete && <svg className="delete-icon" onClick={() => onDelete(taskId)} xmlns="http://www.w3.org/2000/svg" width="33" height="37" viewBox="0 0 33 37" fill="none">
                <path d="M12.1942 18.2222V27.6944M19.9443 18.2222V27.6945M1 8.75H32M4.44531 14.7778V29.8081C4.44531 32.921 7.04767 35.4444 10.2578 35.4444H21.8828C25.0931 35.4444 27.6953 32.921 27.6953 29.8081V14.7778M10.4718 4.875C10.4718 2.7349 12.1424 1 14.2032 1H17.9347C19.9956 1 21.6662 2.7349 21.6662 4.875V8.75H10.4718V4.875Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>}
        </li>
    );
}

export default TaskConstructorTasks;