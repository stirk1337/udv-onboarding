import { createReducer } from '@reduxjs/toolkit';

type InitalState = {
}

const initialState: InitalState = {
};

export const reducer = createReducer(initialState, (builder) => {
    builder
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