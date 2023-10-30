import { useState } from "react"
import LoginPage from "../pages/login-page"
import RegisterPage from "../pages/register-page"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import MainPage from "../pages/main-page"
import AuthChecker from "./auth-checker"
import axios from "axios"
import EnterPage from "../pages/enter-page"


function App() {
  let [isRegistered, setRegisteredData] = useState(true)


  async function checkStatus(): Promise<boolean> {
    let status = false
    await axios.get('http://localhost/api/v1/user/get_current_user_info', {
      withCredentials: true
    })
    .then(function (response) {
      status = true
    })
    .catch(function (error) {
      status = false
    })
    return status
  }

  /*useEffect(() => {
    handleRegisteredUser()
  })*/

  function handleRegisteredUser(){
    checkStatus().then(function(response) {
      setRegisteredData(response)
    })
  }

  return (
      <BrowserRouter>
      <Routes>
        <Route>
            <Route index element={
              //<AuthChecker isAuth={isRegistered}>
                <MainPage
                  onLogin={handleRegisteredUser}
                  isAuth={isRegistered}
                />
              //</AuthChecker>
            }
          />
          <Route path="/enter-page" element={<EnterPage/>}></Route>
          <Route path="/registrations" element={<RegisterPage isAuth={isRegistered}/>}/>
          <Route path="/login" element={<LoginPage isAuth={isRegistered} onLogin={handleRegisteredUser}/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
