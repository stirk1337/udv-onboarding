import Task from "./task";
import TaskData from "./task-data";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useEffect, useState } from "react";
import { getPlanetTasks } from "../store/api-actions/get-actions";
import { CuratorPlanetData, PlanetTask } from "../../types";
import { unwrapResult } from '@reduxjs/toolkit';
import { changeCurrentPlanet, clearCurrentPlanet } from "../store/action";

type TaskBlockProps = {
    tasks: PlanetTask[],
}

function TaskBlock({}: TaskBlockProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const  {planetId, taskId} = useParams()
    const tId = Number(taskId)
    const pId = Number(planetId)
    const planets = useAppSelector((state) => state.planets)
    const data = useAppSelector((state) => state.planetTasks)
    const [tasks, setTasks] =  useState<PlanetTask[]>(useAppSelector((state) => state.planetTasks))
    const [currentTask, setCurrentTask] =  useState<PlanetTask>(tasks.find((task) => task.id === tId) || tasks[0])

    if((!tId && taskId) || (!pId && planetId)) {
        navigate('/not-found')
    }

    useEffect(() =>{
        dispatch(getPlanetTasks(pId)).then(unwrapResult).then((tasks) => {checkDispatch(tasks)})
    }, [JSON.stringify(data), tId])

    useEffect(() =>{
        if(planets.length !== 0) {
            dispatch(changeCurrentPlanet((planets.find((planet) => planet.id === pId) || planets[0]) as CuratorPlanetData))
        }
    }, [planets])

    function checkDispatch(tasks: PlanetTask[]){
        setTasks(tasks); 
        const task = tasks.find((task) => task.id === tId) || 'not-found'
        if(task === 'not-found' && tasks.length !== 0) {
            navigate(`/not-found`)
        }
        else if(task !== 'not-found'){
            setCurrentTask(task)
        }
    }

    function taskClickHandler(id: number){
        setCurrentTask(tasks.find((task) => task.id === id) || tasks[0])
        navigate(`/employee/planet/${pId}/${id}`)
    }

    function exitClick(){
        dispatch(clearCurrentPlanet())
        navigate('/employee')
    }
    
    return ( 
        <div className="task-block">
            <div className="monsters">
                <div className="monster-header">
                    <button onClick={exitClick}>
                        <p><img src="/back-arrow.svg" alt=""></img> Вернуться к блокам</p>
                    </button>
                </div>
                <div className="monster-content">
                    {tasks && currentTask && tasks.map(task => <Task key={task.id} icon={task.image} currentTask={task.id === currentTask.id} id={task.id} name={task.name} taskStatus={task.task_status} taskClick={taskClickHandler}/>)}
                </div>
            </div>
            <div className="task-content">
                {currentTask && <TaskData name={currentTask.name} curatorAnswer={currentTask.curator_answer} id={currentTask.id} planetId={pId} data={currentTask.description} currentAnswer={currentTask.employee_answer} taskStatus={currentTask.task_status}/>}
            </div>
        </div>
     );
}

export default TaskBlock;
