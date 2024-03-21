import {UI, TabArea, Panel, RawCheckboxInput, ActionModal, ActionModalButton,
        FormField, Select, NumberInput, Button, ButtonGroup, Level} from  "../../csabase/js/UI.js";
import {GlobalState} from "../../stemjs/src/state/State.js";
import {StemDate} from "../../stemjs/src/time/Date.js";
import {Duration} from "../../stemjs/src/time/Duration.js";
import {NOOP_FUNCTION} from "../../stemjs/src/base/Utils.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {Language} from "../../establishment/localization/js/state/LanguageStore.js";
import {ArticleEditor} from "../../establishment/content/js/ArticleEditor.jsx";
import {EvalTaskStore} from "../../eval/js/state/EvalTaskStore.js";

import {ContestStore} from "./state/ContestStore.js";
import {ArchiveStore} from "./state/ArchiveStore.js";
import {ContestAnnouncementList, AnnouncementBroadcastModal} from "./ContestAnnouncementList.jsx";
import {AdminContestQuestionPanel} from "./ContestQuestionList.jsx";
import {AdminContestTasksTable} from "./ContestTasksTable.jsx";
import {CreateContestModal} from "./CreateContest.jsx";
import {ContestPermissionsEditor} from "./ContestPermissionsEditor.jsx";
import {ContestExporter} from "./ContestExporter.jsx";
import {ContestPlagiarismPanel} from "./plagiarism/ContestPlagiarismPanel.jsx";
import {StaticCodeHighlighter} from "../../stemjs/src/ui/CodeEditor.jsx";


function addTaskToContest(contest, options, onSuccess=NOOP_FUNCTION, onError=NOOP_FUNCTION) {
    let request = {
        contestId: contest.id,
        evalTaskId: options.evalTaskId,
        sourceSize: options.sourceSizeLimit || (64 * 1024)
    };

    Ajax.postJSON("/contest/add_task/", request).then(onSuccess, onError);
}

class AddTaskModal extends ActionModal {
    getBody() {
        let evalTasks = EvalTaskStore.all();
        return [
            <FormField label="Task name">
                <Select options={evalTasks} ref="evalTaskSelect" />
            </FormField>,
            <FormField label="Source size">
                <div>
                    <NumberInput placeholder="Source size" value="32768" ref="sourceSizeInput"/>
                    <div style={{display: "inline-block", marginLeft: "4px"}}>bytes</div>
                </div>
            </FormField>
        ];
    }

    action() {
        addTaskToContest(this.options.contest, {
                evalTaskId: this.evalTaskSelect.get().id,
                sourceSizeLimit: this.sourceSizeInput.getValue()
            }, () => {
                this.hide();
                this.options.tasksTable.redraw();
            }, (error) => {
                this.messageArea.showMessage(error.message, "red");
            });
    }
}

const AddTaskButton = ActionModalButton(AddTaskModal);

class EditContestModal extends CreateContestModal {
    getDefaultValues() {
        let contest = this.options.contest;
        let duration = {
            days: 0,
            hours: 0,
            minutes: 0
        };
        if (contest.getStartTime() && contest.getEndTime()) {
            let contestDuration = new Duration((contest.getEndTime() - contest.getStartTime()) * 1000);
            duration = {
                days: contestDuration.toDays(),
                hours: contestDuration.getHours(),
                minutes: contestDuration.getMinutes(),
            };
        }
        return {
            contestName: contest.name,
            contestLongName: contest.longName,
            startDate: contest.getStartTime() ? new StemDate(contest.getStartTime() * 1000) : null,
            durationDays: duration.days,
            durationHours: duration.hours,
            durationMinutes: duration.minutes,
            visible: contest.isVisible,
            rated: contest.rated,
            publicSources: contest.publicSources,
            scoringId: contest.scoringId,
            liveResults: contest.liveResults,
        };
    }

    getBody() {
        let contest = this.options.contest;
        let discussionMutedCheckbox = null;
        let chat = contest.getChat();
        if (chat) {
            discussionMutedCheckbox = <FormField label="Mute discussion">
                <RawCheckboxInput ref="discussionMutedCheckbox" initialValue={chat.getMessageThread().muted}/>
            </FormField>;
        }

        return [
            ...super.getBody(),
            discussionMutedCheckbox
        ];
    }

    getRequest() {
        const request = super.getRequest();
        const {contest} = this.options;
        request.contestId = contest.id;
        if (contest.getChat()) {
            request.discussionMuted = this.discussionMutedCheckbox.getValue();
        }
        return request;
    }

    getAjaxUrl() {
        return "/contest/change_settings/";
    }

    getErrorMessage() {
        return "Error in changing contest settings!!";
    }

    getTitle() {
        return "Edit contest " + this.options.contest.longName;
    }

    getActionName() {
        return "Save";
    }
}
const EditContestButton = ActionModalButton(EditContestModal);

class ContestStatisticsModal extends ActionModal {
    response = null;

    getTitle() {
        return "Contest statistics";
    }

    getActionName() {
        return "Rerun query";
    }

    getBody() {
        const {response} = this;
        if (this.response) {
            const text = JSON.stringify(response, null, 2);
            return [
                <h2>General stats </h2>,
                <StaticCodeHighlighter aceMode="json" value={text} maxLines={40} fontSize={16}/>
            ];
        }
        // No response
        return [
            <h2>Still running query</h2>,
            <h2>Sent at {Date()}</h2>
        ]
    }

    action() {
        const query = {
            contestId: this.options.contest.id,
        }
        this.response = null;
        this.redraw();
        this.actionButton.disable();
        Ajax.getJSON("/contest/statistics/", query).then((response) => {
            this.response = response;
            this.redraw();
            this.actionButton.enable();
        }).catch((error) => {
            console.log("Error from ajax", error);
            this.actionButton.enable();
        });
    }

    onMount() {
        this.action();
    }
}

const ContestStatisticsButton = ActionModalButton(ContestStatisticsModal);

class CreateVirtualContestModal extends ActionModal {
    getBody() {
        return <p>Create virtual contest for {this.options.contest.longName}?</p>;
    }

    action() {
        if (!this.options.contest.hasFinished()) {
            window.alert("The contest has not finished yet.");
            return;
        }
        let request = {
            contestId: this.options.contest.id
        };
        Ajax.postJSON("/contest/create_virtual_contest/", request).then(
            () => this.hide()
        );
    }
}

const CreateVirtualContestButton = ActionModalButton(CreateVirtualContestModal);

class AddToArchiveModal extends ActionModal {
    getBody() {
        this.contestTasks = this.options.contest.getContestTasks();
        let taskList = [];
        for (let task of this.contestTasks) {
            taskList.push(<li>{task.longName}</li>);
        }
        return [
            <p>Add the following tasks to the archive?</p>,
            <ul>{taskList}</ul>,
            <FormField label="Which archive?">
                <Select ref="archiveSelect" options={ArchiveStore.all()}/>
            </FormField>
        ];
    }

    action() {
        let request = {
            contestId: this.options.contest.id,
            archiveId: this.archiveSelect.get().id
        };
        this.messageArea.showMessage("Adding to archive...", "black", null);
        Ajax.postJSON("/contest/add_to_archive/", request).then(
            () => this.hide()
        );
    }
}

const AddToArchiveButton = ActionModalButton(AddToArchiveModal);

class CreateDiscussionModal extends ActionModal {
    getBody() {
        return <p>Create discussion for {this.options.contest.longName}?</p>;
    }

    action() {
        let request = {
            contestId: this.options.contest.id
        };
        Ajax.postJSON("/contest/create_discussion/", request).then(
            () => this.hide()
        );
    }
}

const CreateDiscussionButton = ActionModalButton(CreateDiscussionModal);

class DeleteContestModal extends ActionModal {
    getBody() {
        return <p>Delete {this.options.contest.longName}?</p>;
    }

    action() {
        let request = {
            contestId: this.options.contest.id
        };
        Ajax.postJSON("/contest/delete/", request).then(
            () => window.location.replace("/contests/")
        );
    }
}

const DeleteContestButton = ActionModalButton(DeleteContestModal);

class PublishAnalysisModal extends ActionModal {
    getBody() {
        return <p>Publish analysis for {this.options.contest.longName}?</p>
    }

    action() {
        let request = {
            contestId: this.options.contest.id
        };
        Ajax.postJSON("/contest/publish_analysis/", request).then(
            () => this.hide()
        );
    }
}

const PublishAnalysisButton = ActionModalButton(PublishAnalysisModal);

class ContestAnalysisEditor extends UI.Element {
    render() {
        let contest = this.options.contest;
        if (contest.getAnalysisArticle()) {
            return [
                <ArticleEditor ref="solutionEditor" articleId={contest.analysisArticleId} style={{height: "600px"}} />
            ];
        } else {
            return [
                <h2>The contest does not have an analysis article, click bellow to create one</h2>,
                <Button label="Create analysis article" onClick={() => {this.createAnalysisArticle()}} />
            ];
        }
    }

    createAnalysisArticle() {
        let request = {
            contestId: this.options.contest.id,
            createAnalysisArticle: true,
        };

        Ajax.postJSON("/contest/create_analysis_article/", request).then(
            (data) => {
                this.options.contest.analysisArticleId = parseInt(data.analysisArticleId);
                this.redraw();
            }
        );
    }
}

class PrintModal extends ActionModal {
    getBody() {
        return [
            <FormField label="Language:">
                <Select options={Language.all()} ref="languageSelect"/>
            </FormField>,

        ];
    }

    getExporterOptions() {
        return {
            language: this.languageSelect.get()
        };
    }

    onMount() {
        super.onMount();
        this.exporter = new ContestExporter(this.options.contest, this.getExporterOptions());
        this.languageSelect.addNodeListener("change",
            () => this.exporter.updateOptions(this.getExporterOptions())
        );
    }

    action() {
        this.hide();
        this.exporter.updateOptions(this.getExporterOptions());
        this.exporter.exportToPDF();
    }
}

const PrintButton = ActionModalButton(PrintModal);

export class ContestEditPanel extends Panel {
    extraNodeAttributes(attr) {
        attr.setStyle({
            height: "100%",
            display: "flex",
            flexDirection: "column",
            width: "1100px",
            maxWidth: "100%",
            margin: "0 auto",
            padding: "0 15px",
        });
    }

    render() {
        let contest = ContestStore.get(this.options.contestId);
        let tasksTable = <AdminContestTasksTable ref="tasksTable" contest={contest}/>;
        let createVirtualContestButton = null;
        if (!contest.virtualContestId && contest.hasFinished()) {
            createVirtualContestButton = <CreateVirtualContestButton label="Create virtual contest"
                                                                     modalOptions={{contest: contest}}/>
        }
        let createDiscussionButton = null;
        if (!contest.getChat()) {
            createDiscussionButton = <CreateDiscussionButton label="Create discussion"
                                                             modalOptions={{contest: contest}}/>
        }
        let publishAnalysisButton = null;
        if (contest.hasFinished()) {
            publishAnalysisButton = <PublishAnalysisButton label="Publish analysis"
                                                           modalOptions={{contest: contest}}/>;
        }
        let addToArchiveButton = null, printButton = null;
        if (USER.isSuperUser) {
            addToArchiveButton = <AddToArchiveButton label="Add to archive" modalOptions={{contest: contest}}/>;
            printButton = <PrintButton label="Print" modalOptions={{contest: contest}}/>;
        }
        let analysisPanel = null;
        if (USER.isSuperUser) {
            analysisPanel = <Panel title="Analysis" style={{height: "100%"}}>
                <ContestAnalysisEditor contest={contest} style={{height: "100%"}}/>
            </Panel>;
        }
        let permissionsPanel = null;
        let descriptionPanel = null;
        if (USER.isSuperUser || USER.id === contest.ownerId) {
            permissionsPanel = <Panel title="Permissions" style={{height: "100%"}}>
                <ContestPermissionsEditor contest={contest} style={{height: "100%"}} />
            </Panel>;
            if (contest.getDescriptionArticle()) {
                descriptionPanel = <Panel title="Description" style={{height: "100%"}}>
                    <ArticleEditor articleId={contest.descriptionArticleId} />
                </Panel>;
            }
        }
        return [
            <h1>{contest.longName}</h1>,
            <ButtonGroup level={Level.PRIMARY} style={{margin: "10px 0"}}>
                <Button label="Return to contest page"
                        onClick={() => window.location.replace("/contest/" + contest.name + "/")}/>
                <EditContestButton label="Edit contest" modalOptions={{contest: contest}}/>
                {createVirtualContestButton}
                {addToArchiveButton}
                {publishAnalysisButton}
                {createDiscussionButton}
                {printButton}
                <ContestStatisticsButton label="Stats" modalOptions={{contest: contest}}/>
                {USER.id === contest.ownerId && <DeleteContestButton label="Delete contest" level={Level.DANGER}
                                     modalOptions={{contest: contest}}/>}
            </ButtonGroup>,
            <TabArea variableHeightPanels style={{flex: "1"}}>
                <Panel title="Tasks" active>
                    <AddTaskButton label="Add task" level={Level.PRIMARY} style={{margin: "10px 0"}}
                                   modalOptions={{contest: contest, tasksTable: tasksTable}}/>
                    {tasksTable}
                </Panel>
                {descriptionPanel}
                <Panel title="Announcements">
                    <Button level={Level.PRIMARY}
                               label="Broadcast announcement"
                               style={{margin: "5px"}}
                               onClick={() => {AnnouncementBroadcastModal.show({contest})}}/>
                    <ContestAnnouncementList contest={contest}/>
                </Panel>
                <Panel title="Questions" style={{height: "100%"}}>
                  <AdminContestQuestionPanel contest={contest} style={{height: "100%"}}/>
                </Panel>
                {analysisPanel}
                {permissionsPanel}
                <ContestPlagiarismPanel title="Plagiarism Checking" contest={contest} style={{height: "100%"}}/>
            </TabArea>
        ];
    }

    onMount() {
        GlobalState.registerStream("contest-" + this.options.contestId + "-announcements");
        GlobalState.registerStream("contest-" + this.options.contestId + "-scores");
        GlobalState.registerStream("contest-" + this.options.contestId + "-owner");
        let contest = ContestStore.get(this.options.contestId);
        let request = {};
        if (USER.isSuperUser) {
            Ajax.getJSON("/contest/fetch_archives/", request);
        }
    }
}
