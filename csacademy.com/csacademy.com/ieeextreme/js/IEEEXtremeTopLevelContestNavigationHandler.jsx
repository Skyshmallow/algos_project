import {UI} from "../../stemjs/src/ui/UIBase.js";
import {NavManager} from "../../stemjs/src/ui/navmanager/NavManager.jsx";
import {TopLevelContestNavigationHandler} from "../../contest/js/ContestNavigation.jsx";
import {IEEEXtremeContestScoreTracker} from "./IEEEXtremeContestScoreTracker.jsx";
import {NavElement, NavLinkElement} from "../../stemjs/src/ui/navmanager/NavElement.jsx";


export class IEEEXtremeTopLevelContestNavigationHandler extends TopLevelContestNavigationHandler {
    getTasksDropdownElements() {
        return [];
    }

    createRankInfo() {
        const tracker = <IEEEXtremeContestScoreTracker
            contest={this.contest}
            loadedScoreboard={this.contestPanel._loadedScoreboard}
        />;
        this.contestPanel.attachChangeListener(tracker, () => NavManager.Global.checkForWrap());
        return <NavElement value={tracker} key="rank"/>;
    }

    getLeftChildren() {
        const {contest} = this;
        return [
            ...super.getLeftChildren(),
            contest.getSubpages().map(subpage => subpage.showInNav && <NavLinkElement href={this.getURLPrefix(subpage.url)} key={subpage.url} value={UI.T(subpage.name)}/>)
        ];
    }
}

export class IEEEXtremeTopLevelUnauthenticatedNavigationHandler extends IEEEXtremeTopLevelContestNavigationHandler {
    getLeftChildren() {
        return [
            <NavLinkElement href={this.getURLPrefix("summary")} key="summary"
                                          value={UI.T("Summary")} />,
        ];
    }

    getRightChildren() {
        return [];
    }

    createPhotos() {
        return <NavLinkElement href={this.getURLPrefix("photos")} key="photos" value={UI.T("Photos")} />;
    }
}
