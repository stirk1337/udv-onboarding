import axios, {AxiosInstance, AxiosResponse, AxiosError} from 'axios';
import {StatusCodes} from 'http-status-codes';
import {toast} from 'react-toastify';

type DetailMessageType = {
  type: string;
  message: string;
  detail: string;
}

export type Token = {
  access_token: string;
  token_type: string
}

const StatusCodeMapping: Record<number, boolean> = {
  [StatusCodes.BAD_REQUEST]: true,
  [StatusCodes.UNAUTHORIZED]: true,
  [StatusCodes.NOT_FOUND]: true
};

const shouldDisplayError = (response: AxiosResponse) => !!StatusCodeMapping[response.status];

export const BACKEND_URL = 'http://localhost:81/api/v1';
export const REQUEST_TIMEOUT = 5000;

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.response.use(
    (config) => {
      if(((window.location.href.split('/')[3] === 'login' && !window.location.href.split('/')[4]) || !window.location.href.split('/')[3]) && config.data.role !== undefined){
        window.location.href = `/${config.data.role}`
      }
      return config
    },
    (error: AxiosError<DetailMessageType>) => {
      if(error.response?.statusText === 'Not Found' || error.response?.statusText === 'Unprocessable Entity'){
        window.location.href = '/Not-found'
      }
      if(error.response?.statusText === 'Unauthorized'){
        if(window.location.href.split('/')[3] !== 'login'){
          window.location.href = '/login'
        }
      }
      if (error.response && shouldDisplayError(error.response)) {
        const detailMessage = (error.response.data);
        toast.warn(detailMessage.message);
      }
      if(error.response?.statusText === 'Bad Request' || error.response?.statusText === 'Forbidden'){
        localStorage.setItem('error', error.response?.data.detail)
        window.dispatchEvent(new Event('storage'))
      }
      throw error;
    }
  );

  api.interceptors.request.use((request) => {
    const token = localStorage.getItem('token') && JSON.parse(localStorage.getItem('token') || '')
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  }, (error) => {
    return Promise.reject(error);
  });

  return api;
}