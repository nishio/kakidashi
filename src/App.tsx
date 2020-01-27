import React, { KeyboardEventHandler, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { setGlobal, useGlobal } from 'reactn';
import './App.css';
import { addItem, cloudToState, localToState } from './DataSync';
import { IItem, INITIAL_STATE } from './INITIAL_STATE';
import { useParams, Redirect } from 'react-router-dom';
import { create_new_key, key_to_listname } from './FirestoreIO';

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
let prevInnerHeight: number = 0;
setInterval(() => {
  const currentInnerHeight = window.innerHeight;
  if (currentInnerHeight != prevInnerHeight) {
    prevInnerHeight = currentInnerHeight;
    scrollToBottom()
  }
})

setGlobal(INITIAL_STATE);

const App: React.FC = () => {
  const [items] = useGlobal("items");
  const [listname] = useGlobal("listname");
  const [state, setState] = useGlobal("state");
  const { key } = useParams();
  useEffect(() => {
    if (state === "NORMAL") {
      if (key === "new") {
        create_new_key().then((id) => {
          setGlobal({
            listname: id,
            key: id,
            state: "NORMAL",
          })
          // created new list, redirect to the page
          setState("CREATED_NEW")
        });
        setState("WAIT_NEW")
      } else if (key !== undefined) {
        // key changed, 
        // some key was specified
        // fetch listname(try to connect cloud)
        console.log(`key ${key} specified`)
        key_to_listname(key).then((id) => {
          console.log(`listname is ${id}`)
          setGlobal({ listname: id }).then(() => {
            cloudToState()
          })
        }).catch((e) => {
          console.log(e, key, listname);
        })
        localToState(key);
      }
    }
  }, [key])

  useEffect(() => {
    if (listname !== "") {
      scrollToBottom();
    }
  }, [listname, items])

  if (state === "CREATED_NEW") {
    return <Redirect to={`/k=${key}`} />
  }
  if (state === "WAIT_NEW") {
    return <p>creating new list...</p>
  }

  const dom_items = items.map((item: IItem) =>
    <ItemComponent {...item} key={item.created}></ItemComponent>
  )

  return (
    <div className="App" style={{
      "textAlign": "left"
    }}>
      {dom_items}
      <TextareaAutosize onKeyPress={onKeyPress}
        onFocus={onFocus} onHeightChange={scrollToBottom}
        style={{
          height: "13px",
          width: "100%",
          filter: "drop-shadow(0px 0px 6px black)",
          fontSize: "20px",
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


