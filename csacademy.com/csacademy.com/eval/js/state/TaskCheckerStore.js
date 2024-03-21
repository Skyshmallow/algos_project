import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store.js";
import {
    WorkspaceStore
} from "../../../workspace/js/state/WorkspaceStore.js";


class TaskChecker extends StoreObject {
    getWorkspaces() {
        return this.workspaceIds.map(id => WorkspaceStore.get(id));
    }

    toString() {
        return this.name;
    }
}

class TaskCheckerStoreClass extends GenericObjectStore {
    constructor() {
        super("TaskChecker", TaskChecker);
    }

    allIncludingDefault() {
        let all = this.all();
        all.splice(0, 0, {
            name: "------",
            id: 0,
            workspaceIds: [],
            toString: () => {
                return "------";
            }
        });
        return all;
    }
}

export const TaskCheckerStore = new TaskCheckerStoreClass();