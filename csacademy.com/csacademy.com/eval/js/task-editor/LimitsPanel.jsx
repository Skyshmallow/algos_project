import {UI, Panel, TableRow, RawCheckboxInput, TextInput, Form, FormField, Button, Level, TemporaryMessageArea} from "../../../csabase/js/UI.js";
import {Table} from "../../../stemjs/src/ui/table/Table";
import {ProgrammingLanguage} from "../../../csabase/js/state/ProgrammingLanguageStore";
import {Ajax} from "../../../stemjs/src/base/Ajax";

function parseTime(time) {
    if (time === "") {
        return 0;
    }
    if (time[time.length - 1] === "s" || time[time.length - 1] === "S") {
        return parseFloat(time.substr(0, time.length - 1)) * 1000;
    }
    return parseFloat(time) || 0;
}

function parseMemory(memory) {
    if (memory === "") {
        return 0;
    }
    if (memory.length >= 2 && memory.substring(memory.length - 2, memory.length).toUpperCase() === "MB") {
        return 1024 * parseFloat(memory.substring(0, memory.length - 2));
    }
    return parseFloat(memory) || 0;
}

class ComputedTimeSpan extends UI.Element {
    getNodeType() {
        return "span";
    }

    getComputedTime() {
        let evalTask = this.options.evalTask;
        let language = this.options.language;
        let limits = evalTask.programmingLanguageLimits || {};
        let defaultTime;
        let limitsPanel = this.options.table.options.ref.parent;
        if (limitsPanel.timeLimitInput) {
            defaultTime = parseTime(limitsPanel.timeLimitInput.getValue()) || 0;
        } else {
            defaultTime = evalTask.timeLimit;
        }

        let timeRatio;
        let timeRatioInput = this.options.table["timeRatio" + language.id];
        if (timeRatioInput && timeRatioInput.wasChanged) {
            timeRatio = parseFloat(timeRatioInput.getValue());
        } else if (limits[language.id] && limits[language.id].timeRatio) {
            timeRatio = limits[language.id].timeRatio;
        } else if (language.timeRatio) {
            timeRatio = language.timeRatio;
        } else {
            timeRatio = 1;
        }

        let extraTime;
        let extraTimeInput = this.options.table["extraTime" + language.id];
        if (extraTimeInput && extraTimeInput.wasChanged) {
            extraTime = parseTime(extraTimeInput.getValue());
        } else if (limits[language.id] && limits[language.id].extraTime) {
            extraTime = limits[language.id].extraTime;
        } else if (language.extraTime) {
            extraTime = language.extraTime;
        } else {
            extraTime = 0;
        }

        return defaultTime * timeRatio + extraTime + "ms";
    }

    render() {
        return this.getComputedTime();
    }
}

class ComputedMemorySpan extends UI.Element {
    getNodeType() {
        return "span";
    }

    getComputedMemory() {
        let language = this.options.language;
        let evalTask = this.options.evalTask;
        let limits = evalTask.programmingLanguageLimits || {};

        let defaultMemory;
        let limitsPanel = this.options.table.options.ref.parent;
        if (limitsPanel.memoryLimitInput) {
            defaultMemory = parseMemory(limitsPanel.memoryLimitInput.getValue()) || 0;
        } else {
            defaultMemory = evalTask.memoryLimit;
        }

        let extraMemory;
        let extraMemoryInput = this.options.table["extraMemory" + language.id];
        if (extraMemoryInput && extraMemoryInput.wasChanged) {
            extraMemory = parseMemory(extraMemoryInput.getValue());
        } else if (limits[language.id] && limits[language.id].extraMemory) {
            extraMemory = limits[language.id].extraMemory;
        } else if (language.extraMemory) {
            extraMemory = language.extraMemory;
        } else {
            extraMemory = 0;
        }

        return defaultMemory + extraMemory + "kb";
    }

    render() {
        return this.getComputedMemory();
    }
}

class LimitsPerLanguageRow extends TableRow {
    onMount() {
        let table = this.options.parent;
        let checkbox = table["save" + this.options.entry.id];
        if (checkbox.node.checked) {
            this.setStyle("background-color", "#87ACCC");
        }
        checkbox.addChangeListener(() => {
            if (checkbox.node.checked) {
                this.setStyle("background-color", "#87ACCC");
            } else {
                this.setStyle("background-color", "");
            }
        })
    }
}

class LimitsPerLanguageTable extends Table {
    getRowClass() {
        return LimitsPerLanguageRow;
    }

    getEntryKey(entry, index) {
        return index;
    }

    getEntries() {
        return ProgrammingLanguage.all();
    }

    getExtraMemory(id) {
        let evalTask = this.options.evalTask;
        let limits = evalTask.programmingLanguageLimits || {};
        if (limits[id] && limits[id]["extraMemory"]) {
            return [limits[id]["extraMemory"], true];
        }
        return [0, false];
    }
    getExtraTime(id) {
        let evalTask = this.options.evalTask;
        let limits = evalTask.programmingLanguageLimits || {};
        if (limits[id] && limits[id]["extraTime"]) {
            return [limits[id]["extraTime"], true];
        }
        return [0, false];
    }
    getTimeRatio(id) {
        let evalTask = this.options.evalTask;
        let limits = evalTask.programmingLanguageLimits || {};
        if (limits[id] && limits[id]["timeRatio"]) {
            return [limits[id]["timeRatio"], true];
        }
        return [1, false];
    }

    getDefaultColumns() {
        // TODO @cleanup simplify like other tables
        const numberStyle = {
            textAlign: "center"
        };

        return [
            {
                value: (entry) => {
                    let checked = false;
                    if (this.getExtraMemory(entry.id)[1] || this.getExtraTime(entry.id)[1] || this.getTimeRatio(entry.id)[1]) {
                        checked = true;
                    }
                    return <RawCheckboxInput ref={this.refLink("save" + entry.id)} checked={checked}/>;
                },
                headerName: "Save to DB",
                cellStyle: numberStyle,
                headerStyle: numberStyle
            },
            {
                value: entry => entry.name,
                headerName: "Language",
                sortDescending: true,
                cellStyle: numberStyle,
                headerStyle: numberStyle
            }, {
                value: (entry) => {
                    let ratio, wasChanged;
                    [ratio, wasChanged] = this.getTimeRatio(entry.id);
                    let bgColor = "";
                    if (wasChanged) {
                        bgColor = "rgba(255,190,0,0.8)";
                    }
                    let timeRatioField = <TextInput ref={this.refLink("timeRatio" + entry.id)} value={ratio} style={{"background-color": bgColor}}/>;
                    timeRatioField.wasChanged = wasChanged;
                    return timeRatioField;
                },
                headerName: "Time limit ratio",
                sortDescending: true,
                cellStyle: numberStyle,
                headerStyle: numberStyle
            }, {
                value: (entry) => {
                    let extraTime, wasChanged;
                    [extraTime, wasChanged] = this.getExtraTime(entry.id);
                    let bgColor = "";
                    if (wasChanged) {
                        bgColor = "rgba(255,190,0,0.8)";
                    }
                    let extraTimeField = <TextInput ref={this.refLink("extraTime" + entry.id)} value={extraTime} style={{"background-color": bgColor}}/>;
                    extraTimeField.wasChanged = wasChanged;
                    return extraTimeField;
                },
                headerName: "Extra time",
                sortDescending: true,
                cellStyle: numberStyle,
                headerStyle: numberStyle
            }, {
                value: entry => <ComputedTimeSpan ref={this.refLink("computedTime" + entry.id)} table={this}
                                              language={entry} evalTask={this.options.evalTask} />,
                headerName: "Computed Time",
                cellStyle: numberStyle,
                headerStyle: numberStyle
            }, {
                value: (entry) => {
                    let extraMemory, wasChanged;
                    [extraMemory, wasChanged] = this.getExtraMemory(entry.id);
                    let bgColor = "";
                    if (wasChanged) {
                        bgColor = "rgba(255,190,0,0.8)";
                    }
                    let extraMemoryField = <TextInput ref={this.refLink("extraMemory" + entry.id)} value={extraMemory} style={{"background-color": bgColor}}/>;
                    extraMemoryField.wasChanged = wasChanged;
                    return extraMemoryField;
                },
                headerName: "Extra memory",
                sortDescending: true,
                cellStyle: numberStyle,
                headerStyle: numberStyle
            }, {
                value: entry => <ComputedMemorySpan ref={this.refLink("computedMemory" + entry.id)} table={this}
                                              language={entry} evalTask={this.options.evalTask}  />,
                headerName: "Computed Memory",
                cellStyle: numberStyle,
                headerStyle: numberStyle
            }
        ];
    }
}

class LimitsPanel extends Panel {
    getTitle() {
        return "Limits";
    }

    render() {
        let evalTask = this.options.evalTask;
        return [
            <div style={{padding: "20px"}}>
                <Form>
                    <FormField ref="timeLimit" label="Default Time Limit">
                        <TextInput ref="timeLimitInput" value={evalTask.timeLimit} />
                    </FormField>
                    <FormField ref="memoryLimit" label="Default Memory Limit">
                        <TextInput ref="memoryLimitInput" value={evalTask.memoryLimit} />
                    </FormField>
                </Form>
            </div>,
            <LimitsPerLanguageTable ref="limitsTable" evalTask={evalTask} />,
            <div className="text-center">
                <Button ref="saveLimitsButton" level={Level.PRIMARY}
                           label="Save changes" onClick={() => {this.saveChanges();}}
                />
                <TemporaryMessageArea ref="saveStatus"/>
            </div>
        ];
    }

    saveChanges() {
        let timeLimit = parseTime(this.timeLimitInput.getValue());
        let memoryLimit = parseMemory(this.memoryLimitInput.getValue());

        if (timeLimit >= 30000 || memoryLimit >= 1024 * 8192) {
            this.saveStatus.showMessage("Failed, invalid default limits!", "red");
            return;
        }

        let limits = {};
        let languages = ProgrammingLanguage.all();
        for (let language of languages) {
            if (!this.limitsTable["save" + language.id].node.checked) {
                continue;
            }
            let timeRatioField = this.limitsTable["timeRatio" + language.id];
            let timeRatio = parseTime(timeRatioField.getValue());
            let extraTimeField = this.limitsTable["extraTime" + language.id];
            let extraTime = parseTime(extraTimeField.getValue());
            let extraMemoryField = this.limitsTable["extraMemory" + language.id];
            let extraMemory = parseMemory(extraMemoryField.getValue());

            if (timeLimit * timeRatio + extraTime >= 30000 || memoryLimit + extraMemory >= 1024 * 8192) {
                this.saveStatus.showMessage("Failed, invalid limits for " + language.name, "red");
                return;
            }
            limits[language.id] = {};
            if (extraTimeField.wasChanged) {
                limits[language.id].extraTime = extraTime;
            }
            if (extraMemoryField.wasChanged) {
                limits[language.id].extraMemory = extraMemory;
            }
            if (timeRatioField.wasChanged) {
                limits[language.id].timeRatio = timeRatio;
            }
            if (Object.keys(limits[language.id]).length === 0) {
                delete limits[language.id];
            }
        }

        let request = {
            limitsChanged: true,
            timeLimit: timeLimit,
            memoryLimit: memoryLimit,
            programmingLanguageLimits: JSON.stringify(limits)
        };
        Ajax.postJSON("/task/" + this.options.evalTask.urlName + "/edit/", request).then(
            (data) => this.saveStatus.showMessage("Limits changed"),
            (error) => this.saveStatus.showMessage(error.message, "red")
        );
    }

    onMount() {
        let table = this.limitsTable;
        for (let language of ProgrammingLanguage.all()) {
            table["timeRatio" + language.id].addNodeListener("input", () => {
                table["timeRatio" + language.id].wasChanged = true;
                table["timeRatio" + language.id].setStyle("background-color", "rgba(255,190,0,0.8");
                table["computedTime" + language.id].redraw();
            });
            table["extraTime" + language.id].addNodeListener("input", () => {
                table["extraTime" + language.id].wasChanged = true;
                table["extraTime" + language.id].setStyle("background-color", "rgba(255,190,0,0.8");
                table["computedTime" + language.id].redraw();
            });
            table["extraMemory" + language.id].addNodeListener("input", () => {
                table["extraMemory" + language.id].wasChanged = true;
                table["extraMemory" + language.id].setStyle("background-color", "rgba(255,190,0,0.8");
                table["computedMemory" + language.id].redraw();
            });
        }
        this.timeLimitInput.addNodeListener("input", () => {
            for (let language of ProgrammingLanguage.all()) {
                table["computedTime" + language.id].redraw();
            }
        });
        this.memoryLimitInput.addNodeListener("input", () => {
            for (let language of ProgrammingLanguage.all()) {
                table["computedMemory" + language.id].redraw();
            }
        });
    }
}


export {LimitsPanel};