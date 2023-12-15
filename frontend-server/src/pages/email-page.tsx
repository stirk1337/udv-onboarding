import { ChangeEvent, SyntheticEvent, useState } from "react";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import InputComponent from "../components/input-component";
import { store } from "../components/store";
import { forgotPassword, loginAction } from "../components/store/api-actions/post-actions";
import { useAppDispatch, useAppSelector } from "../components/hooks";
import { UserRoles } from "../types";

function LoginPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    let [email, setEmail] = useState('')
    let [isEmailSend, setIsEmailSend] = useState(false)

    function handleEmail(evt: ChangeEvent<HTMLInputElement>){
      setEmail(evt.target.value)
    }

    function handleSubmit(evt: SyntheticEvent){
        evt.preventDefault()
        const data = {
          email: email,
        }
        dispatch(forgotPassword(data))
        setIsEmailSend(true)
    }

    return ( 
        <div className="enter-page">
            <img src="/logo.svg" alt="" width={299} height={57}></img>
            {isEmailSend 
            ? 
                <>
                    <p className="message"><b>Мы отправили вам инструкции 
                    по смене пароля на почту: <br></br><br></br>   {email} </b></p>
                    <button onClick={() => navigate('/login')} className="send-button">Назад</button>
                </>
            :
            <form onSubmit={handleSubmit}>
                <div className="solo-input">
                    <InputComponent name="Почта" icon='/email-icon.svg' value={email} placeholder='Введите почту' type='email' onchange={handleEmail}/>
                </div>
                <div className="assistance-block">
                    <span className="error-message"></span>
                </div>
                <button type="submit" className="send-button">Отправить</button>
            </form>}
        </div>
     );
}

export default LoginPage;