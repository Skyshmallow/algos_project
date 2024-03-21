import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store.js";
import {
    Ajax
} from "../../../stemjs/src/base/Ajax.js";
import {
    NOOP_FUNCTION
} from "../../../stemjs/src/base/Utils.js";
import {
    UserStore
} from "../../../csaaccounts/js/state/UserStore.js";
import {
    WorkspaceStore
} from "../../../workspace/js/state/WorkspaceStore.js";

import {
    EvalTaskStore
} from "./EvalTaskStore";


class EvalTaskUserSummary extends StoreObject {
    constructor(obj) {
        super(obj);
        let user = this.getUser();
        if (user) {
            user.taskSummaries.set(this.evalTaskId, this);
        }
    }

    getEvalTask() {
        return EvalTaskStore.get(this.evalTaskId);
    }

    getUser() {
        return UserStore.get(this.userId);
    }

    getWorkspace() {
        return WorkspaceStore.get(this.workspaceId);
    }

    getUserAndEvalTaskKey() {
        return String(this.evalTaskId) + "-" + String(this.userId);
    }
}

class EvalTaskUserSummaryStoreClass extends GenericObjectStore {
    constructor() {
        super("evaltaskusersummary", EvalTaskUserSummary, {
            dependencies: ["user", "evaltask", "contesttask"]
        });
        this.fetchedEvalTasks = new Set();
        this.userAndEvalTaskMap = new Map();
        this.addCreateListener((userSummary) => {
            this.userAndEvalTaskMap.set(userSummary.getUserAndEvalTaskKey(), userSummary);
        });
    }

    fetchEvalTask(evalTaskId, successCallback = NOOP_FUNCTION, errorCallback = NOOP_FUNCTION) {
        if (this.fetchedEvalTasks.has(evalTaskId)) {
            successCallback(this.getByEvalTaskId(evalTaskId));
            return;
        }
        Ajax.getJSON("/eval/fetch_task_summaries/", {
            evalTaskId: evalTaskId
        }).then(
            (data) => {
                this.fetchedEvalTasks.add(evalTaskId);
                successCallback(data);
            },
            errorCallback
        );
    }

    getByEvalTaskId(evalTaskId) {
        let answer = [];
        for (let summary of this.all()) {
            if (summary.evalTaskId === evalTaskId) {
                answer.push(summary);
            }
        }
        return answer;
    }

    getMapKey(evalTaskId, userId) {
        return String(evalTaskId) + "-" + String(userId);
    }

    getByEvalTaskAndUserId(evalTaskId, userId) {
        return this.userAndEvalTaskMap.get(this.getMapKey(evalTaskId, userId)) || null;
    }
}

export const EvalTaskUserSummaryStore = new EvalTaskUserSummaryStoreClass();