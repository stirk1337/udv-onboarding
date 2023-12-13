import { ChangeEvent, useState } from "react";

type DeclineTaskProps = {
    onDialogClick: () => void
    onDeclineClick: (message: string) => void
}

function DeclineTask({onDialogClick, onDeclineClick}: DeclineTaskProps) {
    const [message, setMessage] = useState('')

    function onMessageHandler(evt: ChangeEvent<HTMLTextAreaElement>){
        setMessage(evt.target.value)
    }


    return ( 
        <div className="decline-comment-dialog">
            <div onClick={onDialogClick} className="useful-links-header">
                <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                            <path d="M29 2L2 29M2.00006 2L29 29" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                </button>
                <p>Причина отказа</p>
            </div>
            <textarea placeholder="Введите причину отказа" value={message} onChange={onMessageHandler}></textarea>
            <button onClick={() => onDeclineClick(message)} className="decline-button">Отклонить</button>
        </div>
     );
}

export default DeclineTask;