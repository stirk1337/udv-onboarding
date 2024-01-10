import LoginPage from "../pages/login-page"
import { Route, Routes } from "react-router-dom"
import TaskConstructor from "./curator-components/task-constructor"
import CuratorPageLayout from "./curator-components/curator-page-layout"
import TaskEditor from "./curator-components/task-editor"
import TaskBlock from "./user-components/task-block"
import Personal from "./curator-components/personal"
import { useAppSelector } from "./hooks"
import { store } from "./store"
import { getCurrentUserInfo } from "./store/api-actions/get-actions"
import { useEffect } from "react"
import HistoryRouter from "./history-route"
import browserHistory from "../browser-history"
import NewPasswordPage from "../pages/new-password-page"
import EmailPage from "../pages/email-page"
import NotFoundPage from "../pages/not-found-page"
import TaskForVerification from "./curator-components/task-for-verification"
import Content from "./user-components/content"

function App() {
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
              <Content />
            }/>
            <Route path="planet/:planetId" element={<TaskBlock tasks={tasks}/>}/>
            <Route path="planet/:planetId/:taskId" element={<TaskBlock tasks={tasks}/>}/>
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
          <Route path="/login">
            <Route index element={<LoginPage/>}/>
            <Route path="new-password" element={<NewPasswordPage/>}/>
            <Route path="forgot-password" element={<EmailPage/>}/>
          </Route>
        </Route>
        <Route path='*' element={<NotFoundPage />}/>
      </Routes>
    </HistoryRouter>
  )
}

export default App
