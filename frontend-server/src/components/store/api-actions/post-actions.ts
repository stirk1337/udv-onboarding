import { AxiosInstance } from "axios";
import { AppDispatch, State } from "..";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Id, Login, Planet, PlanetTask } from "../../../types";
import { changeCurrentTask, logOut, login, redirectToRoute } from "../action";
import { getCurrentUserInfo, getEmployees, getPlanet, getPlanetCuratorTasks, getPlanets } from "./get-actions";
import { Token } from "../../services/api";

export const loginAction = createAsyncThunk<void, Login, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/login',
    async (data, {dispatch, extra: api}) => {
      const {data: tokenData} = await api.post<Token>('/auth/jwt/login', data, {headers: {
        'Content-Type': 'multipart/form-data'
      }});
      localStorage.setItem('token', JSON.stringify(tokenData.access_token));
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
            localStorage.setItem('token', '');
            dispatch(login(false));
            dispatch(logOut())
            dispatch(redirectToRoute(`/login`));
        } catch {
            dispatch(login(false));
        }
    },
  );

  export const createPlanet = createAsyncThunk<void, Id, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'planet/createPlanet',
    async (id, {dispatch, extra: api}) => {
        try {
          const {data: planet} = await api.post<Planet>(`/planet/create_planet`, {name: 'Название планеты', image: 'planet' + id})
            dispatch(getPlanets())
            dispatch(getPlanet(planet.id))
        } catch {
            dispatch(login(false));
        }
    },
  );

  export const createTask = createAsyncThunk<void, {id: number, imageId: number}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'planet/createTask',
    async (data, {dispatch, extra: api}) => {
        try {
          const {data: planet} = await api.post<PlanetTask>(`/task/create_task?planet_id=${data.id}`, {name: 'Название этапа', description: '', image: 'octopus' + data.imageId})
            dispatch(getPlanetCuratorTasks(data.id))
            dispatch(changeCurrentTask(planet))
        } catch {
            dispatch(login(false));
        }
    },
  );

  export const registerNewEmployee = createAsyncThunk<boolean, {email: string, name: string, product: string, productRole: string}, {
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
          return true;
        } catch {
          return false;
        }
    },
  );

  
  export const forgotPassword = createAsyncThunk<void, {email: string}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/forgotPassword',
    async (data, {dispatch, extra: api}) => {
        try {
          await api.post<PlanetTask>(`/auth/forgot-password`, {email: data.email})
        } catch {
          dispatch(login(false));
        }
    },
  );

  export const newPassword = createAsyncThunk<boolean, {token: string, password: string}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/newPassword',
    async (data, {extra: api}) => {
          await api.post<PlanetTask>(`/auth/reset-password`, {token: data.token, password: data.password})
          return true
    },
  );