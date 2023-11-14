import { useState } from "react"

type AddEmployeeFormProps = {
    onDialogClick: () => void
}

function AddEmployeeForm({onDialogClick}: AddEmployeeFormProps) {

    return ( 
        <div className="add-employee-form">
                <div className="useful-links-header">
                    <button onClick={onDialogClick}>
                        <img src="/close-dialog-icon.svg" alt="закрыть окно" width={67} height={40}></img>
                    </button>
                    <p>Добавить нового сотрудника</p>
                </div>
                <form>
                    <input placeholder="Фио сотрудника"></input>
                    <input placeholder="Email сотрудника"></input>
                    <select>
                        <option value="" disabled selected>Выбор команды</option>
                        <option>Дизайн</option>
                        <option>Бэк</option>
                    </select>
                    <select>
                        <option value="" disabled selected>Выбор продукта</option>
                        <option>Дизайн</option>
                        <option>Бэк</option>
                    </select>
                    <select>
                        <option value="" disabled selected>Выбор роли</option>
                        <option>Дизайн</option>
                        <option>Бэк</option>
                    </select>
                    <button type="submit">Отправить</button>
                </form>
            </div>
     );
}

export default AddEmployeeForm;