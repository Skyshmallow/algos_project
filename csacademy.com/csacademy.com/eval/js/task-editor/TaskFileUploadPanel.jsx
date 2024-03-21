import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {Panel} from "../../../stemjs/src/ui/UIPrimitives.jsx";

export class TaskFileUploadPanel extends Panel {
    getTitle() {
        return "File Upload";
    }

    render() {
        const {evalTask} = this.options;

        return <div>
            Configure file upload globally to allow per task.
        </div>
    }
}
