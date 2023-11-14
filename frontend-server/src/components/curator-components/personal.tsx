import { useState } from "react";
import { PersonalData, PersonalDataT } from "../../mocks/personal";
import AddEmployeeForm from "./add-employee-form";
import EmployeeTable from "./employee-table";
import StatisticEmployee from "./statistics-employee";

function Personal() {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState(-1)

    let personalList = PersonalData[selectedEmployee]

    function dialogClickHandler(){
        setIsFormOpen(!isFormOpen)
    }

    function employeeClick(id: number){
        setSelectedEmployee(id - 1)
    }
    
    return ( 
        <div className="personal-block">
            <div className="personal-block-header">
                <input placeholder="Найти сотрудника"></input>
                <button onClick={dialogClickHandler}><img src="/add-icon.svg" alt="Добавить сотрудника"/></button>
            </div>
            <table>
                <tr>
                    <th>Добавлен</th>
                    <th>Фио сотрудника</th>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>{null}</th>
                </tr>
                {PersonalData.map(employee => <EmployeeTable key={employee.id} onClickEmployee={employeeClick} employeeData={employee}/>)}
            </table>
            {isFormOpen && <AddEmployeeForm onDialogClick={dialogClickHandler}/>}
            {selectedEmployee !== -1 && <StatisticEmployee avatar={personalList.avatar} name={personalList.name} completedTasks={personalList.completedTasks} clickExit={employeeClick}/>}
        </div>
     );
}

export default Personal;