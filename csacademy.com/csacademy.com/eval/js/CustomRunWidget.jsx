import {UI, Panel, CardPanel, Button, Level, Size} from "../../csabase/js/UI.js";
import {AjaxButton} from "../../stemjs/src/ui/button/AjaxButton.jsx";
import {GlobalStyle} from "../../stemjs/src/ui/GlobalStyle.js";
import {FileSaver} from "../../stemjs/src/base/FileSaver.js";
import {Formatter} from "../../csabase/js/util.js";
import {CompilationStatusPanel, ExecutionStatusPanel} from "../../workspace/js/CustomRunUtils.jsx";
import {StaticCodeHighlighter} from "../../stemjs/src/ui/CodeEditor.jsx";

import {CustomRunStore} from "./state/CustomRunStore.js";


class AceCardPanel extends CardPanel {
    getDefaultOptions() {
        return {
            bodyStyle: {
                padding: "0",
            },
        }
    }
}

// This class uses a base user submission as an input to render the code source and details about the code.
export class SourceCardPanel extends AceCardPanel {
    getDefaultOptions() {
        // Currently, only custom runs are forkable.
        return Object.assign({
            fork: false,
        }, super.getDefaultOptions());
    }

    getProgrammingLanguage() {
        return this.options.job.getProgrammingLanguage();
    }

    getTitle() {
        let buttonStyle = {margin: "0.3em"};
        const forkButton = this.options.forkable ?
            <AjaxButton ref="forkButton" level={Level.INFO} size={Size.SMALL} style={buttonStyle}
                           statusOptions={[
                               {icon: "code-fork", label: UI.T("Fork")},
                               {icon: "spinner fa-spin", label:" creating workspace..."},
                               "Success",
                               "Failed"
                           ]}
            /> : null;
        return [
            <span style={buttonStyle}>{this.getProgrammingLanguage().toString()}</span>,
            <span style={buttonStyle}>{Formatter.memory(this.options.job.getSize())}</span>,
            <Button ref="downloadSourceButton" label={UI.T("Download")}
                       level={Level.INFO} size={Size.SMALL} icon="download" style={buttonStyle} />,
            <Button label={UI.T("Copy to clipboard")} icon="files-o" style={buttonStyle} level={Level.INFO}
                    size={Size.SMALL}  onClick={() => this.sourceCodeHighlighter.copyTextToClipboard()} />,
            forkButton,
        ];
    }

    render() {
        let codeHighlighterOptions = {};

        if (this.getProgrammingLanguage()) {
            codeHighlighterOptions.aceMode = this.getProgrammingLanguage().aceMode;
        }

        return <StaticCodeHighlighter ref="sourceCodeHighlighter" {...codeHighlighterOptions}
                                      value={this.options.job.sourceText} maxLines={512}/>;
    }

    onMount() {
        this.downloadSourceButton.addClickListener(() => {
            let fileContentBlob = new Blob([this.options.job.sourceText],
                {type: "text/plain;charset=utf-8"});
            let programmingLanguage = this.getProgrammingLanguage();
            let fileName = this.options.name;

            if (programmingLanguage) {
                fileName += "." + programmingLanguage.getExtension();
            }

            FileSaver.saveAs(fileContentBlob, fileName);
        });

        if (this.options.forkable) {
            this.forkButton.addClickListener(() => {
                if (USER.isAuthenticated) {
                    this.forkToWorkspace();
                } else {
                    window.open("/workspace/fork/" + this.options.job.urlHash, "_blank");
                }
            });
        }
    }

    // This fork works only for custom runs.
    forkToWorkspace() {
        if (this.options.forkable) {
            this.forkButton.postJSON("/eval/fork_custom_run/", {
                customRunId: this.options.job.id,
            }).then(
                (data) => window.open("/workspace/" + data.workspaceId, "_blank")
            );
        }
    }
}

class InputCardPanel extends AceCardPanel {
    getTitle() {
        return UI.T("Input");
    }

    render() {
        return <StaticCodeHighlighter value={this.options.customRun.stdin} maxLines={32}/>;
    }
}

class OutputCardPanel extends AceCardPanel {
    getTitle() {
        return UI.T("Output");
    }

    render() {
        return <StaticCodeHighlighter value={this.options.customRun.stdout} maxLines={32}/>;
    }
}

class StderrCardPanel extends AceCardPanel {
    getTitle() {
        return UI.T("Stderr");
    }

    render() {
        return <StaticCodeHighlighter value={this.options.customRun.stderr} maxLines={32}/>;
    }
}

export class CompilationCardPanel extends CardPanel {
    getTitle() {
        return UI.T("Compilation");
    }

    render() {
        return <CompilationStatusPanel customRun={this.options.customRun}/>;
    }
}

class CustomRunPanel extends Panel {
    extraNodeAttributes(attr) {
        attr.addClass(GlobalStyle.Container.SMALL);
        attr.setStyle("marginBottom", "20px");
    }

    render() {
        let ioPanel;
        let executionStatusPanel;
        if (!this.options.customRun.compileOnly) {
            ioPanel = this.getIOPanel();
            executionStatusPanel = <ExecutionStatusPanel customRun={this.options.customRun}/>;
        }

        let result = [
            <div style={{margin: "25px 0"}}>
                <SourceCardPanel job={this.options.customRun} name={this.options.customRun.urlHash}
                                 forkable={true} />
            </div>,
        ];
        if (!this.options.customRun.shareOnly) {
            result = [
                ...result,
                ioPanel,
                <div style={{margin: "25px 0"}}>
                    <CompilationCardPanel customRun={this.options.customRun}/>
                </div>,
                executionStatusPanel,
            ];
        }
        return result;
    }

    getIOPanel() {
        let stderrPanel;
        if (this.options.customRun.stderr) {
            stderrPanel = <StderrCardPanel customRun={this.options.customRun}/>;
        }

        return <div style={{margin: "25px 0"}}>
            <div className={`${GlobalStyle.FlexContainer.HORIZONTAL}`}>
                <InputCardPanel customRun={this.options.customRun}/>
                <OutputCardPanel customRun={this.options.customRun}/>
                {stderrPanel}
            </div>
        </div>;
    }
}

export class CustomRunWidget extends UI.Element {
    render() {
        const customRun = CustomRunStore.get(this.options.customRunId);
        return customRun && <CustomRunPanel customRun={customRun}/>;
    }
}
