import { createReducer } from '@reduxjs/toolkit';
import { changeCurrentTask, changePlanetName, changeTaskData, clearCurrentPlanet, clearCurrentTask, logOut, login, setEmployees, setPlanet, setPlanetTasks, setPlanets, setTaskForVerification, setUserData } from './action';
import { CuratorPlanetData, Planet, PlanetTask, PlanetTaskForVerification, TaskStatus, UserData, UserOnPlanetData, UserRoles } from '../../types';

type InitialState = {
  authorizationStatus: boolean;
  userData: UserData;
  planets: Planet[];
  currentPlanet: CuratorPlanetData
  planetTasks: PlanetTask[];
  employees: UserOnPlanetData[];
  currentTask: PlanetTask;
  taskForVerification: PlanetTaskForVerification[]
}

const initialState: InitialState = {
  authorizationStatus: false,
  userData: {
    id: -1,
    name: '',
    email: '',
    role: UserRoles.undefined,
    image_url: ''
  },
  planets: [],
  currentPlanet: {
    id: -1,
    name: '',
    curator_id: -1,
    created_at: '',
    updated_at: '',
    employees: [],
    task_count: 0
  },
  planetTasks: [],
  employees: [],
  currentTask: {
    id: -1,
    name: '',
    description: '',
    planet_id: -1,
    employee_answer: '',
    task_status: TaskStatus.inProgress,
    created_at: '',
    updated_at: '',
  },
  taskForVerification: []
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
        const tasks = action.payload.task_count
        if(tasks) {
          state.currentPlanet = action.payload;
        }
        else{
          state.currentPlanet = action.payload;
          state.currentPlanet.task_count = tasks
        }
        console.log(tasks)
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
});

/*export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeGenre, (state, action) => {
      const {genre} = action.payload;
      state.genre = genre;
    })
    .addCase(changeListFilmsByGenre, (state) => {
      if(state.genre === 'All genres'){
        state.filmByGenre = FilmList;
      } else{
        state.filmByGenre = FilmList.filter((film) => film.genre === state.genre);
      }
    });
});*/