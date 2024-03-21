import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store.js";
import {
    Ajax
} from "../../../stemjs/src/base/Ajax.js";
import {
    Formatter
} from "../../../csabase/js/util.js";
import {
    ServerTime,
    StemDate
} from "../../../stemjs/src/time/Time";
import {
    GroupChatStore
} from "../../../establishment/chat/js/state/MessageThreadStore.js";
import {
    ArticleStore
} from "../../../establishment/content/js/state/ArticleStore.js";
import {
    CountryStore
} from "../../../establishment/localization/js/state/CountryStore";
import {
    UserGroupStore
} from "../../../establishment/accounts/js/state/UserGroupStore";

import {
    ContestScoringStore
} from "./ContestScoringStore";
import {
    compareContestUsers
} from "./ScoringHelpers";


export class Contest extends StoreObject {
    static scoreboardType = {
        TASK_NAME: 0,
        TASK_LETTER: 1,
        TOTAL_SCORE_ONLY: 2,
    };
    static ModeratedAction = {
        VIEW: "view",
        EDIT_TASKS: "edit-tasks",
        EDIT_SETTINGS: "edit-settings",
        ANSWER_QUESTIONS: "answer-question",
        BROADCAST_ANNOUNCEMENTS: "broadcast-announcement"
    };
    static VerboseModeratedAction = {
        VIEW: "View",
        EDIT_TASKS: "Edit tasks",
        EDIT_SETTINGS: "Edit settings",
        ANSWER_QUESTIONS: "Answer questions",
        BROADCAST_ANNOUNCEMENTS: "Broadcast announcements"
    };

    constructor(obj) {
        super(obj);
        this.contestTasks = new Map();
        this.contestUsers = new Map();
        this.addListener("contestUserUpdate", () => this.enqueueRecalculateUserRanks());
    };

    getScoring() {
        return ContestScoringStore.get(this.scoringId);
    }

    addPermission(userId, permissionName, callback) {
        return Ajax.postJSON("/contest/change_permission/", {
            contestId: this.id,
            userId: userId,
            permissionName: permissionName,
            action: "give"
        }).then(callback);
    }

    removePermission(userId, permissionName, callback) {
        return Ajax.postJSON("/contest/change_permission/", {
            contestId: this.id,
            userId: userId,
            permissionName: permissionName,
            action: "remove"
        }).then(() => {
            this.getPermissionGroup(permissionName).removeMemberByUserId(userId);
            callback();
        });
    }

    getPermissionGroup(permName) {
        return UserGroupStore.getByName("contest-" + this.id + "-perm-" + permName);
    }

    getUserPermission(userId, permName) {
        return !!this.getPermissionGroup(permName).getMemberByUserId(userId);
    }

    canReceiveQuestions() {
        return !this.systemGenerated && this.hasStarted() && !this.isInfinite();
    }

    getAnnouncements() {
        return this.getStore("ContestAnnouncement").all()
            .filter(announcement => announcement.contestId === this.id)
            .sort((a, b) => b.id - a.id);
    }

    getQuestions() {
        return this.getStore("ContestQuestion").all()
            .filter(question => question.contestId === this.id)
            .sort((a, b) => b.id - a.id);
    }

    getFullURL() {
        // TODO: should be a setting, if the contest url is top level or not
        const prefix = this.name.startsWith("ieeextreme") ? "/" : "/contest/";
        return prefix + this.name + "/";
    }

    addContestUser(contestUser) {
        this.contestUsers.set(contestUser.id, contestUser);
    }

    addContestTask(contestTask) {
        if (this.contestTasks.has(contestTask.id)) {
            return false;
        }
        this.contestTasks.set(contestTask.id, contestTask);
        this.dispatch("addTask", contestTask);
        return true;
    }

    getContestTaskById(contestTaskId) {
        return this.contestTasks.get(contestTaskId);
    }

    hasAnyTask() {
        return this.getContestTasks().length > 0;
    }

    enqueueRecalculateUserRanks() {
        // TODO: should add a setTimeout(0, if none is scheduled
        this.recalculateUsers();
    }

    applyEvent(event) {
        let questionData;
        if (event.data.hasOwnProperty("questions")) {
            for (let questionId in event.data.questions) {
                this.questions[questionId] = event.data.questions[questionId];
            }

            questionData = event.data.questions;
            delete event.data.questions;
        }

        super.applyEvent(event);

        if (event.type === "contestTaskUpdate") {
            this.recalculateUsers();
        }

        if (event.numUsersOnline) {
            this.numUsersOnline = event.numUsersOnline;
        }
    };

    isVirtual() {
        return !!this.baseContestId;
    }

    getBaseContest() {
        if (this.baseContestId) {
            return ContestStore.get(this.baseContestId);
        } else {
            return this;
        }
    }

    getVirtualContest() {
        if (this.virtualContestId) {
            return ContestStore.get(this.virtualContestId);
        } else {
            return this;
        }
    }

    getUser(userId) {
        for (let contestUser of this.contestUsers.values()) {
            if (contestUser.userId === userId) {
                return contestUser;
            }
        }
        return null;
    };

    getUsers() {
        return Array.from(this.contestUsers.values());
    }

    getNumUsers() {
        let numUsers = this.getBaseContest().numRegistered;
        // TODO: fix this to only count virtual users if showVirtualUsers=true
        if ((this.isVirtual() || this.virtualContestId) && this.getVirtualContest()) {
            //numUsers += !!this.getVirtualContest().getUser(USER.id);
            numUsers += this.getVirtualContest().numRegistered;
        }
        return numUsers;
    }

    // TODO: this should return a Date directly
    getStartTime(contestUser) {
        contestUser = contestUser || this.getUser(USER.id);
        if (!this.isVirtual() || !contestUser) {
            return this.startTime;
        }
        return parseInt(contestUser.timeRegistered) || this.startTime;
    }

    getEndTime(contestUser) {
        contestUser = contestUser || this.getUser(USER.id);
        if (!this.isVirtual() || !contestUser) {
            return this.endTime;
        }
        return parseInt(contestUser.timeRegistered + this.endTime - this.startTime) || this.endTime;
    }

    getName() {
        if (this.isVirtual()) {
            return "Virtual " + this.getBaseContest().longName;
        } else {
            return this.longName;
        }
    }

    static calculateRanks(users) {
        for (let i = 0; i < users.length; i += 1) {
            users[i].recalculateTotalScore();
        }

        users.sort(compareContestUsers);

        //Recalculate ranks
        for (let i = 0; i < users.length; i += 1) {
            // TODO: In a contest with no penalty system, contest users have penalty equal to 0, and virtual
            // contest users don't have the field, so that is why the checking of penalty equality is made like this.
            if (i > 0 && users[i].totalScore === users[i - 1].totalScore && (users[i].penalty || 0) === (users[i - 1].penalty || 0)) {
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
            let users = this.getBaseContest().getUsers();
            if ((this.isVirtual() || this.virtualContestId) && this.getVirtualContest()) {
                //let user = this.getVirtualContest().getUser(USER.id);
                //if (user) {
                //    users.push(user);
                //}
                users = [...users, ...this.getVirtualContest().getUsers()];
            }

            this.constructor.calculateRanks(users);

            this.dispatch("rankingsChange");
            this.recalculatingUserInProgress = false;
        }, 500);
    }

    getChat() {
        return GroupChatStore.get(this.chatId);
    }

    getContestTasks() {
        let contestTasks = Array.from(this.contestTasks.values());
        contestTasks.sort((a, b) => {
            if (a.contestIndex === b.contestIndex) {
                return a.id - b.id;
            }
            if (a.contestIndex === 0) {
                a.contestIndex = Infinity;
            }
            if (b.contestIndex === 0) {
                b.contestIndex = Infinity;
            }
            return a.contestIndex - b.contestIndex;
        });
        return contestTasks;
    }

    getAnalysisArticle() {
        return ArticleStore.getTranslation(this.analysisArticleId);
    }

    getDescriptionArticle() {
        if (!this.descriptionArticleId) {
            return null;
        }
        return ArticleStore.get(this.descriptionArticleId);
    }

    getMatchingContestTask(contestTask) {
        if (contestTask.contestId === this.id) {
            return contestTask;
        }
        for (let myContestTask of this.getContestTasks()) {
            if (myContestTask.evalTaskId === contestTask.evalTaskId) {
                return myContestTask;
            }
        }
        return null;
    }

    hasPenalty() {
        return this.getScoring().hasPenalty;
    }

    hasDynamicPoints() {
        return this.getScoring().hasDynamicPoints;
    }

    hasStarted() {
        return !this.getStartTime() || ServerTime.now().unix() > this.getStartTime();
    }

    hasFinished() {
        return this.getEndTime() && ServerTime.now().unix() > this.getEndTime();
    }

    isRunning() {
        return this.hasStarted() && !this.hasFinished();
    }

    isInfinite() {
        return !this.getEndTime();
    }

    canShowScoreboard() {
        return USER.isSuperUser || this.liveResults || this.hasFinished();
    }

    canShowPublicSources() {
        return this.publicSources && (this.hasFinished() || this.isInfinite());
    }

    getFormattedTime(time, format = "dddd, MMMM Do, H:mm") {
        let timeFormat = time.format(format);
        let utcTimeFormat;
        if (time.getDate() === time.utc().getDate()) {
            utcTimeFormat = time.utc().format("H:mm");
        } else {
            utcTimeFormat = time.utc().format(format);
        }

        return timeFormat + " local time (" + utcTimeFormat + " UTC)";
    }

    getFormattedStartTime(format = "dddd, MMMM Do, H:mm:ss") {
        let startTime = StemDate.unix(this.getStartTime());
        return this.getFormattedTime(startTime, format);
    }

    getFormattedEndTime(format = "dddd, MMMM Do, H:mm:ss") {
        let endTime = StemDate.unix(this.getEndTime());
        return this.getFormattedTime(endTime, format);
    }

    getFormattedDuration() {
        let startTime = new StemDate(this.getStartTime());
        let duration = new StemDate(this.getEndTime()).diff(startTime);
        let durationFormat = Formatter.duration(duration, {
            days: true,
            hours: true,
            minutes: true,
            separator: ", ",
            lastSeparator: " and ",
        });
        return durationFormat;
    }

    toString() {
        return this.longName;
    }

    getCountries() {
        let countryIds = new Set();
        for (let contestUser of this.getUsers()) {
            let user = contestUser.getPublicUser();
            if (user && user.countryId && !countryIds.has(user.countryId)) {
                countryIds.add(user.countryId);
            }
        }
        return CountryStore.getCountriesFromIds(countryIds);
    }

    getStatistics() {
        const fields = ["numUsersOnline", "numSubmissions", "numExampleRuns", "numCompiles", "numCustomRuns"];
        let stats = {};
        for (const field of fields) {
            if (this.hasOwnProperty(field)) {
                stats[field] = this[field].toString();
            }
        }
        return stats;
    }

    getNextTaskTimestamp() {
        if (!this.nextBroadcastTask) {
            return null;
        }
        return new StemDate(this.nextBroadcastTask).unix();
    }

    getExtraSummary() {
        return this.extraSummary || {};
    }

    getLogoURL() {
        return this.getExtraSummary().logoURL;
    }

    getSubpages() {
        return this.getExtraSummary().subpages || [];
    }
}

export const ContestStore = new GenericObjectStore("contest", Contest);

class ContestEvent extends StoreObject {

}

export const ContestEventStore = new GenericObjectStore("contestevent", ContestEvent, {
    dependencies: ["contest", "contestuser"]
});