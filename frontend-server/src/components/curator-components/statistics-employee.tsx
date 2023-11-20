import { BACKEND_URL } from "../services/api";

type StatisticEmployeesProps = {
    id: number;
    avatar: string,
    name: string,
    completedTasks: string[],
    clickExit: (id:number) => void
    onDelete: (id:number) => void
}

function StatisticEmployee({id, onDelete, avatar, name, completedTasks, clickExit}: StatisticEmployeesProps) {
    return ( 
        <div className="employee-data">
            <div className="useful-links-header">
                <button onClick={() => clickExit(-1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                            <path d="M29 2L2 29M2.00006 2L29 29" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                </button>
                <p>Статистика сотрудника</p>
            </div>
            <div className="employee-data-header">
                <img className="profile-logo" src={avatar ? BACKEND_URL + '/' + avatar : '/profile-logo.png'} alt=""></img>
                <p>{name}</p>
            </div>
            <div className="employee-data-container">
                <div>
                    <p>Прошёл:</p>
                    <ul>
                        {completedTasks.map((task) => <li>{task}</li>)}
                    </ul>
                </div>
                <button className="decline-button" onClick={()=> onDelete(id)}>Деактивировать</button>
            </div>
        </div>
     );
}

export default StatisticEmployee;