import { PersonalDataT } from "../../mocks/personal";

type EmployeeTableProps = {
    employeeData: PersonalDataT
    onClickEmployee: (id: number) => void
}

function EmployeeTable({employeeData, onClickEmployee}: EmployeeTableProps) {
    return ( 
        <tr>
            <td>{employeeData.date}</td>
            <td>{employeeData.name}</td>
            <td>{employeeData.email}</td>
            <td>{employeeData.role}</td>
            <td><button onClick={() => onClickEmployee(Number(employeeData.id))} className="approve-button">Подробнее</button></td>
        </tr>
    );
}

export default EmployeeTable;