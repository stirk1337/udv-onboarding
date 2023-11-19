import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, State } from "..";
import { AxiosInstance, AxiosRequestConfig } from "axios";
import { login, redirectToRoute, setEmployees, setPlanet, setPlanetTasks, setPlanets, setTaskForVerification, setUserData } from "../action";
import { Planet, UserData, Id, PlanetTask, TaskStatus, CuratorPlanetData, UserOnPlanetData, PlanetTaskForVerification } from "../../../types";

export const getCurrentUserInfo = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/get-current-user-info',
    async (_arg, {dispatch, extra: api}) => {
      try {
        const {data} = await api.get<UserData>('/user/get_current_user_info');
        dispatch(setUserData(data))
        dispatch(login(true))
        dispatch(getPlanets())
      } catch {
        dispatch(login(false));
      }
    },
  );

  export const getPlanets = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/get-planets',
    async (_arg, {dispatch, extra: api}) => {
      try {
        const {data: data} = await api.get<Planet[]>('/planet/get_planets');
        dispatch(setPlanets(data))
      } catch {
        dispatch(login(false));
      }
    },
  );

  export const getPlanetTasks = createAsyncThunk<void, Id, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/get-planet-with-status',
    async (id, {dispatch, extra: api}) => {
      try {
        const {data: tasks} = await api.get<PlanetTask[]>(`/task/get_tasks_with_status`, {params: {planet_id: id}});
        dispatch(setPlanetTasks(tasks))
        let task = tasks.find(task => task.task_status === TaskStatus.completed)
        if(task === undefined){
            task = tasks[0]
        }
        if(location.pathname.split('/').length === 2){
            dispatch(redirectToRoute(`employee/${id}/${task.id}`));
        }
      } catch {
        dispatch(login(false));
      }
    },
  );

  export const getPlanetCuratorTasks = createAsyncThunk<void, Id, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/get-planet-curator-tasks',
    async (id, {dispatch, extra: api}) => {
      try {
        const {data: tasks} = await api.get<PlanetTask[]>(`/task/get_tasks`, {params: {planet_id: id}});
        dispatch(setPlanetTasks(tasks))
      } catch {
        dispatch(login(false));
      }
    },
  );

  export const getPlanet = createAsyncThunk<void, Id, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/get-planet',
    async (id, {dispatch, extra: api}) => {
      try {
        const {data: planetData} = await api.get<CuratorPlanetData>(`/planet/get_planet`, {params: {planet_id: id}});
        dispatch(setPlanet(planetData))
      } catch {
        dispatch(login(false));
      }
    },
  );

  export const getEmployees = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/get-employees',
    async (_arg, {dispatch, extra: api}) => {
      try {
        const {data: employeesData} = await api.get<UserOnPlanetData[]>(`/user/get_employees`);
        dispatch(setEmployees(employeesData))
      } catch {
        dispatch(login(false));
      }
    },
  );

  export const getTasksBeingChecked = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/getTasksBeingChecked',
    async (_arg, {dispatch, extra: api}) => {
      try {
        const {data: taskData} = await api.get<PlanetTaskForVerification[]>(`/task/get_tasks_being_checked`);
        dispatch(setTaskForVerification(taskData))
      } catch {
        dispatch(login(false));
      }
    },
  );