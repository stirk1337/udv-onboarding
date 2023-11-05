import Task from "./task";
import TaskData from "./task-data";
import { BlockData } from "../mocks/planet";
import { useState } from "react";

type TaskBlockProps = {
    currentIdBlock: number;
}

function TaskBlock({currentIdBlock}: TaskBlockProps) {
    const [currentIdTask, setCurrentIdTask] = useState(0)
    const tasks = BlockData[currentIdBlock].tasks

    function taskClickHandler(id: number){
        setCurrentIdTask(id - 1)
    }

    return ( 
        <div>
            {tasks.map(task => <Task key={task.id} id={task.id} difficulty={task.difficulty} taskClick={taskClickHandler}/>)}
            <TaskData name={tasks[currentIdTask].name} data={tasks[currentIdTask].data}/>
        </div>
     );
}

export default TaskBlock;