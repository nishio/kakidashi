import { getGlobal, setGlobal } from 'reactn';
import { local_db } from './IndexedDB';
import { addItemToFirestore, getRecent } from './FirestoreIO';

//DataSync
export const updateItem = (index: number, diff: { [key: string]: any }) => {
  const global = getGlobal();
  const new_item = { ...global.items[index], ...diff }
  const new_items = [...global.items]
  new_items[index] = new_item;
  setGlobal({ items: new_items });
}

export const addItem = (s: string) => {
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


export function cloudToState() {
  getRecent().then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      const cloud_item = doc.data();
      local_db.items.get(cloud_item.created).then((local_item) => {
        if (local_item === undefined) {
          local_db.items.add({
            created: cloud_item.created,
            text: cloud_item.text,
            saved_cloud: true,
            saved_local: true,
          }).then(() => {
            local_db.items.toArray().then((local_items) => {
              setGlobal({ items: local_items });
            });
          }).catch((error: any) => {
            console.log(error);
          });
        }
      });
    });
  });
}
export function localToState() {
  local_db.items.toArray().then((local_items) => {
    if (local_items.length > 0) {
      local_items.forEach((item, index) => {
        if (!item.saved_cloud) {
          addItemToFirestore(item).then(() => {
            updateItem(index, { saved_cloud: true });
            local_db.items.update(item.created, { saved_cloud: true });
          });
        }
        item.saved_local = true; // because it comes from local DB
      });
      setGlobal({ items: local_items });
    }
  });
}
