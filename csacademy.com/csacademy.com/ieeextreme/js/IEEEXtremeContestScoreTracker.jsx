import {ContestScoreTracker} from "../../contest/js/ContestScoreTracker.jsx";
import {IEEETeamType} from "./IEEEXtremeScoreboard.jsx";
import {compareContestUsers} from "../../contest/js/state/ScoringHelpers.js";

export class IEEEXtremeContestScoreTracker extends ContestScoreTracker {
    officialOrLateRegistration(user) {
        return (user.ieeeTeamType === IEEETeamType.OFFICIAL || user.ieeeTeamType === IEEETeamType.LATE_REGISTRATION);
    }

    getRankText() {
        if (!this.options.loadedScoreboard) {
            return;
        }

        const contest = this.getContest();
        const user = this.getContestUser();
        let contestUsers = contest.getBaseContest().getUsers();

        if (this.officialOrLateRegistration(user)) {
            contestUsers = contestUsers.filter((contestUser) => {
                return this.officialOrLateRegistration(contestUser);
            });
        }

        let rank = 1;
        for (let contestUser of contestUsers) {
            if (compareContestUsers(user, contestUser) > 0) {
                rank += 1;
            }
        }
        return "Rank " + rank + " / " + contestUsers.length;
    }
}