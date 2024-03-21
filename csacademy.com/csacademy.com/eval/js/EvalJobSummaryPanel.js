import {
    UI
} from "../../stemjs/src/ui/UIBase.js";
import {
    Formatter
} from "../../csabase/js/util.js";
import {
    EvalJob
} from "./state/EvalJobStore.js";
import {
    ContestStore
} from "../../contest/js/state/ContestStore.js";
import {
    ContestTaskStore
} from "../../contest/js/state/ContestTaskStore.js";
import {
    UserHandle
} from "../../csaaccounts/js/UserHandle.jsx";
import {
    StemDate
} from "../../stemjs/src/time/Date.js";
import {
    FAIcon
} from "../../stemjs/src/ui/FontAwesome.jsx";
import {
    Link
} from "../../stemjs/src/ui/UIPrimitives.jsx";
import {
    autoredraw
} from "../../stemjs/src/decorators/AutoRedraw.js";
import {
    MarkupRenderer
} from "../../stemjs/src/markup/MarkupRenderer.js";


class SubmissionPointsLabel extends UI.TextElement {
    getContestTask() {
        return this.options.contestTask;
    }

    getValue() {
        const score = this.options.score;
        const contestTask = this.getContestTask();
        const pointsWorth = (contestTask && contestTask.pointsWorth) || 1;

        let value = Formatter.truncate(score * pointsWorth, 2) + " points";
        if (pointsWorth != 100) {
            value += " (" + Formatter.truncate(score * 100) + "%)";
        }

        return value;
    }

    onMount() {
        if (this.options.contestTask) {
            this.attachChangeListener(this.options.contestTask, () => this.redraw());
        }
    }
}


// TODO: this whole class shouldn't exist, but just be a set of functions
export class EvalJobUIHandler {
    constructor(evalJob) {
        this.evalJob = evalJob;
    }

    getSummary() {
        const {
            evalJob
        } = this;
        let cpuTime = 0,
            memoryUsage = 0;
        for (const test of evalJob.tests) {
            cpuTime = Math.max(cpuTime, test.cpuTime || 0);
            memoryUsage = Math.max(memoryUsage, test.memUsage);
        }
        const comment = this.getComment();

        return <div >
            <
            p > {
                UI.T("User:")
            } {
                this.getUserHandle()
            } < /p> <
            p > {
                UI.T("Verdict:")
            } {
                this.getStatus()
            } < /p> <
            p > {
                UI.T("")
            } < /p> <
            p > {
                UI.T("Language:")
            } {
                evalJob.getProgrammingLanguage().name
            } < /p> <
            p > {
                UI.T("CPU Time usage:")
            } {
                Formatter.cpuTime(cpuTime)
            } < /p> <
            p > {
                UI.T("Memory usage:")
            } {
                Formatter.memory(memoryUsage)
            } < /p> <
            p > {
                UI.T("Source code:")
            } {
                Formatter.memory(evalJob.sourceText.length)
            } < /p> {
                comment && < p > {
                        UI.T("Comment:")
                    } {
                        comment
                    } < /p>} <
                    /div>;
            }

        getJobId() {
            return "Job #" + this.evalJob.id;
        }

        getJobIdWithExternalLink() {
            return [
                "Job ", <
                span onClick = {
                    () => {
                        window.event.stopPropagation();
                    }
                } >
                <
                Link href = {
                    "/submission/" + this.evalJob.id
                }
                newTab
                value = {
                    [
                        "#" + this.evalJob.id + " ", <
                        FAIcon icon = "external-link" / > ,
                    ]
                }
                /> {
                    " "
                } <
                /span>
            ];
        }

        getTimeSubmitted() {
            let timeSubmitted = new StemDate();
            if (this.evalJob.timeSubmitted) {
                timeSubmitted = StemDate.unix(this.evalJob.timeSubmitted);
            }
            timeSubmitted = timeSubmitted.format("DD MMM YYYY HH:mm:ss");
            return timeSubmitted;
        }

        getUserHandle() {
            return <UserHandle userId = {
                this.evalJob.userId
            }
            />;
        }

        getComment() {
            const {
                comment
            } = this.evalJob;
            return comment && < MarkupRenderer value = {
                comment
            }
            style = {
                {
                    display: "inline-block"
                }
            }
            />;
        }

        getTask() {
            let contestTask = ContestTaskStore.getByEvalTaskId(this.evalJob.evalTaskId);

            if (contestTask) {
                return "Task " + contestTask.longName;
            }
            return "Task id #" + this.evalJob.evalTaskId;
        }

        getContest() {
            let contest = ContestStore.get(this.evalJob.contestId);

            if (contest) {
                return contest.longName;
            }
            return "Contest #" + this.evalJob.contestId;
        }

        getStatus() {
            const evalJob = this.evalJob;

            let statusLabel = "";

            let status = evalJob.getStatus();

            const statusMessage = new Map([
                [EvalJob.Status.WAITING, "Waiting"],
                [EvalJob.Status.COMPILING, "Compiling"],
                [EvalJob.Status.RUNNING, "Running"]
            ]);

            if (status === EvalJob.Status.DONE) {
                // TODO: This is not the only partial scoring case
                let hasPartialScoring = evalJob.hasPartialScoring();

                if (evalJob.hasCompileError()) {
                    statusLabel = "Compilation Error";
                } else if (evalJob.hasInternalJudgeError()) {
                    statusLabel = "Internal Judge Error!"
                } else if (!evalJob.onlyExamples) {
                    if (hasPartialScoring) {
                        const score = evalJob.score;
                        const contestTask = evalJob.getContestTask();
                        return <SubmissionPointsLabel score = {
                            score
                        }
                        contestTask = {
                            contestTask
                        }
                        value = "" / > ;
                    } else if (evalJob.getNumTestsPassed() < evalJob.exampleTests.length) {
                        statusLabel = "Passed " + evalJob.getNumTestsPassed() + "/" +
                            evalJob.exampleTests.length + " examples";
                    } else {
                        let resultStatus = evalJob.getResultStatus();
                        let lastTest = evalJob.getLastTest();

                        let resultStatusMessage = new Map([
                            [EvalJob.ResultStatus.TIME_LIMIT_EXCEEDED, "Time Limit Exceeded"],
                            [EvalJob.ResultStatus.MEMORY_LIMIT_EXCEEDED, "Memory Limit Exceeded"],
                            [EvalJob.ResultStatus.RUNTIME_ERROR, "Runtime Error"],
                            [EvalJob.ResultStatus.KILLED_BY_SIGNAL, lastTest ? lastTest.message : ""],
                            [EvalJob.ResultStatus.WRONG_ANSWER, lastTest ? lastTest.message : ""],
                            [EvalJob.ResultStatus.ACCEPTED, "Accepted"],
                            [EvalJob.ResultStatus.UNKNOWN, "Internal Judge Error!"]
                        ]);
                        statusLabel = resultStatusMessage.get(resultStatus);
                    }
                } else {
                    statusLabel = evalJob.getNumTestsPassed() + "/" + evalJob.exampleTests.length;
                }
            } else {
                statusLabel = statusMessage.get(status);
            }

            return statusLabel;
        }
    }


    @autoredraw
    export class EvalJobSummaryPanel extends UI.Element {
        getEvalJob() {
            return this.options.evalJob;
        }

        render() {
            const temp = new EvalJobUIHandler(this.getEvalJob());
            // TODO: move this from EvalJobUIHandler directly here
            return temp.getSummary();
        }
    }