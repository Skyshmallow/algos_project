import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Panel} from "../../stemjs/src/ui/UIPrimitives.jsx";
import {CardPanel} from "../../stemjs/src/ui/CardPanel.jsx";
import {Level} from "../../stemjs/src/ui/Constants.js";
import {Formatter} from "../../csabase/js/util";
import {GlobalStyle} from "../../stemjs/src/ui/GlobalStyle";
import {RunStatusCodes, getSignalDescriptor} from "../../eval/js/state/BaseUserSubmission";
import {autoredraw} from "../../stemjs/src/decorators/AutoRedraw";


@autoredraw
class CompilationStatusPanel extends Panel {
    render() {
        const {customRun} = this.options;

        if (!customRun) {
            return null;
        }

        const compilationMessage = customRun.compilerMessage ?
            <pre className="compilerOutputMessage">{customRun.compilerMessage}</pre> : null;
        return [
            <strong style={{padding: "5px", lineHeight: "2em"}}>{customRun.getCompilationStatusMessage()}</strong>,
            compilationMessage,
        ];
    }

    setCustomRun(customRun) {
        this.updateOptions({customRun});
    }
}

@autoredraw
class ExecutionStatusPanel extends UI.Element {
    extraNodeAttributes(attr) {
        attr.addClass(GlobalStyle.FlexContainer.HORIZONTAL);
        attr.setStyle({
            paddingLeft: "5px",
            paddingRight: "5px",
        });
    }

    render() {
        const {customRun} = this.options;
        if (!customRun) {
            return null;
        }
        let content = [
            <div style={{marginTop: 30}}>
                <CardPanel title={UI.T("CPU Time")}
                           level={customRun.results.internalStatus === RunStatusCodes.TIME_LIMIT_EXCEEDED ? Level.DANGER : Level.PRIMARY}
                           bodyCentered>
                    <div style={{padding: 8}}>
                        {Formatter.cpuTime(customRun.results.cpuTime)}
                    </div>
                </CardPanel>
            </div>,
            <div style={{marginTop: 30}}>
                <CardPanel title={UI.T("Memory Usage")}
                           level={parseInt(customRun.results.signalCode) === 9 ? Level.DANGER : Level.PRIMARY}
                           bodyCentered>
                    <div style={{padding: "8px"}}>
                        {Formatter.memory(customRun.results.memUsage)}
                    </div>
                </CardPanel>
            </div>,
            <div style={{marginTop: 30}}>
                <CardPanel title={UI.T("Exit Code")}
                           level={parseInt(customRun.results.exitCode || 0) !== 0 ? Level.DANGER : Level.PRIMARY}
                           bodyCentered>
                    <div style={{padding: 8}}>
                        {customRun.results.exitCode || "-"}
                    </div>
                </CardPanel>
            </div>
        ];

        if (customRun.results.signalCode) {
            const signalDescriptor = getSignalDescriptor(customRun.results.signalCode);
            let signalElement = signalDescriptor.shortName;
            if (signalDescriptor.longName) {
                signalElement = signalDescriptor.longName + " (" + signalElement + ")";
            }

            if (signalDescriptor.description) {
                signalElement = [
                    signalElement,
                    <div>
                        {signalDescriptor.description}
                    </div>
                ]
            }

            content.push(
                <div style={{marginTop: "30px"}}>
                    <CardPanel title={UI.T("Runtime error")}
                               level={Level.DANGER}
                               bodyCentered>
                        <div style={{padding: "8px"}}>
                            {signalElement}
                        </div>
                    </CardPanel>
                </div>
            );
        }
        return content;
    }

    setCustomRun(customRun) {
        this.updateOptions({customRun});
    }
}

export {CompilationStatusPanel, ExecutionStatusPanel};
