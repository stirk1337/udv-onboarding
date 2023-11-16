import { ChangeEvent, useEffect, useState } from "react";
import { TaskStatus } from "../../types";
import { useDispatch } from "react-redux";
import { UpdateAnswerTask } from "../store/api-actions/patch-action";
import { store } from "../store";
import { getPlanetTasks } from "../store/api-actions/get-actions";

type TaskDataProps = {
    id: number;
    planetId: number;
    name: string;
    data: string;
    currentAnswer: string | null;
    taskStatus: string
}

enum ButtonClasses{
    completedButton = 'completed-button',
    beingChecked = 'being-checked',
    inProgress = 'approve-button'
}

enum ButtonsContent {
    completedButton = 'Выполнено',
    beingChecked = 'Отправлено',
    inProgress = 'Завершить'
}

function TaskData({id, planetId, name, data, currentAnswer, taskStatus}: TaskDataProps) {
    const [answer, setAnswer] = useState(currentAnswer !== null ? currentAnswer : '')

    useEffect(() => {
        setAnswer(currentAnswer !== null ? currentAnswer : '')
    }, [id])

    const buttonInfo = getStyleForButton(taskStatus);
    
    function getStyleForButton(taskStatus: String){
        console.log(taskStatus)
        if(taskStatus === TaskStatus.completed){
            return [ButtonClasses.completedButton, ButtonsContent.completedButton]
        }
        else if(taskStatus === TaskStatus.beingChecked){
            return [ButtonClasses.beingChecked, ButtonsContent.beingChecked]
        }
        else{
            return [ButtonClasses.inProgress, ButtonsContent.inProgress]
        }
    }

    function handleAnswer(evt: ChangeEvent<HTMLInputElement>){
        setAnswer(evt.target.value)
    }

    function handleSubmit(evt: any){
        evt.preventDefault()
        const data = {
          answer: answer,
          task_id: id,
          planet_id: planetId
        }
        store.dispatch(UpdateAnswerTask(data))
    }

    return ( 
        <>
            <p className="task-name">{name}</p>
            <div className="task-data" dangerouslySetInnerHTML={{__html: data}}></div>
            <form onSubmit={handleSubmit} className="task-comments">
                <label htmlFor="comment"><p>Введите комментарий к задаче:</p></label>
                <input type="text" value={answer} onChange={handleAnswer} id="comment"></input>
                <button type="submit" className={buttonInfo[0]}>{buttonInfo[1]}</button>
            </form>
        </>
     );
}

export default TaskData;