import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Table} from "../../stemjs/src/ui/table/Table.jsx";
import {ProgrammingLanguage} from "../../csabase/js/state/ProgrammingLanguageStore.js";
import {MarkupRenderer} from "../../stemjs/src/markup/MarkupRenderer.js";


export class ProgrammingLanguageTable extends Table {
    getDefaultColumns() {
        let cellStyle = {
            textAlign: "left",
            verticalAlign: "middle"
        };
        let nameHeaderStyle = {
            textAlign: "left",
            verticalAlign: "middle",
            width: "20%"
        };
        let compilerHeaderStyle = {
            textAlign: "left",
            verticalAlign: "middle",
            width: "30%"
        };
        let commentHeaderStyle = {
            textAlign: "left",
            verticalAlign: "middle",
            width: "50%"
        };

        return [{
            value: language => language.name,
            headerName: "Language",
            headerStyle: nameHeaderStyle,
            cellStyle: cellStyle
        }, {
            value: language => language.compiler,
            headerName: "Compiler",
            headerStyle: compilerHeaderStyle,
            cellStyle: cellStyle
        }, {
            value: (language) => {
                if (language.comment) {
                    return <MarkupRenderer value={language.comment} />;
                }
                return null;
            },
            headerName: "Comment",
            headerStyle: commentHeaderStyle,
            cellStyle: cellStyle
        }];
    }

    getEntries() {
        return ProgrammingLanguage.all();
    }
}
