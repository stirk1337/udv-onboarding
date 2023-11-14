type TaskDataProps = {
    name: string;
    data: string;
}

function TaskData({name, data}: TaskDataProps) {
    return ( 
        <>
            <p className="task-name">{name}</p>
            <div className="task-data" dangerouslySetInnerHTML={{__html: data}}></div>
            <div className="task-comments">
                <label htmlFor="comment"><p>Введите ответ:</p></label>
                <input type="text" id="comment"></input>
            </div>
        </>
     );
}

export default TaskData;