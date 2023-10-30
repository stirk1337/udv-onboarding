type TaskDataProps = {
    name: string;
    data: string;
}

function TaskData({name, data}: TaskDataProps) {
    return ( 
        <>
            <h2>{name}</h2>
            <div dangerouslySetInnerHTML={{__html: data}}></div>
        </>
     );
}

export default TaskData;