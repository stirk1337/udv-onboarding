import { Link } from "react-router-dom";

type TaskConstructorTasksProps = {
    id: string,
    icon: string,
    name: string,
    date: string,
    isCanDelete?: boolean,
    onClickElement?: (id:number) => void
}

function TaskConstructorTasks({id, icon, name, date, isCanDelete=true, onClickElement=() => {}}: TaskConstructorTasksProps) {
    return ( 
        <li onClick={() => onClickElement(Number(id))} className="selected-block-monster-list-item">
            <img src={icon} alt="" width={56} height={56}></img>
            <div className="selected-block-monster-list-item-content">
                <p>{name}</p>
                <p className="date">{date}</p>
            </div>
            {isCanDelete && <img className="delete-icon" src="/delete-icon.svg" alt=""></img>}
        </li>
    );
}

export default TaskConstructorTasks;