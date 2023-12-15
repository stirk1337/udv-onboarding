import { useEffect, useState } from "react";
import TaskConstructorTasks from "./task-constructor-tasks";
import TaskData from "../user-components/task-data";
import DeclineTask from "./decline-task";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getTasksBeingChecked } from "../store/api-actions/get-actions";
import { checkTask } from "../store/api-actions/patch-action";
import { useNavigate, useParams } from "react-router-dom";
import { PlanetTaskForVerification } from "../../types";
import { unwrapResult } from "@reduxjs/toolkit";
import { redirectToRoute } from "../store/action";

function TaskForVerification() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const  {id} = useParams()
    const tId = id || ''
    console.log(tId);
    const taskForVerificationStore = useAppSelector((state) => state.taskForVerification);
    const [taskForVerification, setTaskForVerification] = useState(useAppSelector((state) => state.taskForVerification))
    const [isDeclineOpen, setIsDeclineOpen] = useState(false)
    const [currentTaskForVerificationId, setCurrentTaskForVerificationId] = useState(tId)
    const [selectedTask, setCurrentTask] =  useState<PlanetTaskForVerification>(taskForVerification.find(task => currentTaskForVerificationId === String(task.employee.id) + '-' + String(task.id)) || taskForVerification[0])

    useEffect(() => {
        if(currentTaskForVerificationId !== tId && tId) {
            setCurrentTaskForVerificationId(tId)
        }
        console.log(currentTaskForVerificationId, tId)
    }, [tId])

    useEffect(() =>{
        dispatch(getTasksBeingChecked()).then(unwrapResult).then((tasks) => {checkDispatch(tasks)})
    }, [JSON.stringify(taskForVerificationStore), navigate])

    useEffect(() =>{
        if(taskForVerification.length !== 0){
            checkDispatch(taskForVerificationStore)
        }
    }, [currentTaskForVerificationId])

    function checkDispatch(tasks: PlanetTaskForVerification[]){
        setTaskForVerification(tasks);
        console.log(tasks)
        let curTask: PlanetTaskForVerification | 'not-found'
        if(currentTaskForVerificationId){
            curTask = tasks.find((task) => currentTaskForVerificationId === String(task.employee.id) + '-' + String(task.id)) || 'not-found'
        }
        else{
            curTask = tasks[0]
        }
        console.log(curTask, currentTaskForVerificationId, tasks)
        if(curTask === 'not-found' && tasks.length !== 0){
            navigate(`/curator/tasks-for-verification/${tasks[0].employee.id}-${tasks[0].id}`)
            setCurrentTask(tasks[0])
        }
        else if(curTask !== 'not-found'){
            setCurrentTask(curTask)
        }
    }

    useEffect(() => {
        setCurrentTask(taskForVerification.find(task => currentTaskForVerificationId === String(task.employee.id) + '-' + String(task.id)) || taskForVerification[0])
    },[taskForVerificationStore])
    
    function taskClickHandler(evt: React.MouseEvent<HTMLLIElement>, idTask: number, idBlock: number){
        const currentTask = taskForVerification.find(task => task.id === idTask && task.planet_id === idBlock);
        setCurrentTaskForVerificationId(String(currentTask?.employee.id) + '-' + String(idTask))
        navigate(`/curator/tasks-for-verification/${currentTask?.employee.id}-${idTask}`)
    }

    function declineClickHandler(){
        setIsDeclineOpen(!isDeclineOpen)
    }

    function acceptClickHandler(){
        redirectAfterAcceptOrDeclineTask()
        dispatch(checkTask({employeeId: selectedTask.employee.id, taskId: selectedTask.id, isApproved: true, curatorAnswer: ''}))
    }

    function declinebuttonClickHandler(message: string){
        redirectAfterAcceptOrDeclineTask()
        dispatch(checkTask({employeeId: selectedTask.employee.id, taskId: selectedTask.id, isApproved: false, curatorAnswer: message}))
        setIsDeclineOpen(!isDeclineOpen)
    }

    function redirectAfterAcceptOrDeclineTask(){
        const index = taskForVerification.findIndex((task) => task.id === selectedTask.id)
        if(taskForVerificationStore.length !== index + 1){
            const item = taskForVerification[index + 1]
            const id = String(item.employee.id) + '-' + String(item.id)
            setCurrentTaskForVerificationId(id)
            navigate(`/curator/tasks-for-verification/${id}`)
        }
        else if(index - 1 >= 0){
            const item = taskForVerification[index - 1]
            const id = String(item.employee.id) + '-' + String(item.id)
            setCurrentTaskForVerificationId(id)
            navigate(`/curator/tasks-for-verification/${id}`)
        }
    }

    function closeDialog(){
        setIsDeclineOpen(!isDeclineOpen)
    }

    console.log(selectedTask)

    return ( 
        <>
            <div className="task-for-verification-block">
                <ul className="task-for-verification-list">
                    {taskForVerification && taskForVerification.map((task, index) => <TaskConstructorTasks index={index} isDraggable={false} key={String(task.employee.id) + '-' + String(task.id)} currentTaskId={String(task.employee.id) + '-' + String(task.id) === String(selectedTask.employee.id) + '-' + String(selectedTask.id)} taskId={task.id} blockId={task.planet_id} icon={task.employee.image_url} name={task.employee.name} date={task.updated_at} isCanDelete={false} onClickElement={taskClickHandler}/>)}
                </ul>
                <div className="task-approve-content">
                    {selectedTask && taskForVerification.length !== 0 && <> <TaskData curatorAnswer={selectedTask.curator_answer} id={selectedTask.id} planetId={selectedTask.planet_id} currentAnswer={selectedTask.employee_answer} taskStatus={selectedTask.task_status} name={selectedTask.name} data={selectedTask.description} isApprovePage={true}/>
                                    <div className="task-approve-buttons">
                                        <button className="approve-button" onClick={acceptClickHandler}>Принять</button>
                                        <button onClick={declineClickHandler} className="decline-button">Отклонить</button>
                                    </div>
                                    </>
                    }
                </div>
            </div>
            {isDeclineOpen && <DeclineTask isOpen={isDeclineOpen} onDeclineClick={declinebuttonClickHandler} onDialogClick={declineClickHandler}/>}
            <div style={{
            opacity: !isDeclineOpen ? "0" : "1",
            transition: "all .5s",
            visibility: !isDeclineOpen ? "hidden" : "visible",
          }} onClick={closeDialog} className={"backdrop"}></div>
        </>
     );
}
export default TaskForVerification;