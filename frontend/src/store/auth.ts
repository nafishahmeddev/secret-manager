import { Store, useStore } from "@tanstack/react-store";

export interface AuthStateLoggedIn {
  user: User
  accessToken: string;
  loggedIn: true;
  loading: boolean;
}

export interface AuthStateLoggedOut {
  loggedIn: false;
  loading: boolean;
}

export type AuthState = AuthStateLoggedIn | AuthStateLoggedOut;

const store = new Store<AuthState>({
  loggedIn: false,
  loading: true,
});
export default class AuthStore {
  static getState<T>() {
    return store.state as T;
  }
  static login = (payload: AuthStateLoggedIn) => store.setState(() => payload);
  static update = (payload: { [key: string]: unknown }) =>
    store.setState((state) => ({ ...state, ...payload }));
  static logout = () =>
    store.setState(() => ({ loggedIn: false, loading: false }));
}

export function useAuthStore<TType>() {
  const auth = useStore(store, (state) => state as TType);
  return [auth, AuthStore] as [TType, AuthStore];
}