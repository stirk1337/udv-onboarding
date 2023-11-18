import { useEffect, useState } from "react";
import { ApprovesData } from "../../mocks/approve-task";
import TaskConstructorTasks from "./task-constructor-tasks";
import TaskData from "../user-components/task-data";
import DeclineTask from "./decline-task";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getTasksBeingChecked } from "../store/api-actions/get-actions";
import { checkTask } from "../store/api-actions/patch-action";

function TaskForVerification() {
    const dispatch = useAppDispatch();
    const TaskForVerification = useAppSelector((state) => state.taskForVerification);
    const [currentIdBlockConstructor, setCurrentIdApproveTask] = useState(-1)
    const [currentIdEmployee, setCurrentIdEmployee] = useState(-1)
    const [isDeclineOpen, setIsDeclineOpen] = useState(false)

    useEffect(() => {
        dispatch(getTasksBeingChecked())
    },[])

    const selectedTask = TaskForVerification.find(task => task.employee.id === currentIdEmployee && task.id === currentIdBlockConstructor) || TaskForVerification[0]
    console.log(TaskForVerification)
    function taskClickHandler(evt: React.MouseEvent<HTMLLIElement>, idEmployee: number, idBlock: number){
        setCurrentIdEmployee(idEmployee)
        setCurrentIdApproveTask(idBlock)
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

    return ( 
        <div className="task-for-verification-block">
            <ul className="task-for-verification-list">
                {TaskForVerification.map(task => <TaskConstructorTasks key={task.id + task.planet_id + task.employee.name} taskId={task.employee.id} blockId={task.id} icon={"/monster-icon.svg"} name={task.employee.name} date={task.updated_at} isCanDelete={false} onClickElement={taskClickHandler}/>)}
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
            {isDeclineOpen && <DeclineTask onDeclineClick={declinebuttonClickHandler} onDialogClick={declineClickHandler}/>}
        </div>
     );
}

export default TaskForVerification;