import React, { KeyboardEventHandler, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { setGlobal, useGlobal } from 'reactn';
import './App.css';
import { addItem, cloudToState, localToState } from './DataSync';
import { IItem, INITIAL_STATE } from './INITIAL_STATE';

const onKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
  if (e.key === "Enter") {
    const target = e.target as HTMLTextAreaElement;
    addItem(target.value)
    target.value = "";
    e.preventDefault();
  }
}

const scrollToBottom = () => {
  window.scrollTo(0, document.body.scrollHeight);
}
const onFocus = () => {
  scrollToBottom();
}

setGlobal(INITIAL_STATE);

const App: React.FC = () => {
  const [items] = useGlobal("items");
  if (items.length === 0) {
    localToState();
    cloudToState();
  }
  const dom_items = items.map((item: IItem) =>
    <ItemComponent {...item} key={item.created}></ItemComponent>
  )

  useEffect(() => {
    scrollToBottom();
  })
  return (
    <div className="App" style={{
      "textAlign": "left"
    }}>
      {dom_items}
      <TextareaAutosize onKeyPress={onKeyPress} onFocus={onFocus}
        style={{
          height: "13px",
          width: "100%",
          filter: "drop-shadow(0px 0px 6px black)",
          fontSize: "16px",
        }}
      ></TextareaAutosize >
    </div >
  );
}

const ItemComponent = (prop: IItem) => {
  let css = {} as any;
  if (!prop.saved_local || !prop.saved_cloud) {
    css["borderLeft"] = "5px solid red"
  } else {
    css["borderLeft"] = "5px solid green"
  }
  css["fontSize"] = "16px"
  css["paddingLeft"] = "3px"
  return <span style={css}>
    {prop.text}<br />
  </span>
  // { prop.saved_local ? "(local save ok)" : "" }
  // { prop.saved_cloud ? "(cloud save ok)" : "(cloud save pending)" }

}
export default App;


