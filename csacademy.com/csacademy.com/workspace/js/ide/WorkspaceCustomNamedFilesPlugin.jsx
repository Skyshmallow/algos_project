import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {Panel} from "../../../stemjs/src/ui/UIPrimitives.jsx";
import {Button} from "../../../stemjs/src/ui/button/Button.jsx";
import {TextInput} from "../../../stemjs/src/ui/input/Input.jsx";
import {ActionModal, ActionModalButton} from "../../../stemjs/src/ui/modal/Modal.jsx";
import {Level, Size} from "../../../stemjs/src/ui/Constants.js";
import {Ajax} from "../../../stemjs/src/base/Ajax.js";
import {ProgrammingLanguage} from "../../../csabase/js/state/ProgrammingLanguageStore.js";
import {WorkspaceFileStore} from "../state/WorkspaceStore.js";
import {WorkspacePlugin} from "./WorkspacePlugin.js";


class DestroyFileModal extends ActionModal {
    getActionName() {
        return "Confirm";
    }

    getBody() {
        return [
            <span>
                Are you sure you want to remove file <em>{this.options.file.name}</em> from the workspace?
            </span>
        ];
    }

    getCloseName() {
        return "Cancel";
    }

    action() {
        Ajax.postJSON("/workspace/delete_workspace_file/", {
                fileId: this.options.file.id
        }).then(
            () => {
                WorkspaceFileStore.applyDeleteEvent({
                    objectId: this.options.file.id
                });
                WorkspaceFileStore.dispatch("changedFile");
                this.hide();
            }
        )
    }
}
let DestroyFileButton = ActionModalButton(DestroyFileModal);
class FileNameEditor extends UI.Element {
    render() {
        return [
            <DestroyFileButton icon="minus" level={Level.DANGER} ref="destroyButton"
                    size={Size.EXTRA_SMALL} style={{"margin": "5px"}}
                    modalOptions={{file: this.options.file, title: "Destroy file"}} />,
            <Button icon="pencil" level={Level.PRIMARY} ref="editButton"
                    size={Size.EXTRA_SMALL} style={{"margin": "5px"}}/>,
            <span ref="nameSpan">{this.options.file.name}</span>,
            <TextInput ref="fileNameInput" className="hidden" style={{"padding-left": "5px"}}/>
        ]
    }

    setFileName(name) {
        Ajax.postJSON("/workspace/rename_workspace_file/", {
            fileId: this.options.file.id,
            fileName: name
        }).then(
            () => {
                WorkspaceFileStore.dispatch("changedFile");
                this.redraw();
            }
        );
    }

    onMount() {
        this.fileNameInput.addNodeListener("keypress", (event) => {
            if (event.keyCode === 13) {
                event.preventDefault();
                this.setFileName(this.fileNameInput.getValue());
            }
        });
        this.editButton.addClickListener(() => {
            this.nameSpan.addClass("hidden");
            this.fileNameInput.removeClass("hidden");
            this.fileNameInput.setValue(this.options.file.name);
            this.fileNameInput.node.focus();
            this.fileNameInput.node.select();
        });
    }
}

class CreateFileModal extends ActionModal {
    getBody() {
        return [
            <div style={{"display": "inline-block", "margin-right": "10px"}}>File Name:</div>,
            <TextInput placeholder="Main1.cpp" ref="fileNameInput" style={{"padding-left": "5px"}}/>
        ]
    }

    getActionName() {
        return "Add";
    }

    action() {
        Ajax.postJSON("/workspace/create_workspace_file/", {
            fileName: this.fileNameInput.getValue(),
            workspaceId: this.options.workspaceId
        }).then(
            () => this.hide()
        );
    }
}
let CreateFileButton = ActionModalButton(CreateFileModal);

class WorkspaceFileNameManager extends Panel {
    getTitle() {
        return "Files";
    }

    getFiles() {
        return this.options.workspace.getFiles().filter((file) => {
            return !file.getName().startsWith('.');
        });
    }

    render() {
        let children = [
            <CreateFileButton icon="plus" ref="addFileButton" style={{"margin": "5px"}}
                    level={Level.SUCCESS} size={Size.EXTRA_SMALL}
                    modalOptions={{
                        title: "Add file to workspace " + this.options.workspace.name,
                        workspaceId: this.options.workspace.id
                    }}
            />
        ];
        for (let file of this.getFiles()) {
            children.push(<FileNameEditor file={file} ref={"file" + file.id} />);
        }
        return children;
    }

    onMount() {
        let refresh = () => {
            this.redraw();
            this.options.fileSelect.options.selected = this.options.fileSelect.get();
            this.options.fileSelect.options.options = this.getFiles();
            this.options.fileSelect.redraw();
        };
        WorkspaceFileStore.addListener("changedFile", refresh);
        this.options.workspace.addListener("newFile", refresh);
        this.options.workspace.addListener("removedFile", refresh);
    }
}

class WorkspaceCustomNamedFilesPlugin extends WorkspacePlugin {
    static priorityIndex = 1000;

    constructor(workspaceIDE) {
        super(workspaceIDE);
        this.workspace = workspaceIDE.workspace;

        let fileManager = workspaceIDE.getPlugin("FileManager");

        // The language select now becomes a file select
        let fileSelect = this.workspaceIDE.programmingLanguageSelect;

        // Remove the old change listener
        fileSelect.removeNodeListener("change", fileManager.changeFileCallback);

        // Set the new options
        fileSelect.options.options = this.workspace.getFiles().filter((file) => {return file.getName()[0] !== '.';});
        fileSelect.options.selected = fileManager.getDefaultFile();
        fileSelect.redraw();

        // Add a new change listener
        fileSelect.addChangeListener(() => {
            let file = fileSelect.get();
            fileManager.setIDEOpenFile(file, ProgrammingLanguage.getLanguageForFileName(file.getName()), false);
        });

        // Append a tab for file name managing to the tab area
        let tabArea = workspaceIDE.tabArea;
        tabArea.appendChild(<WorkspaceFileNameManager workspace={this.workspace} fileSelect={fileSelect} />);
    };
}

export {WorkspaceCustomNamedFilesPlugin};