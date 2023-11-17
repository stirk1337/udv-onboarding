import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, State } from "..";
import { AxiosInstance } from "axios";
import { Id } from "../../../types";
import { clearCurrentPlanet, clearCurrentTask, login } from "../action";
import { getPlanetTasks, getPlanets } from "./get-actions";

export const deletePlanet = createAsyncThunk<void, Id, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'planet/deletePlanet',
    async (id, {dispatch, extra: api}) => {
      try {
        await api.delete('/planet/delete_planet', {params: {planet_id :id}});
        dispatch(clearCurrentPlanet())
        dispatch(getPlanets())
      } catch {
        dispatch(login(false));
      }
    },
  );

  export const deleteTask = createAsyncThunk<void, {planetId: number, taskId: number}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'task/deleteTask',
    async (data, {dispatch, extra: api}) => {
      try {
        await api.delete('/task/delete_task', {params: {task_id :data.taskId}});
        dispatch(clearCurrentTask())
        dispatch(getPlanetTasks(data.planetId))
      } catch {
        dispatch(login(false));
      }
    },
  );