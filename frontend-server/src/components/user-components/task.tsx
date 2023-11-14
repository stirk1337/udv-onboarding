type TaskProps = {
    id:string
    isCompleted: boolean
    taskClick: (id: number) => void
}

function Task({id, isCompleted, taskClick}:TaskProps){
    return ( 
        <div className="monster">
            <button onClick={() => taskClick(Number(id))}>
                <img className="monster-icon" src="/profile-logo.png" alt="Задача" width={68} height={68}></img>
                <p>Пример задачи</p>
                {isCompleted && <img className="completed" src="/completed-icon.svg" alt=""></img>}
            </button>
        </div>
     );
}

export default Task;