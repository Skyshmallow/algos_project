import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store.js";
import {
    EvalTaskStore
} from "../../../eval/js/state/EvalTaskStore.js";
import {
    ContestTaskStore
} from "./ContestTaskStore.js";

class PrivateArchiveUser {
    constructor(userId, contestUsers) {
        this.userId = userId;
        this.contestUsers = contestUsers;
    }

    getContestUser(contestTask) {
        for (let contestUser of this.contestUsers) {
            if (contestUser.getContest() === contestTask.getEvalTask().defaultContest) {
                return contestUser;
            }
        }
        return null;
    }
}

export class PrivateArchive extends StoreObject {
    getName() {
        return this.longName;
    }

    getEvalTasks() {
        let evalTasks = [];
        for (let evalTaskId of this.evalTaskIds) {
            let evalTask = EvalTaskStore.get(evalTaskId);
            if (evalTask) {
                evalTasks.push(evalTask);
            }
        }
        return evalTasks;
    }

    getContestTasks() {
        let contestTasks = [];
        let evalTasks = this.getEvalTasks();
        for (let evalTask of evalTasks) {
            let contestTask = ContestTaskStore.get(evalTask.defaultContestTaskId);
            if (contestTask) {
                contestTasks.push(contestTask);
            }
        }
        return contestTasks;
    }

    getContests() {
        let contests = [];
        let evalTasks = this.getEvalTasks();
        for (let evalTask of evalTasks) {
            contests.push(evalTask.defaultContest);
        }
        return contests;
    }

    getUsers() {
        let contestUsers = new Map();
        let contests = this.getContests();
        for (let contest of contests) {
            for (let contestUser of contest.getUsers()) {
                if (!contestUsers.has(contestUser.userId)) {
                    contestUsers.set(contestUser.userId, []);
                }
                contestUsers.get(contestUser.userId).push(contestUser);
            }
        }

        let privateArchiveUsers = [];
        for (let [userId, contestUser] of contestUsers.entries()) {
            privateArchiveUsers.push(new PrivateArchiveUser(userId, contestUser))
        }

        return privateArchiveUsers;
    }

    toString() {
        return this.longName;
    }
}

export const PrivateArchiveStore = new GenericObjectStore("PrivateArchive", PrivateArchive);