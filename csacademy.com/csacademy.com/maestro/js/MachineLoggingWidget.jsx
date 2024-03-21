import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Panel} from "../../stemjs/src/ui/UIPrimitives.jsx";
import {StaticCodeHighlighter} from "../../stemjs/src/ui/CodeEditor";

import {MachineInstanceStore} from "./state/MachineInstanceStore";


export class MachineLoggingWidget extends Panel {
    constructor(options) {
        super(options);
    }

    render() {
        return [<StaticCodeHighlighter ref="logger" numLines={40} readOnly={true} />];
    }

    onMount() {
        super.onMount();

        MachineInstanceStore.registerStreams();

        this.attachListener(MachineInstanceStore, "logMessage", (logMessage) => {
            let formattedMessage = "[" + logMessage.objectId + "] " + logMessage.message;
            if (!formattedMessage.endsWith("\n")) {
                formattedMessage += "\n";
            }
            this.logger.append(formattedMessage);
        });
    }
}
