import {ActionModal, ActionModalButton, Modal} from "../../../../stemjs/src/ui/modal/Modal.jsx";
import {EvalJobStore} from "../../state/EvalJobStore.js";
import {Select} from "../../../../stemjs/src/ui/input/Input.jsx";
import {ProgrammingLanguage} from "../../../../csabase/js/state/ProgrammingLanguageStore.js";
import {Ajax} from "../../../../stemjs/src/base/Ajax.js";

class ReevalModal extends ActionModal {
    getActionName() {
        return "Re-eval";
    }

    getCloseName() {
        return "Cancel";
    }

    getTitle() {
        return "Are you sure you want to re-evaluate ALL jobs?";
    }

    getMessage() {
        if (EvalJobStore.jobCount === 0) {
            return "No jobs to re-evaluate!";
        }
        if (EvalJobStore.jobCount === 1) {
            return "One job will be re-evaluated";
        }
        return EvalJobStore.jobCount + " jobs will be re-evaluated";
    }

    getBody() {
        return [
            this.getMessage(),
            <div>
                Programming Language: <Select options={["-----", ...ProgrammingLanguage.all()]} ref="languageSelect"/>
            </div>
        ];
    }

    action() {
        let request = {
            evalTaskId: this.options.evalTask.id,
            job: "all"
        };
        const programmingLanguage = this.languageSelect.get();
        if (programmingLanguage.id) {
            request.programmingLanguageId = programmingLanguage.id;
        }
        Ajax.postJSON("/eval/reeval/", request).then(
            (data) => this.hide(),
            (error) => this.messageArea.showMessage(error.message, "red", 4000)
        );
    }
}

export const ReevalButton = ActionModalButton(ReevalModal);

export class ReevalDoneModal extends Modal {
    render() {
        return "All " + this.options.jobCount + " submissions have been enqueued successfully.";
    }
}