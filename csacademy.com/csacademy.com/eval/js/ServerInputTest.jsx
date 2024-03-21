import {UI, Button, Level} from "../../csabase/js/UI.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {CodeEditor, StaticCodeHighlighter} from "../../stemjs/src/ui/CodeEditor.jsx";


export class ServerInputTest extends UI.Element {
    getDefaultOptions() {
        return {
            type: "increment",
            height: 150
        };
    }

    setOptions(options) {
        options.input = options.input && options.input.replace(new RegExp("\\\\n", "g"), "\n");
        super.setOptions(options);
    }

    extraNodeAttributes(attr) {
        attr.setStyle("height", this.options.height + "px");
        attr.setStyle("display", "flex");
        attr.setStyle("flex-direction", "column");
    }

    render() {
        return [
            <div>
                <Button ref="runInputButton" level={Level.PRIMARY} onClick={() => this.recalculate()}
                        icon="cogs" style={{marginBottom: "10px"}}> {UI.T("Compute")}
                </Button>
            </div>,
            <div ref="container" style={{flex: "1"}}>
                <div style={{float: "left", width: "48%", height: "100%"}}>
                    <CodeEditor ref="inputEditor" value={this.options.input} style={{height: "100%"}}/>
                </div>
                <div style={{float: "right", width: "48%", height: "100%", marginRight: "2%"}}>
                    <StaticCodeHighlighter ref="outputView" style={{height: "100%"}}/>
                </div>
            </div>
        ];
    }

    recalculate() {
        const request = {
            type: this.options.type,
            input: this.inputEditor.getValue(),
        };
        this.runInputButton.setLevel(Level.WARNING);
        Ajax.postJSON("/eval/input_server_test/", request, {
            onComplete: () => setTimeout(() => this.runInputButton.setLevel(Level.PRIMARY), 2000),
        }).then(
            (data) => {
                this.outputView.setValue(String(data.output));
                this.runInputButton.setLevel(Level.SUCCESS);
            },
        )
    }
}
