import { TaskStatus } from "../../types";

type TaskProps = {
    id:number
    isCompleted: TaskStatus
    name: string
    currentTask: boolean
    taskClick: (id: number) => void
}

function Task({id, currentTask, isCompleted, name, taskClick}:TaskProps){
    const active = currentTask && 'active'
    return ( 
        <div className={"monster " + active}>
            <button onClick={() => taskClick(id)}>
                <img className="monster-icon" src="/profile-logo.png" alt="Задача" width={68} height={68}></img>
                <p>{name}</p>
                {isCompleted === TaskStatus.completed && <img className="completed" src="/completed-icon.svg" alt=""></img>}
            </button>
        </div>
     );
}

export default Task;