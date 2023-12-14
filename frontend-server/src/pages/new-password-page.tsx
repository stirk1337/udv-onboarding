import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import InputComponent from "../components/input-component";
import { store } from "../components/store";
import { loginAction, newPassword } from "../components/store/api-actions/post-actions";
import { useAppDispatch, useAppSelector } from "../components/hooks";
import { UserRoles } from "../types";
import { errors } from "../const-data";

function NewPasswordPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    
    const [searchParams, setSearchParams] = useSearchParams();

    let [password, setPassword] = useState('')
    let [againPassword, setAgainPassword] = useState('')
    let [errorMessage, setErrorMessage] = useState('')
    let [newPasswordIsSend, setNewPasswordIsSend] = useState(false)

    useEffect(() => {
        const handleStorage = () => {
          const error = localStorage.getItem('error') || ''
          console.log(error)
          setErrorMessage(errors[error])
        }
      
        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
      }, [])

    function handlePassword(evt: ChangeEvent<HTMLInputElement>){
        setPassword(evt.target.value)
        setErrorMessage('')
    }

    function handleAgainPassword(evt: ChangeEvent<HTMLInputElement>){
        setAgainPassword(evt.target.value)
        setErrorMessage('')
    }

    async function handleSubmit(evt: SyntheticEvent){
        evt.preventDefault()
        setSearchParams(location.search)
        const data = {
          token: searchParams.get('token') || '',
          password: password
        }
        if(password !== againPassword){
            setErrorMessage('Пароли не совпадают')
        }
        else if(password.length < 8){
            setErrorMessage('Пароль должен быть хотя бы 8 символов')
        }
        else if(password.length > 100){
            setErrorMessage('Длинный пароль')
        }
        else if(!errorMessage){
            const isValid = await dispatch(newPassword(data))
            if(isValid.payload){
                setNewPasswordIsSend(true)
            }
        }
    }

    return ( 
        <div className="enter-page">
            <img src="/logo.svg" alt="" width={299} height={57}></img>
            {newPasswordIsSend 
            ? 
                <>
                    <div className="message">
                        <p><b>Сброс пароля выполнен успешно!</b></p>
                        <br></br>
                        <p>Ваш новый пароль установлен. Теперь вы можете войти на странице входа.</p>
                    </div>
                    <button className="send-button" onClick={() => navigate('/login')}>Вход</button>
                </>
            :
            <form onSubmit={handleSubmit}>
                <InputComponent name="Новый пароль" icon='/password-icon.svg' value={password} placeholder='Придумайте пароль' type='password' onchange={handlePassword}/>
                <InputComponent name="Повторите новый пароль" icon='/password-icon.svg' value={againPassword} placeholder='Повторите пароль' type="password" onchange={handleAgainPassword}/>
                <div className="assistance-block">
                <span className="error-message">{errorMessage}</span>
                </div>
                <button type="submit" className="send-button">Сохранить</button>
            </form>}
        </div>
     );
}

export default NewPasswordPage;