import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store.js";


export class WSConnectionData extends StoreObject {}

class WSConnectionDataStoreClass extends GenericObjectStore {
    applyEvent(event) {
        super.applyEvent(event);
    }
}

export const WSConnectionDataStore = new WSConnectionDataStoreClass("WSConnectionData", WSConnectionData);