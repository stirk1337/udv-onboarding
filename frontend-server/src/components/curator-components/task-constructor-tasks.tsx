import { Link } from "react-router-dom";

type TaskConstructorTasksProps = {
    taskId: number,
    blockId: number
    icon: string,
    name: string,
    date: string,
    isCanDelete?: boolean,
    onClickElement: (evt: React.MouseEvent<HTMLLIElement>, taskId:number, blockId:number) => void
    onDelete?: (id:number) => void
}

function TaskConstructorTasks({taskId, blockId, icon, name, date, isCanDelete=true, onClickElement, onDelete=() => {}}: TaskConstructorTasksProps) {
    const convertedDate = date.split('T')[0].split('-'); 

    return ( 
        <li onClick={(evt) => onClickElement(evt, taskId, blockId)} className="selected-block-monster-list-item">
            <img src={icon} alt="" width={56} height={56}></img>
            <div className="selected-block-monster-list-item-content">
                <p>{name}</p>
                <p className="date">{`${convertedDate[2]}.${convertedDate[1]}.${convertedDate[0]}`}</p>
            </div>
            {isCanDelete && <img className="delete-icon" src="/delete-icon.svg" onClick={()=>onDelete(taskId)} alt=""></img>}
        </li>
    );
}

export default TaskConstructorTasks;