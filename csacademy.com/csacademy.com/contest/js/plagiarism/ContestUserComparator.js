import {
    Ajax
} from "../../../stemjs/src/base/Ajax.js";
import {
    EvalJobStore
} from "../../../eval/js/state/EvalJobStore.js";
import {
    EvalJobComparator
} from "./EvalJobComparator.jsx";
import {
    Modal
} from "../../../stemjs/src/ui/modal/Modal.jsx";
import {
    Select
} from "../../../stemjs/src/ui/input/Input.jsx";
import {
    RenderContestUserSummaries
} from "./ContestUserWithDecision.jsx";
import {
    Formatter
} from "../../../csabase/js/util.js";
import {
    StemDate
} from "../../../stemjs/src/time/Date.js";
import {
    PlagiarismMatchEditor
} from "./PlagiarismMatchEditor.jsx";
import {
    PlagiarismMatchStore
} from "../state/PlagiarismMatchStore.js";

const contestUserSubmissionCache = new Map();
const contestUserSubmissionResponse = new Map();

async function LoadContestUserSubmissions(contestUser, contestTask) {
    const userId = contestUser.userId;
    const contestTaskId = contestTask.id;
    const uniqueId = `${userId}-${contestTaskId}`;

    if (!contestUserSubmissionCache.has(uniqueId)) {
        const request = {
            userId,
            contestTaskId,
        }
        const responsePromise = Ajax.getJSON("/eval/get_eval_jobs/", request);
        contestUserSubmissionCache.set(uniqueId, responsePromise);
    }
    const responsePromise = contestUserSubmissionCache.get(uniqueId);
    const response = await responsePromise;

    const evalJobs = EvalJobStore.load(response);
    evalJobs.sort((a, b) => b.timeSubmitted - a.timeSubmitted);

    contestUserSubmissionResponse.set(uniqueId, evalJobs);

    return evalJobs;
}

export class ContestUserComparatorModal extends Modal {
    // getDefaultOptions() {
    //     return {
    //         width: "85%",
    //     }
    // }

    renderSubmissionSelect(contestUser, contestTask, refIndex) {
        if (!contestTask) {
            return "Loading..."
        }

        const userId = contestUser.userId;
        const contestTaskId = contestTask.id;
        const uniqueId = `${userId}-${contestTaskId}`;

        const evalJobs = contestUserSubmissionResponse.get(uniqueId);
        if (evalJobs == null) {
            LoadContestUserSubmissions(contestUser, contestTask).then(() => {
                setTimeout(() => this.redraw(), 16);
            });
            return "Loading..."
        }

        if (evalJobs.length === 0) {
            return "Did not submit for " + contestTask;
        }

        return <Select
        ref = {
            `submission${refIndex}Input`
        }
        options = {
            evalJobs
        }
        formatter = {
            submission => {
                const score = Formatter.truncate(submission.score * contestTask.pointsWorth, 2);

                const contestStartTime = new StemDate(contestUser.getContestStartTime());
                const solutionTime = new StemDate(submission.timeSubmitted);
                const solutionTimeRelative = solutionTime.diffDuration(contestStartTime).format("HH:mm");

                return `Submission #${submission.id} ${score} points at ${solutionTimeRelative}`;
            }
        }
        onChange = {
            () => this.redraw()
        }
        />
    }

    render() {
            const {
                contestUsers
            } = this.options;
            const contest = contestUsers[0].getContest();

            const selectedContestTask = this.contestTaskInput ? .getValue() || contest.getContestTasks()[0];

            const submission1 = this.submission1Input ? .getValue();
            const submission2 = this.submission2Input ? .getValue();
            const plagiarismMatch = PlagiarismMatchStore.getFromSubmissions(submission1, submission2);

            return [ <
                    div >
                    Task: < Select ref = "contestTaskInput"
                    options = {
                        contest.getContestTasks()
                    }
                    onChange = {
                        () => this.redraw()
                    }
                    /> {
                        plagiarismMatch && < PlagiarismMatchEditor match = {
                            plagiarismMatch
                        }
                        />} <
                        /div>,

                        RenderContestUserSummaries(contestUsers),

                            <
                            div style = {
                                {
                                    display: "flex",
                                    paddingTop: 6
                                }
                            } > {
                                contestUsers.map((contestUser, index) => < div style = {
                                        {
                                            flex: 1,
                                            alignSelf: "center"
                                        }
                                    } > {
                                        this.renderSubmissionSelect(contestUser, selectedContestTask, index + 1)
                                    } <
                                    /div>)} <
                                    /div>,

                                    submission1 && submission2 && < EvalJobComparator submissions = {
                                        [submission1, submission2]
                                    }
                                    />
                                ];
                            }

                        static promptForContestUsers(contestUsers) {
                            this.show({
                                contestUsers
                            });
                        }

                        onMount() {
                            this.redraw();
                        }
                    }