import { useEffect } from "react";
import { BACKEND_URL } from "../services/api";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getEmployeePlanetsForCurator } from "../store/api-actions/get-actions";

type StatisticEmployeesProps = {
    id: number;
    avatar: string,
    name: string,
    clickExit: (id:number) => void
    onDelete: (id:number) => void
}

function StatisticEmployee({id, onDelete, avatar, name, clickExit}: StatisticEmployeesProps) {
    const dispatch = useAppDispatch()
    const completedPlanets = useAppSelector((state) => state.completedPlanets)

    useEffect(() => {
        dispatch(getEmployeePlanetsForCurator(id))
    })

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
                        {completedPlanets.map((planet) => <li>{planet.name}</li>)}
                    </ul>
                </div>
                <button className="decline-button" onClick={()=> onDelete(id)}>Деактивировать</button>
            </div>
        </div>
     );
}

export default StatisticEmployee;