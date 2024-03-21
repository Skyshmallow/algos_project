import {UI} from "../../stemjs/src/ui/UIBase.js";
import {CardPanel} from "../../stemjs/src/ui/CardPanel.jsx";
import {StyleSheet} from "../../stemjs/src/ui/Style.js";
import {styleRule, styleRuleInherit} from "../../stemjs/src/ui/Style.js";
import {registerStyle} from "../../stemjs/src/ui/style/Theme.js";
import {Size} from "../../stemjs/src/ui/Constants.js";
import {Duration} from "../../stemjs/src/time/Duration.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {EvalJobStore} from "../../eval/js/state/EvalJobStore.js";
import {SubmissionSummary, SubmissionSummaryStyle} from "../../eval/js/SubmissionSummary.jsx";

import {ContestStore} from "./state/ContestStore.js";
import {EvalJobUIHandler} from "../../eval/js/EvalJobSummaryPanel.js";


class ImprovedSubmissionSummaryStyle extends SubmissionSummaryStyle {
    @styleRuleInherit
    submissionSummary = {
        margin: 0,
    };
}

@registerStyle(ImprovedSubmissionSummaryStyle)
class ImprovedSubmissionSummary extends SubmissionSummary {
    getContest() {
        return this.getEvalJob().getContestTask().getContest();
    }

    getTimeSubmittedLabel() {
        const duration = new Duration({
            seconds: this.getEvalJob().timeSubmitted - this.getContest().getStartTime()
        });
        return duration.format("HH:mm:ss");
    }

    render() {
        const evalJobUIHandler = new EvalJobUIHandler(this.getEvalJob());

        return <div>{[
            evalJobUIHandler.getJobIdWithExternalLink(),
            " (",
            evalJobUIHandler.getTimeSubmitted(),
            ") -- ",
            evalJobUIHandler.getStatus(),
        ]}</div>;
    }

    onMount() {
        super.onMount();
        this.addListener("expand", () => {
            this.options.contestTaskSubmissions.dispatch("expand", this);
        });
    }
}

class ContestTaskSubmissions extends UI.Element {
    jobFilter(job) {
        return job.contestTaskId === this.options.contestTask.id && job.userId === USER.id && !job.onlyExamples;
    }

    getEvalJobs() {
        return EvalJobStore.all().filter(job =>  this.jobFilter(job)).sort((a, b) => b.id - a.id);
    }

    getSubmissions() {
        const evalJobs = this.getEvalJobs();
        if (!evalJobs.length) {
            return <div style={{height: "30px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "16px"}}>
                        <em>{UI.T("No submissions for this task")}</em>
                    </div>;
        }
        return evalJobs.map(
            evalJob => <ImprovedSubmissionSummary evalJob={evalJob} contestTaskSubmissions={this}
                                                  ref={this.refLink("evalJob" + evalJob.id)}/>
        );
    }

    render() {
        return [
            <CardPanel title={<span style={{fontSize: "16px"}}>{UI.T(this.options.contestTask.longName)}</span>}
                       size={Size.LARGE} ref="cardPanel">
                {this.getSubmissions()}
            </CardPanel>
        ];
    }

    onMount() {
        this.attachListener(EvalJobStore, ["create", "refresh"], (evalJob) => {
            if (this.jobFilter(evalJob)) {
                this.redraw();
            }
        });
        this.addListener("expand", (expandingElement) => {
            for (const evalJob of this.getEvalJobs()) {
                const submissionSummary = this["evalJob" + evalJob.id];
                if (expandingElement !== submissionSummary) {
                    if (!submissionSummary.options.collapsed) {
                        setTimeout(() => submissionSummary.collapse(), 250);
                    }
                }
            }
        });
    }
}


class ContestSubmissionsStyle extends StyleSheet {
    @styleRule
    className = {
        padding: "25px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "wrap",
        flexDirection: "row",
    };

    @styleRule
    sectionContainer = {
        padding: "12.5px",
        minWidth: "425px",
        width: "30%"
    };
}

@registerStyle(ContestSubmissionsStyle)
export class ContestSubmissions extends UI.Element {
    extraNodeAttributes(attr) {
        attr.addClass(this.styleSheet.className);
    }

    getContest() {
        return ContestStore.get(this.options.contestId);
    }

    getContestTasks() {
        return this.getContest().getContestTasks();
    }

    render() {
        return this.getContestTasks().map(
            contestTask => <div className={this.styleSheet.sectionContainer}>
                <ContestTaskSubmissions contestId={this.options.contestId} contestTask={contestTask} />
            </div>
        );
    }

    onMount() {
        Ajax.getJSON("/eval/get_eval_jobs/", {
            contestId: this.options.contestId,
            userId: USER.id
        });
    }
}