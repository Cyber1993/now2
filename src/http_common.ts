import axios from "axios";
import { APP_ENV } from "./env";
import { IsLoadingActionTypes, IsLoadingTypes } from "./store/reducers/IsLoadingState";
import { store } from "./store/store";

const http_common = axios.create({
  baseURL: APP_ENV.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

http_common.interceptors.request.use(
  (config: any) => {
    const action: IsLoadingTypes = {
      payload: true,
      type: IsLoadingActionTypes.SET_LOADING,
    };
    store.dispatch(action);
    return config;
  },
  (error) => {
    const action: IsLoadingTypes = {
      payload: false,
      type: IsLoadingActionTypes.SET_LOADING,
    };
    store.dispatch(action);
    return Promise.reject(error);
  }
);


http_common.interceptors.response.use(
  (response) => {
    const action: IsLoadingTypes = {
      payload: false,
      type: IsLoadingActionTypes.SET_LOADING,
    };
    store.dispatch(action);
    return response;
  },
  (error) => {
    const action: IsLoadingTypes = {
      payload: false,
      type: IsLoadingActionTypes.SET_LOADING,
    };
    store.dispatch(action);
    return Promise.reject(error);
  }
);



http_common.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default http_common;
