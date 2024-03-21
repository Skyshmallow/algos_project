import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {registerStyle} from "../../../stemjs/src/ui/style/Theme.js";
import {Modal} from "../../../stemjs/src/ui/modal/Modal.jsx";
import {Panel} from "../../../stemjs/src/ui/UIPrimitives.jsx";
import {Button} from "../../../stemjs/src/ui/button/Button.jsx";
import {Select} from "../../../stemjs/src/ui/input/Input.jsx";
import {FileInput} from "../../../stemjs/src/ui/input/Input.jsx";
import {Level, Size, Orientation} from "../../../stemjs/src/ui/Constants.js";
import {ProgrammingLanguage} from "../../../csabase/js/state/ProgrammingLanguageStore.js";
import {AceTheme, AceKeyboardHandler} from "../../../csabase/js/state/AceStore.js";
import {CSAHorizontalOverflow} from "../../../csabase/js/CSAHorizontalOverflow.js";
import {FullScreenable} from "../../../stemjs/src/ui/FullScreenable.js";
import {Device} from "../../../stemjs/src/base/Device.js";
import {UserStore} from "../../../csaaccounts/js/state/UserStore.js";
import {WorkspaceStyle, WorkspaceHorizontalOverflowStyle} from "./WorkspaceStyle.js";

import {FileSavingLabel, WorkspaceSectionDivider, WorkspaceTabArea} from "./WorkspaceComponents.jsx";
import {WorkspaceSettingsPanel} from "../WorkspaceSettingsPanel.jsx";
import {FileCodeEditor} from "./FileCodeEditor.jsx";


@registerStyle(WorkspaceStyle)
class WorkspacePanel extends FullScreenable(UI.Element) {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.addClass(this.styleSheet.workspace);
    }

    addFullscreenListeners() {
        this.addListener("enterFullScreen", () => {
            this.fullScreenButton.setIcon("compress");
        });

        this.addListener("exitFullScreen", () => {
            this.fullScreenButton.setIcon("expand");
        });

        this.fullScreenButton.addClickListener(() => {
            this.toggleFullScreen();
            this.resizeCodeEditor();
        });
    }

    addUploadButtonListeners() {
        if (Device.getBrowser() === "Firefox") {
            console.log("Use a different browser, for god's sake, it's for the good of the Realm.");
            this.uploadFileButton.addClickListener((event) => {
                this.uploadFile.node.click(event);
            });
        }

        this.uploadFile.node.onchange = () => {
            let reader = new FileReader();
            let file = this.uploadFile.getFile();
            console.log(file);
            if (!file) {
                return;
            }
            if (file.size > 1e6) {
                this.fileWarningModal.show();
                console.warn("File ", file.name, " too large. Skipping upload.");
                this.uploadFile.setValue("");
                return;
            }
            reader.onprogress = () => {
                this.uploadFileButton.setLevel(Level.WARNING);
                this.uploadFileButton.setLabel(UI.T("Uploading..."));
                this.uploadFileButton.disable();
            };
            reader.onload = (e) => {
                this.uploadFileButton.setLevel(Level.SUCCESS);
                this.uploadFileButton.setLabel(UI.T("Successfully uploaded!"));
                setTimeout(() => {
                    this.uploadFileButton.enable();
                    this.uploadFileButton.setLevel(Level.INFO);
                    this.uploadFileButton.setLabel(UI.T("Open file"));
                }, 700);
                let text = e.currentTarget.result;
                text.replace("\r\n","\n");
                this.codeEditor.setValue(text, 1);
                this.uploadFile.setValue("");
                this.dispatch("finishedFileUpload");
            };
            reader.readAsText(file);
        };
    }

    addTabAreaListeners() {
        setTimeout(() => {
            this.tabArea.titleArea.appendChild(<div style={{flex: "1"}} />);
            this.tabArea.titleArea.appendChild(<Button icon="chevron-down" size={Size.LARGE}
                                                       onClick={() => this.sectionDivider.collapseChild(1)}
                                                       className={this.styleSheet.menuButton}/>);
        }, 1000);

        this.expandTabAreaButton.addClickListener(() => {
            if (this.sectionDivider.panels[1].collapsed) {
                this.expandTabAreaButton.addClass(this.styleSheet.expandedButton);
            } else {
                this.expandTabAreaButton.removeClass(this.styleSheet.expandedButton);
            }
            this.sectionDivider.toggleChild(1);

        });
        this.attachListener(this.sectionDivider, "collapse", () => {
            this.expandTabAreaButton.removeClass(this.styleSheet.expandedButton);
        });
    }

    onMount() {
        super.onMount();

        this.codeSectionPanel.addListener("resize", () => this.resizeCodeEditor());
        this.addListener("resize", () => {
            this.workspaceButtons.dispatch("resize");
            this.actionButtons.dispatch("resize");
            this.tabArea.titleArea.dispatch("resize");
        });

        this.settingsButton.addClickListener(() => {
            this.workspaceSettingsWindow.toggleClass("hidden");
        });

        setTimeout(() => {
            this.addTabAreaListeners();
            this.addFullscreenListeners();
            this.addUploadButtonListeners();
        });
    }

    resizeCodeEditor() {
        this.codeEditor.dispatch("resize");
        this.tabArea.dispatch("resize");
    }

    maximizeTabSection() {
        this.expandTabAreaButton.addClass(this.styleSheet.expandedButton);
        this.sectionDivider.expandChild(1);
    }

    render() {
        let user = UserStore.getCurrentUser();
        this.codeEditorOptions = {
            aceKeyboardHandler: AceKeyboardHandler.getDefaultKeyboardHandler(),
            aceTheme: AceTheme.getDefaultTheme(),
            fontSize: user.getCodeFontSize(),
            tabSize: user.getTabSize(),
            showLineNumber: user.getShowLineNumber(),
            showPrintMargin: user.getShowPrintMargin(),
            printMarginSize: user.getPrintMarginSize(),
            enableBasicAutocompletion: user.getBasicAutocompletionStatus(),
            enableLiveAutocompletion: user.getLiveAutocompletionStatus(),
            enableSnippets: user.getSnippetsStatus()
        };
        return [
            // TODO @Andrei remove this Modal and replace with a generic error Toast/Modal
            <Modal ref="fileWarningModal">
                <h5 style={{color: "red"}}>File is too large. Skipping upload.</h5>
            </Modal>,
            <div style={{height: "100%", width: "100%", display: "flex", flexDirection: "column"}}>
                <WorkspaceSectionDivider ref="sectionDivider" orientation={Orientation.VERTICAL}
                                style={{width: "100%", height: "100%", overflow: "hidden", flex: "1"}}>
                    <Panel ref="codeSectionPanel" className="row codeSection"
                              style={{margin: "0px", height: "70%", boxSizing: "border-box", position: "relative",
                                      display: "flex", flexDirection: "column"}}>
                        <CSAHorizontalOverflow ref="workspaceButtons" className={this.styleSheet.topMenu}
                                            styleSheet={WorkspaceHorizontalOverflowStyle}>
                            <div ref="optionButtonsTopLeft" className={this.styleSheet.optionButtons}>
                                <Button ref="uploadFileButton" className={`${this.styleSheet.menuButton} file-upload-button`}
                                       label={UI.T("Open file")} icon="upload" style={{position: "relative", overflow: "hidden"}}
                                       HTMLtitle={"Press " + (navigator.platform.match("Mac") ? "Cmd" : "Ctrl") + " + O to open file"}
                                       >
                                    <FileInput ref="uploadFile" style={{position: "absolute", top: "0", right: "0", margin: "0", height: "200%",
                                                                       padding: "0", cursor: "pointer", opacity: "0", filter: "alpha(opacity=0)"}}/>
                                </Button>
                                <Select ref="programmingLanguageSelect" options={ProgrammingLanguage.all()} className={this.styleSheet.menuSelect}
                                               style={{minWidth:"auto"}}/>
                            </div>
                            <div style={{flex: 1, overflow: "hidden", marginLeft: "-5px", marginRight: 0}}>
                                <FileSavingLabel ref="saveFileStatusLabel" size={Size.MEDIUM} className={this.styleSheet.menuSelect}
                                                 style={{pointerEvents: "none", padding: "2px 5px", height: "initial", maxWidth: "fit-content",
                                                         width: "-webkit-fill-available", textOverflow: "ellipsis", overflow: "inherit",
                                                         marginBottom: "-13px"}}/>
                            </div>
                            <div ref="optionButtonsTopRight" className={this.styleSheet.optionButtons}>
                                <Button label={UI.T("Settings")} icon="cog" ref="settingsButton" className={this.styleSheet.menuButton}/>
                                <Button label={UI.T("Fullscreen")} icon="expand" ref="fullScreenButton" className={this.styleSheet.menuButton}
                                           HTMLtitle={"Press " + (navigator.platform.match("Mac") ? "Cmd" : "Ctrl") + " + Enter to enter/exit full screen"}/>
                            </div>
                        </CSAHorizontalOverflow>
                        <div ref="workspaceSettingsWindow" className="hidden"
                             style={{position: "absolute", zIndex: "2016", right: "0px", top: "40px", boxShadow: this.styleSheet.themeProps.BASE_BOX_SHADOW}}>
                            <WorkspaceSettingsPanel/>
                        </div>
                        <FileCodeEditor ref="codeEditor" style={{flex: 1, height: "100%"}} {...this.codeEditorOptions}/>
                    </Panel>
                    <Panel ref="bottomArea" className={this.styleSheet.tabSection} style={{zIndex: "20", width: "100%", right: "0", bottom: "0",
                                                                 height:"30%", display: "flex", flexDirection: "column"}} minHeight={50}>
                        <WorkspaceTabArea ref="tabArea" className="tabSection" panelClass={this.styleSheet.bottomTab}
                                 style={{flexGrow: "1", width:"100%", boxSizing: "border-box", fontSize: "9.5pt"}}
                                 titleAreaClass={this.styleSheet.tabAreaTitleArea}/>
                    </Panel>
                </WorkspaceSectionDivider>
                <CSAHorizontalOverflow styleSheet={WorkspaceHorizontalOverflowStyle} ref="actionButtons">
                    <Button ref="expandTabAreaButton" icon="chevron-up" label={UI.T("Execution Details")}
                            className={`${this.styleSheet.menuButton} ${this.styleSheet.expandedButton} ${this.styleSheet.expandTabAreaButton}`} />
                    <div style={{flex: 1}}/>
                    <div ref="optionButtonsBottom" className={this.styleSheet.actionButtons}>
                    </div>
                </CSAHorizontalOverflow>
            </div>
        ];
    }
}

export {WorkspacePanel};
