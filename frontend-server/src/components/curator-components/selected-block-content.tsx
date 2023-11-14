import { Link, useNavigate } from "react-router-dom";
import { PersonalData } from "../../mocks/constructor-data";
import AddedEmployee from "./added-employee";
import TaskConstructorTasks from "./task-constructor-tasks";

type SelectedBlockContentProps = {
    personalList: PersonalData[],
    idBlock: number
}

function SelectedBlockContent({personalList, idBlock}: SelectedBlockContentProps) {
    const navigate = useNavigate();


    return ( 
        <div className="selected-block-content">
            <input className="selected-block-name" placeholder="Введите название блока"></input>
            <div className="selected-block-data">
                <div className="add-task-form-flex">
                    <p className="header-task-form">Добавление в блок</p>
                    <div className="add-task-form">
                        <div className="add-task-form-choice">
                            <p><img src="group-icon.svg" alt=""/>Группа</p>
                            <p><img src="employee-icon.svg" alt=""/>Сотрудник</p>
                        </div>
                        <form>
                            <select name="Выбор сотрудника">
                                <option value="" disabled selected>Выбор сотрудника</option>
                                <option value="Артём">Артём</option>
                                <option value="Артём">Артём</option>
                                <option value="Артём">Артём</option>
                            </select>
                            <button type="submit">Отправить</button>
                        </form>
                    </div>
                </div>
                <div className="added-employee-block">
                    <p className="header-task-form">Добавленные сотрудники</p>
                    <ul className="added-employee-list">
                        {personalList.map(employee => <AddedEmployee key={employee.id} id={employee.id} avatar={employee.avatar} data={employee.data}/>)}
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