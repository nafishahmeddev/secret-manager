import { Store, useStore } from "@tanstack/react-store";

export interface AdminProjectState {
  formDialog: {
    open: boolean;
    projectId?: string;
  }
}

const store = new Store<AdminProjectState>({
  formDialog: {
    open: false,
    projectId: undefined,
  },
});
export default class AdminProjectStore {
  static getState<T>() {
    return store.state as T;
  }
  static openFormDialog = (payload: Omit<AdminProjectState["formDialog"], "open">) => store.setState(() => ({ formDialog: { ...store.state.formDialog, ...payload, open: true } }));
  static closeFormDialog = () => store.setState(() => ({ formDialog: { ...store.state.formDialog, open: false } }));
}

export function useAdminProjectStore<TType>(selector?: (state: AdminProjectState) => TType) {
  const state = useStore(store, (state) => selector ? selector(state) : (state as unknown as TType));
  return [state, AdminProjectStore] as [TType, typeof AdminProjectStore];
}