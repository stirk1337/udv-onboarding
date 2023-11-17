import { AxiosInstance } from "axios";
import { AppDispatch, State } from "..";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Id, Login, Planet, PlanetTask } from "../../../types";
import { changeCurrentTask, logOut, login } from "../action";
import { getCurrentUserInfo, getEmployees, getPlanet, getPlanetTasks, getPlanets } from "./get-actions";

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
          const {data: planet} = await api.post<Planet>(`/planet/create_planet`, {name: null})
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
    async (id, {dispatch, extra: api}) => {
        try {
          const {data: planet} = await api.post<PlanetTask>(`/task/create_task/?planet_id=${id}`, {name: null, description: null})
            dispatch(getPlanetTasks(id))
            dispatch(changeCurrentTask(planet))
        } catch {
            dispatch(login(false));
        }
    },
  );

  export const registerNewEmployee = createAsyncThunk<void, {email: string, name: string, product: string, productRole: string}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/registerNewEmployee',
    async (data, {dispatch, extra: api}) => {
        try {
          const product = data.product.split(' ').join('_')
          const role = data.productRole.split(' ').join('_')
          await api.post<PlanetTask>(`/user/register_new_employee`, {email: data.email, name: data.name, product: product, product_role: role})
          dispatch(getEmployees())
        } catch {
            dispatch(login(false));
        }
    },
  );