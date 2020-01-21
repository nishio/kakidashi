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

export const addItemToFirestore = (item: IItem) => {
  const doc = item;  // when we need to convert data type modify this
  return db.collection("kakidashi").doc(listname).collection("items").add(
    item
  )
}

const get = () => {
  var docRef = db.collection("kakidashi").doc(listname);
  docRef.get().then(function (doc: any) {
    if (doc.exists) {
      // use server data
      //updateFromFirebase(doc.data());
      console.log(doc.data());
    }
    else {
      // not exists
    }
  }).catch(function (error: any) {
    console.log("Error getting document:", error);
    gotInitialData = true;
  });
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
