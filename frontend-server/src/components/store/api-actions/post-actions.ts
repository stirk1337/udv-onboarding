import { AxiosInstance } from "axios";
import { AppDispatch, State } from "..";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Login } from "../../../types";
import { login } from "../action";
import { getCurrentUserInfo, getPlanets } from "./get-actions";

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
        } catch {
            dispatch(login(false));
        }
    },
  );