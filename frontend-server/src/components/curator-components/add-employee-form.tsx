import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react"
import { ProductRoles, Products } from "../../types";
import { useAppDispatch } from "../hooks";
import { registerNewEmployee } from "../store/api-actions/post-actions";
import { errors } from "../../const-data";

type AddEmployeeFormProps = {
    onDialogClick: () => void
}

function AddEmployeeForm({onDialogClick}: AddEmployeeFormProps) {

    const dispatch = useAppDispatch()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [product, setProduct] = useState('')
    const [role, setRole] = useState('')
    let [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
      const handleStorage = () => {
        const error = localStorage.getItem('error') || ''
        if(error){
            setErrorMessage(errors['EMPLOYEE_WITH_EMAIL_IS_ACTIVE'])
        }
        else{
            setErrorMessage(errors[error])
        }
      }
    
      window.addEventListener('storage', handleStorage)
      return () => window.removeEventListener('storage', handleStorage)
    }, [])

    function nameChangeHandler(evt: ChangeEvent<HTMLInputElement>){
        setName(evt.target.value)
    }

    function emailChangeHandler(evt: ChangeEvent<HTMLInputElement>){
        setEmail(evt.target.value)
        setErrorMessage('')
    }

    function productSelectHandler(evt: ChangeEvent<HTMLSelectElement>){
        setProduct(evt.target.value)
    }

    function roleSelectHandler(evt: ChangeEvent<HTMLSelectElement>){
        setRole(evt.target.value)
    }

    async function submitHandle(evt: SyntheticEvent){
        evt.preventDefault();
        const isValid = await dispatch(registerNewEmployee({email: email, name: name, product: product, productRole: role}))
        console.log(isValid.payload)
        if(isValid.payload){
            onDialogClick()
        }
    }

    return ( 
        <div className="add-employee-form">
                <div className="useful-links-header">
                    <button onClick={onDialogClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                            <path d="M29 2L2 29M2.00006 2L29 29" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <p>Добавить нового сотрудника</p>
                </div>
                <form onSubmit={submitHandle}>
                    <input required value={name} onChange={nameChangeHandler} placeholder="Фио сотрудника"></input>
                    <input required type="email" value={email} onChange={emailChangeHandler} placeholder="Email сотрудника"></input>
                    <select name="Выбор продукта" required value={product} onChange={productSelectHandler}>
                        <option value="" disabled>Выбор продукта</option>
                        {(Object.values(Products) as Array<keyof typeof Products>).map((product) => <option key={product} value={product}>{product}</option>)}
                    </select>
                    <select name="Выбор роли" required value={role} onChange={roleSelectHandler}>
                        <option value="" disabled>Выбор роли</option>
                        {(Object.values(ProductRoles) as Array<keyof typeof ProductRoles>).map((role) => <option key={role} value={role}>{role}</option>)}
                    </select>
                    <span className="error-message">{errorMessage}</span>
                    <button className="send-button" type="submit">Отправить</button>
                </form>
            </div>
     );
}

export default AddEmployeeForm;