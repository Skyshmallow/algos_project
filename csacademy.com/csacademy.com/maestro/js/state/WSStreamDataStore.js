import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store.js";


export class WSStreamData extends StoreObject {}

class WSStreamDataStoreClass extends GenericObjectStore {
    applyEvent(event) {
        super.applyEvent(event);
    }
}

export const WSStreamDataStore = new WSStreamDataStoreClass("WSStreamData", WSStreamData);