import LoginPage from "../pages/login-page"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import MainPage from "../pages/main-page"
import TaskConstructor from "./curator-components/task-constructor"
import CuratorPageLayout from "./curator-components/curator-page-layout"
import TaskEditor from "./curator-components/task-editor"
import TaskBlock from "./user-components/task-block"
import TaskForVerification from "./curator-components/task-for-verification"
import Personal from "./curator-components/personal"
import { useAppSelector } from "./hooks"
import { store } from "./store"
import { getCurrentUserInfo, getNotifications } from "./store/api-actions/get-actions"
import { useEffect } from "react"
import HistoryRouter from "./history-route"
import browserHistory from "../browser-history"
import { UserRoles } from "../types"
import { useLocalStorage } from "@uidotdev/usehooks"

function App() {
  const isRegistered = useAppSelector((state) => state.authorizationStatus);
  const userRole = useAppSelector((state) => state.userData.role);
  const tasks = useAppSelector((state) => state.planetTasks);
  useEffect(() => {
    store.dispatch(getCurrentUserInfo())

  }, [])

  return (
    <HistoryRouter history={browserHistory}>
      <Routes>
        <Route path="/">
          <Route path={`/employee`} element={
              <CuratorPageLayout userRole={userRole}/>
          }>
            <Route index element={
              <MainPage/>
            }/>
            <Route path=":planetId/:taskId" element={<TaskBlock tasks={tasks}/>}/>
          </Route>

          <Route path="/curator" element={
              <CuratorPageLayout userRole={userRole}/>
          }>
            <Route index element={<TaskConstructor/>}/>
            <Route path="tasks-for-verification" element={<TaskForVerification/>}/>
            <Route path="tasks-for-verification/:id" element={<TaskForVerification/>}/>
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
