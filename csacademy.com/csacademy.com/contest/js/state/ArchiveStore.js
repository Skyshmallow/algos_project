import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store.js";
import {
    GroupChatStore
} from "../../../establishment/chat/js/state/MessageThreadStore.js";
import {
    CountryStore
} from "../../../establishment/localization/js/state/CountryStore.js";
import {
    PublicUserStore,
    UserStore
} from "../../../csaaccounts/js/state/UserStore.js";
import {
    ContestStore
} from "./ContestStore.js";
import {
    ContestTaskStore
} from "./ContestTaskStore.js";
import {
    compareTotalScoreAndPenalty
} from "./ScoringHelpers.js";


class Archive extends StoreObject {
    constructor(obj) {
        super(obj);
        this.archiveUsers = new Map();
        this.users = new Map();
        this.addListener("archiveUserUpdate", (event) => {
            this.dispatch("rankingsChange", event);
            this.recalculateUsers();
        });
    }

    getBaseContest() {
        return ContestStore.get(this.baseContestId);
    }

    addArchiveUser(archiveUser) {
        this.archiveUsers.set(archiveUser.id, archiveUser);
        this.users.set(archiveUser.userId, archiveUser);
    }

    getUser(userId) {
        return this.users.get(userId);
    }

    getUsers() {
        return Array.from(this.archiveUsers.values());
    }

    getContestTasks() {
        let result = [];
        for (let contestTask of ContestTaskStore.all()) {
            if (contestTask.contestId === this.baseContestId) {
                result.push(contestTask);
            }
        }
        result.sort((a, b) => {
            if (a.contestIndex === b.contestIndex) {
                return a.getBaseTask().id - b.getBaseTask().id;
            }
            return a.contestIndex - b.contestIndex;
        });
        return result;
    }

    getNumUsers() {
        return this.archiveUsers.size;
    }

    static calculateRanks(users) {
        users.sort(compareTotalScoreAndPenalty);

        //Recalculate ranks
        for (let i = 0; i < users.length; i += 1) {
            if (i > 0 && users[i].totalScore === users[i - 1].totalScore) {
                users[i].rank = users[i - 1].rank;
            } else {
                users[i].rank = i + 1;
            }
        }
    }

    recalculateUsers() {
        if (this.recalculatingUserInProgress) {
            return;
        }
        this.recalculatingUserInProgress = true;
        setTimeout(() => {
            let users = this.getUsers();
            this.constructor.calculateRanks(users);
            this.dispatch("rankingsChange");
            this.recalculatingUserInProgress = false;
        }, 500);
    }

    getChat() {
        return GroupChatStore.get(this.chatId);
    }

    toString() {
        return this.longName;
    }

    getCountries() {
        let countryIds = new Set();
        for (let user of this.getUsers()) {
            if (user && user.countryId && !countryIds.has(user.countryId)) {
                countryIds.add(user.countryId);
            }
        }
        return CountryStore.getCountriesFromIds(countryIds);
    }
}

export const ArchiveStore = new GenericObjectStore("Archive", Archive);

export class ArchiveUser extends StoreObject {
    constructor(obj) {
        super(obj);
        this.metaContest = ArchiveStore.get(this.archiveId);
        if (this.metaContest) {
            this.metaContest.addArchiveUser(this);
        }
    }

    applyEvent(event) {
        super.applyEvent(event);
        this.metaContest.dispatch("archiveUserUpdate", {
            metaContestUser: this,
            event: event
        });
        this.metaContest.dispatch("contestUserUpdate", {
            metaContestUser: this,
            event: event
        });
    }

    solvedTask(task) {
        let user = UserStore.get(this.userId);
        if (user) {
            return user.taskSummaries.has(task.evalTaskId) &&
                user.taskSummaries.get(task.evalTaskId).bestScore === 100.0;
        }
        return false;
    }

    triedTask(task) {
        let user = UserStore.get(this.userId);
        if (user) {
            return user.taskSummaries.has(task.evalTaskId);
        }
        return false;
    }

    getPublicUser() {
        return PublicUserStore.get(this.userId);
    }
}

export const ArchiveUserStore = new GenericObjectStore("ArchiveUser", ArchiveUser, {
    dependencies: ["Archive", "PublicUser"]
});