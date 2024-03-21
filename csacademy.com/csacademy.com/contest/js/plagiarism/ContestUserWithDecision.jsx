import {autoredraw} from "../../../stemjs/src/decorators/AutoRedraw.js";
import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {UserHandle} from "../../../csaaccounts/js/UserHandle.jsx";
import {ContestUserStore} from "../state/ContestUserStore.js";
import {Formatter} from "../../../csabase/js/util.js";

export function SubmissionToContestUser(submission) {
    // TODO terribly inefficient
    return ContestUserStore.findBy({
        contestId: submission.contestId,
        userId: submission.userId,
    });
}

@autoredraw
export class ContestUserWithDecision extends UI.Primitive("span") {
    render() {
        const {contestUser} = this.options;

        const result = [<UserHandle userId={contestUser.userId}/>];

        if (contestUser.isDisqualified()) {
            result.push(" (Disq.)");
        }

        return result;
    }

    static fromSubmission(submission) {
        const contestUser = SubmissionToContestUser(submission);

        return <this contestUser={contestUser}/>;
    }
}

export class ContestUserSummarizer extends UI.Element {
    render() {
        const {contestUser} = this.options;
        return [
            <ContestUserWithDecision contestUser={contestUser}/>,
            <div>
                Score: {Formatter.truncate(contestUser.totalScore, 2)} points.
            </div>
        ]
    }
}

export function RenderContestUserSummaries(contestUsers) {
    return <div style={{display: "flex", paddingTop: 12}}>
        {contestUsers.map(contestUser => <div style={{flex: 1}}>
            <ContestUserSummarizer contestUser={contestUser}/>
        </div>)}
    </div>
}
