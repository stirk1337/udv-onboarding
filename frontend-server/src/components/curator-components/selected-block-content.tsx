import { Link, useNavigate } from "react-router-dom";
import { PersonalData } from "../../mocks/constructor-data";
import AddedEmployee from "./added-employee";
import TaskConstructorTasks from "./task-constructor-tasks";
import { UserOnPlanetData } from "../../types";
import { useAppDispatch, useAppSelector } from "../hooks";
import { ChangeEvent, useEffect, useState } from "react";
import { changePlanetName } from "../store/action";
import { updatePlanetName } from "../store/api-actions/patch-action";
import { getEmployees } from "../store/api-actions/get-actions";
import SelectOneEmployeeForm from "./select-one-employee-form";
import SelectGroupForm from "./select-group-form";

type SelectedBlockContentProps = {
    personalList: UserOnPlanetData[],
    idBlock: number,
    blockName: string,
    numberTask: number,
}

function SelectedBlockContent({numberTask, personalList, idBlock, blockName}: SelectedBlockContentProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [name, setName] = useState(blockName);

    useEffect(() => {
        dispatch(getEmployees())
        setName(blockName)
    }, [idBlock])

    const [isSoloSelection, setIsSoloSelection] = useState(true)

    function blockNameHandler(evt: ChangeEvent<HTMLInputElement>){
        setName(evt.target.value);
    }

    return ( 
        <div className="selected-block-content">
            <div className="selected-bock-header">
                <input className="selected-block-name" placeholder="Введите название блока" value={name} onChange={blockNameHandler} onBlur={()=> dispatch(updatePlanetName({name, idBlock}))}></input>
                <p>{numberTask} задач</p>
            </div>
            <div className="selected-block-data">
                <div className="add-task-form-flex">
                    <p className="header-task-form">Добавление в блок</p>
                    <div className="add-task-form">
                        <div className="add-task-form-choice">
                            <p className={isSoloSelection ? 'active-select' : ''} onClick={() => setIsSoloSelection(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                    <path d="M16.0271 14.4972L11.6987 12.1019C13.3074 10.8374 13.7443 8.35249 13.7443 6.95924V4.05913C13.7443 2.13877 11.1903 0 8.62492 0C6.06024 0 3.4385 2.13911 3.4385 4.05913V6.95924C3.4385 8.22609 3.97506 10.789 5.60031 12.0909L1.16014 14.4972C1.16014 14.4972 0 15.0136 0 15.6575V17.398C0 18.0384 0.520408 18.5583 1.16014 18.5583H16.0271C16.6675 18.5583 17.1879 18.0384 17.1879 17.398V15.6576C17.1879 14.9749 16.0271 14.4972 16.0271 14.4972ZM15.813 17.1847H1.37502V15.9567C1.47368 15.8849 1.61152 15.8018 1.72014 15.752C1.75243 15.7373 1.78474 15.7218 1.81534 15.7043L6.25583 13.2983C6.66076 13.0789 6.92923 12.672 6.97013 12.2139C7.01104 11.7557 6.81957 11.3069 6.4607 11.0191C5.30778 10.0957 4.81382 8.05033 4.81382 6.95931V4.05919C4.81382 3.07257 6.67554 1.37371 8.62526 1.37371C10.6111 1.37371 12.3697 3.04924 12.3697 4.05919V6.95931C12.3697 8.03522 12.0352 10.0895 10.8489 11.0219C10.6701 11.1625 10.529 11.3453 10.4382 11.5538C10.3474 11.7623 10.3097 11.99 10.3285 12.2166C10.3477 12.4431 10.4227 12.6613 10.5468 12.8517C10.671 13.0422 10.8405 13.1989 11.0401 13.308L15.3685 15.7033C15.4067 15.7242 15.4551 15.7469 15.4954 15.7644C15.5968 15.8073 15.7215 15.8791 15.813 15.9423V17.1847Z" fill="white"/>
                                </svg>
                                Сотрудник
                            </p>
                            <p className={!isSoloSelection ? 'active-select' : ''} onClick={() => setIsSoloSelection(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                    <path d="M16.0271 17.9389L11.6987 15.5435C13.3074 14.2791 13.7443 11.7941 13.7443 10.4009V7.50078C13.7443 5.58042 11.1903 3.44165 8.62492 3.44165C6.06024 3.44165 3.4385 5.58077 3.4385 7.50078V10.4009C3.4385 11.6677 3.97506 14.2306 5.60031 15.5325L1.16014 17.9388C1.16014 17.9388 0 18.4553 0 19.0992V20.8396C0 21.4801 0.520408 22 1.16014 22H16.0271C16.6675 22 17.1879 21.4801 17.1879 20.8396V19.0992C17.1879 18.4165 16.0271 17.9388 16.0271 17.9388L16.0271 17.9389ZM15.813 20.6264H1.37502V19.3984C1.47368 19.3266 1.61152 19.2435 1.72014 19.1937C1.75243 19.1789 1.78474 19.1635 1.81534 19.1459L6.25583 16.74C6.66076 16.5206 6.92923 16.1136 6.97013 15.6555C7.01104 15.1974 6.81957 14.7486 6.4607 14.4608C5.30778 13.5373 4.81382 11.492 4.81382 10.401V7.50085C4.81382 6.51422 6.67554 4.81536 8.62526 4.81536C10.6111 4.81536 12.3697 6.49089 12.3697 7.50085V10.401C12.3697 11.4769 12.0352 13.5312 10.8489 14.4635C10.6701 14.6042 10.529 14.7869 10.4382 14.9954C10.3474 15.2039 10.3097 15.4317 10.3285 15.6583C10.3477 15.8847 10.4227 16.1029 10.5468 16.2934C10.671 16.4838 10.8405 16.6406 11.0401 16.7496L15.3685 19.1449C15.4067 19.1659 15.4551 19.1885 15.4954 19.2061C15.5968 19.249 15.7215 19.3207 15.813 19.3839V20.6264ZM20.8389 14.5188L16.4461 12.1235C18.0549 10.859 18.5564 8.37412 18.5564 6.98088V4.08076C18.5564 2.1604 15.9381 0 13.3727 0C11.7056 0 10.0009 0.905577 9.00888 2.0653C9.57471 2.10031 10.1986 2.10102 10.7376 2.27272C11.4618 1.70918 12.3783 1.37401 13.3727 1.37401C15.3585 1.37401 17.1814 3.07079 17.1814 4.08113V6.98124C17.1814 8.05713 16.7826 10.1114 15.5964 11.0438C15.4176 11.1845 15.2765 11.3672 15.1856 11.5757C15.0948 11.7842 15.0571 12.0119 15.076 12.2385C15.0951 12.465 15.1701 12.6832 15.2943 12.8737C15.4185 13.0641 15.5879 13.2209 15.7875 13.3299L20.1803 15.7252C20.2184 15.7461 20.2669 15.7688 20.3071 15.7863C20.4085 15.8293 20.5333 15.901 20.6247 15.9642V17.1857H17.8493C18.2683 17.5017 18.3952 17.9536 18.5578 18.5594H20.8392C21.4796 18.5594 22 18.0394 22 17.399V15.6798C21.9997 14.9965 20.8389 14.5188 20.8389 14.5188L20.8389 14.5188Z" fill="white"/>
                                </svg>
                                Группа
                            </p>
                        </div>
                        {isSoloSelection ? <SelectOneEmployeeForm idBlock={idBlock}/> : <SelectGroupForm idBlock={idBlock}/>}
                    </div>
                </div>
                <div className="added-employee-block">
                    <p className="header-task-form">Добавленные сотрудники</p>
                    <ul className="added-employee-list">
                        {personalList.map(employee => <AddedEmployee key={employee.id} id={employee.id} avatar={"profile-logo.png"} data={employee.name}/>)}
                    </ul>
                    <button className="button-to-tasks" onClick={() => navigate(`/curator/tasks/${idBlock}`)}>
                        Перейти к задачам
                    </button>
                </div>
            </div>
        </div>
     );
}

export default SelectedBlockContent;