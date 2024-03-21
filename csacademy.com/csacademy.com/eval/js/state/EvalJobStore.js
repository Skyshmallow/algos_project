import {
    GenericObjectStore
} from "../../../stemjs/src/state/Store";
import {
    AjaxFetchMixin
} from "../../../stemjs/src/state/StoreMixins";
import {
    ContestTaskStore
} from "../../../contest/js/state/ContestTaskStore";
import {
    BaseUserSubmission
} from "./BaseUserSubmission";
import {
    EvalTaskStore
} from "./EvalTaskStore";
import {
    RunStatusCodes
} from "./BaseUserSubmission";


export class EvalJob extends BaseUserSubmission {
    static Status = {
        WAITING: 1,
        COMPILING: 2,
        RUNNING: 3,
        DONE: 4,
    };
    static ResultStatus = {
        COMPILE_ERROR: 1,
        INTERNAL_JUDGE_ERROR: 2,
        TIME_LIMIT_EXCEEDED: 3,
        MEMORY_LIMIT_EXCEEDED: 4,
        RUNTIME_ERROR: 5,
        KILLED_BY_SIGNAL: 6,
        WRONG_ANSWER: 7,
        PASSED: 8, // Both of these are the same
        ACCEPTED: 8, // It depends on ContestTask type
        UNKNOWN: 9,
    };

    constructor(obj) {
        super(obj);

        this.tests = [];
        this.exampleTests = [];
        this.loadTests(obj);
    }

    applyEvent(event) {
        if (event.type === "test_results") {
            this.loadTests(event.data);
        } else {
            super.applyEvent(event);
            if (event.type === "started") {
                this.exampleTests = [];
                this.tests = [];
            } else {
                this.reloadTests();
            }
        }
    };

    updateTests(exampleTests, tests) {
        const addTestToArray = (test, array) => {
            const existingTest = array.find(existingTest => existingTest.id === test.id);
            if (!existingTest) {
                array.push(test);
            } else {
                array[array.indexOf(existingTest)] = test;
            }
        };

        for (let test of tests) {
            addTestToArray(test, this.tests);
        }
        for (let exampleTest of exampleTests) {
            addTestToArray(exampleTest, this.exampleTests);
        }
    }

    loadTests(obj) {
        let tests = [];
        let exampleTests = [];
        for (let testId of Object.keys(obj.tests)) {
            let test = obj.tests[testId];
            if (this.getExampleTest(test.id)) {
                exampleTests.push(test);
            } else {
                tests.push(test);
            }
        }
        this.updateTests(exampleTests, tests);
    }

    reloadTests() {
        this.tests = this.tests.concat(this.exampleTests || []);
        let tests = this.tests.filter(test => !this.getExampleTest(test.id));
        let exampleTests = this.tests.filter(test => !!this.getExampleTest(test.id));
        this.exampleTests = [];
        this.tests = [];
        this.updateTests(exampleTests, tests);
    }

    getExampleTests() {
        return Array.from(this.exampleTests);
    }

    getAllTests(testGroup) {
        let tests = this.exampleTests.concat(this.tests);
        if (testGroup) {
            const testIndexSet = new Set(testGroup.testIndexes);
            tests = tests.filter(testCase => testIndexSet.has(testCase.testIndex));
        }
        return tests;
    }

    getContestTask() {
        return ContestTaskStore.get(this.contestTaskId);
    }

    getEvalTask() {
        return EvalTaskStore.get(this.evalTaskId);
    }

    hasPartialScoring() {
        let contestTask = this.getContestTask();
        return contestTask && contestTask.hasPartialScore();
    }

    getLastTest() {
        if (this.tests.length > 0) {
            return this.tests[this.tests.length - 1];
        }

        if (this.exampleTests.length > 0) {
            return this.exampleTests[this.exampleTests.length - 1];
        }
        return null;
    }

    getStatus() {
        if (!this.compileStarted && !this.compileOK && (!this.tests || !this.tests.length)) {
            return EvalJob.Status.WAITING;
        }

        if (!this.hasOwnProperty("compileOK")) {
            return EvalJob.Status.COMPILING;
        }

        if (!this.isDone) {
            return EvalJob.Status.RUNNING;
        }

        return EvalJob.Status.DONE;
    }

    getResultStatus() {
        if (this.getStatus() !== EvalJob.Status.DONE) {
            return EvalJob.ResultStatus.UNKNOWN;
        }

        if (this.hasCompileError()) {
            return EvalJob.ResultStatus.COMPILE_ERROR;
        }

        if (this.hasInternalJudgeError()) {
            return EvalJob.ResultStatus.INTERNAL_JUDGE_ERROR;
        }

        let lastTest = this.getLastTest();
        if (!lastTest) {
            return EvalJob.ResultStatus.UNKNOWN;
        }

        if (lastTest.internalStatus === RunStatusCodes.TIME_LIMIT_EXCEEDED) {
            return EvalJob.ResultStatus.TIME_LIMIT_EXCEEDED;
        }

        if (lastTest.internalStatus === RunStatusCodes.RUNTIME_ERROR) {
            return EvalJob.ResultStatus.RUNTIME_ERROR;
        }

        if (lastTest.internalStatus === RunStatusCodes.MEMORY_LIMIT_EXCEEDED) {
            if (parseInt(lastTest.signalCode) === 9) {
                return EvalJob.ResultStatus.MEMORY_LIMIT_EXCEEDED;
            }
            return EvalJob.ResultStatus.KILLED_BY_SIGNAL;
        }

        return EvalJob.ResultStatus.ACCEPTED;
    }

    getNumTestsPassed() {
        let testsPassed = 0;
        for (const test of this.tests.concat(this.exampleTests)) {
            if (test.checkerPassed) {
                testsPassed += 1;
            }
        }
        return testsPassed;
    }

    hasInternalJudgeError() {
        const lastTest = this.getLastTest();
        return lastTest && lastTest.internalStatus === RunStatusCodes.INTERNAL_ERROR;
    }

    getExampleTest(testId) {
        let evalTask = this.getEvalTask();
        if (!evalTask) {
            return null;
        }

        for (let exampleTest of evalTask.exampleTests || []) {
            if (exampleTest.id === parseInt(testId)) {
                return exampleTest;
            }
        }
        return null;
    }
}

class EvalJobStoreClass extends AjaxFetchMixin(GenericObjectStore) {
    constructor() {
        super("evaljob", EvalJob, {
            fetchURL: "/eval/get_eval_jobs/",
            maxFetchObjectCount: 64,
            dependencies: ["evaltask", "publicuser"]
        });
    }

    applyEvent(event) {
        if (event.type === "reevalDone") {
            return this.dispatch("reevalDone", event);
        }
        return super.applyEvent(event);
    }

    getFetchRequestData(ids, fetchJobs) {
        let requestData = super.getFetchRequestData(ids, fetchJobs);
        let contestRequests = [];
        for (const fetchJob of fetchJobs) {
            if (fetchJob.requestContest) {
                contestRequests.push(fetchJob.id);
            }
        }
        if (contestRequests.length > 0) {
            requestData.contestRequests = contestRequests;
        }
        return requestData;
    }

    fetchWithContest(id, successCallback, errorCallback, forceFetch = false) {
        this.fetch(id, successCallback, errorCallback, forceFetch);
        let fetchJob = this.fetchJobs[this.fetchJobs.length - 1];
        fetchJob.requestContest = true;
    }
}

export const EvalJobStore = new EvalJobStoreClass();