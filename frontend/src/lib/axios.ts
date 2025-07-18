import AuthStore, { 
  // type AuthState, 
  // type AuthStateLoggedIn 
} from "../store/auth";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import queryClient from "./query";
const ApiRequest = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

ApiRequest.interceptors.request.use((config) => {
  if (localStorage.getItem("accessToken")) {
    config.headers["Authorization"] =
      "Bearer " + localStorage.getItem("accessToken");
  }
  config.headers["timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
  config.headers["utc-offset"] = dayjs().utcOffset();
  // if (AuthStore.getState<AuthState>().loggedIn) {
  //   const auth = AuthStore.getState<AuthStateLoggedIn>();
  //   config.headers["accept-language"] = auth.user.language || "de-DE";
  // }

  return config;
});

ApiRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.status == 401) {
      AuthStore.logout();
      localStorage.removeItem("accessToken");
      queryClient.invalidateQueries();
    }
    if ((error?.response?.data as { message: string })?.message) {
      error.message = (error?.response?.data as { message: string })?.message;
    }
    return Promise.reject(error);
  }
);

export { ApiRequest };