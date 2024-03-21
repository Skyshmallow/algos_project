import {UI, Image, Link, Route, TerminalRoute} from "../../csabase/js/UI.js";
import {NavLinkElement} from "../../stemjs/src/ui/navmanager/NavElement.jsx";

import {ContestTaskStore} from "../../contest/js/state/ContestTaskStore.js";
import {ContestSummary} from "../../contest/js/ContestSummary.jsx";
import {ContestTaskListWithFilters} from "../../contest/js/ContestTasksTable.jsx";
import {ArchivePanel} from "../../contest/js/ArchiveWidget.jsx";
import {DelayedContestTaskPanel} from "../../contest/js/DelayedContestTaskPanel.js";
import {DelayedArchiveOrContestPanel} from "../../contest/js/DelayedArchiveOrContestPanel.jsx";
import {TopLevelArchiveNavigationHandler} from "../../contest/js/ContestNavigation.jsx";


const IEEEXTREME_URL = "ieeextreme-practice";

class IEEEXtremePracticeContestSummary extends ContestSummary {
    extraNodeAttributes(attr) {
        attr.setStyle({
            margin: "auto",
            maxWidth: 800
        })
    }

    getRegisterButton() {
        return null;
    }

    getNeedLoginMessage() {
        if (USER.isAuthenticated) {
            return;
        }
        return <h4>
            You need to be authenticated to submit a solution, please login.
        </h4>
    }

    getDescription() {
        return <div style={{marginTop: "20px"}}>
            <h3>Welcome to the practice community for IEEEXtreme!</h3>
            <h4>Please familiarize yourself with the contest interface.</h4>
            {this.getNeedLoginMessage()}
            <h4>You can read more about the environment your sources will he evaluated with <Link href="/about/environment" newTab={true}>here</Link>
            </h4>
            <h4>We recommend you also try the <Link value="CS Academy archive" href="/contest/archive/" newTab/> of problems where you will find some easier, and also not so easy tasks.</h4>
        </div>;
    }

    render() {
        return [
            <Image src="/static/svg/XtremeLogo_practice_community.svg" />,
            // this.getInfo(false),
            this.getDescription(),
        ];
    }
}


class IEEEXtremePracticeNavigationHandler extends TopLevelArchiveNavigationHandler {
    getLeftChildren() {
        return [
            <NavLinkElement href={this.getURLPrefix()} value={UI.T("Summary")}/>,
            ...super.getLeftChildren()
        ];
    }
}


class IEEEXtremePracticeArchivePanel extends ArchivePanel {
    getURLPrefix(str) {
        let url = "/" + this.getArchive().name + "/";
        if (str) {
            url += str + "/";
        }
        return url;
    }

    constructor(...args) {
        super(...args);
        this.navHandler = new IEEEXtremePracticeNavigationHandler(this.getArchive(), this);
    }

    getSummaryPanel() {
        return <IEEEXtremePracticeContestSummary contest={this.getArchive()} />;
    }


    getTasks() {
        return <ContestTaskListWithFilters contest={this.getArchive()} isArchive={true} />;
    }

    getRoutes() {
        this.routes = this.routes || new Route(null, () => this.getSummaryPanel(), [
            new Route("tasks", () => this.getTasks()),
            new Route("task", () => this.getTasks(), [
                new TerminalRoute("%s", (options) => {
                    const contestTask = ContestTaskStore.getByContestIdAndUrlName(this.getArchive().baseContestId, options.args[0]);
                    return contestTask && <DelayedContestTaskPanel contestTaskId={contestTask.id} />;
                }),
            ]),
            new Route("scoreboard", () => this.getScoreboard()),
            new Route("submissions", () => this.getSubmissions()),
            new Route("chat", () => this.getChat())
        ]);
        return this.routes;
    }
}

export class IEEEXtremePracticeContestPanelWrapper extends DelayedArchiveOrContestPanel {
    getAjaxUrl() {
        return "/" + IEEEXTREME_URL + "/";
    }

    renderLoaded() {
        return <IEEEXtremePracticeArchivePanel archiveId={this.archiveId} ref="child"/>;
    }
}
