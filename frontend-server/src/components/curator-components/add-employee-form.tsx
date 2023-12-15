import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react"
import { ProductRoles, Products } from "../../types";
import { useAppDispatch } from "../hooks";
import { registerNewEmployee } from "../store/api-actions/post-actions";
import { errors } from "../../const-data";
import InputComponent from "../input-component";

type AddEmployeeFormProps = {
    onDialogClick: () => void
    isOpen: boolean
}

function AddEmployeeForm({onDialogClick, isOpen}: AddEmployeeFormProps) {

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
        const name = evt.target.value
        setName(name)
        if(name.length > 100){
            setErrorMessage('Слишком длинное ФИО')
        }
        else{
            setErrorMessage('')
        }
    }

    function emailChangeHandler(evt: ChangeEvent<HTMLInputElement>){
        const email = evt.target.value
        setEmail(email)
        const emailParts = email.split('@')
        if(emailParts[0].length > 64 || (emailParts[1] && emailParts[1].length > 255)){
            setErrorMessage('Слишком длинный email')
        }
        else{
            setErrorMessage('')
        }
    }

    function productSelectHandler(evt: ChangeEvent<HTMLSelectElement>){
        setProduct(evt.target.value)
    }

    function roleSelectHandler(evt: ChangeEvent<HTMLSelectElement>){
        setRole(evt.target.value)
    }

    async function submitHandle(evt: SyntheticEvent){
        evt.preventDefault();
        const emailParts = email.split('@')
        if(name.length <= 100 && emailParts[0].length <= 64 && emailParts[1].length <= 255){
            const isValid = await dispatch(registerNewEmployee({email: email, name: name, product: product, productRole: role}))
            if(isValid.payload){
                onDialogClick()
            }
        }
        else{
            if(name.length > 100){
                setErrorMessage('Слишком длинное ФИО')
            }
            else{
                setErrorMessage('Слишком длинный email')
            }
        }
    }

    return ( 
        <div className="add-employee-form" style={{
            opacity: !isOpen ? "0" : "1",
            transition: "all .5s",
            visibility: !isOpen ? "hidden" : "visible",
          }}>
                <div className="useful-links-header">
                    <button onClick={onDialogClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                            <path d="M29 2L2 29M2.00006 2L29 29" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <p>Добавить нового сотрудника</p>
                </div>
                <form onSubmit={submitHandle}>
                    <InputComponent name="" icon='/name-employee-icon.svg' value={name} placeholder='Фио сотрудника' type='text' onchange={nameChangeHandler}/>
                    <InputComponent name="" icon='/email-icon.svg' value={email} placeholder='Email сотрудника' type='email' onchange={emailChangeHandler}/>
                    <div className="add-employee-select-block">
                        <img src="/product-icon.svg" alt="" width={26} height={26}></img>
                        <select name="Выбор продукта" required value={product} onChange={productSelectHandler}>
                            <option value="" disabled>Выбор продукта</option>
                            {(Object.values(Products) as Array<keyof typeof Products>).map((product) => <option key={product} value={product}>{product}</option>)}
                        </select>
                    </div>
                    <div className="add-employee-select-block">
                        <img src="/role-icon.svg" alt="" width={26} height={26}></img>
                        <select name="Выбор роли" required value={role} onChange={roleSelectHandler}>
                            <option value="" disabled>Выбор роли</option>
                            {(Object.values(ProductRoles) as Array<keyof typeof ProductRoles>).map((role) => <option key={role} value={role}>{role}</option>)}
                        </select>
                    </div>
                    <span className="error-message">{errorMessage}</span>
                    <button className="send-button" type="submit">Отправить</button>
                </form>
            </div>
     );
}

export default AddEmployeeForm;