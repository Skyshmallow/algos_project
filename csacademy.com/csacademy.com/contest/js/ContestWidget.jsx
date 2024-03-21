import {UI} from "../../stemjs/src/ui/UIBase.js";
import {registerStyle} from "../../stemjs/src/ui/style/Theme.js";
import {Route, Router, TerminalRoute} from "../../stemjs/src/ui/Router.jsx";
import {GlobalState} from "../../stemjs/src/state/State.js";
import {GroupChatStore} from "../../establishment/chat/js/state/MessageThreadStore.js";
import {UserStore} from "../../csaaccounts/js/state/UserStore.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {TimeUnit} from "../../stemjs/src/time/Duration.js";
import {ServerTime} from "../../stemjs/src/time/Time.js";
import {GlobalStyle} from "../../stemjs/src/ui/GlobalStyle.js";
import {PageTitleManager} from "../../stemjs/src/base/PageTitleManager.js";

import {ContestLocalStorageManager} from "./ContestLocalStorageManager.jsx";
import {ContestTaskStore} from "./state/ContestTaskStore.js";
import {ContestQuestionStore, ContestAnnouncementStore} from "./state/ContestQuestionStore.js";
import {ContestStore, ContestEventStore} from "./state/ContestStore.js";
import {ContestSummary} from "./ContestSummary";
import {Scoreboard} from "./scoreboard/Scoreboard.jsx";
import {ContestSubmissions} from "./ContestSubmissions.jsx";
import {ContestAnalysis, AnalysisModal} from "./ContestAnalysis.jsx";
import {NextContestModal, ContestCancelledModal} from "./HourlyContestModal.jsx";
import {DelayedContestTaskPanel} from "./DelayedContestTaskPanel.js";
import {ContestLoadingPage} from "./ContestLoadingPage.jsx";
import {ContestAnnouncementList} from "./ContestAnnouncementList.jsx";
import {ContestTaskList} from "./ContestTasksTable.jsx";
import {ContestPanelStyle} from "./ContestWidgetStyle.js";
import {ContestNavigationHandler} from "./ContestNavigation.jsx";
import {ContestNotificationManager} from "./ContestNotificationManager.jsx";
import {ContestChat} from "./ContestChat.jsx";
import {RecursiveArticleRenderer} from "../../establishment/content/js/ArticleRenderer.jsx";


@registerStyle(ContestPanelStyle)
export class ContestPanel extends Router {
    constructor(...args) {
        super(...args);
        this.navHandler = new ContestNavigationHandler(this.getContest(), this);
        this.contestTaskPanelsMap = new Map();
    }

    getDefaultOptions() {
        return {
            style: {
                height: "100%"
            }
        };
    }

    setOptions(options) {
        super.setOptions(options);
        this.getBaseContest().recalculateUsers();
    }

    getContest() {
        return ContestStore.get(this.options.contestId);
    }

    getBaseContest() {
        return this.getContest().getBaseContest();
    }

    getVirtualContest() {
        if (this.getContest().virtualContestId || this.getContest().isVirtual()) {
            return this.getContest().getVirtualContest();
        }
        return null;
    }

    playbackScoring() {
        // TODO: refactor contestEvents to priorityQueue
        let contestEvents = ContestEventStore.all().sort((a, b) => {return a.event.contestTime - b.event.contestTime});
        let shouldApplyEvent = (event) => {
            return ServerTime.now().unix() - this.getVirtualContest().getStartTime() > event.contestTime;
        };
        let updateInterval = setInterval(() => {
            if (this.getVirtualContest().hasFinished()) {
                clearInterval(updateInterval);
            }
            while(contestEvents.length && shouldApplyEvent(contestEvents[0].event)) {
                GlobalState.applyEvent(contestEvents.shift().event)
            }
        }, 1000);
        ContestEventStore.addCreateListener((contestEvent) => {
            contestEvents.push(contestEvent);
            contestEvents.sort((a, b) => {return a.event.contestTime - b.event.contestTime});
        });
    }

    setActive(element) {
        super.setActive(element);
        this.dispatch("activeElementChanged");
    }

    switchToTask(contestTask) {
        if (this.loadingPage) {
            this.loadingPage.destroyNode();
            delete this.loadingPage;
        }
        Router.changeURL(contestTask.getFullURL());
    }

    getSummaryPanel() {
        return <ContestSummary contest={this.getContest()} baseContest={this.getBaseContest()}
                               className={GlobalStyle.Container.MEDIUM} />;
    }

    getTasksListPanel() {
        return <ContestTaskList ref={this.refLink("contestTaskList")} contest={this.getContest()} isArchive={false}
                                className={GlobalStyle.Container.SMALL} />;
    }

    getScoreboardPanel() {
        return this.getContest().canShowScoreboard() && <Scoreboard ref={this.refLink("scoreboard")}
                                                                    className={GlobalStyle.Container.MEDIUM}
                                                                    contest={this.getBaseContest()}
                                                                    virtualContest={this.getVirtualContest()}
                                                                    originalContest={this.getContest()}/>
    }

    getChatPanel() {
        const chatId = this.getContest().chatId;
        return chatId && <ContestChat chatId={chatId} ref={this.refLink("chat")}
                                      className={GlobalStyle.Container.MEDIUM}/>;
    }

    getSubmissionsPanel() {
        return USER.isAuthenticated && <ContestSubmissions contestId={this.options.contestId}
                                                           className={GlobalStyle.Container.MEDIUM} />;
    }

    getAnnouncementsPanel() {
        if (!this.announcementsList) {
            this.announcementsList = <ContestAnnouncementList ref={this.refLink("announcements")} contest={this.getBaseContest()}
                                        style={{display: "flex", alignItems: "center", flexDirection: "column"}}
                                        className={GlobalStyle.Container.MEDIUM} />;
        }
        return this.announcementsList;
    }

    getAnalysisPanel() {
        if (this.getContest().hasFinished() && this.getContest().isAnalysisPublic) {
            return <ContestAnalysis contest={this.getContest()} className={GlobalStyle.Container.MEDIUM}/>;
        }
    }

    getLoadingPanel() {
        return <ContestLoadingPage ref={this.refLink("loadingPage")} contest={this.getContest()} />;
    }

    getContestTaskPanel(contestTask) {
        if (!this.contestTaskPanelsMap.has(contestTask.id)) {
            this.contestTaskPanelsMap.set(contestTask.id, <DelayedContestTaskPanel contestTaskId={contestTask.id} />);
        }
        return this.contestTaskPanelsMap.get(contestTask.id);
    }

    getSubroutes() {
        const contest = this.getContest();

        return [
            new Route("summary", () => this.getSummaryPanel()),
            new Route("tasks", () => this.getTasksListPanel(), [], "Tasks"),
            new Route("task", () => this.getTasksListPanel(), [
                new TerminalRoute("%s", (options) => {
                    const contestTask = ContestTaskStore.getByContestIdAndUrlName(this.options.contestId, options.args[0]);
                    return contestTask && this.getContestTaskPanel(contestTask);
                }),
            ]),
            new Route("scoreboard", () => this.getScoreboardPanel(), [], "Scoreboard"),
            new Route("chat", () => this.getChatPanel(), [], "Chat"),
            new Route("submissions", () => this.getSubmissionsPanel(), [], "Submissions"),
            new Route("announcements", () => this.getAnnouncementsPanel(), [], "Announcements"),
            new Route("analysis", () => this.getAnalysisPanel(), [], "Analysis"),
            new Route("loading", () => this.getLoadingPanel(), [], "Loading"),
            // Special subpages configurable per contest
            contest.getSubpages().map(subpage => {
                const generator = () => <RecursiveArticleRenderer articleId={subpage.articleId} style={{maxWidth: 800, margin: "auto", padding: 8}}/>;
                return new Route(subpage.url, generator, [], subpage.name);
            }),
        ];
    }

    getRoutes() {
        this.routes = this.routes || new Route(null, () => this.getSummaryPanel(), this.getSubroutes());
        return this.routes;
    }

    setURL(urlParts) {
        if (urlParts) {
            super.setURL(urlParts);
            PageTitleManager.setTitle(this.pageTitle);
        }
    }

    get pageTitle() {
        let title = this.getContest().getName();
        const currentPageTitle = this.getActive().pageTitle;
        if (currentPageTitle) {
            title = currentPageTitle + " " + title;
        }
        return title;
    }

    getURLPrefix(str) {
        let url = "/contest/" + this.getContest().name + "/";
        if (str) {
            url += str + "/";
        }
        return url;
    }

    updateOnNewTasks() {
        this.redraw();
        this.navHandler.apply();
        this.scoreboard?.scoreboardTable.redraw();
    }

    processTaskBroadcast(event) {
        if (this.getContest().id !== event.task.contestId || this.getContest().loadedManually) {
            return;
        }
        // Ensure that the problem which marks the contest as started is the first one
        if (!this.getContest().hasStarted() && !event.task.forceTaskOpen) {
            setTimeout(() => {
                GlobalState.applyEvent(event);
            }, 1000);
            return;
        }
        if (!this.getContest().hasStarted() && event.task.forceTaskOpen) {
            // HACK: If the contest MUST start now, ensure that contest.hasStarted() returns true
            this.getContest().startTime = ServerTime.now().unix();
        }

        GlobalState.importState(event.task.state);
        if (event.state) {
            GlobalState.importState(event.state);
        }

        let contestTask = ContestTaskStore.get(event.task.contestTaskId);

        this.getContest().addContestTask(contestTask);

        this.updateOnNewTasks();

        if (event.objectType !== "contest") {
            GlobalState.applyEvent({
                "objectType": "contest",
                "objectId": this.getContest().id,
                "type": event.type,
                "data": event.data,
                "task": event.task
            });
        }

        if (event.task.forceTaskOpen) {
            this.switchToTask(contestTask);
        }
    }

    createUserListener() {
        this.attachChangeListener(UserStore.getCurrentUser(), (event) => {
            if (event.type !== "contestTaskBroadcast") {
                return;
            }
            if (!this.getContest().getUser(USER.id)) {
                return;
            }
            this.processTaskBroadcast(event);
        });
        this.attachEventListener(this.getContest(), "contestTaskBroadcast", (event) => {
            let extra = event.extra || {};
            Object.assign(event, extra);
            this.processTaskBroadcast(event);
        });
    }

    requestScoreboard() {
        const contest = this.getContest();

        Ajax.getJSON("/contest/scoreboard_state/", {
            contestId: contest.id
        }).then(() => {
            this._loadedScoreboard = true;
            contest._loadedScoreboard = true;
            this.navHandler.apply();
            this.contestTaskList && this.contestTaskList.refreshBubbles();

            if (contest.isVirtual()) {
                for (let contestUser of contest.getBaseContest().getUsers()) {
                    contestUser.resetScore();
                }
                for (let contestUser of contest.getUsers()) {
                    contestUser.resetScore();
                }
                contest.getBaseContest().recalculateUsers();

                if (!contest.hasStarted()) {
                    //TODO: find a way to remove timeout, maybe simulate contestTaskBroadcast event?
                    setTimeout(() => {
                        this.redraw();
                        this.navHandler.apply();
                        let firstTask = contest.getBaseContest().getContestTasks()[0];
                        this.switchToTask(firstTask.getVirtualTask());
                        this.playbackScoring();
                    }, (contest.getStartTime() - ServerTime.now().unix()) * 1000);
                } else {
                    this.playbackScoring();
                }
            }
        });
    }

    requestChat() {
        const contest = this.getContest();
        const chatId = contest.chatId;
        if (chatId) {
            GroupChatStore.fetch(this.getContest().chatId, () => {
                this.chat && this.chat.redraw();
                this.navHandler.apply();
            });
        }
    }

    initializeContestLoading() {
        const contest = this.getContest();
        if (!contest.isVirtual() && !contest.hasStarted()) {
            const contestStartTime = contest.getStartTime();
            const currentServerTime = ServerTime.now().unix();
            const timeRemainingInMilliseconds = (contestStartTime - currentServerTime) * 1000;
            if (timeRemainingInMilliseconds < 20 * TimeUnit.DAY) {
                setTimeout(() => {
                    if (!contest.hasAnyTask()) {
                        Router.changeURL(this.getURLPrefix("loading"));
                    }
                }, timeRemainingInMilliseconds);
            }
        }

        this.attachListener(contest, "loadedManually", () => {
            contest.loadedManually = true;
            this.updateOnNewTasks();

            // Jump to the task with the lowest contest index (the "first" task)
            this.switchToTask(contest.getContestTasks()[0]);
        });
    }

    attachHourlyContestListeners() {
        const contest = this.getContest();
        this.attachEventListener(contest, "contestEnd", (event) => {
            if (this.isInDocument()) {
                NextContestModal.show({contest: this.getContest(), nextContestData: event.nextContestData});
            }
        });
        this.attachDeleteListener(contest, (event) => {
            if (event.reason && event.reason === "noRegisteredUsers" && this.isInDocument()) {
                ContestCancelledModal.show({nextContestName: event.nextContestData.name});
            }
        });
    }

    attachAnalysisListeners() {
        this.attachEventListener(this.getContest(), "publishAnalysis", () => {
            if (this.isInDocument()) {
                this.redraw();
                this.navHandler.apply();
                AnalysisModal.show({contestPanel: this});
            }
        });
        this.addListener("gotoAnalysis", () => {
            Router.changeURL(this.getURLPrefix("analysis"));
        });
    }

    registerStreams() {
        GlobalState.registerStream("contest-" + this.getBaseContest().id + "-announcements");
        if (USER.isSuperUser || this.getContest().liveResults) {
            GlobalState.registerStream("contest-" + this.getBaseContest().id + "-scores");
        }
        if (!this.getBaseContest().getUser(USER.id)) {
            GlobalState.registerStream("contest-" + this.getBaseContest().id + "-unregistered");
        }
        if (this.getVirtualContest()) {
            GlobalState.registerStream("contest-" + this.getVirtualContest().id + "-scoreevents");
        }
        if (!this.getContest().isVirtual() && this.getVirtualContest()) {
            GlobalState.registerStream("contest-" + this.getVirtualContest().id + "-scores");
        }
    }

    handleAnnotationsAndQuestionsChanges() {
        const contest = this.getContest();

        const questionsLocalStorageMap = ContestLocalStorageManager.getQuestionsLocalStorageMap(contest.id);
        const announcementsLocalStorageMap = ContestLocalStorageManager.getAnnouncementsLocalStorageMap(contest.id);

        const contestNotificationManager = new ContestNotificationManager(contest.id);
        const createQuestionNotificationHandler = (question) => {
            const task = question.getContestTask();
            if (question.contestId === contest.id && question.isAnswered() && question.shouldAppear()) {
                const message = question.isAskedByCurrentUser() ?
                    'Your question for task "' + task.longName +'" has been answered.'
                    : "A user's question for task " + '"' + task.longName + '" has been answered publicly.';
                contestNotificationManager.createNotification({
                    message: message,
                    link: task.getFullURL() + "questions",
                    title: "Question notification",
                    id: "question" + question.id,
                    key: question.id
                });

                const badgeValue = parseInt((this.getContestTaskPanel(task)
                    && this.getContestTaskPanel(task).badge
                    && this.getContestTaskPanel(task).badge.getValue()) || 0);
                questionsLocalStorageMap.set(task.id, badgeValue + 1);
            }
        };

        const createAnnouncementNotificationHandler = (announcement) => {
            if (announcement.contestId  === contest.id) {
                let link = this.getURLPrefix("") + "announcements";
                let message = "New announcement: " + announcement.getTarget();
                let id = "announcement" + announcement.id;
                if (announcement.isTaskBroadcast()) {
                    link = this.getURLPrefix("task/" + announcement.getContestTask().name);
                    message = 'Task "' + announcement.getContestTask().longName + '" is now available!';
                    id = null;
                }
                contestNotificationManager.createNotification({
                    message: message,
                    title: announcement.getTarget(),
                    id: id,
                    key: announcement.id,
                    link: link,
                });


                const badgeValue = parseInt((this.navHandler.announcementsBadge
                                          && this.navHandler.announcementsBadge.getValue()) || 0);
                announcementsLocalStorageMap.set("counter", badgeValue + 1);
            }
        };

        this.attachCreateListener(ContestQuestionStore, (question) => {
            if (!question.isAskedByCurrentUser()) {
                createQuestionNotificationHandler(question);
            }
        });
        this.attachListener(this.getContest(), "updateQuestion", createQuestionNotificationHandler);
        this.attachCreateListener(ContestAnnouncementStore, createAnnouncementNotificationHandler);
    }

    onMount() {
        this.navHandler.apply();

        this.requestScoreboard();

        this.requestChat();

        if (UserStore.getCurrentUser()) {
            this.createUserListener();
        }

        this.initializeContestLoading();

        this.attachAnalysisListeners();

        if (this.getContest().systemGenerated) {
            this.attachHourlyContestListeners();
        }

        this.registerStreams();

        if (!this.getContest().hasFinished()) {
            this.handleAnnotationsAndQuestionsChanges();
        }
    }
}
