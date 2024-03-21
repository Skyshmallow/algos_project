import {Dispatcher} from "../../stemjs/src/base/Dispatcher.js";
import {
    UI, CollapsiblePanel, Panel, Button,
    FormField, Select, NumberInput, RawCheckboxInput, Level, Modal,
    StyleSheet, styleRule, registerStyle, Theme
} from "../../csabase/js/UI.js";
import {FlatTabArea} from "../../stemjs/src/ui/tabs/FlatTabArea.jsx";
import {StaticCodeHighlighter} from "../../stemjs/src/ui/CodeEditor.jsx";
import {CompilationStatusPanel} from "../../workspace/js/CustomRunUtils.jsx";
import {GlobalState} from "../../stemjs/src/state/State.js";
import {ContestStore} from "../../contest/js/state/ContestStore.js";
import {ProgrammingLanguage} from "../../csabase/js/state/ProgrammingLanguageStore.js";
import {PrivateArchiveStore} from "../../contest/js/state/PrivateArchiveStore.js";
import {DateTimePicker} from "../../stemjs/src/ui/DateTimePicker.jsx";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {FileSaver} from "../../stemjs/src/base/FileSaver.js";
import {GlobalStyle} from "../../stemjs/src/ui/GlobalStyle.js";
import {enhance} from "../../stemjs/src/ui/Color.js";
import {autoredraw} from "../../stemjs/src/decorators/AutoRedraw.js";

import {EvalJob, EvalJobStore} from "./state/EvalJobStore.js";
import {EvalJobUIHandler, EvalJobSummaryPanel} from "./EvalJobSummaryPanel.js";
import {SubmissionStatusPanel} from "./SubmissionStatusPanel.jsx";
import {cleanObject} from "../../stemjs/src/base/Utils.js";


class SubmissionModal extends Modal {
    hide() {
        super.hide();
        // Refocus the submission once the modal is hid, so that user will know what submission the modal came from.
        this.options.submissionSummary.node.focus();
    }
}


class EvalJobSourcePanel extends UI.Element {
    getEvalJob() {
        return this.options.evalJob;
    }

    render() {
        const {evalJob} = this.options;
        const buttonStyle = {margin: "0.3em"};

        let codeHighlighterOptions = {};
        const programmingLanguage = evalJob.getProgrammingLanguage();

        if (programmingLanguage) {
            codeHighlighterOptions.aceMode = programmingLanguage.aceMode;
        }

        return [
            <div key="optionButtons" className="row" style={{padding: "10px"}}>
                <Button ref="downloadSourceButton"
                        label={UI.T("Download Source")}
                        level={Level.INFO} icon="download" style={buttonStyle}/>
                <Button ref="loadInWorkspaceButton"
                        label={UI.T("Load in Workspace")}
                        level={Level.INFO} style={buttonStyle}/>
            </div>,
            <StaticCodeHighlighter ref="sourceCodeHighlighter"
                                   value={evalJob.sourceText}
                                   maxLines={this.options.maxCodeLines || 32}
                                   {...codeHighlighterOptions}/>
        ]
    }

    onMount() {
        this.downloadSourceButton.addClickListener(() => {
            let fileContentBlob = new Blob([this.getEvalJob().sourceText], {type: "text/plain;charset=utf-8"});
            let programmingLanguage = this.getEvalJob().getProgrammingLanguage();
            let fileName = this.getEvalJob().id;

            if (programmingLanguage) {
                fileName += "." + programmingLanguage.getExtension();
            }

            FileSaver.saveAs(fileContentBlob, fileName);
        });

        this.loadInWorkspaceButton.addClickListener(() => {
            Dispatcher.Global.dispatch("loadEvalJobSource", {evalJob: this.getEvalJob()});
        });
    }
}


class SubmissionSummaryTabArea extends UI.Element {
    render() {
        const {evalJob} = this.options;

        let panelStyle = {padding: "1em"};

        this.options.style = {padding: "0px", margin: "0px"};

        return <FlatTabArea>
                <Panel ref="sourceCodeTabPanel" title={UI.T("Source")} style={panelStyle}>
                    <EvalJobSourcePanel evalJob={evalJob} />
                </Panel>
                <Panel ref="summaryTabPanel"
                       title={UI.T("Summary")}
                       style={panelStyle}>
                    <EvalJobSummaryPanel evalJob={evalJob} />
                </Panel>
                <Panel ref="resultsTabPanel"
                       title={UI.T("Results")}
                       style={panelStyle}>
                    <SubmissionStatusPanel evalJob={evalJob} />
                </Panel>
                <Panel ref="compilationTabPanel"
                       title={UI.T("Compilation messages")}
                       style={panelStyle}>
                   <CompilationStatusPanel customRun={evalJob} />
                </Panel>
            </FlatTabArea>;
    }
}


class SubmissionSummaryStyle extends StyleSheet {
    @styleRule
    submissionSummary = {
        backgroundColor: "white",
        cursor: "pointer",
        margin: "10px 0",
        padding: "10px 15px",
        boxShadow: "0 1px 3px " + enhance(Theme.Global.properties.COLOR_BACKGROUND, 0.3),
        transition: "0.2s",
        ":hover": {
            boxShadow: "0 1px 5px " + enhance(Theme.Global.properties.COLOR_BACKGROUND, 0.5),
            transition: "0.2s",
        },
    };
}


@autoredraw
@registerStyle(SubmissionSummaryStyle)
class SubmissionSummary extends UI.Element {
    extraNodeAttributes(attr) {
        attr.addClass(this.styleSheet.submissionSummary);
        // Element needs a tab index so that focus works.
        attr.setAttribute("tabindex", "0");
    }

    getEvalJob() {
        return this.options.evalJob;
    }

    render() {
        const {hideTaskName, includeComment} = this.options;
        const evalJobUIHandler = new EvalJobUIHandler(this.getEvalJob());
        const comment = includeComment && evalJobUIHandler.getComment();

        return <div>{[
            evalJobUIHandler.getJobIdWithExternalLink(),
            " ",
            evalJobUIHandler.getTimeSubmitted(),
            " ",
            evalJobUIHandler.getUserHandle(),
            " -- ",
            comment && [comment, " "],
            !hideTaskName && evalJobUIHandler.getTask(),
            " ",
            evalJobUIHandler.getContest(),
            " -- ",
            evalJobUIHandler.getStatus(),
        ]}</div>;
    }

    onMount() {
        this.addClickListener(() => {
            SubmissionModal.show({
                fillScreen: true,
                children: [<SubmissionSummaryTabArea evalJob={this.getEvalJob()} />],
                submissionSummary: this,
            });
        });

        this.attachChangeListener(this.getEvalJob(), () => {
            this.redraw();
        });
    }
}


class SubmissionSummaryPanel extends Panel {
    constructor(options) {
        super(options);
        this.submissionSummaryMap = new Map();
    }

    setOptions(options) {
        super.setOptions(options);

        this.fetchEvalJobs();
    }

    editFilters(filters) {
        const newFilters = {
            ...this.options.filters,
            ...filters,
        }
        this.updateOptions({filters: newFilters}); // Will also redraw filters
    }

    render() {
        let evalJobs = EvalJobStore.all().filter((evalJob) => this.filterEvalJob(evalJob)).sort((a, b) => {
            return b.id - a.id;
        });

        this.options.children = evalJobs.map(evalJob => this.getSubmissionSummary(evalJob));
        return this.options.children;
    }

    getSubmissionSummary(evalJob) {
        return <SubmissionSummary evalJob={evalJob} key={evalJob.id} />;
    }

    onMount() {
        super.onMount();

        this.attachCreateListener(EvalJobStore, (evalJob) => {
            if (this.filterEvalJob(evalJob)) {
                let submissionSummary = this.getSubmissionSummary(evalJob);

                let numChildren = this.options.children.length;

                if (numChildren === 0) {
                    this.appendChild(submissionSummary);
                    return;
                }

                let maxId = this.options.children[0].options.evalJob.id;
                let minId = this.options.children[numChildren - 1].options.evalJob.id;

                if (evalJob.id > maxId) {
                    this.insertChild(submissionSummary);
                } else if (evalJob.id < minId) {
                    this.appendChild(submissionSummary);
                } else {
                    let checkPosition = (position) => {
                        if (position >= numChildren) {
                            return false;
                        }

                        let positionId = this.options.children[position].options.evalJob.id;
                        return positionId > evalJob.id;
                    };

                    let position = -1;
                    for (let bit = (1 << 20); bit > 0; bit >>= 1) {
                        if (checkPosition(position + bit)) {
                            position += bit;
                        }
                    }
                    position += 1;

                    if (this.options.children[position].options.evalJob.id < evalJob.id) {
                        this.insertChild(submissionSummary, position);
                    }
                }
            }
        });

    }

    getFilters() {
        return this.options.filters;
    }

    filterEvalJob(evalJob) {
        let filters = Object.assign({
            examplesPassed: true,
            onlyExamples: false,
        }, this.getFilters());

        if (filters.onlyWithComments && (!evalJob.comment && !evalJob.expectedResult)) {
            return false;
        }

        if (filters.startTime && evalJob.timeSubmitted < filters.startTime) {
            return false;
        }

        if (filters.endTime && evalJob.timeSubmitted > filters.endTime) {
            return false;
        }

        if (filters.status && evalJob.getStatus() !== filters.status) {
            return false;
        }

        if (filters.resultStatus && (evalJob.getStatus() !== EvalJob.Status.DONE || evalJob.getResultStatus() !== filters.resultStatus)) {
            return false;
        }

        const strictFilters = ["userId", "contestId", "contestTaskId", "evalTaskId", "score", "programmingLanguageId", "onlyExamples"];

        for (let filter of strictFilters) {
            if (filters.hasOwnProperty(filter) && evalJob[filter] !== filters[filter]) {
                return false;
            }
        }

        return true;
    }

    fetchEvalJobs(requestCount=false) {
        let request = this.getEvalJobRequest(requestCount);

        Ajax.getJSON("/eval/get_eval_jobs/", request).then(
            (data) => {
                if (data.jobCount) {
                    EvalJobStore.jobCount = data.jobCount;
                }
            },
            () => {}
        );
    }

    getEvalJobRequest(requestCount, numJobs=200) {
        let request = {
            numJobs: numJobs || 200,
            requestCount: requestCount,
        };

        Object.assign(request, this.getFilters());

        return cleanObject(request);
    }
}

class SubmissionSummaryMarkup extends UI.Element {
    setOptions(options) {
        super.setOptions(options);
        this.options.evalJobId = this.options.evalJobId || this.options.id;
        this.options.evalJob = EvalJobStore.get(this.options.evalJobId);
    }

    render() {
        if (this.options.error) {
            return [
                <span className="fa fa-warning" />,
                <strong>Failed to open submission with id {this.options.evalJobId}</strong>];
        }
        if (this.options.evalJob) {
            return [<SubmissionSummary evalJob={this.options.evalJob} maxCodeLines={32} />];
        } else {
            let onSuccess = (evalJob) => {
                this.options.evalJob = evalJob;
                if (!this.node) {
                    this.createNode();
                }
                this.redraw();
            };

            let onError = (error) => {
                this.options.error = error || "Error";
                this.redraw();
            };

            // TODO: handle failure to fetch
            EvalJobStore.fetch(this.options.evalJobId, onSuccess, onError);
            return [];
        }
    }
}

function GetProgrammingLanguageOptions(noSelectedOptionName="") {
    return [
        {toString: () => noSelectedOptionName},
        ...ProgrammingLanguage.all()
    ];
}

function GetStatusOptions() {
    return [
        {toString: () => ""},
        {value: EvalJob.Status.WAITING, toString: () => "Waiting"},
        {value: EvalJob.Status.COMPILING, toString: () => "Compiling"},
        {value: EvalJob.Status.RUNNING, toString: () => "Running"},
        {value: EvalJob.Status.DONE, toString: () => "Done"},
    ];
}

function GetResultStatusOptions() {
    return [
        {toString: () => ""},
        {value: EvalJob.ResultStatus.TIME_LIMIT_EXCEEDED, toString: () => "Time Limit Exceeded"},
        {value: EvalJob.ResultStatus.MEMORY_LIMIT_EXCEEDED, toString: () => "Memory Limit Exceeded"},
        {value: EvalJob.ResultStatus.RUNTIME_ERROR, toString: () => "Runtime Error"},
        {value: EvalJob.ResultStatus.KILLED_BY_SIGNAL, toString: () => "Killed by signal"},
        {value: EvalJob.ResultStatus.WRONG_ANSWER, toString: () => "Wrong answer"},
        {value: EvalJob.ResultStatus.ACCEPTED, toString: () => "Accepted"},
        {value: EvalJob.ResultStatus.UNKNOWN, toString: () => "Internal Judge Error!"},
    ];
}

class SubmissionSummaryGlobalFilter extends UI.Element {
    extraNodeAttributes(attr) {
        attr.addClass(GlobalStyle.SMALL);
        attr.setStyle({
            width: 900,
            maxWidth: "calc(100% - 30px)",
            margin: "0 auto",
            padding: 15,
        });
    }

    render() {
        let statusOptions = GetStatusOptions();
        let resultStatusOptions = GetResultStatusOptions();
        let programmingLanguageOptions = GetProgrammingLanguageOptions();

        return [
            <h2>Filter jobs</h2>,
            <div>
                <FormField label="After:" inline>
                    <DateTimePicker ref="startTimePicker"/>
                </FormField>
                <FormField label="Before:" inline>
                    <DateTimePicker ref="endTimePicker"/>
                </FormField>
                <FormField label="Status:" inline>
                    <Select options={statusOptions} ref="statusSelect"/>
                </FormField>
                <FormField label="Result status:" inline>
                    <Select options={resultStatusOptions} ref="resultStatusSelect"/>
                </FormField>
                <FormField label="User id:" inline>
                    <NumberInput ref="userIdInput"/>
                </FormField>
                <FormField label="Language:">
                    <Select options={programmingLanguageOptions} ref="programmingLanguageSelect"/>
                </FormField>
                <FormField label=" ">
                    <div><Button level={Level.PRIMARY} label={UI.T("Set filter")} onClick={() => this.setFilters()}/></div>
                </FormField>
            </div>,
            <br/>,
            <SubmissionSummaryPanel ref="submissionSummaryPanel"/>
        ];
    }

    setFilters() {
        let filters = {};

        let startTime = this.startTimePicker.getDate();
        if (startTime) {
            if (!startTime.isValid()) {
                alert("Invalid time");
                return;
            }
            filters.startTime = startTime.unix();
        }

        let endTime = this.endTimePicker.getDate();
        if (endTime) {
            if (!endTime.isValid()) {
                alert("Invalid time");
                return;
            }
            filters.endTime = endTime.unix();
        }

        let status = this.statusSelect.get().value;
        if (status) {
            filters.status = status;
        }

        let resultStatus = this.resultStatusSelect.get().value;
        if (resultStatus) {
            filters.resultStatus = resultStatus;
        }

        let programmingLanguageId = this.programmingLanguageSelect.get().id;
        if (programmingLanguageId) {
            filters.programmingLanguageId = programmingLanguageId;
        }

        let userId = this.userIdInput.getValue();
        if (userId) {
            filters.userId = userId;
        }

        this.submissionSummaryPanel.updateOptions({ filters });
    }

    onMount() {
        GlobalState.registerStream("evaljobs");
    }
}

class SubmissionSummaryContestFilter extends UI.Element {
    setOptions(options) {
        super.setOptions(options);

        this.contest = ContestStore.get(options.contestId);
    }

    render() {
        let filterView;
        if (this.contest.canShowPublicSources()) {
            let statusOptions = GetStatusOptions();
            let resultStatusOptions = GetResultStatusOptions();
            let programmingLanguageOptions = GetProgrammingLanguageOptions("All");

            let contestTaskSelect;
            if (!this.options.contestTaskId) {
                contestTaskSelect = <FormField label="Contest task:">
                    <Select options={[""].concat(this.contest.getContestTasks())}
                               ref="contestTaskSelect"
                    />
                </FormField>
            }

            filterView = [
                <CollapsiblePanel ref="filterView" title={UI.T("Filter jobs")} >
                    <div>
                        <FormField label="After:">
                            <DateTimePicker ref="startTimePicker"/>
                        </FormField>
                        <FormField label="Before:">
                            <DateTimePicker ref="endTimePicker"/>
                        </FormField>
                        {contestTaskSelect}
                        <FormField label="Status:">
                            <Select options={statusOptions} ref="statusSelect"/>
                        </FormField>
                        <FormField label="Result status:">
                            <Select options={resultStatusOptions} ref="resultStatusSelect"/>
                        </FormField>
                        <FormField label="Language:">
                            <Select options={programmingLanguageOptions} ref="programmingLanguageSelect"/>
                        </FormField>
                        <FormField label="Show my submissions:">
                            <RawCheckboxInput ref="userOnlyCheckbox" style={{display: "inline-block", width: "initial"}}/>
                        </FormField>
                        <FormField label=" ">
                            <div><Button level={Level.PRIMARY} label={UI.T("Set filter")} onClick={() => this.setFilters()}/></div>
                        </FormField>
                    </div>
                </CollapsiblePanel>,
            ];
        }

        return [
            filterView,
            <SubmissionSummaryPanel ref="submissionSummaryPanel" filters={this.getFilters()} />
        ];
    }

    getFilters() {
        let filters = {};

        if (!this.options.allContests) {
            filters.contestId = this.contest.id;
        }

        if (this.options.contestTaskId) {
            filters.contestTaskId = this.options.contestTaskId;
        }  else if (this.filterView) {
            let contestTask = this.contestTaskSelect.get();
            if (contestTask) {
                if (!this.options.allContests) {
                    filters.contestTaskId = contestTask.id;
                } else {
                    filters.evalTaskId = contestTask.evalTaskId;
                }
            }
        } else {
            // by default we only show own sources
            filters.userId = USER.id;
        }

        if (!this.filterView) {
            return filters;
        }

        let startTime = this.startTimePicker.getDate();
        if (startTime) {
            if (!startTime.isValid()) {
                alert("Invalid time");
                return;
            }
            filters.startTime = startTime.unix();
        }

        let endTime = this.endTimePicker.getDate();
        if (endTime) {
            if (!endTime.isValid()) {
                alert("Invalid time");
                return;
            }
            filters.endTime = endTime.unix();
        }

        let status = this.statusSelect.get().value;
        if (status) {
            filters.status = status;
        }

        let resultStatus = this.resultStatusSelect.get().value;
        if (resultStatus) {
            filters.resultStatus = resultStatus;
        }

        let programmingLanguageId = this.programmingLanguageSelect.get().id;
        if (programmingLanguageId) {
            filters.programmingLanguageId = programmingLanguageId;
        }

        let userOnly = this.userOnlyCheckbox.getValue();
        if (userOnly) {
            filters.userId = USER.id;
        }

        return filters;
    }

    setFilters() {
        this.submissionSummaryPanel.updateOptions({filters: this.getFilters()});
    }
}

class SubmissionSummaryInterviewFilter extends SubmissionSummaryPanel {
    getFilters() {
        let filters = {};

        filters.contestId = this.options.contestTask.contestId;
        filters.contestTaskId = this.options.contestTask.id;
        if (!USER.isSuperUser) {
            filters.userId = USER.id;
        }

        return filters;
    }
}

class SubmissionSummaryPrivateArchiveFilter extends UI.Element {
    render() {
        return [
            <SubmissionSummaryPanel ref="submissionSummaryPanel" filters={this.getFilters()} />
        ];
    }

    getFilters() {
        let filters = {};

        let privateArchive = PrivateArchiveStore.get(this.options.privateArchiveId);
        let contestTasks = privateArchive.getContestTasks();
        let contestTaskIds = [];
        for (let contestTask of contestTasks) {
            contestTaskIds.push(contestTask.id);
        }
        filters.contestTaskIdList = contestTaskIds;

        return filters;
    }
}

export {EvalJobUIHandler, SubmissionSummary, SubmissionSummaryStyle, SubmissionSummaryPanel, SubmissionSummaryGlobalFilter, SubmissionSummaryContestFilter,
    SubmissionSummaryInterviewFilter, SubmissionSummaryPrivateArchiveFilter, SubmissionSummaryMarkup};
