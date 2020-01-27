import 'reactn';

export interface IItem {
  created: number,
  text: string,
  saved_local: boolean,
  saved_cloud: boolean,
}


export const INITIAL_STATE = {
  items: [] as IItem[],
  listname: "",
  state: "NORMAL" as ("NORMAL" | "WAIT_NEW" | "CREATED_NEW"),
};

export type TState = typeof INITIAL_STATE;

declare module 'reactn/default' {
  export interface State extends TState { }
}
