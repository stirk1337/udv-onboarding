import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, State } from "..";
import { AxiosInstance } from "axios";
import { changePlanetName, changeTaskData, login, setEmployees, setPlanet } from "../action";
import { UpdateAnswer } from "../../../types";
import { getEmployees, getPlanetTasks } from "./get-actions";

export const updateAnswerTask = createAsyncThunk<void, UpdateAnswer, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'task/answerTask',
    async (data, {dispatch, extra: api}) => {
        try {
            await api.patch(`/task/answer_task/?answer=${data.answer}&task_id=${data.task_id}`);
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
            await api.patch(`/planet/update_planet/?name=${name}&planet_id=${idBlock}`);
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
            const {data: planetData} = await api.patch(`/planet/add_employees_to_planet/?planet_id=${data.planetId}`, {employee_ids: [data.employeeId]});
            dispatch(setPlanet(planetData))
            dispatch(getEmployees())
        } catch {
            dispatch(login(false));
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
            let request = `planet_id=${data.planetId}`
            const product = data.product.split(' ').join('_');
            if(product !== 'all') { request +=  `&product=${product}`}
            const role = data.productRole.split(' ').join('_');
            if(role !== 'all') { request +=  `&product_role=${role}`}
            const {data: planetData} = await api.patch(`/planet/add_employees_to_planet_by_params?` + request);
            dispatch(setPlanet(planetData))
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
            await api.patch(`/task/update_task/?task_id=${data.taskId}&description=${data.description}&name=${data.name}`);
            dispatch(changeTaskData({name: data.name, description: data.description, idTask: data.taskId}))
        } catch {
            dispatch(login(false));
        }
    },
  );