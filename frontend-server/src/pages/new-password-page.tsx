import { ChangeEvent, SyntheticEvent, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import InputComponent from "../components/input-component";
import { store } from "../components/store";
import { loginAction, newPassword } from "../components/store/api-actions/post-actions";
import { useAppDispatch, useAppSelector } from "../components/hooks";
import { UserRoles } from "../types";

function NewPasswordPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    
    const [searchParams, setSearchParams] = useSearchParams();

    let [password, setPassword] = useState('')
    let [againPassword, setAgainPassword] = useState('')
    let [errorMessage, setErrorMessage] = useState('')
    let [newPasswordIsSend, setNewPasswordIsSend] = useState(false)

    function handlePassword(evt: ChangeEvent<HTMLInputElement>){
        setPassword(evt.target.value)
        setErrorMessage('')
    }

    function handleAgainPassword(evt: ChangeEvent<HTMLInputElement>){
        setAgainPassword(evt.target.value)
        setErrorMessage('')
    }

    function handleSubmit(evt: SyntheticEvent){
        evt.preventDefault()
        setSearchParams(location.search)
        const data = {
          token: searchParams.get('token') || '',
          password: password
        }
        if(password !== againPassword){
            setErrorMessage('Пароли не совпадают')
        }
        else{
            dispatch(newPassword(data))
            setNewPasswordIsSend(true)
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