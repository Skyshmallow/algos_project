import {UI} from "../../../../stemjs/src/ui/UIBase.js";
import {CollapsiblePanel} from "../../../../stemjs/src/ui/collapsible/CollapsiblePanel.jsx";
import {FileInput, RawCheckboxInput} from "../../../../stemjs/src/ui/input/Input.jsx";
import {Button} from "../../../../stemjs/src/ui/button/Button.jsx";
import {Level} from "../../../../stemjs/src/ui/Constants.js";
import {Ajax} from "../../../../stemjs/src/base/Ajax.js";
import {ErrorMessage} from "../IssueMessages.jsx";
import {formatBytes} from "../../../../stemjs/src/base/Formatting.js";
import {ProgressBar} from "../../../../stemjs/src/ui/ProgressBar.jsx";
import {FormField} from "../../../../stemjs/src/ui/form/Form.jsx";
import {ToggleInput} from "../../../../stemjs/src/ui/input/checkbox/ToggleInput.jsx";


class TestUploadStatus extends UI.Primitive("span") {
    extraNodeAttributes(attr) {
        attr.setStyle({
            display: "inline-flex",
            alignItems: "baseline",
        });
    }

    render() {
        const {error, message, progress, response} = this.options;
        if (error) {
            return `Error: ${error}`;
        }

        if (response) {
            // This means we're done
            const {numTestFilesUpdated} = response;
            return `Done, ${numTestFilesUpdated} test files updated.`
        }

        if (progress == null) {
            return message;
        }

        if (progress < 1.0) {
            return [
                "Uploading",
                <ProgressBar style={{width: 250, display: "inline-block", marginLeft: 8, height: 8}} level={Level.SUCCESS} value={progress} />
            ]
        }

        return "Processing...";
    }
}


export class TestUploadPanel extends CollapsiblePanel {
    uploadStatus = {};
    maxUploadSize = (100 << 20);
    maxFiles = 100;

    getTitle() {
        return "Upload tests";
    }

    updateSelectedFileDescription() {
        const filesToUpload = this.testInputField?.getFiles() || [];
        this.updateUploadStatus({error: null, progress: null, response: null});
        if (filesToUpload.length === 0) {
            return;
        }
        let totalFileSize = 0;
        for (const file of filesToUpload) {
            totalFileSize += file.size;
        }

        if (totalFileSize > this.maxUploadSize) {
            this.updateUploadStatus({error: `Total upload size too large: ${formatBytes(totalFileSize)} > ${formatBytes(this.maxUploadSize)}`});
            return;
        }

        if (filesToUpload.length > this.maxFiles) {
            this.updateUploadStatus({error: `Too many files selected, max ${this.maxFiles}`});
        }

        return this.updateUploadStatus({message: `${formatBytes(totalFileSize)} ready to upload`});
    }

    render() {
        return [
            <FileInput
                ref="testInputField"
                multipleFiles
                fileTypes=".in,.ok,.zip"
                onChange={() => this.updateSelectedFileDescription()}
            />,
            <Button
                label="Upload tests"
                onClick={() => this.uploadTests()}
                level={Level.PRIMARY}
                style={{margin: "5px"}}
            />,

            <TestUploadStatus {...this.uploadStatus} />,

            // TODO Support these two changes
            // <div>
            //     <FormField label="Use dos2unix">
            //         <RawCheckboxInput ref="useDos2UnixInput" initialValue={true}/>
            //     </FormField>
            //     <FormField label="Purge existing tests">
            //         <RawCheckboxInput ref="purgeExistingInput" initialValue={false}/>
            //     </FormField>
            // </div>,

            <div>
                <ul>
                    <li>Upload either a .zip file or individual test files.</li>
                    <li>If you're uploading a zip file, it should contain individual test files top-level (not inside a folder)</li>
                    <li>The naming of individual test files should be <strong>test-[testId].in</strong> and <strong>test-[testId].ok</strong>, where <strong>[testId]</strong> is a positive integer.</li>
                    <li><strong>dos2unix</strong> will be run the files, to normalize line ending.</li>
                    <li>Total unpacked test size should be at most 200MB, but please think of the children and try to keep it under 5-10MB for evaluation performance reasons.</li>
                </ul>
            </div>
        ]
    }

    updateUploadStatus(newStatus) {
        Object.assign(this.uploadStatus, newStatus);
        this.redraw();
    }

    async uploadTests() {
        const {evalTask} = this.options;
        const formData = new FormData();
        const filesToUpload = this.testInputField.getFiles();

        if (filesToUpload.length === 0) {
            this.updateUploadStatus({error: "No files selected for upload."});
            return;
        }

        for (const file of filesToUpload) {
            if (file.size > 1e8) {
                this.updateUploadStatus({error: "File " + file.name + " too large."});
                continue;
            }
            formData.append(file.name, file);
        }

        this.uploadStatus = {}
        this.updateUploadStatus({progress: 0});

        const onUploadProgress = (event) => this.updateUploadStatus({progress: event.loaded / event.total});

        Ajax.postJSON(evalTask.getEditUrl(), formData, {onUploadProgress}).then(
            (response) => {
                this.updateUploadStatus({response});
            }, (error) => {
                this.updateUploadStatus({error});
            }
        );
    };
}
