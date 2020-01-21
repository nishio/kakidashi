import React, { KeyboardEventHandler } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import './App.css';

const onKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
  console.log(e.key)
  if (e.key === "Enter") {
    const target = e.target as HTMLTextAreaElement;
    console.log(target.value)
    target.value = "";
    e.preventDefault();
  }
}

const App: React.FC = () => {
  return (
    <div className="App">
      <TextareaAutosize onKeyPress={onKeyPress}></TextareaAutosize>
    </div>
  );
}

export default App;
