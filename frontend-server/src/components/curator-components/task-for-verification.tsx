import { useEffect, useState } from "react";
import TaskConstructorTasks from "./task-constructor-tasks";
import TaskData from "../user-components/task-data";
import DeclineTask from "./decline-task";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getTasksBeingChecked } from "../store/api-actions/get-actions";
import { checkTask } from "../store/api-actions/patch-action";
import { useNavigate, useParams } from "react-router-dom";

function TaskForVerification() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const  {id} = useParams()
    const tId = Number(id)
    console.log(tId);
    const TaskForVerification = useAppSelector((state) => state.taskForVerification);
    const [isDeclineOpen, setIsDeclineOpen] = useState(false)
    const [currentTaskForVerificationId, setCurrentTaskForVerificationId] = useState(tId)
    if(currentTaskForVerificationId !== tId) {
        setCurrentTaskForVerificationId(tId)
    }
    console.log(currentTaskForVerificationId)

    useEffect(() => {
        dispatch(getTasksBeingChecked())
    },[])

    const selectedTask = TaskForVerification.find(task => currentTaskForVerificationId === Number(String(task.planet_id) + String(task.id))) || TaskForVerification[0]
    console.log(TaskForVerification)
    function taskClickHandler(evt: React.MouseEvent<HTMLLIElement>, idTask: number, idBlock: number){
        setCurrentTaskForVerificationId(Number(String(idBlock) + String(idTask)))
        navigate(`/curator/tasks-for-verification/${idBlock}${idTask}`)
    }

    function declineClickHandler(){
        setIsDeclineOpen(!isDeclineOpen)
    }

    function acceptClickHandler(){
        dispatch(checkTask({employeeId: selectedTask.employee.id, taskId: selectedTask.id, isApproved: true}))
    }

    function declinebuttonClickHandler(){
        dispatch(checkTask({employeeId: selectedTask.employee.id, taskId: selectedTask.id, isApproved: false}))
        setIsDeclineOpen(!isDeclineOpen)
    }

    function closeDialog(){
        setIsDeclineOpen(!isDeclineOpen)
    }

    return ( 
        <>
            <div className="task-for-verification-block">
                <ul className="task-for-verification-list">
                    {TaskForVerification.map(task => <TaskConstructorTasks key={String(task.planet_id) + String(task.id)} currentTaskId={String(task.planet_id) + String(task.id) === String(selectedTask.planet_id) + String(selectedTask.id)} taskId={task.id} blockId={task.planet_id} icon={task.employee.image_url} name={task.employee.name} date={task.updated_at} isCanDelete={false} onClickElement={taskClickHandler}/>)}
                </ul>
                <div className="task-approve-content">
                    {selectedTask &&<> <TaskData id={selectedTask.id} planetId={selectedTask.planet_id} currentAnswer={selectedTask.employee_answer} taskStatus={selectedTask.task_status} name={selectedTask.name} data={selectedTask.description} isApprovePage={true}/>
                                    <div className="task-approve-buttons">
                                        <button className="approve-button" onClick={acceptClickHandler}>Принять</button>
                                        <button onClick={declineClickHandler} className="decline-button">Отклонить</button>
                                    </div>
                                    </>
                    }
                </div>
            </div>
            {isDeclineOpen && <DeclineTask onDeclineClick={declinebuttonClickHandler} onDialogClick={declineClickHandler}/>}
            {isDeclineOpen && <div onClick={closeDialog} className={"backdrop"}></div>}
        </>
     );
}

export default TaskForVerification;