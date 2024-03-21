import {UI, ActionModal, TemporaryMessageArea, ButtonGroup, Button,
        FileInput, TextInput, ProgressBar, Level} from "../../csabase/js/UI.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {AjaxButton} from "../../stemjs/src/ui/button/AjaxButton.jsx";

import {StorageLimits} from "./StorageLimits.js";
import {PublicStorageFileStore} from "./state/PublicFileStore.js";
import {formatBytes} from "../../stemjs/src/base/Formatting.js";


export class DeleteFileModal extends ActionModal {
    getActionName() {
        return "Delete file";
    }

    getBody() {
        return "Delete " + this.options.file.name + "?";
    }

    getFooter() {
        return [<TemporaryMessageArea ref="messageArea"/>,
            <ButtonGroup>
                <Button label="Close" onClick={() => this.hide()}/>
                <AjaxButton ref="deleteFileButton" level={Level.DANGER} onClick={() => {
                    this.deleteFile()
                }}
                            statusOptions={["Delete file", {icon: "spinner fa-spin", label: " deleting file ..."},
                                "Delete file", "Failed"]}/>
            </ButtonGroup>
        ];
    }

    hide() {
        this.messageArea.clear();
        super.hide();
    }

    deleteFile() {
        const request = {
            ids: [this.options.file.id]
        };

        this.deleteFileButton.postJSON("/storage/delete_request/", request).then(
            () => this.hide(),
            (error) => this.messageArea.showMessage(error.message, "red")
        );
    }
}

export class UploadFilesModal extends ActionModal {
    getActionName() {
        return "Upload files";
    }

    getBody() {
        return [<div>
            <FileInput className="pull-left" ref="fileInput" multipleFiles/>
        </div>,
            <br/>,
            <ProgressBar level={Level.SUCCESS} ref="progress">Progress</ProgressBar>
        ];
    }

    getFooter() {
        return [<TemporaryMessageArea ref="messageArea"/>,
            <ButtonGroup>
                <Button label="Close" onClick={() => this.hide()}/>
                <Button level={Level.SUCCESS} label="Upload" onClick={() => this.upload()}/>
            </ButtonGroup>
        ];
    }

    onMount() {
        super.onMount();

        this.fileInput.addChangeListener(() => {
            this.messageArea.clear();
            this.progress.set(0);
        });
    }

    upload() {
        let files = this.fileInput.getFiles();

        if (files.length === 0) {
            this.messageArea.showMessage("Please select some files!", "red");
            return;
        }

        if (!StorageLimits.validateUploadMaxCount(files.length)) {
            this.messageArea.showMessage("You cannot upload more than " + StorageLimits.userUploadMaxCount() + " files at once!", "red");
            return;
        }

        let storageMeta = PublicStorageFileStore.getStorageMeta();

        if (!StorageLimits.validateFileMaxCount(storageMeta, files.length)) {
            this.messageArea.showMessage("Completion of this request will exceed the maximum number of total files you can " +
                "store (" + StorageLimits.userFileMaxCount() + ").", "red");
            return;
        }

        let totalSize = 0;
        let formData = new FormData();

        for (const file of files) {
            if (!StorageLimits.validateFileMaxSize(file.size)) {
                this.messageArea.showMessage("File " + file.name + " is too big (" +
                    formatBytes(file.size) + " while maximum size per file is " +
                    formatBytes(StorageLimits.userFileMaxSize()) + ").", "red");
                return;
            }
            formData.append(file.name, file);
            totalSize += file.size;
        }

        if (!StorageLimits.validateTotalMaxSize(storageMeta, totalSize)) {
            this.messageArea.showMessage("Completion of this request will exceed the maximum total size you can store (" +
                formatBytes(StorageLimits.userTotalMaxSize()) + ").", "red");
            return;
        }

        const fileUploadRequest = Ajax.post("/storage/upload_request/", {
            dataType: "json",
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
        });

        fileUploadRequest.then(
            (data) => this.hide(),
            (error) => {
                this.messageArea.showMessage("Error in uploading files: status:" + error.message, "red");
            }
        );

        fileUploadRequest.xhr.upload.addEventListener("progress", (event) => console.warn("E", event));

        fileUploadRequest.addProgressListener((event) => {
            console.warn("Progress", event);
            this.progressHandling(event);
        });
    }

    hide() {
        this.messageArea.clear();
        this.progress.set(0);
        super.hide();
    }

    progressHandling(event) {
        if (event.lengthComputable) {
            this.progress.set(event.loaded / event.total);
        }
    }
}

export class RenameFileModal extends ActionModal {
    getActionName() {
        return "Rename file";
    }

    getBody() {
        return [<UI.TextElement ref="text" value={"Choose your new file name:"}/>,
            <TextInput ref="nameInput" value={this.options.file.name}/>];
    }

    getFooter() {
        return [<TemporaryMessageArea ref="messageArea"/>,
            <ButtonGroup>
                <Button label="Close" onClick={() => this.hide()}/>
                <AjaxButton ref="renameFileButton" level={Level.SUCCESS} onClick={() => {
                    this.renameFile()
                }}
                            statusOptions={["Rename file", {icon: "spinner fa-spin", label: " renaming file ..."},
                                "Rename file", "Failed"]}/>
            </ButtonGroup>
        ];
    }

    hide() {
        this.messageArea.clear();
        super.hide();
    }

    renameFile() {
        const request = {
            id: this.options.file.id,
            newName: this.nameInput.getValue()
        };

        this.renameFileButton.postJSON("/storage/rename_request/", request).then(
            () => this.hide(),
            (error) => this.messageArea.showMessage(error.message, "red")
        );
    }
}
