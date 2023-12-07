import Task from "./task";
import TaskData from "./task-data";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useEffect, useState } from "react";
import { getPlanetTasks } from "../store/api-actions/get-actions";
import { PlanetTask } from "../../types";
import { unwrapResult } from '@reduxjs/toolkit';

type TaskBlockProps = {
    tasks: PlanetTask[],
}

function TaskBlock({}: TaskBlockProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const  {planetId, taskId} = useParams()
    const tId = Number(taskId)
    const pId = Number(planetId)
    const data = useAppSelector((state) => state.planetTasks)
    const [tasks, setTasks] =  useState<PlanetTask[]>(useAppSelector((state) => state.planetTasks))
    const [currentTask, setCurrentTask] =  useState<PlanetTask>(tasks.find((task) => task.id === tId) || tasks[0])

    if(currentTask && currentTask.id !== tId) {
        setCurrentTask(tasks.find((task) => task.id === tId) || tasks[0])
    }

    useEffect(() =>{
        dispatch(getPlanetTasks(pId)).then(unwrapResult).then((tasks) => {setTasks(tasks); setCurrentTask(tasks.find((task) => task.id === tId) || tasks[0])})
    }, [JSON.stringify(data)])

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
                    {tasks && currentTask && tasks.map(task => <Task key={task.id} currentTask={task.id === currentTask.id} id={task.id} name={task.name} isCompleted={task.task_status} taskClick={taskClickHandler}/>)}
                </div>
            </div>
            <div className="task-content">
                {currentTask && <TaskData name={currentTask.name} id={currentTask.id} planetId={pId} data={currentTask.description} currentAnswer={currentTask.employee_answer} taskStatus={currentTask.task_status}/>}
            </div>
        </div>
     );
}

export default TaskBlock;