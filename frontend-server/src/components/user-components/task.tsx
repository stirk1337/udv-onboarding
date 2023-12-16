import { TaskStatus } from "../../types";

type TaskProps = {
    id:number
    taskStatus: TaskStatus
    name: string
    currentTask: boolean
    icon: string
    taskClick: (id: number) => void
}

function Task({id, currentTask, icon, taskStatus, name, taskClick}:TaskProps){
    const active = currentTask && 'active'
    console.log(taskStatus)
    return ( 
        <div className={"monster " + active}>
            <button onClick={() => taskClick(id)}>
                <img className="monster-icon" src={`/octopuses/${icon}.png`} alt="Этап" width={68} height={68}></img>
                <p className={taskStatus}>{name}</p>
                {taskStatus === TaskStatus.completed && <img className="completed" src="/completed-icon.svg" alt=""></img>}
                {taskStatus === TaskStatus.beingChecked && <img className="completed" src="/in-progress-icon.svg" alt=""></img>}
            </button>
        </div>
     );
}

export default Task;