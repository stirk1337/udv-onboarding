import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getProgressPlanetsTasks } from "../store/api-actions/get-actions";
import ProgressBlock from "./progress-block";
import { useEffect, useState } from "react";

type ProgressProps = {
    onClickExit: () => void
    isOpen: boolean
}

type TProgressData = {
    id: number,
    name: string,
    icon: string,
    tasksName: ProgressTaskData[]
}

type ProgressTaskData = {
    id: number,
    name: string,
    completed: boolean,
}

function Progress({onClickExit, isOpen}:ProgressProps) {
    const dispatch = useAppDispatch()
    const [progressData, setProgressData] = useState<TProgressData[]>([])
    const planets = useAppSelector((state) => state.planets)

    useEffect(() => {
        fillProgressData().then((progressData) => setProgressData(progressData))
    }, [isOpen])

    async function fillProgressData(){
        const newProgressData: TProgressData[] = [] 
        for await (let planet of planets) {
            await dispatch(getProgressPlanetsTasks(planet.id)).then(unwrapResult).then((tasks) => {
                const data: TProgressData = {
                    id: planet.id,
                    name: planet.name,
                    icon: planet.image,
                    tasksName: []
                }
                tasks.forEach(task => {
                    const taskData: ProgressTaskData = {
                        id: task.id,
                        name: task.name,
                        completed: task.task_status === 'completed'
                    }
                    data.tasksName.push(taskData)
                })
                newProgressData.push(data)
            })
        };
        return newProgressData
    }
    fillProgressData()
    return ( 
        <div className="progress-block" style={{
            opacity: !isOpen ? "0" : "1",
            transition: "all .5s",
            visibility: !isOpen ? "hidden" : "visible",
          }}>
            <div className="progress-header">
                <button onClick={onClickExit}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                            <path d="M29 2L2 29M2.00006 2L29 29" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                </button>
                <p>Мой прогресс</p>
            </div>
            <div className="progress-content">
                {progressData.map(progress => <ProgressBlock key={progress.id} icon={progress.icon} name={progress.name} listBlock={progress.tasksName}/>)}
            </div>
        </div>
     );
}

export default Progress;