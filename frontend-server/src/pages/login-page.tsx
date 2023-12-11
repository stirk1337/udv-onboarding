import { ChangeEvent, SyntheticEvent, useState } from "react";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import InputComponent from "../components/input-component";
import { store } from "../components/store";
import { loginAction } from "../components/store/api-actions/post-actions";
import { useAppDispatch, useAppSelector } from "../components/hooks";
import { UserRoles } from "../types";

function LoginPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')

    function handleEmail(evt: ChangeEvent<HTMLInputElement>){
      setEmail(evt.target.value)
    }

    function handlePassword(evt: ChangeEvent<HTMLInputElement>){
      setPassword(evt.target.value)
    }

    function handleSubmit(evt: SyntheticEvent){
        evt.preventDefault()
        const data = {
          username: email,
          password: password
        }
        dispatch(loginAction(data))
    }

    return ( 
        <div className="enter-page">
            <img src="logo.svg" alt="" width={299} height={57}></img>
            <form onSubmit={handleSubmit}>
                  <InputComponent name="Email" icon='login-icon.svg' value={email} placeholder='Введите email' type='email' onchange={handleEmail}/>
                  <InputComponent name="Пароль" icon='password-icon.svg' value={password} placeholder='Введите пароль' type="password" onchange={handlePassword}/>
                <div className="assistance-block">
                  <span className="error-message"></span>
                  <button className="forget-password-button" type="button" onClick={() => navigate('/login/forgot-password')}>Забыли пароль?</button>
                </div>
                <button type="submit" className="send-button">Войти</button>
            </form>
        </div>
     );
}

export default LoginPage;