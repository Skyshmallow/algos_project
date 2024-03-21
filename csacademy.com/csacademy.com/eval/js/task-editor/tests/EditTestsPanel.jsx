import {Panel} from "../../../../stemjs/src/ui/UIPrimitives.jsx";
import {TestGroupingPanel} from "./TestGroupingEditor.jsx";
import {ArchiveStore} from "../../../../contest/js/state/ArchiveStore.js";
import {ContestTaskStore} from "../../../../contest/js/state/ContestTaskStore.js";
import {TestUploadPanel} from "./TestUploadPanel.jsx";
import {TestCaseTablePanel} from "./TestCaseTable.jsx";
import {ButtonStyle} from "../../../../stemjs/src/ui/button/ButtonStyle.js";


function hasEvalTaskInArchive(evalTask) {
    const archiveContestIds = new Set(ArchiveStore.all().map(archive => archive.baseContestId));
    for (const contestTask of ContestTaskStore.filterBy({evalTaskId: evalTask.id})) {
        if (archiveContestIds.has(contestTask.contestId)) {
            return true;
        }
    }
    return false;
}


export class EditTestsPanel extends Panel {
    getTitle() {
        return "Tests";
    }

    render() {
        const {evalTask} = this.options;

        return [
            <div style={{marginTop: 12}}>
                <a
                    className={ButtonStyle.getInstance().container}
                    style={{margin: "5px"}}
                    href={`/task/${evalTask.urlName}-tests.zip`}
                    target="_blank"
                >
                    Download tests
                </a>

                {hasEvalTaskInArchive(evalTask) && <div style={{color: "darkorange", padding: 8}}>
                    ⚠ Tests are publicly downloadable due to inclusion in archive.
                </div>}
            </div>,


            <TestUploadPanel evalTask={evalTask}/>,

            <TestCaseTablePanel
                evalTask={evalTask}
                style={{marginTop: 8, marginBottom: 8}}
            />,

            <TestGroupingPanel evalTask={evalTask} />,
        ];
    }
}
