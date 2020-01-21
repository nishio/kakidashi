import firebase from 'firebase';
import { IItem } from './INITIAL_STATE';

const config = {
  apiKey: "AIzaSyB0wAxxeLeHr4udunpln5jCYpGpFGn7D00",
  authDomain: "regroup-d4932.firebaseapp.com",
  projectId: "regroup-d4932",
};
const app = firebase.initializeApp(config);
const db = firebase.firestore();

export let gotInitialData = false;

const listname = "nishio"

const stateToFirestore = (item: IItem) => {
  return {
    created: item.created,
    text: item.text,
  } // omit saved_local and saved_cloud
}
export const addItemToFirestore = (item: IItem) => {
  const doc = stateToFirestore(item);  // when we need to convert data type modify this
  return db.collection("kakidashi").doc(listname).collection("items").add(
    item
  )
}

export const getRecent = () => {
  return db.collection("kakidashi").doc(listname)
    .collection("items")
    .orderBy('created')
    .startAt(Date.now() - 24 * 60 * 60 * 1000)
    .get();
}

const subscribe = () => {
  var docRef = db.collection("kakidashi").doc(listname);
  var unsubscribe = db.collection("kakidashi").doc(listname).onSnapshot((doc: any) => {
    console.log("update on server");
    //updateFromFirebase(doc.data());
    console.log(doc.data())
  });
};

export default db;
