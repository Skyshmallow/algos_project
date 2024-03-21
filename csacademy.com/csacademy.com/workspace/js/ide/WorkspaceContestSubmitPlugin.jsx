import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {Modal} from "../../../stemjs/src/ui/modal/Modal.jsx";
import {Button} from "../../../stemjs/src/ui/button/Button.jsx";
import {Level} from "../../../stemjs/src/ui/Constants.js";
import {RawCheckboxInput} from "../../../stemjs/src/ui/input/Input.jsx";
import {FormField} from "../../../stemjs/src/ui/form/Form.jsx";
import {Link} from "../../../stemjs/src/ui/primitives/Link.jsx";
import {VirtualParticipationButton} from "../../../contest/js/ContestList.jsx";
import {Dispatcher} from "../../../stemjs/src/base/Dispatcher.js";
import {EvalJobStore} from "../../../eval/js/state/EvalJobStore.js";
import {ContestTaskStore} from "../../../contest/js/state/ContestTaskStore.js";
import {ErrorHandlers} from "../../../establishment/errors/js/ErrorHandlers.js";
import {FixedURLAjaxHandler} from "../../../stemjs/src/base/Ajax.js";
import {workspaceButtonStyle} from "./WorkspaceStyle";

import {WorkspacePlugin} from "./WorkspacePlugin";
import {InQueuePopupManager} from "./InQueuePopupManager";
import {EvalTaskExamplesPanel} from "../../../eval/js/EvalTaskExamplesPanel.jsx";
import {SubmissionStatusPanel} from "../../../eval/js/SubmissionStatusPanel.jsx";


class ContestNotRunningModal extends Modal {
    render() {
        return [
            <h3>The contest is not currently running.</h3>,
            <VirtualParticipationButton modalOptions={{contest: this.options.contest}} />,
            <Button label={UI.T(`Submit in ${this.options.archiveName}`)} style={{margin: "20px"}}
                       level={Level.PRIMARY}
                       onClick={() => {
                this.options.parent.submitCode(this.options.onlyExamples, this.options.archiveTaskId);
                this.hide();
            }}/>,
            <Link style={{margin: "20px"}} href={`/contest/${this.options.archiveUrl}/task/` + this.options.evalTask.urlName}
                value={UI.T(`Open task in ${this.options.archiveName}`)} />,
            <div>
                <FormField label="Always submit in archive">
                    <RawCheckboxInput ref="disableCheckbox"/>
                </FormField>
            </div>
        ];
    }

    onMount() {
        super.onMount();
        this.disableCheckbox.addChangeListener(() => {
            this.options.parent.contestNotRunningModalDisabled = !this.options.parent.contestNotRunningModalDisabled;
        })
    }

    hide() {
        this.options.parent.setSubmissionDisabled(false);
        super.hide();
    }
}

const ContestSubmitAjax = new FixedURLAjaxHandler("/eval/submit_evaljob/");

export class WorkspaceContestSubmitPlugin extends WorkspacePlugin {
    static priorityIndex = 600;

    constructor(workspaceIDE) {
        super(workspaceIDE);

        let tabArea = workspaceIDE.tabArea;

        this.workspace = this.workspaceIDE.workspace;

        this.contestTask = ContestTaskStore.get(this.workspaceIDE.options.contestTaskId);
        this.evalTask = this.contestTask.getEvalTask();
        this.contest = this.contestTask.getContest();

        tabArea.appendChild(<EvalTaskExamplesPanel
            ref={this.refLink("examplesTab")}
            title={UI.T("Examples")}
            evalTask={this.evalTask}
        />);

        // TODO: We want to remount this onclick
        tabArea.appendChild(<SubmissionStatusPanel ref={this.refLink("submissionTab")} title={UI.T("Submission")}
                                                   evalTask={this.evalTask}/>);
        this.workspaceIDE.optionButtonsBottom.appendChild(
            <span ref={this.refLink("runExamplesPopupContainer")} style={{position: "relative"}}>
                <Button ref={this.refLink("runExamplesButton")} HTMLtitle={"Press " + (navigator.platform.match("Mac") ? "Cmd" : "Ctrl") + " + E to run examples"}
                        className={workspaceButtonStyle.RUN} icon="check" label={UI.T("Run examples")}/>
            </span>);

        this.workspaceIDE.optionButtonsBottom.appendChild(
            <span ref={this.refLink("submitPopupContainer")} style={{position: "relative"}}>
                <Button
                    ref={this.refLink("submitButton")}
                    HTMLtitle={"Press " + (navigator.platform.match("Mac") ? "Cmd" : "Ctrl") + " + U to submit"}
                    className={workspaceButtonStyle.SUBMIT}
                    icon="paper-plane"
                    label={UI.T("Submit")}
                />
            </span>);

        this.submitButton.addClickListener((event) => {
            event.stopPropagation();
            this.submitCode();
            this.workspaceIDE.maximizeTabSection();
        });

        this.runExamplesButton.addClickListener(() => {
            this.examplesTab.show();
            this.examplesTab.dispatch("show");
            this.submitCode(true);
            this.workspaceIDE.maximizeTabSection();
        });

        EvalJobStore.addCreateListener((evalJob) => {
            if (evalJob.statusStream.endsWith(this.workspace.sessionId)) {
                this.setEvalJob(evalJob);
            }
        });

        this.workspaceIDE.addListener("submissionStarted", (event) => {
            this.setSubmissionDisabled(true);
            InQueuePopupManager.cancelInQueuePopup();
        });

        this.workspaceIDE.addListener("submissionRunFinished", (event) => {
            this.setSubmissionDisabled(false);
        });

        Dispatcher.Global.addListener("loadEvalJobSource", (event) => {
            let evalJob = event.evalJob;
            if (evalJob.contestTaskId != this.contestTask.id) {
                return;
            }
            let programmingLanguage = event.evalJob.getProgrammingLanguage();
            this.workspaceIDE.getPlugin("FileManager").updateProgrammingLanguage(programmingLanguage);
            this.workspaceIDE.codeEditor.setValue(evalJob.sourceText, true);
            this.workspaceIDE.resizeCodeEditor();
            Dispatcher.Global.dispatch("finishedLoadEvalJobSource");
        });
    };

    static pluginName() {
        return "ContestSubmit";
    }

    setSubmissionDisabled(disabled, internal=true) {
        this.submitButton.setEnabled(!disabled);
        this.runExamplesButton.setEnabled(!disabled);

        if (this.workspaceIDE.getPlugin("CustomRun") && internal) {
            this.workspaceIDE.getPlugin("CustomRun").setSubmissionDisabled(disabled, false);
        }
    };

    showContestNotRunningModal(archiveTaskId, archiveUrl, archiveName, onlyExamples) {
        if (this.contestNotRunningModalDisabled) {
            this.submitCode(onlyExamples, archiveTaskId);
        } else {
            ContestNotRunningModal.show({
                archiveTaskId: archiveTaskId,
                archiveUrl: archiveUrl,
                archiveName: archiveName,
                contest: this.contest,
                evalTask: this.evalTask,
                overflow: "auto",
                parent: this,
                onlyExamples: onlyExamples,
                fillScreen: true,
            });
        }
    }

    getAjaxHandler() {
        return this.ajaxHandler || ContestSubmitAjax;
    }

    setAjaxHandler(ajaxHandler) {
        this.ajaxHandler = ajaxHandler;
    }

    submitCode(onlyExamples, contestTaskId=-1) {
        let workspaceFile = this.workspaceIDE.codeEditor.getFile();
        let request = this.workspace.getBaseRequest();

        if (contestTaskId === -1) {
            request.contestTaskId = this.contestTask.id;
        } else {
            request.contestTaskId = contestTaskId;
        }
        request.sourceCode = workspaceFile.getValue();
        //TODO: this should be rename to languageId
        request.programmingLanguageId = this.workspaceIDE.getPlugin("FileManager").getSelectedProgrammingLanguage().id;

        if (onlyExamples) {
            request.onlyExamples = true;
        }

        this.resetStatus();
        this.setSubmissionDisabled(true);

        this.getAjaxHandler().postJSON(request).then(
            (data) => {
                const evalJobId = data.evalJobId;
                const evalJob = EvalJobStore.get(evalJobId);
                if (evalJob?.compileStarted) {
                    // Results through WebSocket came before the XHR.
                    // Thus, no popup needs to be displayed.
                    return;
                }
                let target = this.submitButton;
                if (onlyExamples) {
                    target = this.runExamplesButton;
                }
                InQueuePopupManager.scheduleInQueuePopup(target, data.estimatedWait, () => {
                    this.setSubmissionDisabled(false);
                });
            },
            (error) => {
                if (error.message === "The contest is not running" && error.archiveTask) {
                    ContestTaskStore.create(error.archiveTask);
                    this.showContestNotRunningModal(error.archiveTask.id, error.archiveUrl, error.archiveName, onlyExamples);
                } else {
                    ErrorHandlers.showErrorAlert("Error in submitting code:\n" + error.message);
                    this.setSubmissionDisabled(false);
                }
            }
        );
    };

    setEvalJob(evalJob) {
        this.examplesTab.setEvalJob(evalJob);
        this.workspaceIDE.getPlugin("CustomRun").compilationStatusTab.setCustomRun(evalJob);

        if (!evalJob.onlyExamples) {
            this.submissionTab.setEvalJob(evalJob);
        }

        this.attachChangeListener(evalJob, (event) => {
            if (event.type === "started") {
                this.workspaceIDE.dispatch("compileStarted", event);
                this.workspaceIDE.dispatch("submissionStarted", event);
            } else if (event.type === "compile_status") {
                this.workspaceIDE.dispatch("compileStatus", event);
                if (!event.data.compileOK) {
                    this.setSubmissionDisabled(false);
                }
            } else if (event.type === "test_results") {
                this.workspaceIDE.dispatch("submissionTestResult", event);
            }  else if (event.type === "finished") {
                this.workspaceIDE.dispatch("submissionRunFinished", event);
            }
        })
    }

    resetStatus() {
        // Reset progress bar
        this.submissionTab.setEvalJob(null);

        // Reset counters
        this.numTests = 0;
        this.numTestsDone = 0;
        this.currentTest = 0;
        this.worstCPU = 0;
        this.worstMemory = 0;
    };
}
