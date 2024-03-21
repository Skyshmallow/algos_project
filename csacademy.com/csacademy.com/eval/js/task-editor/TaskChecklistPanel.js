import {
    Panel
} from "../../../stemjs/src/ui/UIPrimitives.jsx";
import {
    Table
} from "../../../stemjs/src/ui/table/Table.jsx";
import {
    formatBytes
} from "../../../stemjs/src/base/Formatting.js";
import {
    ProgrammingLanguage
} from "../../../csabase/js/state/ProgrammingLanguageStore.js";
import {
    Duration
} from "../../../stemjs/src/time/Duration.js";
import {
    IssueSummary
} from "./IssueMessages.jsx";
import {
    EvalJobStore
} from "../state/EvalJobStore.js";
import {
    expectedResultMatches
} from "./submissions/SubmissionsPanel.jsx";
import {
    Ajax
} from "../../../stemjs/src/base/Ajax.js";
import {
    autoredraw
} from "../../../stemjs/src/decorators/AutoRedraw.js";


const haveLoadedMarkedJobs = new Map();

async function EnsureMarkedJobsLoaded(evalTask) {
    haveLoadedMarkedJobs.set(evalTask, false);
    const request = {
        numJobs: 200,
        evalTaskId: evalTask.id,
        requestCount: false,
        onlyWithComments: true,
    }
    try {
        await Ajax.getJSON("/eval/get_eval_jobs/", request);
        haveLoadedMarkedJobs.set(evalTask, true);
    } catch (error) {
        haveLoadedMarkedJobs.set(evalTask, error);
    }

    evalTask.dispatchChange();
}

function ExpectedResultsAreOk(evalTask) {
    if (!haveLoadedMarkedJobs.has(evalTask)) {
        EnsureMarkedJobsLoaded(evalTask).then();
    }
    const loadResult = haveLoadedMarkedJobs.get(evalTask)
    if (!loadResult) {
        IssueSummary.warn("Still loading jobs");
        return "Loading...";
    }
    if (loadResult !== true) {
        IssueSummary.error("Failed to load sources");
        return "???";
    }
    const evalJobs = EvalJobStore.filterBy({
        evalTaskId: evalTask.id
    }).filter(evalJob => evalJob.expectedResult);
    if (evalJobs.length === 0) {
        IssueSummary.warn("There are no sources with an expected result");
    }
    const invalidJobs = new Set();
    for (const evalJob of evalJobs) {
        if (!expectedResultMatches(evalJob)) {
            invalidJobs.add(evalJob);
        }
    }
    if (invalidJobs.size > 0) {
        IssueSummary.error(`There are ${invalidJobs.size} sources where the expected result differs from the score`);
    }

    // TODO warn if only a single author has full score

    return `${evalJobs.length} sources checked`;
}


function TotalTestSize(evalTask) {
    const allTests = [].concat(evalTask.exampleTests, evalTask.systemTests);
    let totalInput = 0,
        totalOutput = 0;
    for (const test of allTests) {
        totalInput += test.inputSize;
        totalOutput += test.outputSize;
    }

    const totalSize = totalInput + totalOutput;
    if (totalSize >= (10 << 20)) {
        IssueSummary.warn("Huge test size, do you really need it?");
    }

    if (totalSize === 0) {
        IssueSummary.error("There doesn't seem to be any test data");
    }

    return formatBytes(totalInput + totalOutput);
}

function MaximumEvaluationDuration(evalTask) {
    const allTests = [].concat(evalTask.exampleTests, evalTask.systemTests);
    const numTests = allTests.length;
    let minMemory = null,
        minTime = null;
    let maxMemory = 0,
        maxTime = 0;

    for (const programmingLanguage of ProgrammingLanguage.all()) {
        const langId = programmingLanguage.id;
        const memLimit = evalTask.getMemoryLimit(langId);
        const timeLimit = evalTask.getTimeLimit(langId);
        if (minMemory == null || memLimit < minMemory) {
            minMemory = memLimit;
        }
        if (minTime == null || timeLimit < minTime) {
            minTime = timeLimit;
        }
        if (memLimit > maxMemory) {
            maxMemory = memLimit;
        }
        if (timeLimit > maxTime) {
            maxTime = timeLimit;
        }
    }

    const minTestDuration = new Duration(minTime * numTests);
    const maxTestDuration = new Duration(maxTime * numTests);

    if (maxTestDuration.getSeconds() > 300) {
        IssueSummary.error("Evaluation can take a damn long time!")
    } else if (minTestDuration.getSeconds() > 60 || maxTestDuration.getSeconds() > 120) {
        IssueSummary.warn("Evaluation can take a long time");
    }

    return [ <
        div >
        Max eval duration: {
            minTestDuration
        } - {
            maxTestDuration
        } <
        /div>, <
        div >
        Max memory: {
            formatBytes(minMemory * 1024)
        } - {
            formatBytes(maxMemory * 1024)
        } <
        /div>
    ]
}


@autoredraw
export class TaskChecklistPanel extends Panel {
    getTitle() {
        return "Checklist"
    }

    render() {
        const {
            evalTask
        } = this.options;

        const columns = [
            ["Check", entry => entry[0]],
            ["Value", entry => entry[1]],
            ["Recommendation", entry => entry[2]],
        ]

        const checks = [
            ["Expected scores match", ExpectedResultsAreOk],
            // ["Official implementation asserts something", "Warn: validate all the constraints"],
            ["Total test size", TotalTestSize],
            ["Maximum limits (over all languages)", MaximumEvaluationDuration],

        ];

        const entries = checks.map(check => {
            const [title, checkFunc] = check;
            IssueSummary.clear();
            const value = checkFunc(evalTask);
            return [title, value, IssueSummary.render()];
        })

        return [ <
            Table columns = {
                columns
            }
            entries = {
                entries
            }
            />
        ]
    }
}