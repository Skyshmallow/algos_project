import {
    GenericObjectStore,
    StoreObject
} from "../../../stemjs/src/state/Store.js";
import {
    ContestStore
} from "./ContestStore.js";

class ContestRegisterer extends StoreObject {
    getContest() {
        return ContestStore.get(this.contestId);
    }

    isOwned() {
        return USER.id === this.ownerId;
    }

    getCode() {
        let contestName = this.getContest().name;
        return contestName.substr(contestName.length - 12);
    }
}

class ContestRegistererStoreClass extends GenericObjectStore {
    getForContest(contestId) {
        for (let registerer of this.all()) {
            if (registerer.contestId === contestId) {
                return registerer;
            }
        }
        return null;
    }
}

const ContestRegistererStore = new ContestRegistererStoreClass("contestregisterer", ContestRegisterer);

export {
    ContestRegisterer,
    ContestRegistererStore
};