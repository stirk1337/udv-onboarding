type TaskProps = {
    id:string
    difficulty: number
    taskClick: (id: number) => void
}

function Task({id, difficulty, taskClick}:TaskProps){
    return ( 
        <div>
            <button onClick={() => taskClick(Number(id))}>
                <p>{difficulty} звезда</p>
                <img src="" alt="Задача" width={182} height={181}></img>
            </button>
        </div>
     );
}

export default Task;