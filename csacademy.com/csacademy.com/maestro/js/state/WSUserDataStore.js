import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store.js";


export class WSUserData extends StoreObject {
    applyEvent(event) {
        if (event.type === "logMessage") {
            return;
        }

        super.applyEvent(event);
    }
}

class WSUserDataStoreClass extends GenericObjectStore {
    applyEvent(event) {
        if (event.type == "logMessage") {
            this.dispatch("logMessage", event);
        }

        super.applyEvent(event);
    }
}

// TODO @cleanup Is this still a thing?
export const WSUserDataStore = new WSUserDataStoreClass("WSUserData", WSUserData);