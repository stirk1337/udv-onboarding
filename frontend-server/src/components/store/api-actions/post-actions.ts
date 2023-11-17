import { AxiosInstance } from "axios";
import { AppDispatch, State } from "..";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Id, Login, Planet } from "../../../types";
import { logOut, login } from "../action";
import { getCurrentUserInfo, getPlanet, getPlanets } from "./get-actions";

export const loginAction = createAsyncThunk<void, Login, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/login',
    async (data, {dispatch, extra: api}) => {
      console.log(data)
      await api.post('/auth/jwt/login', data, {headers: {
        'Content-Type': 'multipart/form-data'
      }});
      dispatch(login(true));
      dispatch(getCurrentUserInfo())
    },
  );

  export const logOutAction = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/log-out',
    async (_arg, {dispatch, extra: api}) => {
        try {
            await api.post('/auth/jwt/logout')
            dispatch(login(false));
            dispatch(logOut())
        } catch {
            dispatch(login(false));
        }
    },
  );

  export const createPlanet = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'planet/createPlanet',
    async (_arg, {dispatch, extra: api}) => {
        try {
          const {data: planet} = await api.post<Planet>(`/planet/create_planet`)
            dispatch(getPlanets())
            dispatch(getPlanet(planet.id))
        } catch {
            dispatch(login(false));
        }
    },
  );

  export const createTask = createAsyncThunk<void, Id, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'planet/createTask',
    async (_arg, {dispatch, extra: api}) => {
        try {
          const {data: planet} = await api.post<Planet>(`/task/create_task`)
            dispatch(getPlanets())
            dispatch(getPlanet(planet.id))
        } catch {
            dispatch(login(false));
        }
    },
  );