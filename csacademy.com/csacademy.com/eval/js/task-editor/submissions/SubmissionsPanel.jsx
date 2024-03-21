import {Button, Level, Panel, Size, UI} from "../../../../csabase/js/UI.js";
import {Ajax} from "../../../../stemjs/src/base/Ajax.js";
import {GlobalState} from "../../../../stemjs/src/state/State.js";

import {SubmissionSummary, SubmissionSummaryPanel} from "../../SubmissionSummary.jsx";
import {EvalJob, EvalJobStore} from "../../state/EvalJobStore.js";
import {autoredraw} from "../../../../stemjs/src/decorators/AutoRedraw.js";
import {MarkupRenderer} from "../../../../stemjs/src/markup/MarkupRenderer.js";
import {ToggleInput} from "../../../../stemjs/src/ui/input/checkbox/ToggleInput.jsx";
import {isNumericString, toArray} from "../../../../stemjs/src/base/Utils.js";
import {ReevalButton, ReevalDoneModal} from "./ReevalModal.jsx";
import {EditSubmissionCommentModal} from "./SubmissionSetterMetadata.jsx";
import {parseTestRanges} from "../tests/TestGroupingEditor.jsx";


export function expectedResultMatches(evalJob) {
    const {expectedResult} = evalJob;

    if (expectedResult?.trim() === "*") {
        return evalJob.score === 1.0;
    }

    if (isNumericString(expectedResult, true)) {
        const expectedScore = parseFloat(expectedResult) / 100;
        return Math.abs(expectedScore - evalJob.score) < 1e-3;
    }

    // This must be a group notation
    const evalTask = evalJob.getEvalTask();
    const allTests = [...evalTask.exampleTests, ...evalTask.systemTests];
    const allTestIds = new Set(allTests.map(test => test.index));
    const testGroups = toArray(evalTask.testGrouping);

    let expectedDescription;
    try {
        // Build test groups just like in the group editor validation
        const previouslyParsedGroups = [];
        testGroups.forEach((testGroup, index) => {
            index = index + 1;
            const result = parseTestRanges(testGroup.testRanges, allTestIds, index, previouslyParsedGroups);
            result.index = index;
            previouslyParsedGroups.push(result);
        });
        expectedDescription = parseTestRanges(expectedResult, allTestIds, testGroups.length + 1, previouslyParsedGroups);
        if (expectedDescription.explicitTestIds.size) {
            throw "Can't define explicit tests";
        }
        if (expectedDescription.groupIds.size === 0) {
            throw "No groups identified";
        }
    } catch (error) {
        console.warn("Invalid expectedResult", expectedResult, error);
        return null;
    }

    for (let index = 1; index <= testGroups.length; index++) {
        const testGroup = testGroups[index - 1];
        const tests = evalJob.getAllTests(testGroup);
        if (!tests?.length) {
            return null;
        }
        const pointsReceived = testGroup.pointsWorth * Math.min(...tests.map(test => test.checkerScore || 0));
        if (pointsReceived > 0 && pointsReceived < testGroup.pointsWorth) {
            console.warn("Can't do expected with partial points per group");
            return false;
        }
        const groupPassed = pointsReceived > 0;
        if (groupPassed !== expectedDescription.groupIds.has(index)) {
            return false;
        }
    }

    return true;
}


@autoredraw
class SubmissionSummaryWithReeval extends UI.Element {
    extraNodeAttributes(attr) {
        attr.setStyle("display", "flex");
    }

    renderPreparationMetadata() {
        const {evalJob} = this.options;
        const {comment, expectedResult} = evalJob;
        const expectedResultVerdict = expectedResult && expectedResultMatches(evalJob);
        if (!comment && !expectedResult) {
            return null;
        }

        return <div style={{display: "inline-block", margin: "8px 0 -16px 0"}}>
            {expectedResult && <div>
                Expected Result: {expectedResult} {expectedResultVerdict != null ? (expectedResultVerdict ? "✅" : "❌") : "[Invalid value]"}
            </div>}
            {comment && <MarkupRenderer value={comment} />}
        </div>;
    }

    render() {
        const {evalJob} = this.options;

        return [
            <div
                style={{
                        margin: "8px",
                        marginTop: "5px"
                    }}>
                <Button
                    onClick={() => {
                        if (evalJob.getStatus() === EvalJob.Status.DONE) {
                            Ajax.postJSON("/eval/reeval/", {
                                evalTaskId: evalJob.evalTaskId,
                                job: evalJob.id
                            });
                        }
                    }}
                    style={{height: "100%"}}
                    icon="rotate-left"
                />
            </div>,
            <div style={{display: "inline-block"}}>
                {this.renderPreparationMetadata()}
                <div style={{display: "flex"}}>
                    <SubmissionSummary
                        key={evalJob.id}
                        evalJob={evalJob}
                        hideTaskName={true}
                    />
                    <Button
                        icon="edit"
                        onClick={() => EditSubmissionCommentModal.show({evalJob})}
                        style={{margin: "auto auto auto 6px", height: "fit-content"}}
                        size={Size.SMALL}
                    />
                </div>
            </div>
        ];
    }
}

class SubmissionSummaryPanelWithReeval extends SubmissionSummaryPanel {
    getSubmissionSummary(evalJob) {
        return <SubmissionSummaryWithReeval evalJob={evalJob} key={evalJob.id}/>;
    }

    fetchEvalJobs(requestCount) {
        super.fetchEvalJobs(true);
    }
}

export class SubmissionsPanel extends Panel {
    getTitle() {
        return "Submissions";
    }

    render() {
        return [
            <div>
                <ReevalButton modalOptions={{evalTask: this.options.evalTask}} style={{margin: "15px", marginLeft: "8px"}} level={Level.WARNING}>Re-eval all submissions</ReevalButton>
                <div style={{display: "inline-flex", alignItems: "center"}}>
                    <ToggleInput
                        ref="onlyWithCommentsInput"
                        initialValue={false}
                        onChange={(value) => {
                            this.submissionPanel.editFilters({onlyWithComments: value});
                        }}
                        style={{margin: 6}}
                    /> Show only labeled submissions
                </div>
            </div>,
            <SubmissionSummaryPanelWithReeval
                ref="submissionPanel"
                filters={{
                    evalTaskId: this.options.evalTask.id,
                    onlyWithComments: this.onlyWithCommentsInput?.getValue(),
                }}
            />
        ];
    }

    onMount() {
        GlobalState.registerStream("evaljobs");
        this.attachListener(EvalJobStore, "reevalDone", (event) => {
            if (event.data.evalTaskId === this.options.evalTask.id) {
                ReevalDoneModal.show({jobCount: event.data.jobCount});
            }
        });
    }
}
