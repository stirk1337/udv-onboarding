type DeclineTaskProps = {
    onDialogClick: () => void
    onDeclineClick: () => void
}

function DeclineTask({onDialogClick, onDeclineClick}: DeclineTaskProps) {
    return ( 
        <div className="decline-comment-dialog">
            <div onClick={onDialogClick} className="useful-links-header">
                <button>
                    <img src="/close-dialog-icon.svg" alt="закрыть окно" width={67} height={40}></img>
                </button>
                <p>Причина отказа</p>
            </div>
            <textarea placeholder="Введите причину отказа"></textarea>
            <button onClick={onDeclineClick} className="decline-button">Отклонить</button>
        </div>
     );
}

export default DeclineTask;