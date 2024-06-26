import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, State } from "..";
import { AxiosInstance } from "axios";
import { changePlanetName, changeTaskData, login } from "../action";
import { CuratorPlanetData, Id, UpdateAnswer } from "../../../types";
import { getCurrentUserInfo, getEmployees, getNotifications, getPlanet, getPlanetTasks, getTasksBeingChecked } from "./get-actions";

export const updateAnswerTask = createAsyncThunk<void, UpdateAnswer, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'task/answerTask',
    async (data, {dispatch, extra: api}) => {
        try {
            await api.patch(`/task/answer_task?task_id=${data.task_id}`, {answer: data.answer});
            dispatch(getPlanetTasks(data.planet_id))
        } catch {
            dispatch(login(false));
        }
    },
  );

  export const updatePlanetName = createAsyncThunk<void, {name: string, idBlock: number}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'task/updatePlanet',
    async (data, {dispatch, extra: api}) => {
        try {
            const name = data.name;
            const idBlock = data.idBlock;
            await api.patch<CuratorPlanetData>(`/planet/update_planet?planet_id=${idBlock}`, {name: name});
            dispatch(changePlanetName({name, idBlock}))
        } catch {
            dispatch(login(false));
        }
    },
  );

  export const updateEmployeeToPlanet = createAsyncThunk<void, {planetId: number, employeeId: number}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'planet/addEmployeeToPlanet',
    async (data, {dispatch, extra: api}) => {
        try {
          await api.patch(`/planet/add_employees_to_planet?planet_id=${data.planetId}`, {employee_ids: [data.employeeId]});
          await dispatch(getPlanet(data.planetId))
          dispatch(getEmployees())
        } catch {
        }
    },
  );

  export const updateGroupToPlanet = createAsyncThunk<void, {product: string, productRole: string, planetId: number}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'planet/addGroupToPlanet',
    async (data, {dispatch, extra: api}) => {
        try {
            const product = data.product !== 'all' ? data.product.split(' ').join('_') : null;
            const role = data.productRole !== 'all' ? data.productRole.split(' ').join('_') : null;
            await api.patch(`/planet/add_employees_to_planet_by_params?planet_id=${data.planetId}`, {product: product, role: role});
            await dispatch(getPlanet(data.planetId))
            dispatch(getEmployees())
        } catch {
            dispatch(login(false));
        }
    },
  );

  export const updateTask = createAsyncThunk<void, {name: string, description: string, taskId: number}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'task/updateTask',
    async (data, {dispatch, extra: api}) => {
        try {
            await api.patch(`/task/update_task?task_id=${data.taskId}`, {description:data.description, name:data.name});
            dispatch(changeTaskData({name: data.name, description: data.description, idTask: data.taskId}))
        } catch {
            dispatch(login(false));
        }
    },
  );

  export const updateEmployeeOnPlanet = createAsyncThunk<void, {planetId: number, employeeId: number}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'planet/updateEmployeeOnPlanet',
    async (data, {dispatch, extra: api}) => {
        try {
          await api.patch(`/planet/remove_employee_from_planet?planet_id=${data.planetId}`, {employee_id: data.employeeId});
          await dispatch(getPlanet(data.planetId))
          dispatch(getEmployees())
        } catch {
            dispatch(login(false));
        }
    },
  );

  export const disableEmployee = createAsyncThunk<void, Id, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/disableEmployee',
    async (id, {dispatch, extra: api}) => {
        try {
          await api.patch(`/user/disable_employee`, {employee_id: id});
          dispatch(getEmployees())
        } catch {
            dispatch(login(false));
        }
    },
  );

  export const checkTask = createAsyncThunk<void, {employeeId: number, taskId: number, isApproved: boolean, curatorAnswer: string}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/disableEmployee',
    async (data, {dispatch, extra: api}) => {
        try {
          await api.patch(`/task/check_task?employee_id=${data.employeeId}&task_id=${data.taskId}`, {task_status: data.isApproved ? 'completed' : 'in_progress', curator_answer: data.curatorAnswer});
          dispatch(getTasksBeingChecked())
        } catch {
            dispatch(login(false));
        }
    },
  );

  export const updateImage = createAsyncThunk<void, {file: File}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/disableEmployee',
    async (data, {dispatch, extra: api}) => {
        const formData = new FormData();
        formData.append("file", data.file);
        try {
          await api.patch(`/auth/update_image`, formData, {headers: {
            'Content-Type': 'multipart/form-data'
          }});
          dispatch(getCurrentUserInfo())
        } catch {
            dispatch(login(false));
        }
    },
  );

  export const readNotification = createAsyncThunk<void, Id, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'notification/readNotification',
    async (id, {dispatch, extra: api}) => {
        try {
          await api.patch(`/notification/read_notification?notification_id=${id}`);
          dispatch(getNotifications())
        } catch {
            dispatch(login(false));
        }
    },
  );

  export const readAllNotification = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'notification/readAllNotification',
    async (_arg, {dispatch, extra: api}) => {
        try {
          await api.patch(`/notification/read_all_notifications`);
          dispatch(getNotifications())
        } catch {
            dispatch(login(false));
        }
    },
  );

  export const editUserProfile = createAsyncThunk<void, {contact: string}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/editUserProfile',
    async (data, {dispatch, extra: api}) => {
        try {
          await api.patch(`/user/edit_user_profile`, {contact: data.contact});
          dispatch(getCurrentUserInfo())
        } catch {
          dispatch(login(false));
        }
    },
  );

  export const changePlanerPosition = createAsyncThunk<void, {planetId: number, position: number}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'planet/changePlanerPosition',
    async (data, {dispatch, extra: api}) => {
        try {
          await api.patch(`/planet/change_planet_pos?planet_id=${data.planetId}`, {new_pos: data.position});
        } catch {
          dispatch(login(false));
        }
    },
  );

  export const changeTaskPosition = createAsyncThunk<void, {taskId: number, position: number}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'task/changeTaskPosition',
    async (data, {dispatch, extra: api}) => {
        try {
          await api.patch(`/task/change_task_pos?task_id=${data.taskId}`, {new_pos: data.position});
        } catch {
          dispatch(login(false));
        }
    },
  );