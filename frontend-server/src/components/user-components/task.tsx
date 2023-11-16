import { TaskStatus } from "../../types";

type TaskProps = {
    id:number
    isCompleted: TaskStatus
    name: string
    taskClick: (id: number) => void
}

function Task({id, isCompleted, name, taskClick}:TaskProps){
    return ( 
        <div className="monster">
            <button onClick={() => taskClick(id)}>
                <img className="monster-icon" src="/profile-logo.png" alt="Задача" width={68} height={68}></img>
                <p>{name}</p>
                {isCompleted === TaskStatus.completed && <img className="completed" src="/completed-icon.svg" alt=""></img>}
            </button>
        </div>
     );
}

export default Task;