import {
    StateDependentElement
} from "../../stemjs/src/ui/StateDependentElement.jsx";
import {
    Ajax
} from "../../stemjs/src/base/Ajax.js";

import {
    ContestTaskPanel
} from "./ContestTaskPanel.jsx";


export class DelayedContestTaskPanel extends StateDependentElement(ContestTaskPanel) {
    get pageTitle() {
        return this.getContestTask() && this.getContestTask().longName;
    }

    beforeRedrawNotLoaded() {
        if (this.getContestTask() && this.getContestTask().hasStateLoaded()) {
            // The contest task already has its state loaded, either from the WebSocket or from previous requests.
            this.setLoaded();
            return;
        }
        Ajax.postJSON("/contest/get_contest_task/", {
            contestTaskId: this.options.contestTaskId
        }).then(
            (data) => {
                this.importState(data);
                this.setLoaded();
            }
        );
    }

    onDelayedMount() {
        super.onDelayedMount();
        if (this.urlParts) {
            this.setURL(this.urlParts);
        }
    }

    setURL(urlParts) {
        if (this.taskPanel) {
            super.setURL(urlParts);
        } else {
            this.urlParts = urlParts;
        }
    }
}