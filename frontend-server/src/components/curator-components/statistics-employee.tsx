type StatisticEmployeesProps = {
    avatar: string,
    name: string,
    completedTasks: string[],
    clickExit: (id:number) => void
}

function StatisticEmployee({avatar, name, completedTasks, clickExit}: StatisticEmployeesProps) {
    return ( 
        <div className="employee-data">
            <div className="useful-links-header">
                <button onClick={() => clickExit(0)}>
                    <img src="/close-dialog-icon.svg" alt="закрыть окно" width={67} height={40}></img>
                </button>
                <p>Статистика сотрудника</p>
            </div>
            <div className="employee-data-header">
                <img src={avatar} alt=""></img>
                <p>{name}</p>
            </div>
            <div className="employee-data-container">
                <div>
                    <p>Прошёл:</p>
                    <ul>
                        {completedTasks.map((task) => <li>{task}</li>)}
                    </ul>
                </div>
                <button className="decline-button">Деактивировать</button>
            </div>
        </div>
     );
}

export default StatisticEmployee;