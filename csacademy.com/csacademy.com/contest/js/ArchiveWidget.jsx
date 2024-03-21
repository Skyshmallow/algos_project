import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Select} from "../../stemjs/src/ui/input/Input.jsx";
import {Router, Route, TerminalRoute} from "../../stemjs/src/ui/Router.jsx";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {GlobalState} from "../../stemjs/src/state/State.js";
import {GlobalStyle} from "../../stemjs/src/ui/GlobalStyle.js";
import {SubmissionSummaryContestFilter} from "../../eval/js/SubmissionSummary.jsx";
import {GroupChatStore} from "../../establishment/chat/js/state/MessageThreadStore.js";

import {ArchiveStore, ArchiveUserStore} from "./state/ArchiveStore.js";
import {ContestTaskStore} from "./state/ContestTaskStore.js";
import {ContestChat} from "./ContestChat.jsx";
import {ContestTaskListWithFilters} from "./ContestTasksTable.jsx";
import {DelayedContestTaskPanel} from "./DelayedContestTaskPanel.js";
import {ArchiveNavigationHandler} from "./ContestNavigation.jsx";
import {autoredraw} from "../../stemjs/src/decorators/AutoRedraw.js";
import {MetaContestUsersTable} from "./scoreboard/MetaContestUsersTable.jsx";


// TODO: merge this class with ContestUsersFilter
class CountryUsersFilter extends UI.Primitive("span") {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.setStyle("whiteSpace", "nowrap");
        attr.setStyle("padding", "10px 0");
    }

    render() {
        return [
            <Select
                ref="filterCountry"
                onChange={() => this.updateFilter()}
                style={{height: "2em", marginLeft: "10px"}}
                options={this.options.countries}
            />,
        ];
    }

    getFilter() {
        this.options.countryIdFilter = this.filterCountry.get().id;

        return (user) => {
            if (this.options.countryIdFilter) {
                return user.countryId === this.options.countryIdFilter;
            }
            return true;
        };
    }

    updateFilter() {
        this.dispatch("filterChange");
    }
}

@autoredraw(ArchiveUserStore)
class ArchiveScoreboardWrapper extends UI.Element {
    extraNodeAttributes(attr) {
        attr.setStyle({
            display: "flex",
            flexDirection: "column",
            height: "100%",
        });
    }

    render() {
        return [
            <CountryUsersFilter ref="archiveUsersFilter" countries={this.options.archive.getCountries()} />,
            <MetaContestUsersTable ref="scoreboard" metaContest={this.options.archive} style={{flex: "1", overflow: "hidden"}}/>
        ];
    }

    onMount() {
        this.archiveUsersFilter.addListener("filterChange", () => {
            this.scoreboard.applyFilter(this.archiveUsersFilter.getFilter());
        });

        this.addListener("setActive", (active) => {
            this.scoreboard.redraw();
            if (active) {
                if (typeof this.scoreboard.applyScrollState == "function") {
                    this.scoreboard.applyScrollState();
                }
            } else {
                if (typeof this.scoreboard.saveScrollState == "function") {
                    this.scoreboard.saveScrollState();
                }
            }
        });
    }
}

class ArchiveSubmissionsWrapper extends UI.Element {
    onMount() {
        this.addListener("setActive", (active) => {
            if (active) {
                if (this.options.children.length === 0) {
                    this.appendChild(<SubmissionSummaryContestFilter contestId={this.options.archive.baseContestId}
                                                                     allContests/>);
                }
            }
        });
    }
}

class ArchivePanel extends Router {
    constructor(...args) {
        super(...args);
        this.navHandler = new ArchiveNavigationHandler(this.getArchive(), this);
    }

    getDefaultOptions() {
        return Object.assign({}, super.getDefaultOptions(), {
            fullHeight: true,
        });
    }

    getArchive() {
        return ArchiveStore.get(this.options.archiveId);
    }

    getTasks() {
        return <ContestTaskListWithFilters contest={this.getArchive()} isArchive={true} />;
    }

    getScoreboard() {
        return <ArchiveScoreboardWrapper archive={this.getArchive()} className={GlobalStyle.Container.MEDIUM} />;
    }

    getSubmissions() {
        return <ArchiveSubmissionsWrapper archive={this.getArchive()} className={GlobalStyle.Container.MEDIUM} />;
    }

    getChat() {
        const chatId = this.getArchive().discussionId;
        return chatId && <ContestChat chatId={chatId} ref={this.refLink("chat")} />;
    }

    getRoutes() {
        this.routes = this.routes || new Route(null, () => this.getTasks(), [
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

    onMount() {
        Ajax.getJSON("/contest/archive_scoreboard_state/", {
            archiveId: this.getArchive().id
        }).then(() => this.getArchive().recalculateUsers());
        if (this.isInDocument()) {
            this.navHandler.apply();
        }
        if (this.getArchive().discussionId) {
            GroupChatStore.fetch(this.getArchive().discussionId, () => this.chat && this.chat.redraw(),
                (error) => this.chat && this.chat.updateOptions({ error })
            );
        }
        GlobalState.registerStream("contest-" + this.getArchive().baseContestId + "-scores");
    }
}

export {ArchivePanel, CountryUsersFilter};
