import 'reactn';

export interface IItem {
  created: number,
  text: string,
}

export const INITIAL_STATE = {
  items: [] as IItem[],
};

export type TState = typeof INITIAL_STATE;

declare module 'reactn/default' {
  export interface State extends TState { }
}
