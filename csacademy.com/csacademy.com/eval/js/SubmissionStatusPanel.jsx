import {Panel} from "../../stemjs/src/ui/UIPrimitives.jsx";
import {autoredraw} from "../../stemjs/src/decorators/AutoRedraw.js";
import {CollapsiblePanel} from "../../stemjs/src/ui/collapsible/CollapsiblePanel.jsx";
import {MarkupRenderer} from "../../stemjs/src/markup/MarkupRenderer.js";
import {EvalJobResultsTable} from "./EvalJobResultsTable.jsx";
import {Formatter} from "../../csabase/js/util.js";
import {EvalJob} from "./state/EvalJobStore.js";
import {Level} from "../../stemjs/src/ui/Constants.js";
import {ProgressBar} from "../../stemjs/src/ui/ProgressBar.jsx";
import {ContestTaskStore} from "../../contest/js/state/ContestTaskStore.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";

@autoredraw
export class SubmissionStatusPanel extends Panel {
    haveShown = new Set();

    renderTestGroupingPanel(evalJob, testGroup, testGroupIndex) {
        const tests = evalJob.getAllTests(testGroup);
        const evalTask = evalJob.getEvalTask();
        if (!tests?.length) {
            return null;
        }

        const getTestGroupDescription = (testGroup, testGroupIndex) => {
            if (!testGroup) {
                return "All Tests";
            }
            const testsMoreToGo = testGroup.testIndexes.length - tests.length;
            const pointsReceived = testGroup.pointsWorth * Math.min(...tests.map(test => test.checkerScore || 0));
            const status = (pointsReceived > 0) ? "✅ Passed" : "❌Failed";
            const description = testsMoreToGo ? `${testsMoreToGo} tests pending` : `${status} ${pointsReceived} points`

            return `Group #${testGroupIndex + 1} ${description}`;
        }

        const groupDescription = getTestGroupDescription(testGroup, testGroupIndex);

        return <CollapsiblePanel title={groupDescription}>
            <div style={{padding: 8}}>
                {testGroup?.comment && <div>
                    <MarkupRenderer classMap={evalTask.articleClassMap} value={testGroup.comment} />
                </div>}
                <EvalJobResultsTable evalJob={evalJob} testGroup={testGroup} />
            </div>
        </CollapsiblePanel>
    }

    renderEvalJobSummary() {
        const {evalJob} = this.options; // TODO This should be an option param, not internal state
        if (!evalJob) {
            return null;
        }

        const evalTask = evalJob.getEvalTask();

        if (evalTask?.testGrouping) {
            return [
                evalTask.testGrouping.map((testGroup, index) => this.renderTestGroupingPanel(evalJob, testGroup, index)),
                this.renderTestGroupingPanel(evalJob, null, null),
            ]
        }

        return <EvalJobResultsTable evalJob={evalJob} />
    }

    render() {
        return [
            this.options.evalJob?.getEvalTask() && <ProgressBar ref="resultsProgressBar" {...this.getRunProgress()} />,
            this.renderEvalJobSummary(),
        ];
    }

    setEvalJob(evalJob) {
        this.updateOptions({evalJob});
    }

    getRunProgress() {
        const {evalJob} = this.options;
        if (!evalJob) return {};

        const evalTask = evalJob.getEvalTask();

        const progress = {};

        const testResults = evalJob.getAllTests() || [];

        const status = evalJob.getStatus();
        let numTotalTests = evalTask.numSystemTests;
        if (evalTask.exampleTests) {
            numTotalTests += evalTask.exampleTests.length;
        }

        progress.value = testResults.length / numTotalTests;

        let worstCPU = 0;
        let worstMemory = 0;
        for (let i = 0; i < testResults.length; i += 1) {
            worstCPU = Math.max(worstCPU, testResults[i].cpuTime || 0);
            worstMemory = Math.max(worstMemory, testResults[i].memUsage || 0);
        }

        const labelInfo = "(" +
            Formatter.cpuTime(worstCPU) +
            " - " +
            Formatter.memory(worstMemory) +
            ")";

        if (status === EvalJob.Status.RUNNING) {
            progress.active = true;
            progress.striped = true;
            if (testResults.length > 0) {
                progress.label = "Successfully done " + testResults.length + " tests" + labelInfo;
            } else {
                progress.label = "Running";
            }
        } else {
            progress.value = 0;
            progress.active = false;
            progress.striped = false;
            progress.disableSmoothTransision = true;
        }

        if (status === EvalJob.Status.DONE) {
            let resultStatus = evalJob.getResultStatus();
            progress.value = 1;

            if (evalJob.hasCompileError()) {
                progress.level = Level.WARNING;
                progress.label = "Compilation Error";
            } else if (evalJob.hasInternalJudgeError()) {
                progress.level = Level.DANGER;
                progress.label = "Internal Judge Error!";
            } else {
                if (evalJob.hasPartialScoring()) {
                    let score = evalJob.score;
                    progress.label = "Score: " + Formatter.truncate(score * 100, 2) + "/100 " + labelInfo;
                    if (score == 1) {
                        progress.level = Level.SUCCESS;
                    } else {
                        progress.level = Level.WARNING;
                    }
                } else {
                    let lastTest = evalJob.getLastTest();
                    let labelResult = new Map([
                        [EvalJob.ResultStatus.ACCEPTED, "Accepted " + labelInfo],
                        [EvalJob.ResultStatus.WRONG_ANSWER, lastTest.message + " on test " + lastTest.testNumber],
                        [EvalJob.ResultStatus.TIME_LIMIT_EXCEEDED, "Time Limit Exceeded"],
                        [EvalJob.ResultStatus.MEMORY_LIMIT_EXCEEDED, "Memory Limit Exceeded"],
                        [EvalJob.ResultStatus.RUNTIME_ERROR, "Runtime Error"],
                        [EvalJob.ResultStatus.KILLED_BY_SIGNAL, lastTest.message]
                    ]);
                    progress.level = (resultStatus === EvalJob.ResultStatus.ACCEPTED) ? Level.SUCCESS : Level.DANGER;
                    progress.label = labelResult.get(resultStatus);
                }
            }
        }

        return progress;
    }

    redraw(event) {
        super.redraw();
        if (event?.type === "test_results" && !this.haveShown.has(event.objectId)) {
            this.haveShown.add(event.objectId);
            this.dispatch("show");
        }
    }

    async onMount() {
        const {evalJob} = this.options;
        if (!evalJob) {
            return;
        }
        const contestTaskId = evalJob.contestTaskId;
        const evalTask = evalJob.getEvalTask();
        if (!ContestTaskStore.get(contestTaskId) || !evalTask) {
            await Ajax.postJSON("/contest/get_contest_task/", {
                contestTaskId,
                requestContestTask: true
            });
            this.redraw();
        }
    }
}
