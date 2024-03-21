import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Table} from "../../stemjs/src/ui/table/Table";
import {MarkupRenderer} from "../../stemjs/src/markup/MarkupRenderer.js";


// TODO This should not be a lambda probably, and the Markdown parser should also allow functions
export const EvalTaskTestGroupingTable = (evalTask) => class EvalTaskTestGroupingTable extends Table {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.setStyle({
            tableLayout: "fixed",
            pageBreakInside: "avoid", // For printing
        });
    }

    getCellStyle() {
        return {
            pageBreakBefore: "avoid", // TODO For printing, fix implementing this
        };
    }

    getDefaultEntries(options) {
        return evalTask.testGrouping;
    }

    getDefaultColumns(options, entries) {
        const INDEX_STYLE = {width: 30};
        const POINTS_STYLE = {width: 60};

        return [
            ["#", (testGroup, index) => index + 1, {cellStyle: INDEX_STYLE, headerStyle: INDEX_STYLE}],
            ["Points", testGroup => testGroup.pointsWorth, {cellStyle: POINTS_STYLE, headerStyle: POINTS_STYLE}],
            ["Restrictions", testGroup => <MarkupRenderer classMap={evalTask.articleClassMap}
                                                       value={testGroup.comment} />],
        ];
    }
};
