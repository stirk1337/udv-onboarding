import { useState } from "react"
import LoginPage from "../pages/login-page"
import RegisterPage from "../pages/register-page"
import LogoutPage from "../pages/logout-page"


function App() {
  let [isRegistered, setRegisteredData] = useState(false)

  function handleRegisteredUser(){
    setRegisteredData(!isRegistered)
  }

  return (
    <>
      {
        isRegistered ? <LoginPage/> : <RegisterPage changeRegistered={handleRegisteredUser}/>
      }
      {
        isRegistered && <LogoutPage changeRegistered={handleRegisteredUser}/>
      }
    </>
  )
}

export default App
