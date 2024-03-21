import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store.js";
import {
    EvalTaskStore
} from "./EvalTaskStore.js";


class EvalTaskStatistics extends StoreObject {
    getEvalTask() {
        return EvalTaskStore.get(this.evalTaskId);
    }
}

class EvalTaskStatisticsStoreClass extends GenericObjectStore {
    constructor() {
        super("EvalTaskStatistics", EvalTaskStatistics, {
            dependencies: ["evaltask"]
        });
        this.evalTaskMap = new Map();
        this.addCreateListener((evalTaskStatistics) => {
            this.evalTaskMap.set(evalTaskStatistics.evalTaskId, evalTaskStatistics);
        });
    }

    getByEvalTaskId(evalTaskId) {
        return this.evalTaskMap.get(evalTaskId);
    }
}

export const EvalTaskStatisticsStore = new EvalTaskStatisticsStoreClass();