import React, { KeyboardEventHandler } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import './App.css';
import { getGlobal, setGlobal, useGlobal } from 'reactn';
import { IItem, INITIAL_STATE } from './INITIAL_STATE';
import { local_db } from './IndexedDB';
import { addItemToFirestore } from "./FirestoreIO";

const updateItem = (index: number, diff: { [key: string]: any }) => {
  const global = getGlobal();
  const new_item = { ...global.items[index], ...diff }
  const new_items = [...global.items]
  new_items[index] = new_item;
  setGlobal({ items: new_items });
}

const addItem = (s: string) => {
  const global = getGlobal();
  const item = {
    text: s,
    created: Date.now(),
    saved_cloud: false,
    saved_local: false
  }

  const index = global.items.length;
  setGlobal({ items: [...global.items, item] });
  local_db.items.add(item).then(() => {
    updateItem(index, { saved_local: true })
  })
  addItemToFirestore(item).then(() => {
    updateItem(index, { saved_cloud: true })
    local_db.items.update(item.created, { saved_cloud: true })
  })
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
  if (items.length === 0) {
    local_db.items.toArray().then((local_items) => {
      if (local_items.length > 0) {
        local_items.forEach((item, index) => {
          if (!item.saved_cloud) {
            addItemToFirestore(item).then(() => {
              updateItem(index, { saved_cloud: true })
              local_db.items.update(item.created, { saved_cloud: true })
            })
          }
          item.saved_local = true;  // because it comes from local DB
        })
        setGlobal({ items: local_items })
      }
    });
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
