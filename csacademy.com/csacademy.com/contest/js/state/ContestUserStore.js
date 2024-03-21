import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store";
import {
    PublicUserStore
} from "../../../csaaccounts/js/state/UserStore";

import {
    ContestTaskStore
} from "./ContestTaskStore";
import {
    ContestStore
} from "./ContestStore";


export class ContestUser extends StoreObject {
    constructor(obj) {
        super(obj);
        const contest = this.getContest();
        if (contest) {
            contest.addContestUser(this);
            contest.dispatch("contestUserUpdate", {
                contestUser: this
            });
        }
    }

    applyEvent(event) {
        super.applyEvent(event);
        this.getContest() ? .dispatch("contestUserUpdate", {
            contestUser: this,
            event: event
        });
    }

    getPublicUser() {
        return PublicUserStore.get(this.userId);
    }

    getContest() {
        return ContestStore.get(this.contestId);
    }

    getOriginalRating() {
        if (this.hasOwnProperty("oldRating")) {
            return this.oldRating;
        }
        let publicUser = this.getPublicUser();
        if (publicUser) {
            return publicUser.getRating();
        }
        return 1500;
    }

    isOfficial() {
        if (this.getContest().isVirtual()) {
            return false;
        }
        let rating = this.getOriginalRating();
        if (!rating) {
            return true;
        }
        let minRating = this.getContest().minRating || -Infinity;
        let maxRating = this.getContest().maxRating || Infinity;
        return minRating <= rating && rating < maxRating;
    }

    getBaseContest() {
        return this.getContest().getBaseContest();
    }

    getContestStartTime() {
        return this.getContest().getStartTime(this);
    }

    getContestEndTime() {
        return this.getContest().getEndTime(this);
    }

    recalculateTotalScore() {
        this.totalScore = 0;
        let lastGoodSubmissionTime = this.getContestStartTime();
        for (let contestTaskId in this.scores) {
            let contestTask = ContestTaskStore.get(contestTaskId);
            let contestTaskScore = this.scores[contestTaskId];
            if (contestTaskScore.score > 0) {
                if (contestTaskScore.scoreTime > lastGoodSubmissionTime) {
                    lastGoodSubmissionTime = contestTaskScore.scoreTime;
                }
                if (contestTask) {
                    this.totalScore += contestTask.getBaseTask().pointsWorth * contestTaskScore.score;
                }
            }
        }
    }

    solvedTask(contestTask) {
        return this.scores[contestTask.id] && this.scores[contestTask.id].score == 1;
    }

    triedTask(contestTask) {
        return this.scores[contestTask.id] && this.scores[contestTask.id].score != 1;
    }

    resetScore() {
        this.scoresBackup = this.scores;
        this.scores = {};
        this.numSubmissions = 0;
        this.penalty = 0;
    }

    haveSubmitted() {
        return this.numSubmissions > 0;
    }

    isDisqualified() {
        return this.disqualified;
    }
}

class ContestUserStoreClass extends GenericObjectStore {
    constructor() {
        super("ContestUser", ContestUser, {
            dependencies: ["contest", "publicuser"]
        });
    }

    applyEvent(event) {
        let obj = this.get(event.objectId);
        if (!obj) {
            obj = event.data;
            obj.id = event.objectId;
            let user = this.create(obj);
            user.applyEvent(event);
            if (event.user) {
                PublicUserStore.create(event.user);
            }
        } else {
            super.applyEvent(event);
        }
    }
}

export const ContestUserStore = new ContestUserStoreClass();