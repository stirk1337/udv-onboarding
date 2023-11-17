import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { updateEmployeeToPlanet } from "../store/api-actions/patch-action";

type SelectedBlockContentProps = {
    idBlock: number,
}

function SelectOneEmployeeForm({idBlock}: SelectedBlockContentProps) {

    const dispatch = useAppDispatch()
    const employees = useAppSelector((state) => state.employees);
    const [employee, setEmployee] = useState('')
    const [employeeId, setEmployeeId] = useState(-1)
    console.log(employee)

    useEffect(() => {
        setEmployee('')
    }, [idBlock])

    function employeeSelectHandler(evt: ChangeEvent<HTMLSelectElement>){
        setEmployee(evt.target.value);
        setEmployeeId(Number(evt.target.value));
    }

    function submitHandle(evt: SyntheticEvent){
        evt.preventDefault()
        setEmployee('')
        setEmployeeId(-1)
        dispatch(updateEmployeeToPlanet({employeeId: employeeId, planetId: idBlock}))
    }
    
    return ( 
        <form onSubmit={submitHandle}>
            <select required name="Выбор сотрудника" value={employee} onChange={employeeSelectHandler}>
                <option value="" disabled>Выбор сотрудника</option>
                {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
            </select>
            <button type="submit">Отправить</button>
        </form>
     );
}

export default SelectOneEmployeeForm;