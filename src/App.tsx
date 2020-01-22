import React, { KeyboardEventHandler } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { setGlobal, useGlobal } from 'reactn';
import './App.css';
import { addItem, cloudToState, localToState } from './DataSync';
import { IItem, INITIAL_STATE } from './INITIAL_STATE';

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
  if (items.length === 0) {
    localToState();
    cloudToState();
  }
  const dom_items = items.map((v: IItem) =>
    <p key={v.created}>
      {v.text}
      {v.saved_local ? "(local save ok)" : ""}
      {v.saved_cloud ? "(cloud save ok)" : "(cloud save pending)"}
    </p>)
  return (
    <div className="App">
      {dom_items}
      <TextareaAutosize onKeyPress={onKeyPress}></TextareaAutosize>
    </div>
  );
}

export default App;


