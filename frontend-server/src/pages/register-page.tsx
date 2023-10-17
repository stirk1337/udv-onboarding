import axios from "axios";
import { ChangeEvent, useState } from "react";

function RegisterPage({changeRegistered}: any) {
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
        axios.post('http://localhost/api/v1/auth/register', {
            email: email,
            password: password
          })
          .then(function (response) {
            console.log(response);
            changeRegistered()
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    return ( 
        <>
            <h1>Регистрация</h1>
            <form>
                <label htmlFor="email">Введите почту</label>
                <input type="text" name="email" value={email} onChange={handleUserData}></input>
                <label htmlFor="password">Введите пароль</label>
                <input type="text" name="password" value={password} onChange={handleUserData}></input>
                <button type="submit" onClick={handleSubmit}>Зарегестрироваться</button>
            </form>
        </>
     );
}

export default RegisterPage;