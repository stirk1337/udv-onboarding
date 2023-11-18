import { ChangeEvent, useEffect, useState } from "react";
import { PersonalData, PersonalDataT } from "../../mocks/personal";
import AddEmployeeForm from "./add-employee-form";
import EmployeeTable from "./employee-table";
import StatisticEmployee from "./statistics-employee";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getEmployees } from "../store/api-actions/get-actions";
import { SortTypes, UserOnPlanetData } from "../../types";
import { disableEmployee } from "../store/api-actions/patch-action";
import { clearCurrentPlanet } from "../store/action";

function Personal() {
    const dispatch = useAppDispatch()
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState(-1)
    const [sortType, setSortType] = useState<SortTypes>(SortTypes.created_at)
    const [isSortAdded, setIsSortAdded] = useState('1')
    const [isSortName, setIsSortName] = useState('0')
    const [isSortEmail, setIsSortEmail] = useState('0')
    const [isSortProduct, setIsSortProduct] = useState('0')
    const [isSortRole, setIsSortRole] = useState('0')
    const [searchValue, setSearchValue] = useState('')

    let personalData:UserOnPlanetData[] = searchFinder(sortPersonal(useAppSelector((state) => state.employees)))
    let currentEmployee = personalData[selectedEmployee]
    console.log(isSortAdded, isSortName, isSortEmail, isSortProduct, isSortRole)

    useEffect(() => {
        dispatch(clearCurrentPlanet())
        dispatch(getEmployees())
    }, [])

    function sortPersonal(personalData: UserOnPlanetData[]){
        let array = personalData
        if(isSortAdded !== '0' || isSortName !== '0' || isSortEmail !== '0' || isSortProduct !== '0' || isSortRole !== '0'){
            array = [...personalData].sort((a, b) => a[sortType] > b[sortType] ? 1 : -1)
            if(isSortAdded === '2' || isSortName === '2' || isSortEmail === '2' || isSortProduct === '2' || isSortRole === '2'){ 
                return array.reverse()
            }
        }
        return array
    }

    function sortHandler(sortTypeNew: SortTypes){
        sortType === sortTypeNew && isSortAdded === '1' ? setIsSortAdded('2') : setIsSortAdded('0')
        sortType === sortTypeNew && isSortName === '1' ? setIsSortName('2') : setIsSortName('0')
        sortType === sortTypeNew && isSortEmail === '1' ? setIsSortEmail('2') : setIsSortEmail('0')
        sortType === sortTypeNew && isSortProduct === '1' ? setIsSortProduct('2') : setIsSortProduct('0')
        sortType === sortTypeNew && isSortRole === '1' ? setIsSortRole('2') : setIsSortRole('0')

        sortTypeNew === SortTypes.created_at && isSortAdded === '0' && setIsSortAdded('1')
        sortTypeNew === SortTypes.name && isSortName === '0' && setIsSortName('1')
        sortTypeNew === SortTypes.email && isSortEmail === '0' && setIsSortEmail('1')
        sortTypeNew === SortTypes.product && isSortProduct === '0' && setIsSortProduct('1')
        sortTypeNew === SortTypes.product_role && isSortRole === '0' && setIsSortRole('1')

        setSortType(sortTypeNew)
    }

    function searchHandler(evt: ChangeEvent<HTMLInputElement>) {
        setSearchValue(evt.target.value)
    }

    function searchFinder(personalData: UserOnPlanetData[]){
        if(searchValue === ''){
            return personalData
        }
        const array = personalData.filter(data => data.email.toLowerCase().includes(searchValue.toLowerCase()) || data.name.toLowerCase().includes(searchValue.toLowerCase()))
        if(array){
            return array
        }
        else{
            return []
        }
    }

    function dialogClickHandler(){
        setIsFormOpen(!isFormOpen)
    }

    function employeeClick(id: number){
        setSelectedEmployee(id - 1)
    }

    function deleteEmployee(id: number){
        setSelectedEmployee(-1)
        dispatch(disableEmployee(id))
    }
    
    return ( 
        <div className="personal-block">
            <div className="personal-block-header">
                <input placeholder="Найти сотрудника" value={searchValue} onChange={searchHandler}></input>
                <button onClick={dialogClickHandler}><img src="/add-icon.svg" alt="Добавить сотрудника"/></button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => sortHandler(SortTypes.created_at)}>Добавлен</th>
                        <th onClick={() => sortHandler(SortTypes.name )}>Фио сотрудника</th>
                        <th onClick={() => sortHandler(SortTypes.email)}>Email</th>
                        <th onClick={() => sortHandler(SortTypes.product)}>Продукт</th>
                        <th onClick={() => sortHandler(SortTypes.product_role)}>Роль</th>
                        <th>{null}</th>
                    </tr>
                </thead>
                <tbody>
                    {personalData.filter(employee => employee.employee_status !== 'disabled').map(employee => <EmployeeTable key={employee.id} onClickEmployee={employeeClick} employeeData={employee}/>)}
                </tbody>
            </table>
            {isFormOpen && <AddEmployeeForm onDialogClick={dialogClickHandler}/>}
            {selectedEmployee !== -1 && <StatisticEmployee avatar={"/profile-logo.png"} id={currentEmployee.id} name={currentEmployee.name} completedTasks={[]} onDelete={deleteEmployee} clickExit={employeeClick}/>}
        </div>
     );
}

export default Personal;