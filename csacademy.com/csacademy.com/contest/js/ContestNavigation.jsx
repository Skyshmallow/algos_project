import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Level} from "../../stemjs/src/ui/Constants.js";
import {Dispatchable} from "../../stemjs/src/base/Dispatcher.js";
import {NavManager} from "../../stemjs/src/ui/navmanager/NavManager.jsx";
import {NavElement, NavLinkElement} from "../../stemjs/src/ui/navmanager/NavElement.jsx";
import {NavCounterBadge} from "../../stemjs/src/ui/navmanager/NavCounterBadge.js";

import {ContestAnnouncementStore} from "./state/ContestQuestionStore";
import {ContestTimeCounter} from "./ContestTimeCounter";
import {ContestScoreTracker, ArchiveScoreTracker} from "./ContestScoreTracker";
import {ContestLocalStorageManager} from "./ContestLocalStorageManager";


class NavChatBadge extends NavCounterBadge {
    onMount() {
        super.onMount();

        const contestPanel = this.options.contestPanel;
        const contest = this.options.contest;

        this.attachListener(contestPanel, "activeElementChanged", () => {
            if (contestPanel.getActive() === contestPanel.chat) {
                this.reset();
            }
        });
        if (contest.getChat()) {
            this.attachListener(contest.getChat().getMessageThread(), "newMessage", () => {
                if (contestPanel.getActive() !== contestPanel.chat) {
                    this.increment();
                }
            });
        }
    }
}


class NavAnnouncementsBadge extends NavCounterBadge {
    onMount() {
        super.onMount();

        const contestPanel = this.options.contestPanel;
        const localStorageMap = this.options.localStorageMap;

        /* When badge is created, it takes its counter from the local storage. After that:
           - when an announcement is created: increase badge counter if the active tab isn't "Announcements"
           - when active tab is set to "Announcements": reset badge count and update local storage value
           - when local storage value changes: if the new value is 0 it means that the "Announcements" tab has been
                clicked on another tab, so reset the badge counter.
         */

        this.attachListener(localStorageMap, "change", (event) => {
            if (!event.newValue) {
                this.reset();
            }
        });

        this.attachListenerForIncrement(ContestAnnouncementStore, "create",
            (announcement) => announcement.contestId === this.options.contest.id);

        this.attachListener(contestPanel, "activeElementChanged", () => {
           if (contestPanel.getActive() === contestPanel.announcements) {
               this.reset();
               localStorageMap.set("counter", 0);
           }
        });
    }
}


export class ContestNavigationHandler extends Dispatchable {
    constructor(contest, contestPanel) {
        super();
        this.contest = contest;
        this.contestPanel = contestPanel;
    }

    getURLPrefix(str) {
        let url = "/contest/" + this.contest.name + "/";
        if (str) {
            url += str + "/";
        }
        return url;
    }

    getTasksDropdownElements() {
        return this.contest.getContestTasks().map(
                    contestTask => <NavLinkElement href={this.getURLPrefix("task/" + contestTask.name)}
                                                   value={contestTask.longName} key={Math.random()}/>
        );
    }

    getLeftChildren() {
        const contest = this.contest;

        let leftChildren = [];
        // Summary button
        leftChildren.push(<NavLinkElement href={this.getURLPrefix("summary")} key="summary"
                                          value={UI.T("Summary")} />);
        // Tasks dropdown
        if (contest.hasStarted()) {
            leftChildren.push(<NavLinkElement href={this.getURLPrefix("tasks")} key="tasks"
                                              value={UI.T("Tasks")}>
                                    {this.getTasksDropdownElements()}
                                </NavLinkElement>);
        }
        // Scoreboard button
        if (contest.canShowScoreboard()) {
            leftChildren.push(<NavLinkElement href={this.getURLPrefix("scoreboard")} key="scoreboard"
                                              value={UI.T("Scoreboard")}/>);
        }
        // Submissions button
        if (contest.hasStarted() && USER.isAuthenticated) {
            leftChildren.push(<NavLinkElement href={this.getURLPrefix("submissions")} key="submissions"
                                              value={UI.T("Own Submissions")} />);
        }
        // Chat button
        if (contest.chatId) {
            leftChildren.push(this.createChatButton());
        }
        // Questions & Announcements Buttons
        if (!contest.systemGenerated && contest.hasStarted()) {
            leftChildren.push(this.createAnnouncementsButton());
        }
        // Analysis button
        if (contest.hasFinished() && contest.isAnalysisPublic) {
            leftChildren.push(<NavLinkElement href={this.getURLPrefix("analysis")} key="analysis"
                                              value={UI.T("Analysis")} />);
        }

        return leftChildren;
    }

    getRightChildren() {
        const contest = this.contest;

        let rightChildren = [];

        if (contest.hasStarted() && USER.isAuthenticated) {
            rightChildren.push(this.createRankInfo());
        }
        rightChildren.push(this.createTimeCounter());

        return rightChildren;
    }

    apply() {
        if (!this.contestPanel.isInDocument()) {
            return;
        }

        NavManager.Global.skipWrap();
        NavManager.Global.getLeftConditioned().setChildren(this.getLeftChildren());
        NavManager.Global.getRightConditioned().setChildren(this.getRightChildren());
        NavManager.Global.unskipWrap();
        NavManager.Global.checkForWrap();
    }

    createChatButton() {
        const badge = <NavChatBadge contestPanel={this.contestPanel} contest={this.contest}/>;
        const chatButton = <NavLinkElement href={this.getURLPrefix("chat")} key="chat"
                                  style={{position: "relative"}} value={[UI.T("Chat"), badge]} />;

        return chatButton;
    }

    createAnnouncementsButton() {
        const localStorageMap = ContestLocalStorageManager.getAnnouncementsLocalStorageMap(this.contest.id);
        const badge = <NavAnnouncementsBadge contestPanel={this.contestPanel} contest={this.contest}
                                             counter={localStorageMap.get("counter") || 0} level={Level.DANGER}
                                             localStorageMap={localStorageMap}/>;
        const announcementsButton = <NavLinkElement href={this.getURLPrefix("announcements")} key="announcements"
                                  style={{position: "relative"}} value={[UI.T("Announcements"), badge]} />;

        return announcementsButton;
    }

    createTimeCounter() {
        const timer = <ContestTimeCounter contest={this.contest} />;
        this.attachChangeListener(timer, () => NavManager.Global.checkForWrap());
        return <NavElement value={[timer]} key="timer" />;
    }

    createRankInfo() {
        const tracker = <ContestScoreTracker contest={this.contest} loadedScoreboard={this.contestPanel._loadedScoreboard} />;
        this.contestPanel.attachChangeListener(tracker, () => NavManager.Global.checkForWrap());
        return <NavElement value={tracker} key="rank" />;
    }

    reset() {
        NavManager.Global.getLeftConditioned().setChildren([]);
        NavManager.Global.getRightConditioned().setChildren([]);
        NavManager.Global.checkForWrap();
    }
}


export class ArchiveNavigationHandler extends ContestNavigationHandler {
    getLeftChildren() {
        let leftChildren = [
            <NavLinkElement href={this.getURLPrefix("tasks")} value={UI.T("Tasks")}/>,
            <NavLinkElement href={this.getURLPrefix("scoreboard")} value={UI.T("Scoreboard")}/>,
            <NavLinkElement href={this.getURLPrefix("submissions")} value={UI.T("Submissions")}/>
        ];
        if (this.contest.discussionId) {
            leftChildren.push(
                <NavLinkElement href={this.getURLPrefix("chat")} value={UI.T("Chat")} />
            );
        }
        return leftChildren;
    }

    getRightChildren() {
        const tracker = <ArchiveScoreTracker archive={this.contest} />;
        this.contestPanel.attachChangeListener(tracker, () => setTimeout(() => NavManager.Global.checkForWrap()));
        return [<NavElement value={tracker} key={Math.random()} />];
    }
}


const TopLevelNavigationHandler = (NavigationHandler) => class TopLevelNavigationHandler extends NavigationHandler {
    getURLPrefix(str) {
        let url = "/" + this.contest.name + "/";
        if (str) {
            url += str + "/";
        }
        return url;
    }
};


export const TopLevelContestNavigationHandler = TopLevelNavigationHandler(ContestNavigationHandler);
export const TopLevelArchiveNavigationHandler = TopLevelNavigationHandler(ArchiveNavigationHandler);
