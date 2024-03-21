import {UI, Panel, ActionModal, ActionModalButton, Router, Route,
        CardPanel, Button, Theme, TextInput, TimePassedSpan, Level, Size} from "../../csabase/js/UI.js";
import {CustomRunStore} from "../../eval/js/state/CustomRunStore.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {StateDependentElement} from "../../stemjs/src/ui/StateDependentElement.jsx";

import {WorkspaceStore, WorkspaceFileStore} from "./state/WorkspaceStore";
import {PluginTypes, WorkspaceIDE} from "./ide/WorkspaceIDE";
import {autoredraw} from "../../stemjs/src/decorators/AutoRedraw.js";


class DeleteWorkspaceModal extends ActionModal {
    getTitle() {
        return "Delete workspace";
    }

    getActionName() {
        return "Delete";
    }

    getBody() {
        return <p>Are you sure you want to delete {this.options.workspace.name}?</p>;
    }

    action() {
        let request = this.options.workspace.getBaseRequest();

        Ajax.postJSON("/workspace/delete/", request).then(
            () => {
                WorkspaceStore.applyDeleteEvent({
                    type: "delete",
                    objectId: request.workspaceId
                });
            }
        );

        this.hide();
    }
}
const DeleteWorkspaceButton = ActionModalButton(DeleteWorkspaceModal);

@autoredraw
class WorkspacePreviewPanel extends CardPanel {
    getTitle() {
        let title, editSpan;
        if (this.isEditing) {
            title = <TextInput ref="workspaceNameInput" value={this.options.workspace.name}
            className="text-center" style={{width: "80%", marginTop: "-3px", marginBottom: "-3px", display: "inline-table", outline: "none", border: 0,}}/>;
            editSpan = <span ref="settingsButton" className="fa fa-floppy-o" style={{cursor: "pointer", margin: "3px"}}/>;
        } else {
            title = this.options.title || this.options.workspace.name;
            editSpan = <span ref="settingsButton" className="fa fa-pencil" style={{cursor: "pointer", margin: "3px", color: Theme.Global.COLOR_BACKGROUND}}/>;
        }
        return [
            <div style={{display: "flex", justifyContent: "space-between", width: "100%", textTransform: "initial"}}>
                {title}
                {editSpan}
            </div>
        ];
    }

    getDefaultOptions(options) {
        return {
            size: Size.LARGE,
        };
    }

    render() {
        let results = [];

        let workspace_files = this.options.workspace.getFiles();
        if (workspace_files.length > 0) {
            for (let file of this.options.workspace.getFiles()) {
                if (!file.hasTemporaryId()) {
                    results.push(<p>{file.name}</p>);
                }
            }
        } else {
            results.push(<p>No files</p>);
        }

        let footer = <div>
            <hr style={{marginTop: 0, marginBottom: "5px"}}/>
            <div>
                <h5 style={{color: "#AAA", "white-space": "nowrap", textAlign: "left", paddingLeft: "12px"}}>
                    {UI.T("Updated")} <TimePassedSpan timeStamp={this.options.workspace.getLastUpdate()} />
                </h5>
                <div style={{display: "flex", justifyContent: "flex-end", padding: "5px 10px"}}>
                    <Button level={Level.PRIMARY} label={UI.T("Open")}
                               onClick={() => Router.changeURL(["workspace", this.options.workspace.id])}/>
                    <DeleteWorkspaceButton icon="trash" level={Level.DANGER} style={{marginLeft: "7px"}}
                                           modalOptions={{workspace: this.options.workspace}}/>
                </div>
            </div>
        </div>;

        return [
            <div style={{overflow: "auto", height: "145px"}}>{results}</div>,
            footer
        ];
    }

    saveChanges() {
        let request = this.options.workspace.getBaseRequest();
        if (this.workspaceNameInput && this.workspaceNameInput.getValue() !== this.options.workspace.name) {
            request.name = this.workspaceNameInput.getValue();
        } else {
            return;
        }

        Ajax.postJSON("/workspace/edit/", request);
    }

    onMount() {
        super.onMount();
        this.attachListener(WorkspaceFileStore, "createOrUpdate", (workspaceFile) => {
            if (workspaceFile.getWorkspace().id === this.options.workspace.id) {
                this.redraw();
            }
        });

        // Settings button behavior
        // this.settingsButton.addNodeListener("mouseover", () => {
        //     this.settingsButton.setStyle("color", "#0082AD");
        // });
        // this.settingsButton.addNodeListener("mouseleave", () => {
        //     this.settingsButton.setStyle("color", Theme.Global.COLOR_BACKGROUND);
        // });
        this.settingsButton.addClickListener(() => {
            this.isEditing = !this.isEditing;
            if (!this.isEditing) {
                this.saveChanges();
            }
            this.redraw();
            if (this.isEditing) {
                this.workspaceNameInput.node.focus();
                this.workspaceNameInput.node.select();
                this.workspaceNameInput.addNodeListener("keypress", (event) => {
                    if (event.keyCode === 13) { // Pressed enter
                        this.isEditing = false;
                        this.saveChanges();
                        this.redraw();
                    }
                });
            }
        });
    }
}

class CreateWorkspacePanel extends CardPanel {
    getTitle() {
        return <div style={{height: "26px"}}>
            <TextInput ref="workspaceNameInput" placeholder="Title"
             className="text-center" style={{height: "100%", width: "90%", border: "0", outline: "none"}}/>
        </div>;
    }

    render() {
        return [
            <div style={{paddingTop: "85px"}}>
                <Button icon="plus" level={Level.SUCCESS} size={Size.LARGE} onClick={() => {this.createWorkspace()}}/>
                <p>{UI.T("Create new workspace")}</p>
            </div>
        ];
    }

    getDefaultOptions(options) {
        return {
            size: Size.LARGE,
            headingCentered: true,
        };
    }

    createWorkspace() {
        Ajax.postJSON("/workspace/create/", {
            name: this.workspaceNameInput.getValue()
        }).then(
            (data) => Router.changeURL(["workspace", data.workspaceId])
        );
    }
}

class WorkspacePanels extends Panel {
    extraNodeAttributes(attr) {
        attr.addClass("text-center");
        attr.setStyle({
            width: "1200px",
            maxWidth: "100%",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
        });
    }

    render() {
        let panelStyle = {
            width: "350px",
            height: "262px",
            margin: "25px",
        };

        let results = [];
        const userWorkspaces = WorkspaceStore.getUserWorkspaces().sort((a, b) => {return b.lastModified - a.lastModified});
        // TODO: this should depend on the user maxWorkspaces
        results.push(<CreateWorkspacePanel style={panelStyle} />);
        for (let workspace of userWorkspaces) {
            results.push(<WorkspacePreviewPanel key={workspace.id} workspace={workspace} style={panelStyle} />);
        }

        return results;
    }

    onMount() {
        this.attachListener(WorkspaceStore, "create", () => {
            this.redraw();
        });
        this.attachListener(WorkspaceStore, "delete", () => {
            this.redraw();
        });
    }
}

class WorkspaceManager extends Router {
    getDefaultOptions() {
        return Object.assign({}, super.getDefaultOptions(), {
            fullHeight: true,
        });
    }


    getRoutes() {
        this.routes = this.routes || new Route(null, WorkspacePanels, [
            new Route("%s", (options) => {
                const workspace = WorkspaceStore.get(parseInt(options.args[0]));
                return workspace && <WorkspaceIDE workspace={workspace} plugins={PluginTypes.GLOBAL}/>;
            })
        ]);
        return this.routes;
    }
}

class AnonymousWorkspaceManager extends UI.Element {
    getDefaultOptions() {
        return {
            style: {
                height: "100%",
                width: "100%",
            }
        };
    }

    getWorkspace() {
        if (!this.options.workspace) {
            this.options.workspace = WorkspaceStore.createVirtualWorkspace();
        }
        return this.options.workspace;
    }
 
    render() {
        return this.workspaceIDE || <h1>{UI.T("Loading the workspace")} <i className="fa fa-spinner fa-spin"/></h1>;
    }

    setURL(urlParts) {
        if (urlParts.length === 2 && urlParts[0] === "fork") {
            this.getCustomRun(urlParts[1]);
        } else {
            this.workspaceIDE = <WorkspaceIDE workspace={this.getWorkspace()} plugins={PluginTypes.GLOBAL} />;
            this.redraw();
        }
        Router.changeURL(["workspace"], true);
    }

    getCustomRun(urlHash) {
        Ajax.postJSON("/eval/get_custom_run/", {
            urlHash: urlHash,
        }).then(
            (data) => {
                let customRun = CustomRunStore.get(data.customRunId);
                this.options.workspace.createFile(customRun.sourceName, customRun.sourceText);
                if (customRun.stdin) {
                    this.options.workspace.createFile(".stdin", customRun.stdin);
                }
                this.workspaceIDE = <WorkspaceIDE workspace={this.options.workspace} plugins={PluginTypes.GLOBAL} />;
                this.redraw();
            },
            (error) => {
                this.workspaceIDE = <h1>Error: {error.message}</h1>;
                this.redraw();
            }
        );
    }
}

class WorkspaceManagerWrapper extends StateDependentElement(UI.Element) {
    extraNodeAttributes(attr) {
        attr.setStyle({
            height: "100%",
        });
    }

    renderLoaded() {
        if (USER.isAuthenticated) {
            return <WorkspaceManager ref="workspaceManager"/>;
        }
        return <AnonymousWorkspaceManager ref="workspaceManager"/>;
    }

    setURL(urlParts) {
        if (this.workspaceManager) {
            this.workspaceManager.setURL(urlParts);
        } else {
            this.initialUrlParts = urlParts;
        }
    }

    onDelayedMount() {
        this.setURL(this.initialUrlParts);
    }
}

export {WorkspaceManager, AnonymousWorkspaceManager, WorkspaceManagerWrapper};
