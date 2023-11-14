import { useState } from "react";
import { ApprovesData } from "../../mocks/approve-task";
import TaskConstructorTasks from "./task-constructor-tasks";
import TaskData from "../user-components/task-data";
import DeclineTask from "./decline-task";

function TaskForVerification() {
    const [currentIdBlockConstructor, setCurrentIdApproveTask] = useState(-1)
    const [isDeclineOpen, setIsDeclineOpen] = useState(false)

    const selectedTask = ApprovesData[currentIdBlockConstructor]
    function taskClickHandler(id: number){
        console.log('uwu')
        setCurrentIdApproveTask(id - 1)
    }

    function declineClickHandler(){
        setIsDeclineOpen(!isDeclineOpen)
    }

    return ( 
        <div className="task-for-verification-block">
            <ul className="task-for-verification-list">
                {ApprovesData.map(task => <TaskConstructorTasks key={task.id} id={task.id} icon={task.icon} name={task.sender} date={task.date} isCanDelete={false} onClickElement={taskClickHandler}/>)}
            </ul>
            <div className="task-approve-content">
                {selectedTask &&<> <TaskData name={selectedTask.name} data={selectedTask.data}/>
                                <div className="task-approve-buttons">
                                    <button className="approve-button">Принять</button>
                                    <button onClick={declineClickHandler} className="decline-button">Отклонить</button>
                                </div>
                                </>
                }
            </div>
            {isDeclineOpen && <DeclineTask onDialogClick={declineClickHandler}/>}
        </div>
     );
}

export default TaskForVerification;