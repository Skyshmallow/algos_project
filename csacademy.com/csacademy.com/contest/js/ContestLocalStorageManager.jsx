import {LocalStorageMap} from "../../stemjs/src/base/StorageMap.js";


class ContestLocalStorageManagerClass {
    constructor() {
        this.localStorageMap = new Map();
    }

    getLocalStorageMap(contestId, type) {
        const identifier = "contest-" + contestId + "user-" + USER.id + type;
        if (!this.localStorageMap.has(identifier)) {
            this.localStorageMap.set(identifier, new LocalStorageMap(identifier));
        }
        return this.localStorageMap.get(identifier);
    }

    /* Key is task id.
       Value is badge count.
     */
    getQuestionsLocalStorageMap(contestId) {
        return this.getLocalStorageMap(contestId, "questions");
    }

    /* Key is "counter".
       Value is badge count.
     */
    getAnnouncementsLocalStorageMap(contestId) {
        return this.getLocalStorageMap(contestId, "announcements");
    }

    /* Key is data key.
       Value is data.
     */
    getNotificationsLocalStorageMap(contestId) {
        return this.getLocalStorageMap(contestId, "notifications");
    }
}

export const ContestLocalStorageManager = new ContestLocalStorageManagerClass();