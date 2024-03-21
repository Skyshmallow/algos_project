import {UI, Link, ActionModal, ActionModalButton, Router, Route, TerminalRoute, registerStyle, Level} from "../../csabase/js/UI.js";
import {GlobalState} from "../../stemjs/src/state/State.js";
import {Difficulty} from "../../csabase/js/state/DifficultyStore.js";
import {DelayedContestTaskPanel} from "../../contest/js/DelayedContestTaskPanel.js";
import {SubmissionSummaryInterviewFilter} from "../../eval/js/SubmissionSummary.jsx";
import {StemDate} from "../../stemjs/src/time/Date.js";
import {ServerTime} from "../../stemjs/src/time/Time.js";
import {FixedURLAjaxHandler} from "../../stemjs/src/base/Ajax.js";
import {NavManager} from "../../stemjs/src/ui/navmanager/NavManager.jsx";
import {NavElement, NavLinkElement} from "../../stemjs/src/ui/navmanager/NavElement.jsx";
import {GlobalStyle} from "../../stemjs/src/ui/GlobalStyle.js";

import {InterviewStore, InterviewTaskStore} from "./state/InterviewStore.js";
import {InterviewTaskBubbleStyle} from "./InterviewStyle.js";
import {autoredraw} from "../../stemjs/src/decorators/AutoRedraw.js";


class InterviewTaskPanel extends DelayedContestTaskPanel {
    getInterview() {
        return this.options.interviewTask.getInterview();
    }

    getCommentsPanel() {
        if (this.getInterview().getEndTime()) {
            return super.getCommentsPanel();
        }
    }

    getSolutionPanel() {
        if (this.getInterview().getEndTime()) {
            return super.getSolutionPanel();
        }
    }

    getStatisticsPanel() {
        if (this.getInterview().getEndTime()) {
            return super.getStatisticsPanel();
        }
    }

    getSubmissionPanel() {
        return <SubmissionSummaryInterviewFilter ref="submissionsPanel" title={UI.T("Submissions")}
                                                 tabHref={this.getSubURL("submissions")}
                                                 contestTask={this.getContestTask()} />;
    }

    modifyIde() {
        const interviewSubmitAjaxHandler = new FixedURLAjaxHandler("/interview/submit_interviewjob/");
        interviewSubmitAjaxHandler.addPreprocessor((request) => {
            request.data.interviewId = this.getInterview().id;
        });
        this.ide.getPlugin("ContestSubmit").setAjaxHandler(interviewSubmitAjaxHandler);
    }

    onDelayedMount() {
        super.onDelayedMount();
        // TODO: fix this hack
        if (this.ide) {
            this.ide.whenLoaded(() => this.modifyIde());
        } else {
            this.addListener("workspaceLoaded", () => {
                this.ide.whenLoaded(() => this.modifyIde());
            });
        }


        // TODO: fix this in case it fails, (No Denis, No setInterval/setTimeout here)
        // Mark problem as read
        this.options.interviewTask.markAsRead();

        this.attachChangeListener(this.getInterview(), () => {
            this.redraw();
        });
    }
}

class SkipTaskModal extends ActionModal {
    getTitle() {
        return "Skip task";
    }

    getActionName() {
        return "Skip";
    }

    getBody() {
        return <p>
            Are you sure you want to skip {this.options.interviewTask.getContestTask().longName}?
            You will not be able to solve this task later.
        </p>;
    }

    action() {
        this.options.interviewTask.markAsLocked();
        this.hide();
    }
}

class SkipTaskButton extends ActionModalButton(SkipTaskModal) {
    onMount() {
        super.onMount();
        this.addClickListener((event) => {
            event.preventDefault();
            event.stopPropagation();
        });
    }
}

@registerStyle(InterviewTaskBubbleStyle)
class InterviewTaskBubble extends Link {
    setOptions(options) {
        super.setOptions(options);
        this.options.contestTask = this.getInterviewTask().getContestTask();
        this.options.href = this.options.href || this.getFullTaskUrl();
    }

    getFullTaskUrl() {
        return "/interview/" + this.getInterviewTask().interviewId + "/task/" + this.options.contestTask.name + "/";
    }

    getInterviewTask() {
        return this.options.interviewTask;
    }

    getContestTask() {
        return this.options.contestTask;
    }

    getTaskDifficulty() {
        let taskDifficulty = Difficulty.get(this.getContestTask().getDifficulty());

        return <div className={this.styleSheet.taskDifficulty} style={{"color": taskDifficulty.color}}>
            {taskDifficulty.toString()}
        </div>;
    }

    getUserScore() {
        let points;
        let getSolvedIcon = () => <span className="fa fa-check fa-lg" style={{color: "green"}}/>;
        let getUnsolvedIcon = () => <span className="fa fa-times fa-lg" style={{color: "red"}}/>;
        let getLockIcon = () => <span className="fa fa-lock fa-lg" style={{color: "gray"}}/>;

        if (!this.getInterviewTask().canOpen()) {
            points = getLockIcon();
        } else if (!this.getInterviewTask().isAvailableTask()) {
            points = this.getInterviewTask().getSolvedTime() ? getSolvedIcon() : getUnsolvedIcon();
        }

        return <div className={this.styleSheet.userScore}>
            {points}
        </div>;
    }

    getTaskDescription() {
        return <div className={this.styleSheet.taskDescription}>
            <div className={this.styleSheet.taskName}>
                {UI.T(this.getContestTask().longName)}
            </div>
            <div className={this.styleSheet.originalContest}>
            </div>
        </div>
    }

    getNodeAttributes() {
        let attr = super.getNodeAttributes();

        attr.addClass(String(this.styleSheet.className));
        if (this.getInterviewTask().canOpen()) {
            attr.setStyle("cursor", "pointer");
        } else {
            attr.setStyle("backgroundColor", "lightgray");
        }

        return attr;
    }

    render() {
        let skipTaskButton;
        if (this.getInterviewTask().isAvailableTask() && !this.getInterviewTask().isLastTask()) {
            skipTaskButton = <SkipTaskButton style={{marginRight: "5%", marginTop: "20px"}} className="pull-right"
                                             label="Skip" modalOptions={{interviewTask: this.getInterviewTask()}}/>;
        }
        return [
            this.getTaskDescription(),
            this.getUserScore(),
            this.getTaskDifficulty(),
            skipTaskButton,
        ];
    }
}

@autoredraw(InterviewTaskStore)
class InterviewTaskList extends UI.Element {
    render() {
        const {interview} = this.getInterview();
        return interview.getInterviewTasks().map(interviewTask => <InterviewTaskBubble
            key={interviewTask.id}
            interviewTask={interviewTask}
        />);
    }
}

class InterviewAnalysis extends UI.Element {
    render() {
        return <div className="text-center">
            <h3>Congratulations</h3>
            <p>You can continue training in the <Link href="/contest/interview-archive/" value="interview archive" />.</p>
        </div>;
    }
}

class GoNextModal extends ActionModal {
    getInterviewTask() {
        return this.options.interviewTask;
    }

    getTitle() {
        if (this.getInterviewTask().getLockedTime() && !this.getInterviewTask().isLastTask()) {
            return "New problem unlocked";
        }
        return "Congratulations";
    }

    getActionName() {
        if (this.getInterviewTask().isLastTask()) {
            return "End interview";
        } else {
            return "Next problem";
        }
    }

    getActionLevel() {
        return Level.PRIMARY;
    }

    getCloseName() {
        return "Not now";
    }

    getBody() {
        if (this.getInterviewTask().isLastTask()) {
            return "You finished all the problems!";
        } else {
            return "You unlocked a new problem.";
        }
    }

    action() {
        let interviewTask = this.getInterviewTask();
        if (interviewTask.isLastTask()) {
            // TODO: duplicated from EndInterviewModal.action
            let onSuccess = () => {
                this.hide();
                Router.changeURL(["interview", interviewTask.interviewId, "analysis"]);
            };
            let onError = (error) => {
                if (typeof error === "string") {
                    this.messageArea.showMessage("Error: " + error);
                } else {
                    this.messageArea.showMessage("Error: " + error.message);
                }
            };
            interviewTask.getInterview().endInterview(onSuccess, onError);
        } else {
            this.hide();
            Router.changeURL(["interview", interviewTask.interviewId, "task", interviewTask.getNextTask().getContestTask().name]);
        }
    }
}

class EndInterviewModal extends ActionModal {
    getActionName() {
        return "End interview";
    }

    getActionLevel() {
        return Level.WARNING;
    }

    getBody() {
        return "Are you sure you want to end your interview?";
    }

    action() {
        let onSuccess = () => {
            this.hide();
            Router.changeURL(["interview", this.options.interview.id, "analysis"]);
        };
        let onError = (error) => {
            if (typeof error === "string") {
                this.messageArea.showMessage("Error: " + error);
            } else {
                this.messageArea.showMessage("Error: " + error.message);
            }
        };
        this.options.interview.endInterview(onSuccess, onError);
    }
}

const EndInterviewButton = ActionModalButton(EndInterviewModal);

export class InterviewPanel extends Router {
    getDefaultOptions() {
        return {
            style: {
                height: "100%",
            },
            children: []
        };
    }

    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.addClass(GlobalStyle.Container.MEDIUM);
    }

    getInterview() {
        return InterviewStore.get(this.options.interviewId);
    }

    getUrlPrefix(str) {
        let url = "/interview/" + this.options.interviewId + "/";
        if (str) {
            url += str + "/";
        }
        return url;
    }

    setOptions(options) {
        super.setOptions(options);
        this.tasksWithShowedModal = new Set();
        // TODO: add solved tasks to the set
        GlobalState.importState(options.state || {});
    }

    getAnalysis() {
        if (this.getInterview().getEndTime()) {
            return <InterviewAnalysis interview={this.getInterview()} />;
        }
    }

    getTasks() {
        let endInterviewButton;
        if (!this.getInterview().getEndTime()) {
            endInterviewButton = <div style={{marginRight: "12%"}}>
                    <EndInterviewButton modalOptions={{interview: this.getInterview()}}
                                        label="End interview" level={Level.WARNING} className="pull-right"/>
                </div>
        }
        return <div>
            {endInterviewButton}
            <InterviewTaskList interview={this.getInterview()} style={{marginLeft: "12%", marginRight: "12%"}} />
        </div>;
    }

    getRoutes() {
        this.routes = this.routes || new Route(null, () => this.getTasks(), [
                new Route("tasks", () => this.getTasks()),
                new Route("task", null, [
                    new TerminalRoute("%s", (options) => {
                        const interviewTask = this.getInterview().getInterviewTasks()
                            .find(interviewTask => interviewTask.getContestTask().name === options.args[0]);
                        const customURLPrefix = "/interview/" + this.getInterview().id + "/task/" + options.args[0] + "/";
                        return interviewTask && <InterviewTaskPanel interviewTask={interviewTask}
                                                                    customURLPrefix={customURLPrefix}
                                                                    contestTaskId={interviewTask.contestTaskId} />;
                    })
                ]),
                new Route("analysis", () => this.getAnalysis()),
            ]);
        return this.routes;
    }

    showModalForTask(interviewTask) {
        if (this.tasksWithShowedModal.has(interviewTask)) {
            return;
        }
        this.tasksWithShowedModal.add(interviewTask);
        let modal = <GoNextModal interviewTask={interviewTask}/>;
        modal.show();
    }

    onMount() {
        this.createNavbarElements();

        this.attachChangeListener(this.getInterview(), () => {
            this.createNavbarElements();
            if (this.getInterview().getEndTime() && this.endInterviewButton) {
                this.endInterviewButton.hide();
            }
            this.redraw();
        });
        this.attachChangeListener(InterviewTaskStore, (interviewTask) => {
            if (interviewTask.getSolvedTime()) {
                // TODO: show congrats modal
                this.showModalForTask(interviewTask);
            } else if (interviewTask.getLockedTime()) {
                // TODO: show next problem modal
                this.showModalForTask(interviewTask);
            }
        });
    }

    createNavbarElements() {
        if (!this.isInDocument()) {
            return;
        }

        let leftChildren = [];
        if (this.getInterview().getEndTime()) {
            leftChildren.push(<NavLinkElement href="/interview/" value={UI.T("My Interviews")}/>)
        }
        leftChildren.push(<NavLinkElement href={this.getUrlPrefix("tasks")} value={UI.T("Tasks")}/>);
        if (this.getInterview().getEndTime()) {
            leftChildren.push(<NavLinkElement href={this.getUrlPrefix("analysis")} value={UI.T("Analysis")}/>);
        }
        NavManager.Global.getLeftConditioned().setChildren(leftChildren);
        NavManager.Global.getRightConditioned().setChildren([this.createTimeCounter()]);
        NavManager.Global.checkForWrap();
    }

    destroyNavbarElements() {
        NavManager.Global.getLeftConditioned().setChildren([]);
        NavManager.Global.getRightConditioned().setChildren([]);
        NavManager.Global.checkForWrap();
    }

    createTimeCounter() {
        let timeCounter = <NavElement value=""/>;

        let timerInterval = setInterval(() => {
            let serverTime = ServerTime.now();
            let value;
            if (this.getInterview().getEndTime()) {
                // User finished interview
                let interviewStartTime = new StemDate(this.getInterview().getStartTime());
                let interviewEndTime = new StemDate(this.getInterview().getEndTime());
                let timeDifference = interviewEndTime.diffDuration(interviewStartTime);
                let diffFormat = timeDifference.format("h:mm:ss");
                value = "Done in " + diffFormat;
                clearInterval(timerInterval);
            } else if (this.getInterview().hasEnded()) {
                // Interview time finished, user can still continue
                let interviewEndTime = new StemDate(this.getInterview().getStartTime() + this.getInterview().getExpectedDuration());
                let timeDifference = serverTime.diffDuration(interviewEndTime);
                let diffFormat = timeDifference.format("h:mm:ss");
                value = "Extra " + diffFormat;
            } else {
                // Interview is running
                let interviewEndTime = new StemDate(this.getInterview().getStartTime() + this.getInterview().getExpectedDuration());
                let timeDifference = serverTime.diffDuration(interviewEndTime);
                let diffFormat = timeDifference.format("h:mm:ss");
                value = "Ends in " + diffFormat;
            }
            timeCounter.updateOptions({value});
        }, 1000);

        timeCounter.addCleanupJob(() => {
            clearInterval(timerInterval);
        });
        return timeCounter;
    }
}

export class InterviewPanelWrapper extends UI.Element {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.addClass(GlobalStyle.Utils.fullHeight);
    }

    setURL(urlParts) {
        if (this.interviewPanel) {
            this.interviewPanel.setURL(urlParts);
        } else {
            this.initialUrlParts = urlParts;
        }
    }

    render() {
        return <InterviewPanel ref="interviewPanel" interviewId={this.options.interviewId} />;
    }

    onMount() {
        this.setURL(this.initialUrlParts);
        this.addListener("urlEnter", () => {
            this.interviewPanel.createNavbarElements();
        });
        this.addListener("urlExit", () => {
            this.interviewPanel.destroyNavbarElements();
        });
    }
}
