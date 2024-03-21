import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Formatter} from "../../csabase/js/util.js";

import {compareTotalScoreAndPenalty} from "./state/ScoringHelpers";


export class ContestScoreTracker extends UI.Primitive("span") {
    getContest() {
        return this.options.contest;
    }

    getContestUser() {
        return this.getContest().getUser(USER.id);
    }

    getRankText() {
        if (!this.options.loadedScoreboard) {
            return;
        }

        const contest = this.getContest();
        const user = this.getContestUser();
        let contestUsers = contest.getBaseContest().getUsers();
        if (contest.isVirtual()) {
            contestUsers.push(user);
        }

        let rank = 1;
        for (let contestUser of contestUsers) {
            if (compareTotalScoreAndPenalty(user, contestUser) > 0) {
                rank += 1;
            }
        }
        return "Rank " + rank + " / " + contestUsers.length;
    }

    getScoreText() {
        if (this.getContestUser().hasOwnProperty("totalScore")) {
            return "Score: " + Formatter.truncate(this.getContestUser().totalScore, 2) + "";
        }
    }

    track() {
        if (this.getContestUser()) {
            const rankText = this.getRankText();
            const scoreText = this.getScoreText();
            let text;
            if (rankText && scoreText) {
                text = rankText + " (" + scoreText + ")";
            } else {
                text = rankText || scoreText || "";
            }
            this.setChildren([text]);
        }
    }

    onMount() {
        this.track();
        const contest = this.options.contest;
        if (this.options.contest.isVirtual()) {
            this.attachListener(contest.getBaseContest(), "rankingsChange", () => this.track());
        }
        this.attachListener(contest, "rankingsChange", () => this.track());
    }
}


export class ArchiveScoreTracker extends ContestScoreTracker {
    getContest() {
        return this.options.archive;
    }

    getRankText() {
        let archiveUsers = this.getContest().getUsers();
        let rank = 1;
        for (let archiveUser of archiveUsers) {
            if (compareTotalScoreAndPenalty(this.getContestUser(), archiveUser) > 0) {
                rank += 1;
            }
        }
        return "Rank " + rank + " / " + archiveUsers.length;
    }

    onMount() {
        this.track();
        this.attachListener(this.getContest(), "rankingsChange", () => this.track());
    }
}