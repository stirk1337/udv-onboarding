import { useEffect } from "react";
import { BACKEND_URL } from "../services/api";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getEmployeePlanetsForCurator } from "../store/api-actions/get-actions";
import ProgressBarComponent from "../user-components/progress-bar";
import { UserOnPlanetData } from "../../types";

type StatisticEmployeesProps = {
    currentEmployee: UserOnPlanetData
    isOpen: boolean
    clickExit: (id:number) => void
    onDelete: (id:number) => void
}

function StatisticEmployee({currentEmployee, onDelete, isOpen, clickExit}: StatisticEmployeesProps) {
    const dispatch = useAppDispatch()
    const progressData = useAppSelector((state) => state.employeeProgressPlanets)
    console.log(progressData)

    useEffect(() => {
        if(isOpen){
            dispatch(getEmployeePlanetsForCurator(currentEmployee.id))
        }
    }, [isOpen])

    return ( 
        <div className="employee-data" style = {{
            opacity: !isOpen ? "0" : "1",
            transition: "all .5s",
            visibility: !isOpen ? "hidden" : "visible",
          }}>
            {isOpen &&<><div className="useful-links-header">
                <button onClick={() => clickExit(-1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                            <path d="M29 2L2 29M2.00006 2L29 29" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                </button>
                <p>Статистика сотрудника</p>
            </div>
            <div className="employee-data-header">
                <img className="profile-logo" src={currentEmployee.image_url ? BACKEND_URL + '/' + currentEmployee.image_url : '/profile-logo.png'} alt=""></img>
                <p>{currentEmployee.name}</p>
                <button className="decline-button" onClick={()=> onDelete(currentEmployee.id)}>Деактивировать</button>
            </div>
            <div className="employee-data-container">
                <div>
                    <p>Прогресс:</p>
                    <ul>
                        {progressData.map((planet) => 
                        <li>
                            <img src={`/planet-gif/${planet.icon}.gif`} width={50} height={50} alt=""></img>
                            <div className="employee-progress-data">
                                <p>{planet.name.length >= 50 ? planet.name.slice(0, 30) + '...' : planet.name}</p>
                                <ProgressBarComponent percentage={planet.percentage}/> {planet.percentage}%
                            </div>
                        </li>)}
                    </ul>
                </div>
            </div></>}
        </div>
     );
}

export default StatisticEmployee;