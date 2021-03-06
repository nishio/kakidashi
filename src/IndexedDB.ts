import Dexie from 'dexie';
import { IItem } from "./INITIAL_STATE";

class KakidashiDB extends Dexie {
  // Declare implicit table properties.
  // (just to inform Typescript. Instanciated by Dexie in stores() method)
  items: Dexie.Table<IItem, number>; // number = type of the primkey
  //...other tables goes here...

  constructor(listname: string) {
    super("KakidashiDB_" + listname);
    this.version(1).stores({
      items: 'created, text, saved_cloud',
    });
    // The following line is needed if your typescript
    // is compiled using babel instead of tsc:
    this.items = this.table("items");
  }
}

export const change_local_db = (key: string) => {
  local_db = new KakidashiDB(key);
}
export let local_db = new KakidashiDB("sandbox");;