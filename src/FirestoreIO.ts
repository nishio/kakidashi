import firebase from 'firebase/app';
import 'firebase/firestore';
import { IItem } from './INITIAL_STATE';
import { getGlobal } from 'reactn';
const config = {
  apiKey: "AIzaSyB0wAxxeLeHr4udunpln5jCYpGpFGn7D00",
  authDomain: "regroup-d4932.firebaseapp.com",
  projectId: "regroup-d4932",
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const app = firebase.initializeApp(config);
const db = firebase.firestore();
//@ts-ignore
window.db = db

const stateToFirestore = (item: IItem) => {
  return {
    created: item.created,
    text: item.text,
  } // omit saved_local and saved_cloud
}
export const addItemToFirestore = (item: IItem) => {
  const listname = getGlobal().listname;
  const doc = stateToFirestore(item);  // when we need to convert data type modify this
  return db.collection("kakidashi").doc(listname).collection("items").add(
    doc
  )
}

export const getRecent = () => {
  const listname = getGlobal().listname;
  return db.collection("kakidashi").doc(listname)
    .collection("items")
    .orderBy('created')
    .startAt(Date.now() - 24 * 60 * 60 * 1000)
    .get();
}

export const create_new_key = async () => {
  const new_list = {
    items: []
  }
  return (await db.collection("kakidashi").add(new_list)).id;
}

export const key_to_listname = async (key: string) => {
  const doc = await db.collection("key_to_kakidashi").doc(key).get()
  const data = doc.data();
  if (data === undefined) {
    return "sandbox"
  } else {
    return data.listname;
  }
}


const subscribe = () => {  // eslint-disable-line @typescript-eslint/no-unused-vars
  const listname = getGlobal().listname;
  var docRef  // eslint-disable-line @typescript-eslint/no-unused-vars
    = db.collection("kakidashi").doc(listname);
  var unsubscribe  // eslint-disable-line @typescript-eslint/no-unused-vars
    = db.collection("kakidashi").doc(listname).onSnapshot((doc: any) => {
      console.log("update on server");
      //updateFromFirebase(doc.data());
      console.log(doc.data())
    });
};

export default db;
