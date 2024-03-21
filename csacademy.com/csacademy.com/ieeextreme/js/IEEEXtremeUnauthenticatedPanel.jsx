import {Route, Router} from "../../stemjs/src/ui/Router.jsx";
import {IEEEXtremeTopLevelUnauthenticatedNavigationHandler} from "./IEEEXtremeTopLevelContestNavigationHandler.jsx";
import {IEEEXtremeContestSummary} from "./IEEEXtremeContestSummary.jsx";

export class IEEEXtremeUnauthenticatedPanel extends Router {
    constructor(...args) {
        super(...args);
        this.navHandler = new IEEEXtremeTopLevelUnauthenticatedNavigationHandler(this.getContest(), this);
    }

    getContest() {
        return this.options.contest;
    }

    getURLPrefix(str) {
        let url = "/" + this.getContest().name + "/";
        if (str) {
            url += str + "/";
        }
        return url;
    }

    getRoutes() {
        this.routes = this.routes || new Route(null, () => this.getSummaryPanel(), this.getSubroutes());
        return this.routes;
    }

    getDefaultOptions() {
        return {
            style: {
                height: "100%"
            }
        };
    }

    getSummaryPanel() {
        return <IEEEXtremeContestSummary contest={this.getContest()}/>;
    }

    getSubroutes() {
        return [
            new Route("summary", () => this.getSummaryPanel()),
        ];
    }

    onMount() {
        super.onMount();

        this.navHandler.apply();
    }
}