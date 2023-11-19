import { UserOnPlanetData } from "../../types";

type EmployeeTableProps = {
    employeeData: UserOnPlanetData
    onClickEmployee: (id: number) => void
}

function EmployeeTable({employeeData, onClickEmployee}: EmployeeTableProps) {
    const convertedDate = employeeData.created_at.split('T')[0].split('-'); 

    return ( 
        <tr>
            <td>{`${convertedDate[2]}.${convertedDate[1]}.${convertedDate[0]}`}</td>
            <td>{employeeData.name}</td>
            <td>{employeeData.email}</td>
            <td>{employeeData.product}</td>
            <td>{employeeData.product_role}</td>
            <td><button onClick={() => onClickEmployee(Number(employeeData.id))} className="approve-button">Подробнее</button></td>
        </tr>
    );
}

export default EmployeeTable;