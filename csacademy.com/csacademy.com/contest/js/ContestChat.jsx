import {UI} from "../../stemjs/src/ui/UIBase.js";
import {GlobalStyle} from "../../stemjs/src/ui/GlobalStyle.js";
import {GroupChatStore} from "../../establishment/chat/js/state/MessageThreadStore.js";
import {GroupChatWidget} from "../../establishment/chat/js/ChatWidget.jsx";
import {StateDependentElement} from "../../stemjs/src/ui/StateDependentElement.jsx";


export class ContestChat extends UI.Element {
    getMessageThread() {
        const groupChat = GroupChatStore.get(this.options.chatId);
        return groupChat?.getMessageThread();
    }

    render() {
        const messageThread = this.getMessageThread();
        if (messageThread) {
            return <GroupChatWidget
                ref="chatWidget"
                className={GlobalStyle.Container.MEDIUM}
                style={{height: window.innerHeight - 70}}
                chatId={this.options.chatId}
                messageThread={messageThread}
            />;
        } else if (this.options.error) {
            return StateDependentElement.renderError(this.options.error);
        }

        return [
            <h3>Chat loading...</h3>,
            <span className="fa fa-spinner fa-spin"/>
        ];
    }

    onMount() {
        this.addListener("hide", () => {
            this.chatWidget?.dispatch("hide");
        });
        this.addListener("show", () => {
            this.chatWidget?.dispatch("show");
        });
    }
}
