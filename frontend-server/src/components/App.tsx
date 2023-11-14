import { useState } from "react"
import LoginPage from "../pages/login-page"
import RegisterPage from "../pages/register-page"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import MainPage from "../pages/main-page"
import AuthChecker from "./auth-checker"
import axios from "axios"
import EnterPage from "../pages/enter-page"
import TaskConstructor from "./curator-components/task-constructor"
import CuratorPageLayout from "./curator-components/curator-page-layout"
import TaskEditor from "./curator-components/task-editor"
import TaskBlock from "./user-components/task-block"
import TaskForVerification from "./curator-components/task-for-verification"
import Personal from "./curator-components/personal"

function App() {
  let [isRegistered, setRegisteredData] = useState(false)
  let userRole = 'curator'

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
        <Route path="/">
          <Route index element={
            <Navigate to={`/${userRole}`}></Navigate>
          }/>
          <Route path={`/user`} element={
            <AuthChecker isAuth={isRegistered} userRole={userRole}>
              <CuratorPageLayout userRole={userRole}/>
            </AuthChecker>
          }>
            <Route index element={
              <MainPage onLogin={handleRegisteredUser} isAuth={isRegistered} userRole={userRole}/>
            }/>
            <Route path=":planetId/:taskId" element={<TaskBlock/>}/>
          </Route>

          <Route path="/curator" element={
            <AuthChecker isAuth={isRegistered} userRole={userRole}>
              <CuratorPageLayout userRole={userRole}/>
            </AuthChecker>
          }>
            <Route index element={<TaskConstructor/>}/>
            <Route path="tasks-for-verification" element={<TaskForVerification/>}/>
            <Route path="personal" element={<Personal/>}/>
            <Route path="tasks/:id" element={<TaskEditor/>}/>
          </Route>
          <Route path="/enter-page" element={<EnterPage/>}></Route>
          <Route path="/registrations" element={<RegisterPage isAuth={isRegistered}/>}/>
          <Route path="/login" element={<LoginPage isAuth={isRegistered} onLogin={handleRegisteredUser}/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
