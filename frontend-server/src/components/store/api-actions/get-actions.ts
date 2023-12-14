import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, State } from "..";
import { AxiosInstance, AxiosRequestConfig } from "axios";
import { login, redirectToRoute, setAchievements, setCompletedPlanets, setEmployees, setNotifications, setPercentageCompletedPlanets, setPlanet, setPlanetTasks, setPlanets, setTaskForVerification, setUserData } from "../action";
import { Planet, UserData, Id, PlanetTask, TaskStatus, CuratorPlanetData, UserOnPlanetData, PlanetTaskForVerification, NotificationType, Achievement, EmployeePlanets } from "../../../types";

export const getCurrentUserInfo = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/get-current-user-info',
    async (_arg, {dispatch, extra: api}) => {
      console.log('www')
      try {
        const {data} = await api.get<UserData>('/user/get_current_user_info');
        console.log(data)
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

  export const getPlanetTasks = createAsyncThunk<PlanetTask[], Id, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/get-planet-with-status',
    async (id, {dispatch, extra: api}) => {
        const {data: tasks} = await api.get<PlanetTask[]>(`/task/get_tasks_with_status`, {params: {planet_id: id}});
        dispatch(setPlanetTasks(tasks))
        let task = tasks.find(task => task.task_status === TaskStatus.completed)
        if(task === undefined){
            task = tasks[0]
        }
        console.log(id)
        if(!task){
          dispatch(redirectToRoute(`/employee/planet/${id}`));
        }
        else if(location.pathname.split('/').length === 2){
          dispatch(redirectToRoute(`/employee/planet/${id}/${task.id}`));
        }
        return tasks
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

  export const getTasksBeingChecked = createAsyncThunk<PlanetTaskForVerification[], undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/getTasksBeingChecked',
    async (_arg, {dispatch, extra: api}) => {
        const {data: taskData} = await api.get<PlanetTaskForVerification[]>(`/task/get_tasks_being_checked`);
        dispatch(setTaskForVerification(taskData))
        const currentTask = taskData[0]
        if(location.pathname.split('/').length === 3 && currentTask){
          dispatch(redirectToRoute(`/curator/tasks-for-verification/${currentTask.planet_id}${currentTask.id}`))
        }
        else if(!currentTask){
          dispatch(redirectToRoute(`/curator/tasks-for-verification`))
        }
        return taskData
    },
  );

  export const getNotifications = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/getNotifications',
    async (_arg, {dispatch, extra: api}) => {
      try {
        const {data: notificationData} = await api.get<NotificationType[]>(`/notification/get_notifications`);
        dispatch(setNotifications(notificationData))
      } catch {
        dispatch(login(false));
      }
    },
  );

  export const getAchievements = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'achievements/getAchievements',
    async (_arg, {dispatch, extra: api}) => {
      try {
        const {data: achievementsData} = await api.get<Achievement[]>(`/achievement/get_achievements`);
        dispatch(setAchievements(achievementsData))
      } catch {
        dispatch(login(false));
      }
    },
  );

  export const getEmployeePlanets = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'achievements/getAchievements',
    async (_arg, {dispatch, extra: api}) => {
      try {
        const {data: planetsData} = await api.get<EmployeePlanets[]>(`/planet/get_employee_planets`);
        let allTasks = 0
        let completed = 0
        planetsData.forEach(element => {
          allTasks += element.task_count
          completed += element.completed
        });
        if(allTasks){
          dispatch(setPercentageCompletedPlanets(Math.round(completed / allTasks * 100)));
        }
        else{
          dispatch(setPercentageCompletedPlanets(0));
        }
      } catch {
        dispatch(login(false));
      }
    },
  );

  export const getProgressPlanetsTasks = createAsyncThunk<PlanetTask[], Id, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'tasks/getProgressPlanetsTasks',
    async (id, {extra: api}) => {
      const {data: tasks} = await api.get<PlanetTask[]>(`/task/get_tasks_with_status`, {params: {planet_id: id}});
      return tasks
    });

    export const getEmployeePlanetsForCurator = createAsyncThunk<void, Id, {
      dispatch: AppDispatch;
      state: State;
      extra: AxiosInstance;
    }>(
      'tasks/getEmployeePlanetsForCurator',
      async (id, {dispatch, extra: api}) => {
        try {
          const {data: planetsData} = await api.get<EmployeePlanets[]>(`/planet/get_employee_planets_by_employee_id?employee_id=${id}`);
          const CompletedPlanets = planetsData.filter(planet => planet.completed === planet.task_count);
          dispatch(setCompletedPlanets(CompletedPlanets));
        } catch {
          dispatch(login(false));
        }
      });