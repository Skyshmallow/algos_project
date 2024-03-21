import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {Panel} from "../../../stemjs/src/ui/UIPrimitives.jsx";
import {Button} from "../../../stemjs/src/ui/button/Button.jsx";
import {Dispatcher} from "../../../stemjs/src/base/Dispatcher.js";
import {Ajax} from "../../../stemjs/src/base/Ajax.js";
import {ErrorHandlers} from "../../../establishment/errors/js/ErrorHandlers.js";
import {WebsocketSubscriber} from "../../../stemjs/src/websocket/client/WebsocketSubscriber.js";
import {GlobalState} from "../../../stemjs/src/state/State.js";
import {CustomRunStore} from "../../../eval/js/state/CustomRunStore.js";
import {UserStore} from "../../../csaaccounts/js/state/UserStore.js";
import {workspaceButtonStyle} from "./WorkspaceStyle";

import {UserInputEditor, InputFileEditor} from "./FileCodeEditor";
import {WorkspacePlugin} from "./WorkspacePlugin";
import {InQueuePopupManager} from "./InQueuePopupManager";
import {CompilationStatusPanel, ExecutionStatusPanel} from "../CustomRunUtils";


class WorkspaceCustomRunPlugin extends WorkspacePlugin {
    static priorityIndex = 500;

    constructor(workspaceIDE) {
        super(workspaceIDE);

        let tabArea = workspaceIDE.tabArea;

        let codeEditorOptions = Object.assign({}, this.workspaceIDE.codeEditorOptions, {
            className: "custom-height",
            style: {
                height: "100%",
            },
            fontSize: UserStore.getCurrentUser().getFileFontSize(),
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
        });
        tabArea.appendChild(<Panel ref={this.refLink("inputEditorTab")} title={UI.T("Input")} active="true">
            <InputFileEditor ref={this.refLink("inputEditor")} {...codeEditorOptions}/>
        </Panel>);

        tabArea.appendChild(<Panel ref={this.refLink("outputEditorTab")} title={UI.T("Output")}>
            <UserInputEditor ref={this.refLink("outputEditor")} {...codeEditorOptions}/>
        </Panel>);

        tabArea.appendChild(<Panel ref={this.refLink("stderrEditorTab")} title={UI.T("Stderr")}>
            <UserInputEditor ref={this.refLink("stderrEditor")} {...codeEditorOptions}/>
        </Panel>);

        tabArea.appendChild(<CompilationStatusPanel ref={this.refLink("compilationStatusTab")} style={{height: "100%"}} title={UI.T("Compilation")} />);
        tabArea.appendChild(<ExecutionStatusPanel ref={this.refLink("executionStatusTab")} style={{height: "100%"}} title={UI.T("Execution")} />);

        this.workspace = workspaceIDE.workspace;

        this.workspaceIDE.optionButtonsBottom.appendChild(
            <span ref={this.refLink("compilePopupContainer")} style={{position: "relative"}}>
                <Button ref={this.refLink("compileButton")} icon="cogs" HTMLtitle={"Press " + (navigator.platform.match("Mac") ? "Cmd" : "Ctrl") + " + B to compile"}
                        className={workspaceButtonStyle.COMPILE} label={UI.T("Compile")} />
            </span>);

        this.workspaceIDE.optionButtonsBottom.appendChild(
            <span ref={this.refLink("runInputPopupContainer")} style={{position: "relative"}}>
                <Button ref={this.refLink("runInputButton")} HTMLtitle={"Press " + (navigator.platform.match("Mac") ? "Cmd" : "Ctrl") + " + I to run input"}
                        icon="play" label={UI.T("Run input")} className={workspaceButtonStyle.RUN} />
            </span>);

        this.compileButton.addClickListener((event) => {
            event.stopPropagation();
            this.workspaceIDE.maximizeTabSection();
            this.compileCode();
        });

        this.runInputButton.addClickListener((event) => {
            this.workspaceIDE.maximizeTabSection();
            event.stopPropagation();
            this.runCode();
        });

        this.inputEditor.setFile(this.workspace.getOrCreateFile(".stdin"));

        tabArea.addListener("resize", () => {
            this.inputEditor.dispatch("resize");
            this.outputEditor.dispatch("resize");
            this.stderrEditor.dispatch("resize");
        });

        this.exportFunctions();

        GlobalState.registerStream("workspacesession-" + this.workspace.userId + "-" + this.workspace.sessionId);

        CustomRunStore.addCreateListener((customRun) => {
            this.compilationStatusTab.setCustomRun(customRun);
            this.executionStatusTab.setCustomRun(customRun);
        });

        WebsocketSubscriber.addListener("workspacesession-" + this.workspace.userId + "-" + this.workspace.sessionId, (event) => {
            if (event.type === "started") {
                this.workspaceIDE.dispatch("compileStarted", event);
            } else if (event.type === "compile_status") {
                this.workspaceIDE.dispatch("compileStatus", event);
            } else if (event.type === "runResults") {
                this.workspaceIDE.dispatch("customRunTestResult", event);
            } else if (event.type === "finished") {
                this.workspaceIDE.dispatch("customRunFinished", event);
            }
            InQueuePopupManager.cancelInQueuePopup();
        });

        this.workspaceIDE.addListener("compileStarted", (event) => {
            this.setCompilationStarted();
        });

        this.workspaceIDE.addListener("compileStatus", (event) => {
            this.setCompilationStatus(event.data);
        });

        this.workspaceIDE.addListener("customRunTestResult", (event) => {
            this.setCustomTestResult(event.data);
            this.stderrEditor.dispatch("resize");
        });

        this.workspaceIDE.addListener("submissionRunFinished", (event) => {
            this.enableSubmission();
        });
        this.workspaceIDE.addListener("customRunTestResult", (event) => {
            this.enableSubmissionDelayed();
        });
        this.workspaceIDE.addListener("customRunFinished", (event) => {
            this.enableSubmissionDelayed();
        });

        Dispatcher.Global.addListener("loadWorkspaceInput", (input) => {
            this.inputEditor.setValue(input);
            this.inputEditorTab.show();
            this.inputEditorTab.dispatch("show");
        });
    };

    static pluginName() {
        return "CustomRun";
    }

    setSubmissionDisabled(disabled, internal=true) {
        // TODO: This should NOT be named setSubmissionDisabled
        this.runInputButton.setEnabled(!disabled);
        this.compileButton.setEnabled(!disabled);

        if (this.workspaceIDE.getPlugin("ContestSubmit") && internal) {
            this.workspaceIDE.getPlugin("ContestSubmit").setSubmissionDisabled(disabled, false);
        }
    };

    enableSubmission() {
        this.compileButton.setLabel(UI.T("Compile"));
        this.compileButton.setLevel("info");
        this.setSubmissionDisabled(false);
    };

    enableSubmissionDelayed() {
        setTimeout(() => {
            this.enableSubmission();
        }, 200);
    }
    // TODO: This can be taken out and placed in an interaction layer with the website
    submitCode(workspaceFile, compileOnly) {
        this.setSubmissionDisabled(true);

        console.log("Submitting file: ", workspaceFile);

        let request = this.workspace.getBaseRequest();

        request.sourceCode = workspaceFile.getValue();
        //TODO: this should be rename to languageId
        request.programmingLanguageId = this.workspaceIDE.getPlugin("FileManager").getSelectedProgrammingLanguage().id;


        if (compileOnly) {
            request.compileOnly = true;
        } else {
            request.customInput = this.getInputEditor().getValue();
        }

        if (this.workspaceIDE.options.contestTaskId) {
            request.contestTaskId = this.workspaceIDE.options.contestTaskId;
        }

        Ajax.postJSON("/eval/submit_custom_run/", request).then(
            (data) => {
                const jobId = data.customRunId;
                const customRun = CustomRunStore.get(jobId);
                if (customRun && customRun.compileStarted) {
                    return; // The results through WebSocket came faster than the results through the Ajax
                            // Thus, no popup needs to be shown.
                }
                let target = this.runInputButton;
                if (compileOnly) {
                    target = this.compileButton;
                }
                InQueuePopupManager.scheduleInQueuePopup(target, data.estimatedWait, () => {
                    this.enableSubmission();
                });
            },
            (error) => {
                ErrorHandlers.showErrorAlert("Error in compiling/running custom code:\n" + error.message);
                this.enableSubmission();
            }
        );
    };

    compileCode() {
        this.submitCode(this.workspaceIDE.codeEditor.getFile(), true);
        this.compilationStatusTab.show();
        this.compilationStatusTab.dispatch("show");
    };

    runCode() {
        this.submitCode(this.workspaceIDE.codeEditor.getFile(), false);
    };

    getInputEditor() {
        return this.inputEditor;
    };

    //TODO: reconsider how to allow for external input Editor access
    exportFunctions() {
        this.workspaceIDE.getInputEditor = function () {
            return this.inputEditor;
        }
    };

    setCompilationStarted() {
        this.compileButton.setLevel("warning");
        this.compileButton.setLabel(UI.T("Compiling..."));
        this.setSubmissionDisabled(true);
    };

    setCompilationStatus(compilationStatus) {
        if (compilationStatus.compileOK === true) {
            this.compileButton.setLabel(UI.T("Compiled"));
            this.compileButton.setLevel("success");
        } else {
            this.compileButton.setLabel("Compilation error!");
            this.compileButton.setLevel("danger");
            this.enableSubmissionDelayed();
            this.compilationStatusTab.show();
            this.compilationStatusTab.dispatch("show");
            // TODO: focus on the compilation results tab
        }
    };

    setCustomTestResult(data) {
        if (data.hasOwnProperty("stderr")) {
            this.stderrEditor.setValue(data.stderr);
            // TODO: show to stderr tab and focus on it
        }

        if (data.results.terminationReason) {
            this.executionStatusTab.show();
            this.executionStatusTab.dispatch("show");
        } else {
            this.outputEditorTab.show();
            this.outputEditorTab.dispatch("show");
        }

        this.outputEditor.setValue(data.stdout || "");
    };
}

export {WorkspaceCustomRunPlugin};
