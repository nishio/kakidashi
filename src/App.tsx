import React, { KeyboardEventHandler, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { setGlobal, useGlobal } from 'reactn';
import './App.css';
import { addItem, cloudToState, localToState } from './DataSync';
import { create_new_key, key_to_listname } from './FirestoreIO';
import { IItem, INITIAL_STATE } from './INITIAL_STATE';
import { ItemComponent } from './ItemComponent';

const onKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
  if (e.key === "Enter") {
    const target = e.target as HTMLTextAreaElement;
    addItem(target.value)
    target.value = "";
    e.preventDefault();
  }
}

const scrollToBottom = () => {
  console.log("scrollToBottom")
  const h = document.body.scrollHeight;
  const X = 495;
  if (h < X) {
  } else {
    window.scrollTo(0, h - X)
  }
}

const onFocus = () => {
  console.log("onFocus")
  scrollToBottom();
}


setGlobal(INITIAL_STATE);

type Props = {
  keyToList: string
}

const App = (props: Props) => {
  const [items] = useGlobal("items");
  const [listname] = useGlobal("listname");
  const [state, setState] = useGlobal("state");
  const key = props.keyToList;
  console.log("App", key, props)
  useEffect(() => {
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
        if (document.activeElement) {
          // @ts-ignore
          if (document.activeElement.blur) {
            // @ts-ignore
            document.activeElement.blur()
          }
        }
      }
    });
  }, [])

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
      <TextareaAutosize id="text" onKeyPress={onKeyPress}
        onFocus={onFocus} onHeightChange={scrollToBottom}
        style={{
          height: "20px",
          width: "95%",
          filter: "drop-shadow(0px 0px 6px black)",
          fontSize: "20px",
        }}
      ></TextareaAutosize >
    </div >
  );
}

export default App;


