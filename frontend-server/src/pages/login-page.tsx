import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputComponent from "../components/input-component";
import { loginAction } from "../components/store/api-actions/post-actions";
import { useAppDispatch } from "../components/hooks";
import { errors } from "../const-data";

function LoginPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    let [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
      const handleStorage = () => {
        const error = localStorage.getItem('error') || ''
        setErrorMessage(errors[error])
      }
    
      window.addEventListener('storage', handleStorage)
      return () => window.removeEventListener('storage', handleStorage)
    }, [])
    

    function handleEmail(evt: ChangeEvent<HTMLInputElement>){
      setErrorMessage('')
      setEmail(evt.target.value)
    }

    function handlePassword(evt: ChangeEvent<HTMLInputElement>){
      setErrorMessage('')
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
                  <InputComponent name="Email" icon='email-icon.svg' value={email} placeholder='Введите email' type='email' onchange={handleEmail}/>
                  <InputComponent name="Пароль" icon='password-icon.svg' value={password} placeholder='Введите пароль' type="password" onchange={handlePassword}/>
                  <span className="error-message">{errorMessage}</span>
                <div className="assistance-block">
                  <button className="forget-password-button" type="button" onClick={() => navigate('/login/forgot-password')}>Забыли пароль?</button>
                </div>
                <button type="submit" className="send-button">Войти</button>
            </form>
        </div>
     );
}

export default LoginPage;