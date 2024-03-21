import {UI, Modal, ActionModal, Button, ButtonGroup,
    TemporaryMessageArea, Form, FormField, Select, Size,
    Router, Route, TerminalRoute, Level} from "../../csabase/js/UI.js";
import {CreateEvalTaskModal} from "../../eval/js/EvalTaskManager.jsx";
import {SubmissionSummaryPrivateArchiveFilter} from "../../eval/js/SubmissionSummary.jsx";
import {Ajax, FixedURLAjaxHandler} from "../../stemjs/src/base/Ajax.js";
import {GlobalState} from "../../stemjs/src/state/State.js";
import {EvalTaskStore} from "../../eval/js/state/EvalTaskStore.js";
import {NavManager} from "../../stemjs/src/ui/navmanager/NavManager.jsx";
import {NavLinkElement} from "../../stemjs/src/ui/navmanager/NavElement.jsx";
import {UserGroupEditor, UserGroupMemberUI} from "../../establishment/accounts/js/UserGroupEditor.jsx";

import {PrivateArchiveStore} from "./state/PrivateArchiveStore.js";
import {PrivateArchiveUsersTable} from "./scoreboard/Scoreboard.jsx";
import {DelayedContestTaskPanel} from "./DelayedContestTaskPanel.js";
import {ContestTaskList} from "./ContestTasksTable.jsx";
import {ContestTaskBubble} from "./ContestTaskBubble.jsx";


class PrivateArchiveCreateEvalTaskModal extends CreateEvalTaskModal {
    getPrivateArchive() {
        return this.options.privateArchiveWidget.getPrivateArchive();
    }

    addEvalTask(evalTaskId) {
        let request = {
            privateArchiveId: this.getPrivateArchive().id,
            evalTaskId: evalTaskId
        };

        Ajax.postJSON("/contest/private_archive_add_eval_task/", request).then(
            () => this.hide()
        );
    }

    createTask() {
        let urlName = this.urlNameInput.getValue();
        let longName = this.longNameInput.getValue();
        let type = this.typeSelect.get().id;
        let timeLimit = this.timeLimitInput.getValue();
        let memoryLimit = this.memoryLimitInput.getValue() * 1024;
        let request = {
            urlName: urlName,
            longName: longName,
            type: type,
            timeLimit: timeLimit,
            memoryLimit: memoryLimit
        };

        Ajax.postJSON("/eval/create_eval_task/", request).then(
            (data) => {
                this.addEvalTask(data.evalTaskId);
                window.location.pathname = "/task/" + urlName + "/edit/";
            },
            (error) => this.messageArea.showMessage(error.message, "red")
        );
    }
}

class PrivateArchiveRemoveEvalTaskModal extends ActionModal {
    getPrivateArchive() {
        return this.options.privateArchiveWidget.getPrivateArchive();
    }

    getActionName() {
        return "Remove eval task";
    }

    getBody() {
        return <FormField ref="typeFormField" label="Task">
            <Select ref="taskSelect" options={this.getPrivateArchive().getEvalTasks()}/>
        </FormField>;
    }

    getFooter() {
        return [<TemporaryMessageArea ref="messageArea"/>,
            <ButtonGroup>
                <Button label="Close" onClick={() => this.hide()}/>,
                <Button level={Level.WARNING} label="Remove task" onClick={() => this.removeTask()}/>
            </ButtonGroup>
        ];
    }

    removeTask() {
        let task = this.taskSelect.get();
        let request = {
            privateArchiveId: this.getPrivateArchive().id,
            evalTaskId: task.id
        };

        Ajax.postJSON("/contest/private_archive_remove_eval_task/", request).then(
            () => {
                this.hide();
                window.location.reload();
            },
            (error) => this.messageArea.showMessage(error.message, "red")
        );
    }

    hide() {
        this.messageArea.clear();
        super.hide();
    }
}

class PrivateArchiveAddEvalTaskModal extends Modal {
    getPrivateArchive() {
        return this.options.privateArchiveWidget.getPrivateArchive();
    }

    renderModal(bodyContent) {
        return [
            <div style={{margin: "0px"}}>
                <div>
                    <h4>Add eval task</h4>
                </div>
                <div ref="body">
                    {bodyContent}
                </div>
                <div>
                        <TemporaryMessageArea ref="messageArea"/>
                        <Button label="Close" onClick={() => this.hide()}/>
                        <Button level={Level.PRIMARY} label="Add task" onClick={() => this.addTask()}/>
                </div>
            </div>
        ];
    }

    render() {
        if (!this.isLoaded) {
            this.fetchEvalTasks();
            return this.renderModal(<Form style={{marginTop: "10px"}}>
                                        <FormField ref="typeFormField" label="Loading Tasks" />
                                    </Form>);
        }
        return this.renderModal(<Form style={{marginTop: "10px"}}>
                                    <FormField ref="typeFormField" label="Task">
                                        <Select ref="taskSelect" options={this.getEvalTasks()}/>
                                    </FormField>
                                </Form>);
    }

    getEvalTasks() {
        let allEvalTasks = EvalTaskStore.all();
        let privateArchiveEvalTasks = this.getPrivateArchive().getEvalTasks();
        let evalTasks = allEvalTasks.filter(evalTask => privateArchiveEvalTasks.indexOf(evalTask) == -1);
        evalTasks.sort((a, b) => { return b.id - a.id });
        return evalTasks;
    }

    fetchEvalTasks() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;

        let request = {};
        Ajax.getJSON("/eval/get_available_tasks/", request).then(
            () => {
                this.isLoading = false;
                this.isLoaded = true;
                this.body.options.children = [
                    <Form style={{marginTop: "10px"}}>
                        <FormField ref={this.refLink("typeFormField")} label="Task">
                            <Select ref={this.refLink("taskSelect")} options={this.getEvalTasks()}/>
                        </FormField>
                    </Form>
                ];
                this.body.redraw();
            }
        );
    }

    addTask() {
        let task = this.taskSelect.get();
        let request = {
            privateArchiveId: this.getPrivateArchive().id,
            evalTaskId: task.id
        };

        Ajax.postJSON("/contest/private_archive_add_eval_task/", request).then(
            () => window.location.reload(),
            (error) => this.messageArea.showMessage(error.message, "red")
        );
    }

    hide() {
        this.messageArea.clear();
        super.hide();
    }
}

class DelayedPrivateArchiveContestTaskPanel extends DelayedContestTaskPanel {
    modifyIde() {
        const privateArchiveAjaxHandler = new FixedURLAjaxHandler("/contest/submit_private_archive_job/");
        privateArchiveAjaxHandler.addPreprocessor((request) => {
            request.data.privateArchiveId = this.options.privateArchiveId;
        });
        this.ide.getPlugin("ContestSubmit").setAjaxHandler(privateArchiveAjaxHandler);
    }

    onDelayedMount() {
        super.onDelayedMount();

        if (this.ide) {
            this.ide.whenLoaded(() => this.modifyIde());
        } else {
            this.addListener("workspaceLoaded", () => {
                this.ide.whenLoaded(() => this.modifyIde());
            });
        }
    }

    getSubURL(section) {
        let url = "/private-archive/" + PrivateArchiveStore.get(this.options.privateArchiveId).name + "/";
        url += "task/" + this.getContestTask().name + "/";
        if (section) {
            url += section + "/";
        }
        return url;
    }
}

class PrivateArchiveContestTaskList extends ContestTaskList {
    getPrivateArchive() {
        return this.options.privateArchive;
    }

    getTasks() {
        return this.getPrivateArchive().getContestTasks();
    }

    getHeader() {
        return undefined;
    }

    getContestTaskBubble(task) {
        return <ContestTaskBubble isArchive={this.options.isArchive}
                                  href={"/private-archive/" + this.getPrivateArchive().name + "/task/" + task.name + "/"}
                                  showTags={this.options.showTags} contestTask={task} />;
    }
}

class PrivateArchiveUserGroupMemberUI extends UserGroupMemberUI {
    getGlobalAccessButton() {
        return <Button ref="globalAccessButton" level={Level.PRIMARY} size={Size.EXTRA_SMALL} style={{marginRight: "5px"}}>
            Give access to all problems
        </Button>;
    }

    render() {
        return [
            this.getDestroyButton(),
            this.getGlobalAccessButton(),
            this.getUserHandle()
        ];
    }

    onMount() {
        super.onMount();
        this.globalAccessButton.addClickListener(() => Ajax.postJSON("/contest/private_archive_give_testing_access/", {
            userId: this.options.member.userId,
            privateArchiveId: this.options.privateArchiveId
        }));
    }
}

class PrivateArchiveUserGroupEditor extends UserGroupEditor {
    renderUserGroupMember(member) {
        return <PrivateArchiveUserGroupMemberUI member={member} privateArchiveId={this.options.privateArchiveId} />;
    }
}

class PrivateArchivePanel extends Router {
    getDefaultOptions() {
        return {
            fullHeight: true,
            children: []
        };
    }

    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        // attr.addClass(GlobalStyle.Container.MEDIUM);
    }

    getPrivateArchive() {
        return PrivateArchiveStore.get(this.options.privateArchiveId);
    }

    getContestTasks() {
        return this.getPrivateArchive().getContestTasks();
    }

    getRoutes() {
        this.routes = this.routes || new Route(null, () => this.getTasks(), [
            new Route("tasks", () => this.getTasks()),
            new Route("task", () => this.getTasks(), [
                new TerminalRoute("%s", (options) => {
                    const contestTask = this.getContestTasks().find(contestTask => contestTask.name === options.args[0]);
                    return contestTask && <DelayedPrivateArchiveContestTaskPanel contestTask={contestTask}
                                                                                 contestTaskId={contestTask.id}
                                                                                 urlPrefix={this.getUrlPrefix("task/" + contestTask.name)}
                                                                     privateArchiveId={this.options.privateArchiveId}/>;
                })
            ]),
            new Route("scoreboard", () => this.getScoreboard()),
            new Route("submissions", () => this.getSubmissions()),
            new Route("permissions", () => this.getPermissions())
        ]);
        return this.routes;
    }

    getTasks() {
        let buttons;
        if (USER.isSuperUser ||  USER.id === this.getPrivateArchive().ownerId) {
            buttons = [
                <ButtonGroup level={Level.PRIMARY} style={{float: "right"}}>
                    <Button label="Add task"
                            onClick={() => PrivateArchiveAddEvalTaskModal.show({privateArchiveWidget: this})}/>
                    <Button label="Remove task"
                            onClick={() => PrivateArchiveRemoveEvalTaskModal.show({privateArchiveWidget: this})}/>
                    <Button label="Create task"
                            onClick={() => PrivateArchiveCreateEvalTaskModal.show({privateArchiveWidget: this})}/>
                </ButtonGroup>,
                <div style={{clear: "both"}}/>
            ];
        }
        return <div style={{margin: "auto", maxWidth: 800}}>
                {buttons}
                <PrivateArchiveContestTaskList privateArchive={this.getPrivateArchive()}/>
            </div>;
    }

    getScoreboard() {
        return <PrivateArchiveUsersTable privateArchive={this.getPrivateArchive()} />;
    }

    getSubmissions() {
        return <SubmissionSummaryPrivateArchiveFilter privateArchiveId={this.options.privateArchiveId}/>;
    }

    getPermissions() {
        if (!USER.isSuperUser && USER.id !== this.getPrivateArchive().ownerId) {
            return <div />;
        }
        return <div>
            <h3>Here are the users that can edit this private archive: </h3>
            <PrivateArchiveUserGroupEditor groupId={this.getPrivateArchive().ownerGroupId}
                                           privateArchiveId={this.getPrivateArchive().id}
                                           style={{fontSize: "1.2em"}}/>
        </div>;
    }

    onMount() {
        if (this.isInDocument()) {
            this.createNavbarElements();
        }
        GlobalState.registerStream("private-archive-" + this.getPrivateArchive().id);
    }

    getUrlPrefix(str) {
        let url = "/private-archive/" + this.getPrivateArchive().name + "/";
        if (str) {
            url += str + "/";
        }
        return url;
    }

    createNavbarElements() {
        let leftSideChildren = [
            <NavLinkElement href="/private-archives/" value={UI.T("All archives")} />,
            <NavLinkElement href={this.getUrlPrefix("tasks")} value={UI.T("Tasks")} />,
            <NavLinkElement href={this.getUrlPrefix("scoreboard")} value={UI.T("Scoreboard")} />,
            <NavLinkElement href={this.getUrlPrefix("submissions")} value={UI.T("Submissions")} />,
        ];
        if (USER.isSuperUser || USER.id === this.getPrivateArchive().ownerId) {
            leftSideChildren.push(
                <NavLinkElement href={this.getUrlPrefix("permissions")} value={UI.T("Permissions")} />
            );
        }
        NavManager.Global.getLeftConditioned().setChildren(leftSideChildren);
        NavManager.Global.checkForWrap();
    }

    destroyNavbarElements() {
        NavManager.Global.getLeftConditioned().setChildren([]);
        NavManager.Global.checkForWrap();
    }
}

class PrivateArchivePanelWrapper extends UI.Element {
    extraNodeAttributes(attr) {
        attr.setStyle({
            height: "100%",
        });
    }

    render() {
        return <PrivateArchivePanel ref="privateArchivePanel" privateArchiveId={this.options.privateArchiveId} />;
    }

    setURL(urlParts) {
        if (this.privateArchivePanel) {
            this.privateArchivePanel.setURL(urlParts);
        } else {
            this.initialUrlParts = urlParts;
        }
    }

    onMount() {
        this.setURL(this.initialUrlParts);
        this.addListener("urlEnter", () => {
            this.privateArchivePanel.createNavbarElements();
        });
        this.addListener("urlExit", () => {
            this.privateArchivePanel.destroyNavbarElements();
        });

    }
}

export {PrivateArchivePanel, PrivateArchivePanelWrapper};
