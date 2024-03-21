import {GlobalStyle} from "../../stemjs/src/ui/GlobalStyle.js";
import {ContestPanel} from "../../contest/js/ContestWidget.jsx";
import {IEEEXtremeTopLevelContestNavigationHandler} from "./IEEEXtremeTopLevelContestNavigationHandler.jsx";
import {IEEEXtremeContestSummary} from "./IEEEXtremeContestSummary.jsx";
import {IEEEXtremeScoreboard} from "./IEEEXtremeScoreboard.jsx";
import {IEEEXtremeContestTasksList} from "./IEEEXtremeContestTasksTable.jsx";

export class IEEEXtremeContestPanel extends ContestPanel {
    getURLPrefix(str) {
        let url = "/" + this.getContest().name + "/";
        if (str) {
            url += str + "/";
        }
        return url;
    }

    constructor(...args) {
        super(...args);
        this.navHandler = new IEEEXtremeTopLevelContestNavigationHandler(this.getContest(), this);
    }

    getSummaryPanel() {
        return <IEEEXtremeContestSummary contest={this.getContest()}/>;
    }

    getScoreboardPanel() {
        return this.getContest().canShowScoreboard() &&
            <IEEEXtremeScoreboard ref={this.refLink("scoreboard")}
                                  contest={this.getBaseContest()}
                                  virtualContest={this.getVirtualContest()}
                                  originalContest={this.getContest()}/>
    }

    getTasksListPanel() {
        return <IEEEXtremeContestTasksList
            ref={this.refLink("contestTaskList")}
            contest={this.getContest()}
            isArchive={false}
            className={GlobalStyle.Container.SMALL}
        />;
    }
}
