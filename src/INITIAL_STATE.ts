import 'reactn';
import { getGlobal, setGlobal, useGlobal } from 'reactn';

export interface IItem {
  created: number,
  text: string,
}

export const INITIAL_STATE = {
  items: [] as IItem[],
};
setGlobal(INITIAL_STATE);

export type TState = typeof INITIAL_STATE;

declare module 'reactn/default' {
  export interface State extends TState { }
}
