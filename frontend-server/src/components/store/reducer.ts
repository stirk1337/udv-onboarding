import { createReducer } from '@reduxjs/toolkit';
import { login, setPlanetTasks, setPlanets, setUserData } from './action';
import { Planet, PlanetTasks, UserData, UserRoles } from '../../types';

type InitialState = {
  authorizationStatus: boolean;
  userData: UserData;
  planets: Planet[];
  planetTasks: PlanetTasks[];
}

const initialState: InitialState = {
  authorizationStatus: false,
  userData: {
    id: -1,
    name: '',
    email: '',
    role: UserRoles.employee
  },
  planets: [],
  planetTasks: [],
};

export const reducer = createReducer(initialState, (builder) => {
    builder
      .addCase(login,(state,action) => {
        state.authorizationStatus = action.payload;
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