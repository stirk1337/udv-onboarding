import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Navigate } from "react-router-dom";

type LoginPageProps = {
  onLogin: () => void;
  isAuth: boolean;
}


function LoginPage({onLogin, isAuth}: LoginPageProps) {
    let [userData, setFormData] = useState({
        email: '',
        password: ''
    })

    let {email, password} = userData

    function handleUserData(evt: ChangeEvent<HTMLInputElement>){
        const {name, value} = evt.target;
        setFormData({...userData, [name]: value});
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
        <>
            {isAuth && <Navigate to="/"/>}
            <h1>Логин</h1>
            <form>
                <label htmlFor="email">Введите почту</label>
                <input type="text" name="email" value={email} onChange={handleUserData}></input>
                <label htmlFor="password">Введите пароль</label>
                <input type="text" name="password" value={password} onChange={handleUserData}></input>
                <button type="submit" onClick={handleSubmit}>Войти</button>
            </form>
        </>
     );
}

export default LoginPage;