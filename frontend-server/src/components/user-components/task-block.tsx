import Task from "./task";
import TaskData from "./task-data";
import { BlockData } from "../../mocks/planet";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TaskBlock() {
    const navigate = useNavigate();
    const  {planetId, taskId} = useParams()
    const tId = Number(taskId)
    const pId = Number(planetId)
    const tasks = BlockData[pId].tasks

    function taskClickHandler(id: number){
        navigate(`/user/${pId}/${id - 1}`)
    }

    return ( 
        <div className="task-block">
            <div className="monsters">
                <div className="monster-header">
                    <button onClick={() => navigate('/user')}>
                        <p><img src="/back-arrow.svg" alt=""></img> Вернуться к блокам</p>
                    </button>
                </div>
                <div className="monster-content">
                    {tasks.map(task => <Task key={task.id} id={task.id} isCompleted={task.completed} taskClick={taskClickHandler}/>)}
                </div>
            </div>
            <div className="task-content">
                <TaskData name={tasks[tId].name} data={tasks[tId].data}/>
                <button className="approve-button">Завершить</button>
            </div>
        </div>
     );
}

export default TaskBlock;