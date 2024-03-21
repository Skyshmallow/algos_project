import {ActionModal} from "../../../../stemjs/src/ui/modal/Modal.jsx";
import {MarkupEditor} from "../../../../establishment/content/js/markup/MarkupEditor.jsx";
import {TextInput} from "../../../../stemjs/src/ui/input/Input.jsx";
import {Ajax} from "../../../../stemjs/src/base/Ajax.js";


export class EditSubmissionCommentModal extends ActionModal {
    getDefaultOptions() {
        return {
            ...super.getDefaultOptions(),
            closeButton: true,
            actionName: "Edit metadata"
        };
    }

    getBody() {
        const {evalJob} = this.options;
        return [
            <h2>Comment</h2>,
            <MarkupEditor
                ref={this.refLink("markupEditor")}
                showButtons={false}
                value={evalJob.comment}
                style={{height: 200}}
            />,
            <div>
                Expected result: <TextInput
                ref="expectedResultInput"
                placeholder="For ex. 100 or * or g1,g2"
                initialValue={evalJob.expectedResult}
            />
            </div>
        ]

    }

    async action() {
        const request = {
            evalJobId: this.options.evalJob.id,
            comment: this.markupEditor.getValue(),
            expectedResult: this.expectedResultInput.getValue(),
        }
        try {
            const response = await Ajax.postJSON("/eval/edit_eval_job_comment/", request);
            this.hide();
        } catch (error) {
            this.messageArea.showMessage("Failed to save: " + error, "red", 8000);
        }
    }
}
