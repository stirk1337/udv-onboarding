import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import InputComponent from "../components/input-component";

type LoginPageProps = {
  onLogin: () => void;
  isAuth: boolean;
}


function LoginPage({onLogin, isAuth}: LoginPageProps) {
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')

    function handleEmail(evt: ChangeEvent<HTMLInputElement>){
      setEmail(evt.target.value)
    }

    function handlePassword(evt: ChangeEvent<HTMLInputElement>){
      setPassword(evt.target.value)
    }

    function handleSubmit(evt: any){
        evt.preventDefault()
        axios.post('http://localhost/api/v1/auth/jwt/login', {
            username : email,
            password: password
          }, {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(function (response) {
            console.log(response);
            onLogin()
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    return ( 
        <div className="enter-page">
            {isAuth && <Navigate to="/"/>}
            <img src="logo.svg" alt="" width={299} height={57}></img>
            <form>
                <InputComponent name="Email" icon='login-icon.svg' value={email} placeholder='Введите email' onchange={handleEmail}/>
                <InputComponent name="Пароль" icon='password-icon.svg' value={password} placeholder='Введите пароль' onchange={handlePassword}/>
                <div className="assistance-block">
                  <span className="error-message"></span>
                  <button className="forget-password-button">Забыли пароль?</button>
                </div>
                <button type="submit" className="send-button" onClick={handleSubmit}>Войти</button>
            </form>
        </div>
     );
}

export default LoginPage;