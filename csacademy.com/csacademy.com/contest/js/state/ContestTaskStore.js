import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store";
import {
    StemDate
} from "../../../stemjs/src/time/Date.js";
import {
    Duration,
    TimeUnit
} from "../../../stemjs/src/time/Duration";
import {
    ArticleStore
} from "../../../establishment/content/js/state/ArticleStore";
import {
    EvalTaskStatisticsStore
} from "../../../eval/js/state/EvalTaskStatisticsStore";
import {
    EvalTaskStore
} from "../../../eval/js/state/EvalTaskStore";

import {
    ContestStore
} from "./ContestStore";

export class ContestTask extends StoreObject {
    constructor(obj) {
        super(obj);

        if (this.getContest()) {
            this.getContest().addContestTask(this);
        } else {
            console.warn("Contest task with id =", this.id, "does not have a contest.");
        }
    }

    getFullURL() {
        // TODO: should have URLHelper.join(paths)
        return this.getContest().getFullURL() + "task/" + this.name + "/";
    }

    getEvalTask() {
        return EvalTaskStore.get(this.evalTaskId);
    }

    hasStateLoaded() {
        return this.getContest() && this.getEvalTask() && this.getStatementArticle();
    }

    getDifficulty() {
        if (this.hasOwnProperty("difficulty")) {
            return this.difficulty;
        }
        let statistics = EvalTaskStatisticsStore.getByEvalTaskId(this.evalTaskId);
        if (statistics) {
            return statistics.difficulty;
        }
        return 0;
    }

    getOriginalContest() {
        return ContestStore.get(this.originalContestId);
    }

    getStatementArticle() {
        if (this.statementArticleId) {
            return ArticleStore.get(this.statementArticleId);
        }
        return this.getEvalTask().getStatementArticle();
    }

    getContest() {
        return ContestStore.get(this.contestId);
    }

    getTimeAvailable() {
        let time = new StemDate(this.getContest().getStartTime());
        if (this.broadcastDelay) {
            time.addUnit(TimeUnit.SECOND, this.broadcastDelay);
        }
        return time;
    }

    getBroadcastDelay() {
        if (this.broadcastDelay) {
            // broadcast delay is in seconds, and the argument needs to be passed in milliseconds.
            return new Duration(this.broadcastDelay * 1000);
        } else {
            return new Duration(0);
        }
    }

    getBaseTask() {
        let contest = this.getContest().getBaseContest();
        return contest.getMatchingContestTask(this);
    }

    getVirtualTask() {
        let contest = this.getContest();
        if (contest.isVirtual()) {
            return this;
        }
        for (let contestTask of contest.getVirtualContest().getContestTasks()) {
            if (contestTask.evalTaskId === this.evalTaskId) {
                return contestTask;
            }
        }
        return null;
    }

    applyEvent(event) {
        super.applyEvent(event);
        let contest = this.getContest();
        if (contest) {
            contest.applyEvent({
                type: "contestTaskUpdate",
                contestTaskId: this.id,
                contestTaskEvent: event,
                data: {}
            });
        }
    }

    hasPartialScore() {
        return this.getContest() && this.getContest().getScoring().hasPartialScoring;
    }

    hasPenalty() {
        return this.getContest() && this.getContest().hasPenalty();
    }

    hasScore() {
        return this.hasOwnProperty("pointsWorth") && this.pointsWorth != 1;
    }

    toString() {
        return this.longName;
    }

    canShowStatistics() {
        return this.getContest() && this.getContest().canShowPublicSources();
    }
}
ContestTask.ScoreType = {
    ACM: 0, // to AC or not AC
    PARTIAL: 1, // tests or groups of tests
    OPTIMIZATION: 2, // % out of best score, for optimizing NP-complete tasks for instance
    SPECIAL_JUDGE: 3
};

class ContestTaskStoreClass extends GenericObjectStore {
    constructor() {
        super("contesttask", ContestTask, {
            dependencies: ["contest"]
        });
    }

    getByEvalTaskId(evalTaskId) {
        return this.all().find(contestTask => contestTask.evalTaskId === evalTaskId);
    }

    getByContestIdAndUrlName(contestId, urlName) {
        // TODO: Keep a map here
        return this.all().find(contestTask => contestTask.name === urlName &&
            contestTask.contestId === contestId);
    }
}

export const ContestTaskStore = new ContestTaskStoreClass();