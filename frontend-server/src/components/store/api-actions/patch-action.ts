import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, State } from "..";
import { AxiosInstance } from "axios";
import { login } from "../action";
import { UpdateAnswer } from "../../../types";
import { getPlanetTasks } from "./get-actions";

export const UpdateAnswerTask = createAsyncThunk<void, UpdateAnswer, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/log-out',
    async (data, {dispatch, extra: api}) => {
        try {
            await api.patch(`/task/answer_task/?answer=${data.answer}&task_id=${data.task_id}`);
            dispatch(getPlanetTasks(data.planet_id))
        } catch {
            //dispatch(login(false));
        }
    },
  );