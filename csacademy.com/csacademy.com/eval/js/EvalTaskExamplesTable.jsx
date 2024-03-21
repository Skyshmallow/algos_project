import {UI, Level, Button} from "../../csabase/js/UI.js";
import {Table} from "../../stemjs/src/ui/table/Table.jsx";
import {MarkupRenderer} from "../../stemjs/src/markup/MarkupRenderer.js";

import {InteractiveTaskLog} from "./InteractiveTaskLog.jsx";


// TODO This should not be a lambda probably, and the Markdown parser should also allow functions
export const EvalTaskExamplesTable = (evalTask) => class EvalTaskExamplesTable extends Table {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.setStyle({
            tableLayout: "fixed",
            pageBreakInside: "avoid", // For printing
        });
    }

    getCellStyle() {
        return {
            pageBreakBefore: "avoid", // TODO For printing
        };
    }

    getDefaultEntries(options) {
        return evalTask.exampleTests;
    }

    getDefaultColumns(options, entries) {
        let haveComments = false;

        for (const entry of entries) {
            haveComments = haveComments || entry.comment;
        }

        let columns;

        if (evalTask.getType() == 0) {// Non-interactive problems
            columns = [{
                value: entry => <pre>{entry.input}</pre>,
                headerName: UI.T("Input"),
                cellStyle: this.getCellStyle()
            }, {
                value: entry => <pre>{entry.output}</pre>,
                headerName: UI.T("Output"),
                cellStyle: this.getCellStyle()
            }];
        } else { // interactive problems
            columns = [{
                value: (entry) => {
                    return <InteractiveTaskLog extra={entry.extra} />;
                },
                headerName: UI.T("Interaction"),
                cellStyle: this.getCellStyle()
            }];
        }

        if (haveComments || this.options.loadTestButton) {
            columns.push({
                value: (entry) => {
                    let result = [];
                    if (entry.comment) {
                        result.push(<MarkupRenderer classMap={evalTask.articleClassMap}
                                                       value={entry.comment} />);
                    }
                    if (this.options.loadTestButton) {
                        result.push(<Button label={UI.T(this.options.loadTestText || "Load test")}
                                               onClick={() => {
                                                    evalTask.dispatch("loadTest", entry.input);
                                               }}
                                               level={Level.INFO}
                                               style={{display: "block", margin: "5px"}} />);
                    }
                    return result;
                },
                headerName: UI.T("Explanation"),
                cellStyle: this.getCellStyle()
            })
        }

        return columns;
    }
};


export const EvalTaskExamplesTableForPDF = (evalTask) => class EvalTaskExamplesTableForPDF extends EvalTaskExamplesTable(evalTask) {
};
