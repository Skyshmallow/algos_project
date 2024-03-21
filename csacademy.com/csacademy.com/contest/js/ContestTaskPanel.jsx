// TODO: this file is way too big, try to split it
import {UI, TitledSectionDivider, Modal, Button, Panel, styleRule, StyleSheet, registerStyle,
        FlatTabArea, RawHTML, Level, Size, Orientation} from "../../csabase/js/UI.js";
import {StateDependentElement} from "../../stemjs/src/ui/StateDependentElement.jsx";
import {GlobalState} from "../../stemjs/src/state/State.js";
import {WorkspaceIDE, PluginTypes} from "../../workspace/js/ide/WorkspaceIDE.js";
import {AsyncCommentThread} from "../../establishment/chat/js/CommentWidget.jsx";
import {NavCounterBadge} from "../../stemjs/src/ui/navmanager/NavCounterBadge.js";
import {SubmissionSummaryContestFilter} from "../../eval/js/SubmissionSummary.jsx";
import {ArticleRenderer} from "../../establishment/content/js/ArticleRenderer.jsx";
import {MarkupClassMap} from "../../stemjs/src/markup/MarkupRenderer.js";
import {FullScreenable} from "../../stemjs/src/ui/FullScreenable.js";
import {Formatter} from "../../csabase/js/util.js";
import {ProgrammingLanguage} from "../../csabase/js/state/ProgrammingLanguageStore.js";
import "Translation";
import {Login} from "../../establishment/accounts/js/Login.jsx";
import {EvalTaskStatisticsWidget} from "../../eval/js/EvalTaskStatistics.jsx";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import * as Badges from "../../eval/js/EvalTaskBadge.jsx";
import {ServerTime} from "../../stemjs/src/time/Time.js";
import {ServerInputTest} from "../../eval/js/ServerInputTest.jsx";
import {Device} from "../../stemjs/src/base/Device.js";
import {EvalTaskExamplesTable} from "../../eval/js/EvalTaskExamplesTable.jsx";

import {ContestQuestionStore} from "./state/ContestQuestionStore";
import {ContestTaskStore} from "./state/ContestTaskStore";
import {ContestTaskQuestionList, AskTaskQuestionButton} from "./ContestQuestionList";
import {ContestLocalStorageManager} from "./ContestLocalStorageManager";
import {EvalTaskTestGroupingTable} from "../../eval/js/EvalTaskTestGroupingTable.jsx";


class EvalTaskLimits extends UI.Element {
    render() {
        const evalTask = this.options.evalTask;
        return [
            UI.T("Time limit:"), " ",
            <em>{Formatter.cpuTime(evalTask.getTimeLimit(this.options.programmingLanguageId) / 1000)}</em>,
            <br/>,
            UI.T("Memory limit:"), " ",
            <em>{Formatter.memory(evalTask.getMemoryLimit(this.options.programmingLanguageId) * 1024)}</em>,
            <br/>,
            <br/>
        ]
    }

    setProgrammingLanguageId(programmingLanguageId) {
        this.updateOptions({programmingLanguageId});
    }
}

class ContestTaskSummaryPanel extends Panel {
    getContestTask() {
        return this.options.contestTask;
    }

    getEvalTaskBadges() {
        let badges = [];
        let evalTask = this.getContestTask().getEvalTask();
        if (evalTask) {
            if (evalTask.hasEnforcedTemplates()) {
                badges.push(<Badges.EnforcedTemplateBadge />);
            }
            if (evalTask.isInteractive()) {
                badges.push(<Badges.InteractiveBadge />);
            }
        }
        return badges;
    }

    render() {
        const contestTask = this.getContestTask();
        const evalTask = contestTask.getEvalTask();
        const contest = contestTask.getContest();
        const article = contestTask.getStatementArticle();

        if (article.markup.startsWith("pdf:")) {
            const pdfURL = article.markup.substring(4);
            return [
                <div className="text-center">
                    <EvalTaskLimits ref="taskLimits" evalTask={evalTask} programmingLanguageId={this.options.programmingLanguageId}/>
                    <object data={pdfURL} type="application/pdf" width="100%" height="640px" />
                </div>,
            ];
        }

        const articleClassMap = new MarkupClassMap(MarkupClassMap.GLOBAL, [
            ["TaskExamples", EvalTaskExamplesTable(evalTask)],
            ["TaskTestGrouping", EvalTaskTestGroupingTable(evalTask)],
            ["RawHTML", RawHTML],
            ["ServerInputTest", ServerInputTest]
        ]);
        evalTask.articleClassMap = articleClassMap;

        return [
            contest.getLogoURL() && <div style={{textAlign: "center"}}>
                <img style={{
                    maxWidth: "360px",
                    marginBottom: "-10px",
                }}
                     src={contest.getLogoURL()}
                />
            </div>,

            <div className="text-center">
                <h1>{UI.T(evalTask.longName)}</h1>
                <EvalTaskLimits ref="taskLimits" evalTask={evalTask} programmingLanguageId={this.options.programmingLanguageId}/>
                <div>
                    {this.getEvalTaskBadges()}
                </div>
            </div>,
            <ArticleRenderer
                ref="statementArticle"
                article={article}
                showEditButton
                liveLanguage
                editButtonUrl={"/task/" + evalTask.urlName + "/edit/"}
                classMap={articleClassMap}
            />
        ];
    }
}

class EvalTaskSolutionPanel extends Panel {
    getTitle() {
        return UI.T("Editorial");
    }

    render() {
        return <ArticleRenderer article={this.options.evalTask.getSolutionArticle()} liveLanguage />
    }
}

class EvalTaskStatisticsPanel extends Panel {
    getTitle() {
        return UI.T("Statistics");
    }

    onMount() {
        this.addListener("setActive", () => {
            if (this.options.children.length === 0) {
                let child = <EvalTaskStatisticsWidget evalTask={this.options.evalTask} />;
                this.appendChild(child);
            }
        });
    }
}

class QuestionsPanel extends Panel {
    render() {
        let {contest, contestTask} = this.options;

        return [
            <AskTaskQuestionButton level={Level.PRIMARY}
                                   label={UI.T("Ask question")}
                                   modalOptions={{contest, contestTask}}
                                   style={{margin: "10px"}} />,
            <ContestTaskQuestionList contest={contest}
                                     contestTaskId={contestTask.id} />,
        ];
    }
}


class ContestTaskCounterBadge extends NavCounterBadge {
    getDefaultOptions() {
        return Object.assign({}, super.getDefaultOptions(), {
            style: {
                right: 0,
                top: 0,
                marginLeft: 5,
                position: "initial",
            },
        });
    }
}


class ContestTaskPanelStyle extends StyleSheet {
    @styleRule
    taskPanel = {
        padding: "5px 24px",
        backgroundColor: this.themeProps.COLOR_BACKGROUND,
    };
}


@registerStyle(ContestTaskPanelStyle)
class ContestTaskPanel extends FullScreenable(Panel) {
    getDefaultOptions() {
        return {
            ...super.getDefaultOptions(),
            updateURL: true,
        };
    }

    getContestTask() {
        return ContestTaskStore.get(this.options.contestTaskId);
    }

    getEvalTask() {
        return this.getContestTask().getEvalTask();
    }

    getContest() {
        return this.getContestTask().getContest();
    }

    getWorkspace() {
        return this.getEvalTask().getWorkspace();
    }

    showWorkspace() {
        this.divider.collapseChild(0);
        this.divider.expandChild(1);
    }

    showStatement() {
        this.divider.collapseChild(1);
        this.divider.expandChild(0);
    };

    showBoth() {
        if (this.idePanel.getWidth() === 0) {
            this.idePanel.setWidth("50%");
            this.taskPanel.setWidth("50%");
        }
        this.divider.expandChild(0);
        this.divider.expandChild(1);
    };

    setURL(urlParts) {
        this.showUrlTab(urlParts[0] || "");
    }

    addQuestionBadgeListeners() {
        const localStorageMap = ContestLocalStorageManager.getQuestionsLocalStorageMap(this.getContestTask().id);

        /* When badge is created, it takes its counter from the local storage. After that:
           - when a question is created: increase badge counter if the active tab isn't "Questions"
           - when active tab is set to "Questions": reset badge count and update local storage value
           - when local storage value changes: if the new value is 0 it means that the "Questions" tab has been clicked
                on another tab, so reset the badge counter.
         */

        this.badge.setValue(localStorageMap.get(this.getContestTask().id) || 0);
        this.attachListener(this.tabArea.activeTabDispatcher, () => {
            if (this.tabArea.getActive() === this.questionsPanel) {
                this.badge.reset();
                localStorageMap.set(this.getContestTask().id, 0);
            }
        });

        localStorageMap.addChangeListener((event) => {
            if (!event.newValue) {
                this.badge.reset();
            }
        });

        const incrementBadgeCount = (question) => {
            if (question.contestId === this.getContest().id && question.contestTaskId === this.getContestTask().id) {
                this.badge.increment();
            }
        };

        this.attachListener(ContestQuestionStore, "create", (question) => {
            if (!question.isAskedByCurrentUser()) {
                incrementBadgeCount(question);
            }
        });
        this.attachListener(this.getContest(), "updateQuestion", incrementBadgeCount);
    }

    onMount() {
        this.attachChangeListener(this.getEvalTask(), () => this.redraw());

        const modifyIde = () => {
            const updateTaskLimits = (programmingLanguage) => {
                this.taskSummaryPanel.taskLimits.setProgrammingLanguageId(programmingLanguage.id);
            };
            this.ide.addListener("changeLanguage", updateTaskLimits);
            updateTaskLimits(this.ide.programmingLanguageSelect.get());

            // Automatically focus the code editor when entering the page (feature request)
            this.ide.codeEditor.focus();
            this.ide.codeEditor.gotoEnd();
        };

        this.addListener("workspaceLoaded", () => modifyIde());
        if (this.ide) {
            modifyIde();
        }

        // TODO: make this a method in this class!
        let dispatchResize = () => {
            if (this.ide) {
                this.ide.sectionDivider.dispatch("resize");
            }
        };

        window.addEventListener("resize", () => {
            dispatchResize();
        });

        this.idePanel.addListener("resize", () => {
            dispatchResize();
        });

        let contest = this.getContest();
        if (contest.systemGenerated) {
            this.attachEventListener(contest, "contestEnd", () => {
                this.tabArea.redraw();
            });
        }

        // TODO: Why is this here?
        contest.addEventListener("broadcastTask", (event) => {
            GlobalState.importState(event.extra.state);
        });

        window.taskView = false;

        // Questions Badge
        if (this.questionsPanel) {
            this.addQuestionBadgeListeners();
        }

        this.addListener("enterFullScreen", () => this.ide.dispatch("enterFullScreen"));
        this.addListener("exitFullScreen", () => this.ide.dispatch("exitFullScreen"));

        this.attachListener(this.idePanel, "resize", () => {
            if (this.ide) {
                this.ide.dispatch("resize");
            }
        });
        this.attachListener(this.taskPanel, "resize", () => {
            this.tabArea.titleArea.dispatch("resize");
        })
    };

    getCommentsPanel() {
        const discussionId = this.getEvalTask().discussionId;
        if (discussionId && (!this.getContest().isRunning() || this.getContest().isInfinite())) {
            return <Panel ref="discussionPanel" title={UI.T("Task Discussion")}
                             tabHref={this.getSubURL("discussion")}>
                <AsyncCommentThread chatId={discussionId} />
            </Panel>;
        }
    }

    getSolutionPanel() {
        const solutionArticle = this.getEvalTask().getSolutionArticle();
        if (solutionArticle && (!this.getContest().isRunning() || this.getContest().isInfinite())) {
            return <EvalTaskSolutionPanel ref="solutionPanel"
                                          tabHref={this.getSubURL("solution")}
                                          evalTask={this.getEvalTask()} />;
        }
    }

    getStatisticsPanel() {
        if (this.getContestTask().canShowStatistics()) {
            return <EvalTaskStatisticsPanel ref="statisticsPanel"
                                            tabHref={this.getSubURL("statistics")}
                                            evalTask={this.getEvalTask()} />
        }
    }

    getSubmissionPanel() {
        return <SubmissionSummaryContestFilter ref="submissionsPanel" title={UI.T("Submissions")}
                                               tabHref={this.getSubURL("submissions")}
                                               contestId={this.getContest().id}
                                               contestTaskId={this.getContestTask().id} />
    }

    getQuestionsPanelTitleWithBadge() {
        if (!this.badge) {
            this.badge = <ContestTaskCounterBadge level={Level.DANGER}/>;
        }
        return <div>
            <span>{UI.T("Questions")}</span>
            {this.badge}
        </div>;
    }

    getQuestionsPanel() {
        const contest = this.getContest();

        if (!contest.canReceiveQuestions()) {
            return;
        }

        return <QuestionsPanel ref="questionsPanel"
                               title={this.getQuestionsPanelTitleWithBadge()}
                               tabHref={this.getSubURL("questions")}
                               contest={this.getContest()}
                               contestTask={this.getContestTask()} />;
    }

    requestEvalTaskWorkspace() {
        Ajax.postJSON("/eval/fetch_eval_task_user_summary/", {evalTaskId: this.getEvalTask().id}).then(
            () => {
                if (this.getWorkspace()) {
                    this.idePanel.setChildren([this.getWorkspaceIDE()]);
                    this.dispatch("workspaceLoaded");
                }
            }
        );
    }

    getWorkspaceIDE() {
        if (USER.isAuthenticated) {
            const workspace = this.getWorkspace();
            if (workspace) {
                let plugins = PluginTypes.CONTEST;
                if (this.getContest().canShowPublicSources() && this.getEvalTask().hasEnforcedTemplates()) {
                    plugins = PluginTypes.CONTEST_PUBLIC_SOURCES_ENFORCED_TEMPLATE;
                } else if (this.getContest().canShowPublicSources()) {
                    plugins =  PluginTypes.CONTEST_PUBLIC_SOURCES;
                } else if (this.getEvalTask().hasEnforcedTemplates()) {
                    plugins = PluginTypes.CONTEST_ENFORCED_TEMPLATE;
                }
                this.ide = <WorkspaceIDE plugins={plugins} workspace={workspace} fullContainer={false}
                                         contestTaskId={this.options.contestTaskId} />;

                this.ide.toggleFullScreen = () => this.toggleFullScreen();

                return this.ide;
            } else {
                const timeShouldRequest = this.getContestTask().getTimeAvailable().add({seconds: 10 + 10 * Math.random()});
                let requestDelay = (+timeShouldRequest - ServerTime.now());
                if (this.getContest() && this.getContest().isVirtual()) {
                    requestDelay = 0;
                }

                setTimeout(() => this.requestEvalTaskWorkspace(), Math.min(Math.max(requestDelay, 0), 20 * 1000));

                return [
                    StateDependentElement.renderLoading(),
                    <div style={{marginTop: "20px", textAlign: "center", fontSize: "1.3em"}}>
                        Loading the workspace...
                    </div>
                ];
            }
        } else {
            return <div>
                <h3 className="text-center">{UI.T("Authenticate to use the workspace")}</h3>
                <Login ref={this.refLink("loginPanel")}/>
            </div>;
        }
    }

    /* TODO: WARNING! THIS CLASS FAILS ON REDRAW */
    redraw() {
        if (!this.taskPanel) {
            super.redraw();
        } else {
            this.taskPanel.redraw();
        }
    }

    getSubURL(section) {
        if (this.options.updateURL) {
            let prefix;
            if (this.options.customURLPrefix) {
                prefix = this.options.customURLPrefix;
            } else {
                prefix = this.getContestTask().getFullURL();
            }
            return prefix + section + "/";
        }
    }

    render() {
        let programmingLanguageId = ProgrammingLanguage.getDefaultLanguage().id;

        const isMobile = Device.isMobileDevice();

        const ideWidth = isMobile ? "0%" : "50%";
        const taskWidth = isMobile ? "100%" : "50%";

        return [<TitledSectionDivider ref="divider" orientation={Orientation.HORIZONTAL}
                                      style={{overflow: "hidden", height: "100%", width: "100%"}}>
                    <Panel size={taskWidth} style={{overflow: "hidden"}} title="task" ref="taskPanel">
                        <FlatTabArea style={{height: "100%"}} ref="tabArea" lazyRender
                                 panelClass={this.styleSheet.taskPanel}>
                            <ContestTaskSummaryPanel
                                ref="taskSummaryPanel"
                                title={UI.T("Statement")}
                                active="true"
                                tabHref={this.getSubURL("statement")}
                                contestTask={this.getContestTask()}
                                programmingLanguageId={programmingLanguageId}
                                style={{width: "100%", height: "100%"}}
                            />
                            {this.getSolutionPanel()}
                            {this.getCommentsPanel()}
                            {this.getStatisticsPanel()}
                            {this.getSubmissionPanel()}
                            {this.getQuestionsPanel()}
                        </FlatTabArea>
                    </Panel>
                    <Panel collapsed={Device.isMobileDevice()} size={ideWidth} ref="idePanel" title="workspace / submit">
                        {this.getWorkspaceIDE()}
                    </Panel>
                </TitledSectionDivider>
        ];
    }

    showUrlTab(location) {
        for (const panel of this.tabArea.options.children) {
            if (panel.options.tabHref === this.getSubURL(location)) {
                panel.dispatch("show");
                return;
            }
        }
        this.taskSummaryPanel.dispatch("show");
    }
}

class ContestTaskModal extends Modal {
    getDefaultOptions() {
        return Object.assign({}, super.getDefaultOptions(), {
            height: "80%",
            width: "80%"
        });
    }

    showTask() {
        this.modalWindow.setChildren(this.render());
    }

    getContestTaskPanelStyle() {
        return {
            minHeight: "700px",
            borderRadius: "10px"
        };
    }

    render() {
        let contestTask = ContestTaskStore.get(this.options.contestTaskId);
        if (contestTask) {
            return [<ContestTaskPanel style={this.getContestTaskPanelStyle()}
                                      contestTaskId={this.options.contestTaskId}
                                      updateURL={false} />];
        }
        // This is a post because it creates a workspace if one doesn't exist
        Ajax.postJSON("/contest/get_contest_task/", {
            contestTaskId: this.options.contestTaskId,
            requestContestTask: true
        }).then(
            () => this.showTask()
        );
        return [
            StateDependentElement.renderLoading()
        ];
    }
}

class ContestTaskButton extends Button {
    getDefaultOptions() {
        return Object.assign({}, super.getDefaultOptions(), {
            style: {
                margin: "5px",
            },
            level: Level.PRIMARY,
            size: Size.LARGE
        });
    }

    setOptions(options) {
        if (!options.icon) {
            options.label = options.label || UI.T("Solve this task");
        }
        super.setOptions(options);
    }

    onMount() {
        super.onMount();
        this.addClickListener(() => {
            if (this.contestTaskModal) {
                this.contestTaskModal.show();
            } else {
                this.contestTaskModal = ContestTaskModal.show({
                    contestTaskId: this.options.contestTaskId,
                    destroyOnHide: false
                });
            }
        });
    }
}

export {ContestTaskSummaryPanel, ContestTaskPanel, ContestTaskModal, ContestTaskButton};
