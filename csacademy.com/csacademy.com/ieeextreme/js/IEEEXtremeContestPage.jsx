import {UI} from "../../stemjs/src/ui/UIBase.js";
import {ContestStore} from "../../contest/js/state/ContestStore.js";
import {DelayedArchiveOrContestPanel} from "../../contest/js/DelayedArchiveOrContestPanel.jsx";
import {IEEEXtremeUnauthenticatedPanel} from "./IEEEXtremeUnauthenticatedPanel.jsx";
import {IEEEXtremeContestPanel} from "./IEEEXtremeContestPanel.jsx";


export class IEEEXtremeContestPage extends DelayedArchiveOrContestPanel {
    dispatchUrlChange() {
        setTimeout(() => {
            if (!this.options.error) {
                this.child.setURL(this.urlParts);
            }
        });
    }

    renderLoaded() {
        if (!USER.isAuthenticated) {
            return <IEEEXtremeUnauthenticatedPanel ref="child" contest={ContestStore.get(this.contestId)} />;
        }
        if (this.options.error) {
            return this.renderError();
        }

        return <IEEEXtremeContestPanel contestId={this.contestId} ref="child"/>;
    }
}
