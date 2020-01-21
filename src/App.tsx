import React, { KeyboardEventHandler } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import './App.css';
import { getGlobal, setGlobal, useGlobal } from 'reactn';
import { IItem, INITIAL_STATE } from './INITIAL_STATE';
import { local_db } from './IndexedDB';

const addItem = (s: string) => {
  const global = getGlobal();
  const item = {
    text: s,
    created: Date.now(),
  }
  setGlobal({ items: [...global.items, item] });
  local_db.items.add(item)
}

const onKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
  console.log(e.key)
  if (e.key === "Enter") {
    const target = e.target as HTMLTextAreaElement;
    console.log(target.value)
    addItem(target.value)
    target.value = "";
    e.preventDefault();
  }
}

setGlobal(INITIAL_STATE);

const App: React.FC = () => {
  const [items] = useGlobal("items");
  const dom_items = items.map((v: IItem) => <p key={v.created}>{v.text}</p>)
  return (
    <div className="App">
      {dom_items}
      <TextareaAutosize onKeyPress={onKeyPress}></TextareaAutosize>
    </div>
  );
}

export default App;
