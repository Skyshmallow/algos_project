import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Table} from "../../stemjs/src/ui/table/Table.jsx";
import {UserHandle} from "../../csaaccounts/js/UserHandle.jsx";
import {Formatter} from "../../csabase/js/util.js";

import {EvalTaskUserSummaryStore} from "./state/EvalTaskUserSummaryStore.js";
import {SubmissionSummaryMarkup} from "./SubmissionSummary.jsx";

class UsersSolved extends UI.Element {
    render() {
        const {summaries} = this.options;
        return [
            <h3>
                {UI.T("Users that solved this task: ")} {summaries.length}
                {" ("}<span ref="details" style={{"color": "blue", "cursor": "pointer"}}>details</span>{")"}
            </h3>,
            <div ref="userHandlesArea" style={{maxWidth: "500px", maxHeight: "300px", "overflow-y": "scroll"}}></div>
        ];
    }

    onMount() {
        this.details.addClickListener(() => {
            const {summaries} = this.options;
            if (this.users) {
                this.userHandlesArea.addClass("hidden");
                this.users = false;
            } else {
                this.users = true;
                if (this.userHandlesArea.hasClass("hidden")) {
                    this.userHandlesArea.removeClass("hidden");
                } else {
                    for (let summary of summaries) {
                        this.userHandlesArea.appendChild(
                            <div style={{
                                margin: "3px",
                                padding: "4px",
                                display: "inline-block",
                                border: "2px solid #e6e6e6",
                                "borderRadius": "4px"
                            }}>
                                <UserHandle id={summary.userId}/>
                            </div>
                        );
                    }
                }
            }
        })
    }
}

class BestSubmissionsTable extends Table {
    getEntryKey(entry, index) {
        return index;
    }

    getEntries() {
        return this.summaries;
    }
}

class BestTimesTable extends BestSubmissionsTable {
    constructor(obj) {
        super(obj);
        this.summaries = this.options.summaries;
        this.summaries.sort((a, b) => {
            return a.bestTime - b.bestTime;
        });
        this.summaries = this.summaries.slice(0, Math.min(10, this.summaries.length));
    }

    getDefaultColumns() {
        let style = {
            textAlign: "center"
        };
        return [
            {
                value: entry => <UserHandle id={entry.userId}/>,
                headerName: "User",
                cellStyle: style,
                headerStyle: style
            }, {
                value: entry => Formatter.cpuTime(entry.bestTime),
                headerName: "CPU Time",
                cellStyle: style,
                headerStyle: style
            }, {
                value: (entry) => {
                    return <SubmissionSummaryMarkup id={entry.bestTimeEvalJobId}/>;
                },
                headerName: "Submission",
                headerStyle: style
            }
        ];
    }
}

class BestMemoryTable extends BestSubmissionsTable {
    constructor(obj) {
        super(obj);
        this.summaries = this.options.summaries;
        this.summaries.sort((a, b) => {
            return a.bestMemory - b.bestMemory;
        });
        this.summaries = this.summaries.slice(0, Math.min(10, this.summaries.length));
    }

    getDefaultColumns() {
        let style = {
            textAlign: "center"
        };
        return [
            {
                value: entry => <UserHandle id={entry.userId} />,
                headerName: "User",
                cellStyle: style,
                headerStyle: style
            }, {
                value: entry => Formatter.memory(entry.bestMemory),
                headerName: "Memory usage",
                cellStyle: style,
                headerStyle: style
            }, {
                value: (entry) => {
                    return <SubmissionSummaryMarkup id={entry.bestMemoryEvalJobId} />;
                },
                headerName: "Submission",
                headerStyle: style
            }
        ];
    }
}

class LoadingTable extends Table {
    getEntryKey(entry, index) {
        return index;
    }

    getEntries() {
        return [0];
    }

    getDefaultColumns() {
        let style = {
            textAlign: "center"
        };
        return [
            {
                value: entry => "Loading...",
                headerName: "User",
                cellStyle: style,
                headerStyle: style
            }, {
                value: entry => "",
                headerName: "CPU Time",
                cellStyle: style,
                headerStyle: style
            }, {
                value: (entry) => "",
                headerName: "Submission",
                headerStyle: style
            }
        ];
    }
}

export class EvalTaskStatisticsWidget extends UI.Element {
    render() {
        let summaries = this.getSummaries();
        if (summaries) {
            return [
                <UsersSolved summaries={summaries} />,
                <h3> {UI.T("Solutions with lowest CPU Time:")} </h3>,
                <BestTimesTable summaries={summaries}
                                style={{"border": "1px solid #BBB", "borderRadius": "5px"}}/>,
                <h3> {UI.T("Solutions with lowest memory usage:")} </h3>,
                <BestMemoryTable summaries={summaries}
                                 style={{"border": "1px solid #BBB", "borderRadius": "5px"}}/>
            ];
        }
        EvalTaskUserSummaryStore.fetchEvalTask(this.options.evalTask.id, () => {
            this.redraw();
        });
        return [
            <h3>Loading...</h3>,
            <h3> {UI.T("Solutions with lowest CPU Time:")} </h3>,
            <LoadingTable />,
            <h3> {UI.T("Solutions with lowest memory usage:")} </h3>,
            <LoadingTable />,
        ];
    }

    getSummaries() {
        const {evalTask} = this.options;
        if (EvalTaskUserSummaryStore.fetchedEvalTasks.has(evalTask.id)) {
            let summariesOfEvalTask = EvalTaskUserSummaryStore.getByEvalTaskId(evalTask.id);
            let result = [];
            for (let summary of summariesOfEvalTask) {
                if (summary.solved) {
                    result.push(summary);
                }
            }
            return result;
        }
        return null;
    }
}
