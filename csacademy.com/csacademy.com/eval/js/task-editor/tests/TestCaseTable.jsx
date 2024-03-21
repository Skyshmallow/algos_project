import {CollapsibleTable, CollapsibleTableRow} from "../../../../stemjs/src/ui/table/CollapsibleTable.jsx";
import {RawCheckboxInput, TextArea} from "../../../../stemjs/src/ui/input/Input.jsx";
import {PreviewMarkupButton} from "../../../../establishment/chat/js/ChatWidget.jsx";
import {ButtonGroup} from "../../../../stemjs/src/ui/button/ButtonGroup.jsx";
import {Level, Orientation, Size} from "../../../../stemjs/src/ui/Constants.js";
import {Button} from "../../../../stemjs/src/ui/button/Button.jsx";
import {Ajax} from "../../../../stemjs/src/base/Ajax.js";
import {FileSaver} from "../../../../stemjs/src/base/FileSaver.js";
import {Panel} from "../../../../stemjs/src/ui/UIPrimitives.jsx";
import {StaticCodeHighlighter} from "../../../../stemjs/src/ui/CodeEditor.jsx";
import {SectionDivider} from "../../../../stemjs/src/ui/section-divider/SectionDivider.jsx";
import {autoredraw} from "../../../../stemjs/src/decorators/AutoRedraw.js";
import {CollapsiblePanel} from "../../../../stemjs/src/ui/collapsible/CollapsiblePanel.jsx";
import {formatBytes} from "../../../../stemjs/src/base/Formatting.js";


class TestCaseRow extends CollapsibleTableRow {
    onMount() {
        super.onMount();

        this.isExampleCheckbox.addClickListener(() => {
            this.markChanged();
        });

        this.isPretestCheckbox.addClickListener(() => {
            this.markChanged();
        });

        this.previewButton.addClickListener(() => {
            // TODO: should be something different here, only mark as changed if content changes
            this.markChanged();
        });

        this.saveButton.addClickListener(() => {
            this.saveTest();
        });

        this.deleteButton.addClickListener(() => {
            const {entry} = this.options;
            const shouldDelete = window.confirm(`Do you want to delete test ${entry.index}?`);
            if (!shouldDelete) {
                return;
            }
            this.deleteTest();
        });
        this.downloadButton.addClickListener(() => {
            this.downloadTest();
        })
    }

    downloadTest() {
        const test = this.options.entry;
        const request = {
            testId: test.id,
            downloadTest: true,
        };
        Ajax.postJSON("/task/" + this.options.evalTask.urlName + "/edit/", request).then(
            (data) => {
                let delay = 0;
                if (data.input) {
                    let file1 = new Blob([data.input], {type: 'text/plain;charset=utf-8'});
                    FileSaver.saveAs(file1, 'input.txt');
                    delay += 1000;
                }
                if (data.output) {
                    setTimeout(() => {
                        let file2 = new Blob([data.output], {type: 'text/plain;charset=utf-8'});
                        FileSaver.saveAs(file2, 'output.txt');
                    }, delay);
                    delay += 1000;
                }
                if (data.extra) {
                    setTimeout(() => {
                        let file3 = new Blob([data.extra], {type: 'text/plain;charset=utf-8'});
                        FileSaver.saveAs(file3, 'extra.txt');
                    }, delay);
                }
            }
        );
    }

    renderFilePanel(title, content, panelStyle) {
        return (<Panel style={panelStyle}>
            <div style={{height: "20px", paddingLeft: "10px", boxSizing: "border-box", backgroundColor: "white"}}>{title}</div>
            <StaticCodeHighlighter style={{width: "100%", height: "150px"}} value={content}/>
        </Panel>);
    }

    renderCollapsible() {
        const {entry} = this.options;
        const panelStyle = {height: "170px", width: "33.33%", display: "inline-block"};

        const panels = [
            this.renderFilePanel(" Input", entry.input, panelStyle),
            this.renderFilePanel(" Judge output", entry.output, panelStyle),
            this.renderFilePanel(" Extra", JSON.stringify(entry.extra), panelStyle)
        ];

        return (
            <Panel className={"section" + entry.testNumber} key={entry.testNumber} orientation={Orientation.HORIZONTAL}
                   style={{height: panelStyle.height, width: "100%", padding: "5px"}}>
                <SectionDivider style={{height: "100%"}} orientation={Orientation.HORIZONTAL}>
                    {panels}
                </SectionDivider>
            </Panel>
        );
    }

    markChanged() {
        this.setStyle("background-color", "lightblue");
    }

    markUnchanged() {
        this.setStyle("background-color", "white");
    }

    saveTest() {
        let test = this.options.entry;
        let isPretest = this.isPretestCheckbox.node.checked;
        let isExample = this.isExampleCheckbox.node.checked;
        let comment = this.previewButton.options.getValue() || "";

        const request = {
            testId: test.id,
            isPretest: isPretest,
            isExample: isExample,
            comment: comment,
        };

        Ajax.postJSON("/task/" + this.options.evalTask.urlName + "/edit/", request).then(
            (data) => this.markUnchanged()
        );
    }

    deleteTest() {
        let test = this.options.entry;

        const request = {
            testId: test.id,
            deleteTest: true,
        };

        Ajax.postJSON("/task/" + this.options.evalTask.urlName + "/edit/", request).then(
            (data) => this.parent.redraw()
        );
    }
}


class TestCaseTable extends CollapsibleTable {
    getRowClass() {
        return TestCaseRow;
    }

    getRowOptions(entry, rowIndex) {
        let options = super.getRowOptions(entry, rowIndex);
        options.evalTask = this.options.evalTask;
        return options;
    }

    getDefaultColumns() {
        const numberStyle = {
            textAlign: "right"
        };

        return [
            {
                value: entry => entry.index,
                headerName: "Test ID",
                sortDescending: true,
                cellStyle: numberStyle,
                headerStyle: numberStyle,
            }, {
                value: entry => entry.id,
                headerName: "DB ID",
                sortDescending: true,
                cellStyle: numberStyle,
                headerStyle: numberStyle,
            }, {
                value: entry => entry.inputSize,
                headerName: "Input size",
                sortDescending: true,
                cellStyle: numberStyle,
                headerStyle: numberStyle,
            }, {
                value: entry => entry.outputSize,
                headerName: "Output size",
                sortDescending: true,
                cellStyle: numberStyle,
                headerStyle: numberStyle,
            }, {
                value: entry => entry.extraSize,
                headerName: "Extra size",
                sortDescending: true,
                cellStyle: numberStyle,
                headerStyle: numberStyle,
            }, {
                value: entry => <RawCheckboxInput initialValue={entry.isExample} ref="isExampleCheckbox"/>, // WOW, the ref is applied to the table row!
                headerName: "Is example",
                sortDescending: true,
                cellStyle: numberStyle,
                headerStyle: numberStyle,
            }, {
                value: entry => <RawCheckboxInput initialValue={entry.isPretest} ref="isPretestCheckbox"/>,
                headerName: "Is pretest",
                sortDescending: true,
                cellStyle: numberStyle,
                headerStyle: numberStyle,
            }, {
                value: (entry) => {
                    //TODO: duplicated from ChatWidget.renderMessageBox, refactor to common class (MessageBox)
                    let chatInputStyle = {
                        display: "inline-block",
                        overflow: "auto",
                        resize: "none",
                        height: "46px",
                        "vertical-align": "top"
                    };

                    let entryMessageInputRef = "messageInput" + entry.id;

                    return <div>
                        <TextArea ref={this.refLink(entryMessageInputRef)} style={chatInputStyle}
                                  value={entry.comment || ""}/>
                        <PreviewMarkupButton ref="previewButton"
                                             getValue={() => this[entryMessageInputRef].getValue()}
                                             setValue={(value) => {
                                                 this[entryMessageInputRef].setValue(value);
                                                 this[entryMessageInputRef].node.focus();
                                             }}
                        />
                    </div>;
                },
                headerName: "Comment",
                sortDescending: true,
            }, {
                value: entry => entry.lastModified,
                headerName: "Last modified",
                sortDescending: true,
                cellStyle: numberStyle,
                headerStyle: numberStyle,
            }, {
                value: (entry) => {
                    return <ButtonGroup level={Level.INFO} size={Size.SMALL}>
                        <Button ref="saveButton" label="Save"/>
                        <Button ref="downloadButton" label="Download"/>
                        <Button ref="deleteButton" label="Delete" level={Level.DANGER}/>
                    </ButtonGroup>;
                },
                headerName: "Actions",
                sortDescending: true,
            }
        ];
    }

    getEntryKey(entry, index) {
        return index;
    }

    getEntries() {
        const {evalTask} = this.options;
        return [].concat(evalTask.exampleTests, evalTask.systemTests);
    }
}


@autoredraw
export class TestCaseTablePanel extends CollapsiblePanel {
    getTitle() {
        const {evalTask} = this.options;
        const allTests = [].concat(evalTask.exampleTests, evalTask.systemTests);
        let maxInput = 0, totalInput = 0, maxOutput = 0, totalOutput = 0;
        for (const test of allTests) {
            totalInput += test.inputSize;
            totalOutput += test.outputSize;
            if (test.inputSize > maxInput) {
                maxInput = test.inputSize;
            }
            if (test.outputSize > maxOutput) {
                maxOutput = test.outputSize;
            }
        }

        return `${allTests.length} tests (${evalTask.exampleTests.length} ex.) | Input: ${formatBytes(maxInput)} max, ${formatBytes(totalInput)} total | Output: ${formatBytes(maxOutput)} max, ${formatBytes(totalOutput)} total | Cumulated ${formatBytes(totalInput + totalOutput)}`;
    }

    render() {
        return <TestCaseTable evalTask={this.options.evalTask}/>
    }
}
