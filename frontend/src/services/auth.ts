import { ApiRequest } from "@app/lib/axios";
import queryClient from "@app/lib/query";
import AuthStore from "@app/store/auth";

export default class AuthApi {

  static login = (payload: {
    email: string;
    password: string;
  }) =>
    ApiRequest.post("/api/v1/auth/login", payload).then((res) => {
      const data: ApiResponse<{
        tokens: {
          accessToken: string;
        };
        user: User;
      }> = res.data;
      const response = data.result;
      localStorage.setItem("accessToken", response.tokens.accessToken);
      AuthStore.login({
        accessToken: response.tokens.accessToken,
        user: response.user,
        loggedIn: true,
        loading: false
      });
      return response;
    });

  static verify = () => {
    if (!localStorage.getItem("accessToken")) {
      AuthStore.logout();
      localStorage.removeItem("accessToken");
      return Promise.reject("No token found");
    }
    return ApiRequest.get(`/api/v1/auth/verify`)
      .then((res) => {
        const response = res.data.result as {
          user: User;
        };
        AuthStore.login({
          accessToken: localStorage.getItem("accessToken") as string,
          ...response,
          loggedIn: true,
          loading: false,
        });
        return response;
      })
      .catch((e) => {
        AuthApi.logout();
        throw e;
      });
  };

  static logout = async () => {
    localStorage.removeItem("accessToken");
    AuthStore.logout();
    queryClient.invalidateQueries();
    queryClient.clear();
  };
}