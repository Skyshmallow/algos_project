import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Panel} from "../../stemjs/src/ui/UIPrimitives.jsx";
import {StaticCodeHighlighter} from "../../stemjs/src/ui/CodeEditor.jsx";
import {WebsocketSubscriber} from "../../stemjs/src/websocket/client/WebsocketSubscriber.js";


export class WebsiteLoggingWidget extends Panel {
    render() {
        return [<StaticCodeHighlighter ref="logger" numLines={40} readOnly={true} />];
    }

    onMount() {
        super.onMount();

        WebsocketSubscriber.addListener("global-logging", (logMessage) => {
            let formattedMessage = "[" + logMessage.levelname + " " + logMessage.asctime + "] [" + logMessage.service.name + "] " + logMessage.message + "\n";
            if (logMessage.hasOwnProperty("exc_info")) {
                formattedMessage += "Stack trace:\n" + logMessage.exc_info + "\n";
            }
            this.logger.append(formattedMessage);
        });
    }
}
