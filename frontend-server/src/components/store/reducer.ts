import { createReducer } from '@reduxjs/toolkit';
import { changeCurrentTask, changePlanetName, changeTaskData, clearCurrentPlanet, clearCurrentTask, logOut, login, setAchievements, setCompletedPlanets, setEmployees, setErrorMessage, setNotifications, setPercentageCompletedPlanets, setPlanet, setPlanetTasks, setPlanets, setTaskForVerification, setUserData } from './action';
import { Achievement, CuratorPlanetData, EmployeePlanets, NotificationType, Planet, PlanetTask, PlanetTaskForVerification, TaskStatus, UserData, UserOnPlanetData, UserRoles } from '../../types';

type InitialState = {
  authorizationStatus: boolean;
  userData: UserData;
  planets: Planet[];
  currentPlanet: CuratorPlanetData
  planetTasks: PlanetTask[];
  employees: UserOnPlanetData[];
  currentTask: PlanetTask;
  taskForVerification: PlanetTaskForVerification[]
  notifications: NotificationType[],
  achievements: Achievement[]
  percentage: number
  completedPlanets: EmployeePlanets[];
  errorMessage: string;
}

const initialState: InitialState = {
  authorizationStatus: false,
  userData: {
    id: -1,
    name: '',
    email: '',
    role: UserRoles.undefined,
    image_url: '',
    contact: '',
    curator: null,
  },
  planets: [],
  currentPlanet: {
    id: -1,
    name: '',
    curator_id: -1,
    created_at: '',
    updated_at: '',
    employees: [],
    task_count: 0,
    image: '',
    pos: 0,
  },
  planetTasks: [],
  employees: [],
  currentTask: {
    id: -1,
    name: '',
    description: '',
    planet_id: -1,
    employee_answer: '',
    curator_answer: '',
    task_status: TaskStatus.inProgress,
    created_at: '',
    updated_at: '',
    image: '',
  },
  taskForVerification: [],
  notifications: [],
  achievements: [],
  percentage: 0,
  completedPlanets: [],
  errorMessage: ''
};

export const reducer = createReducer(initialState, (builder) => {
    builder
      .addCase(login,(state,action) => {
        state.authorizationStatus = action.payload;
      })
      .addCase(logOut,() => {
          return initialState
      })
      .addCase(setUserData,(state,action) => {
        state.userData = action.payload;
      })
      .addCase(setPlanets,(state,action) => {
        state.planets = action.payload;
      })
      .addCase(setPlanetTasks,(state,action) => {
        state.planetTasks = action.payload;
      })
      .addCase(setPlanet,(state,action) => {
        console.log(action.payload)
        const tasks = action.payload.task_count
        if(tasks) {
          state.currentPlanet = action.payload;
        }
        else{
          state.currentPlanet = action.payload;
          state.currentPlanet.task_count = tasks
        }
      })
      .addCase(clearCurrentPlanet,(state) => {
        state.currentPlanet = initialState.currentPlanet
      })
      .addCase(clearCurrentTask,(state) => {
        state.currentTask.id = -1
      })
      .addCase(changeCurrentTask,(state,action) => {
        state.currentTask = action.payload
      })
      .addCase(changePlanetName,(state, action) => {
        const index = state.planets.findIndex(planet => planet.id === action.payload.idBlock);
        state.planets[index].name = action.payload.name
      })
      .addCase(setEmployees,(state, action) => {
        state.employees = action.payload.filter(employee => !state.currentPlanet.employees.find(currentEmployee => currentEmployee.id === employee.id));
      })
      .addCase(changeTaskData,(state, action) => {
        const index = state.planetTasks.findIndex(task => task.id === action.payload.idTask);
        state.planetTasks[index].name = action.payload.name
        state.planetTasks[index].description = action.payload.description
      })
      .addCase(setTaskForVerification,(state, action) => {
        state.taskForVerification = action.payload
      })
      .addCase(setNotifications,(state, action) => {
        state.notifications = action.payload
      })
      .addCase(setAchievements,(state, action) => {
        state.achievements = action.payload
      })
      .addCase(setPercentageCompletedPlanets,(state, action) => {
        state.percentage = action.payload
      })
      .addCase(setCompletedPlanets,(state, action) => {
        state.completedPlanets = action.payload
      })
      .addCase(setErrorMessage,(state, action) => {
        state.errorMessage = action.payload
      })
});