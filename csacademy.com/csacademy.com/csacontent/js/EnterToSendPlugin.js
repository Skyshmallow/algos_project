import {
    ChatPlugin
} from "../../establishment/chat/js/ChatPlugin.js";


class EnterToSendPlugin extends ChatPlugin {
    constructor() {
        super(...arguments);
        if (!this.getChatbox()) {
            return;
        }
        this.callback = (event) => {
            if (!(event.shiftKey || event.ctrlKey) && (event.key === "Enter" || event.keyCode === 13)) {
                this.chatWidget.sendMessage();
                event.preventDefault();
            }
        };
        this.getChatbox().addNodeListener("keydown", this.callback);
    }

    remove() {
        this.getChatbox().removeNodeListener("keydown", this.callback);
    }
}

export {
    EnterToSendPlugin
};