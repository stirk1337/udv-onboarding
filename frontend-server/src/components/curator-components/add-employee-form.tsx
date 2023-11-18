import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react"
import { ProductRoles, Products } from "../../types";
import { useAppDispatch } from "../hooks";
import { registerNewEmployee } from "../store/api-actions/post-actions";

type AddEmployeeFormProps = {
    onDialogClick: () => void
}

function AddEmployeeForm({onDialogClick}: AddEmployeeFormProps) {

    const dispatch = useAppDispatch()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [product, setProduct] = useState('')
    const [role, setRole] = useState('')

    function nameChangeHandler(evt: ChangeEvent<HTMLInputElement>){
        setName(evt.target.value)
    }

    function emailChangeHandler(evt: ChangeEvent<HTMLInputElement>){
        setEmail(evt.target.value)
    }

    function productSelectHandler(evt: ChangeEvent<HTMLSelectElement>){
        setProduct(evt.target.value)
    }

    function roleSelectHandler(evt: ChangeEvent<HTMLSelectElement>){
        setRole(evt.target.value)
    }

    function submitHandle(evt: SyntheticEvent){
        evt.preventDefault();
        dispatch(registerNewEmployee({email: email, name: name, product: product, productRole: role}))
        onDialogClick()
    }

    return ( 
        <div className="add-employee-form">
                <div className="useful-links-header">
                    <button onClick={onDialogClick}>
                        <img src="/close-dialog-icon.svg" alt="закрыть окно" width={67} height={40}></img>
                    </button>
                    <p>Добавить нового сотрудника</p>
                </div>
                <form onSubmit={submitHandle}>
                    <input value={name} onChange={nameChangeHandler} placeholder="Фио сотрудника"></input>
                    <input value={email} onChange={emailChangeHandler} placeholder="Email сотрудника"></input>
                    <select name="Выбор продукта" required value={product} onChange={productSelectHandler}>
                        <option value="" disabled>Выбор продукта</option>
                        {(Object.values(Products) as Array<keyof typeof Products>).map((product) => <option key={product} value={product}>{product}</option>)}
                    </select>
                    <select name="Выбор роли" required value={role} onChange={roleSelectHandler}>
                        <option value="" disabled>Выбор роли</option>
                        {(Object.values(ProductRoles) as Array<keyof typeof ProductRoles>).map((role) => <option key={role} value={role}>{role}</option>)}
                    </select>
                    <button type="submit">Отправить</button>
                </form>
            </div>
     );
}

export default AddEmployeeForm;