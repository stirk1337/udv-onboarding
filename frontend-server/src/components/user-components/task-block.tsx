import Task from "./task";
import TaskData from "./task-data";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { useEffect, useState } from "react";

function TaskBlock() {

    const navigate = useNavigate();
    const  {planetId, taskId} = useParams()
    const tId = Number(taskId)
    const pId = Number(planetId)
    const tasks = useAppSelector((state) => state.planetTasks);

    const [currentTask, setCurrentTask] =  useState(tasks.find((task) => task.id === tId) || tasks[0])

    useEffect(() =>{
        setCurrentTask(tasks.find((task) => task.id === tId) || tasks[0])
    }, [tasks])

    function taskClickHandler(id: number){
        setCurrentTask(tasks.find((task) => task.id === id) || tasks[0])
        navigate(`/employee/${pId}/${id}`)
    }

    return ( 
        <div className="task-block">
            <div className="monsters">
                <div className="monster-header">
                    <button onClick={() => navigate('/employee')}>
                        <p><img src="/back-arrow.svg" alt=""></img> Вернуться к блокам</p>
                    </button>
                </div>
                <div className="monster-content">
                    {tasks.map(task => <Task key={task.id} id={task.id} name={task.name} isCompleted={task.task_status} taskClick={taskClickHandler}/>)}
                </div>
            </div>
            <div className="task-content">
                <TaskData name={currentTask.name} id={currentTask.id} planetId={pId} data={currentTask.description} currentAnswer={currentTask.employee_answer} taskStatus={currentTask.task_status}/>
            </div>
        </div>
     );
}

export default TaskBlock;