import { createReducer } from '@reduxjs/toolkit';
import { changePlanetName, changeTaskData, clearCurrentPlanet, logOut, login, setEmployees, setPlanet, setPlanetTasks, setPlanets, setUserData } from './action';
import { CuratorPlanetData, Planet, PlanetTasks, UserData, UserOnPlanetData, UserRoles } from '../../types';

type InitialState = {
  authorizationStatus: boolean;
  userData: UserData;
  planets: Planet[];
  currentPlanet: CuratorPlanetData
  planetTasks: PlanetTasks[];
  employees: UserOnPlanetData[];
}

const initialState: InitialState = {
  authorizationStatus: false,
  userData: {
    id: -1,
    name: '',
    email: '',
    role: UserRoles.undefined,
  },
  planets: [],
  currentPlanet: {
    id: -1,
    name: '',
    curator_id: -1,
    created_at: '',
    updated_at: '',
    employees: [],
    tasks: []
  },
  planetTasks: [],
  employees: [],
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
        state.currentPlanet = action.payload;
      })
      .addCase(clearCurrentPlanet,(state) => {
        state.currentPlanet.id = -1
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