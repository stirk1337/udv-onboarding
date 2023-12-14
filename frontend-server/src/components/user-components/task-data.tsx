import { ChangeEvent, useEffect, useState } from "react";
import { TaskStatus } from "../../types";
import { useDispatch } from "react-redux";
import { updateAnswerTask } from "../store/api-actions/patch-action";
import { store } from "../store";
import { getPlanetTasks } from "../store/api-actions/get-actions";

type TaskDataProps = {
    id: number;
    planetId: number;
    name: string;
    data: string;
    currentAnswer: string | null;
    curatorAnswer: string | null;
    taskStatus: string
    isApprovePage?: boolean
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

function TaskData({id, curatorAnswer, planetId, name, data, currentAnswer, taskStatus, isApprovePage=false}: TaskDataProps) {
    const [answer, setAnswer] = useState(currentAnswer !== null ? currentAnswer : '')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        setErrorMessage('')
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

    function handleAnswer(evt: ChangeEvent<HTMLTextAreaElement>){
        const userAnswer = evt.target.value
        setAnswer(evt.target.value)
        if(userAnswer.length > 1000){
            setErrorMessage('Превышен лимит комментария')
        }
        else{
            setErrorMessage('')
        }
    }

    function handleSubmit(evt: any){
        evt.preventDefault()
        const data = {
          answer: answer,
          task_id: id,
          planet_id: planetId
        }
        if(!errorMessage){
            store.dispatch(updateAnswerTask(data))
        }
    }

    return ( 
        <>
            <p className="task-name">{name}</p>
            <div style={curatorAnswer ? {height: '64%'}: {height:'74%'}} className="task-data" dangerouslySetInnerHTML={{__html: data}}></div>
            {!isApprovePage ?
                        <form onSubmit={handleSubmit} className="task-comments">
                            <label htmlFor="comment"><p>Введите комментарий к этапу:</p></label>
                            <div className="user-answer">
                                <textarea autoComplete="off" value={answer} onChange={handleAnswer} id="comment"></textarea>
                                <span className='error-message'>{errorMessage}</span>
                            </div>
                            {curatorAnswer &&
                                <>
                                    <p>Комментарий Куратора:</p>
                                    <div id="comment">{curatorAnswer}</div>
                                </>
                            }
                            {!isApprovePage && !errorMessage && <button type="submit" disabled={buttonInfo[0] !== 'approve-button'} className={buttonInfo[0]}>{buttonInfo[1]}</button>}
                        </form>
                            :
                        <div className="task-comments">
                            <p>Комментарий к этапу:</p>
                            <div id="comment">{answer}</div>
                            {curatorAnswer &&
                                <>
                                    <p>Ваш комментарий:</p>
                                    <div id="comment">{curatorAnswer}</div>
                                </>
                            }
                            {!isApprovePage && <button type="submit" className={buttonInfo[0]}>{buttonInfo[1]}</button>}
                        </div>
            }
        </>
     );
}

export default TaskData;