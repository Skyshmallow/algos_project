import {UI, Panel, Button, SectionDivider, CollapsibleTableInterface, SortableTable, Orientation,
    Level, Size
} from "../../csabase/js/UI.js";
import {AjaxButton} from "../../stemjs/src/ui/button/AjaxButton.jsx";
import {Dispatcher} from "../../stemjs/src/base/Dispatcher.js";
import {Formatter} from "../../csabase/js/util.js";
import {InteractiveTaskLog} from "./InteractiveTaskLog.jsx";
import {StaticCodeHighlighter} from "../../stemjs/src/ui/CodeEditor.jsx";
import {autoredraw} from "../../stemjs/src/decorators/AutoRedraw.js";
import {CollapsibleTableRow, TableRowInCollapsibleTable} from "../../stemjs/src/ui/table/CollapsibleTable.jsx";


class EvalTaskPublicTestRow extends CollapsibleTableRow {
    getEvalTask() {
        return this.options.evalJob.getEvalTask();
    }

    getTest() {
        // TODO: Should return TestCaseStore.get(this.options.entry.id)
        throw Error("Unimplemented. This method should be implemented by subclasses.");
    }
    
    getLoadButton() {
        throw Error("Unimplemented. This method should be implemented by subclasses.");
    }

    getColumns() {
        // TODO this is dumb that it's done here, and not in the table
        let columns = super.getColumns();
        const loadButton = this.getLoadButton();
        if (loadButton) {
            columns = [
                ...columns,
                {value: () => loadButton},
            ];
        }
        return columns;
    }

    renderFilePanel(title, content, key, panelStyle) {
        return (<Panel key={key} style={panelStyle}>
            <div style={{
                height: 20,
                paddingLeft: 10,
                boxSizing: "border-box",
                backgroundColor: "white"
            }}>{title}</div>
            <StaticCodeHighlighter style={{width: "100%", height: 150}} value={content}/>
        </Panel>);
    }

    renderCollapsible() {
        let {entry} = this.options;
        let test = this.getTest();
        let panelStyle = {height: "170px", width: "49%", display: "inline-block"};

        if (!test) {
            return [<h3>Test loading...</h3>, <span className="fa fa-spinner fa-spin"/>];
        }

        let inputName = " Input " + Formatter.memory(test.inputSize);
        if (test.inputSize > test.input.length) {
            inputName = inputName + " (truncated to 1 MB)";
        }
        let outputName = " Judge output " + Formatter.memory(test.outputSize);
        if (test.outputSize > test.output.length) {
            outputName = outputName + " (truncated to 1 MB)";
        }
        let panels = [
            this.renderFilePanel(inputName, test.input, Math.random(), panelStyle),
            this.renderFilePanel(outputName, test.output, Math.random(), panelStyle)
        ];

        if (entry.hasOwnProperty("stdout")) {
            // The key must be random, else the content of the ace editor is not updated correctly
            panels.push(this.renderFilePanel(" Your output", entry.stdout, Math.random(), panelStyle));
            panelStyle.width = "32%";
        }

        return <Panel className={"section" + entry.testNumber} key={entry.testNumber}
                      orientation={Orientation.HORIZONTAL}
                      style={{height: panelStyle.height, width: "100%", padding: "5px"}}>
            <SectionDivider style={{height: "100%"}} orientation={Orientation.HORIZONTAL}>
                {panels}
            </SectionDivider>
        </Panel>;
    }
}

class EvalTaskDownloadableTestRow extends EvalTaskPublicTestRow {
    getLoadButton() {
        if (this.getEvalTask().isPublic) {
            let onSuccess = (test) => {
                if (test.inputSize > test.input.length) {
                    this.expand();
                } else {
                    Dispatcher.Global.dispatch("loadWorkspaceInput", test.input);
                }
            };
            return (
                <AjaxButton ref="loadTestButton"
                            level={Level.INFO}
                            size={Size.SMALL}
                            onClick={() => this.loadTest(this.options.entry.id, onSuccess)}
                            statusOptions={["Load", {icon: "spinner fa-spin", label: ""}, "Load", "Failed"]}/>
            );
        }
    }

    getTest() {
        return this.getEvalTask().systemTests[this.options.entry.id];
    }

    expand() {
        if (!this.getTest()) {
            this.loadTest(this.options.entry.id);
        }
        super.expand();
    }

    loadTest(testId, onSuccess) {
        let evalTask = this.getEvalTask();

        if (evalTask.systemTests[testId]) {
            if (onSuccess) {
                onSuccess(evalTask.systemTests[testId]);
            }
            return;
        }

        this.loadTestButton.getJSON("/eval/download_test/", {
            evalTaskId: evalTask.id,
            testId: testId,
        }).then(
            (data) => {
                evalTask.systemTests[testId] = data;
                this.redraw();
                if (onSuccess) {
                    onSuccess(data);
                }
            }
        );
    }
}

class EvalTaskExampleRow extends EvalTaskPublicTestRow {
    getLoadButton() {
        return <Button
            ref="loadTestButton"
            label="Load"
            level={Level.INFO}
            size={Size.SMALL}
            onClick={() => Dispatcher.Global.dispatch("loadWorkspaceInput", this.getTest().input)}
        />
    }

    getTest() {
        return this.options.evalJob.getExampleTest(this.options.entry.id);
    }
}

class InteractiveEvalTaskExampleRow extends CollapsibleTableRow {
    renderCollapsible() {
        const {entry} = this.options;

        let panelStyle = {height: 170, width: "49%", display: "inline-block"};

        let result = <InteractiveTaskLog extra={entry.extra} />;

        return (
            <Panel className={"section" + entry.testNumber} key={entry.testNumber} orientation={Orientation.HORIZONTAL}
                      style={{height: panelStyle.height, width: "100%", padding: "5px"}}>
                {result}
            </Panel>
        );
    }
}

@autoredraw
export class EvalJobResultsTable extends CollapsibleTableInterface(SortableTable) {
    getRowClass(entry) {
        const {evalJob} = this.options;
        const evalTask = evalJob.getEvalTask();
        if (evalJob.getExampleTest(entry.id)) {
            if (evalTask.getType() === 0) {
                return EvalTaskExampleRow;
            } else {
                return InteractiveEvalTaskExampleRow;
            }
        }
        if (evalTask?.isPublic && evalTask.getType() === 0) {
            evalTask.systemTests = evalTask.systemTests || {};
            return EvalTaskDownloadableTestRow;
        }
        return TableRowInCollapsibleTable;
    }

    getRowOptions(entry, rowIndex) {
        return {
            ...super.getRowOptions(entry, rowIndex),
            evalJob: this.options.evalJob,
        }
    }

    getEntries() {
        const {evalJob, testGroup} = this.options;
        if (!evalJob) {
            return [];
        }

        let entries = evalJob.getAllTests(testGroup);

        for (let i = 0; i < entries.length; i += 1) {
            entries[i].testNumber = i;
        }

        entries.reverse();

        return this.sortEntries(entries);
    }

    getDefaultColumns() {
        const numberStyle = {
            textAlign: "right"
        };

        return [{
            headerName: "Test Number",
            value: entry => entry.testNumber,
            sortDescending: true,
            cellStyle: numberStyle,
            headerStyle: numberStyle,
        }, {
            headerName: "CPU Usage",
            value: entry => Formatter.cpuTime(entry.cpuTime),
            rawValue: entry => entry.cpuTime || 0,
            cellStyle: numberStyle,
            headerStyle: numberStyle,
        }, {
            headerName: "Memory Usage",
            value: entry => Formatter.memory(entry.memUsage),
            rawValue: entry => entry.memUsage || 0,
            cellStyle: numberStyle,
            headerStyle: numberStyle,
        }, {
            headerName: "Result",
            value: entry => entry.message ?? "-",
            cellStyle: numberStyle,
            headerStyle: numberStyle,
        }];
    }
}
