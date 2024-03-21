import {
    StoreObject,
    GenericObjectStore
} from "state/Store";


export class ContestScoring extends StoreObject {
    static get PARTIAL_SCORING() {
        return ContestScoringStore.get(1);
    }

    static get ACM() {
        return ContestScoringStore.get(2);
    }

    static get CSA() {
        return ContestScoringStore.get(3);
    }

    toString() {
        return this.name;
    }
}

export const ContestScoringStore = new GenericObjectStore("ContestScoring", ContestScoring);