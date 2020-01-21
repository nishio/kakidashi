import Dexie from 'dexie';
import { IItem } from "./INITIAL_STATE";

class MyAppDatabase extends Dexie {
  // Declare implicit table properties.
  // (just to inform Typescript. Instanciated by Dexie in stores() method)
  items: Dexie.Table<IItem, number>; // number = type of the primkey
  //...other tables goes here...

  constructor() {
    super("MyAppDatabase");
    this.version(1).stores({
      items: 'created, text',
    });
    // The following line is needed if your typescript
    // is compiled using babel instead of tsc:
    this.items = this.table("items");
  }
}

export const local_db = new MyAppDatabase();
