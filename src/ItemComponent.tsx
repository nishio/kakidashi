import React from 'react';
import { IItem } from './INITIAL_STATE';
export const ItemComponent = (prop: IItem) => {
  let css = {} as any;
  if (!prop.saved_local || !prop.saved_cloud) {
    css["borderLeft"] = "5px solid red";
  }
  else {
    css["borderLeft"] = "5px solid green";
  }
  css["fontSize"] = "16px";
  css["paddingLeft"] = "3px";
  if (prop.text.match(/\[https:\/\/gyazo\.com\/([^/]*)\]/)) {
    const hash = RegExp.$1;
    const src = `https://gyazo.com/${hash}/thumb/400`;
    const alt = `[https://gyazo.com/${hash}]`;
    return <> <img src={src} alt={alt} style={css} /> <br /></>;
  }
  else if (prop.text.match(/https:\/\/gyazo\.com\/([^/]*)/)) {
    const hash = RegExp.$1;
    const src = `https://gyazo.com/${hash}/thumb/400`;
    const alt = `[https://gyazo.com/${hash}]`;
    return <img src={src} alt={alt} style={css}></img>;
  }
  return <span style={css}>
    {prop.text}<br />
  </span>;
};
