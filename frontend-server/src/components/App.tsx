import LoginPage from "../pages/login-page"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import MainPage from "../pages/main-page"
import AuthChecker from "./auth-checker"
import TaskConstructor from "./curator-components/task-constructor"
import CuratorPageLayout from "./curator-components/curator-page-layout"
import TaskEditor from "./curator-components/task-editor"
import TaskBlock from "./user-components/task-block"
import TaskForVerification from "./curator-components/task-for-verification"
import Personal from "./curator-components/personal"
import { useAppSelector } from "./hooks"
import { store } from "./store"
import { getCurrentUserInfo } from "./store/api-actions/get-actions"
import { useEffect } from "react"
import HistoryRouter from "./history-route"
import browserHistory from "../browser-history"
import { UserRoles } from "../types"

function App() {
  useEffect(() => {
    store.dispatch(getCurrentUserInfo())
  }, [])
  const isRegistered = useAppSelector((state) => state.authorizationStatus);
  const userRole = useAppSelector((state) => state.userData.role);

  return (
    <HistoryRouter history={browserHistory}>
      <Routes>
        <Route path="/">
          <Route index element={
            <Navigate to='/login'></Navigate>
          }/>
          <Route path={`/employee`} element={
            <AuthChecker isAuth={isRegistered} userRole={userRole}>
              <CuratorPageLayout userRole={userRole}/>
            </AuthChecker>
          }>
            <Route index element={
              <MainPage isAuth={isRegistered} userRole={userRole}/>
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
          <Route path="/login" element={<LoginPage isAuth={isRegistered}/>}/>
        </Route>
      </Routes>
    </HistoryRouter>
  )
}

export default App
