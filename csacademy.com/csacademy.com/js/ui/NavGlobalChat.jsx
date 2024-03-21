import {UI} from "../../../stemjs/src/ui/UIBase.js";
import "Translation";
import {FRONT_PAGE_CHAT_ID} from "../state/CSASettings.js";
import {GroupChatStore} from "../../../establishment/chat/js/state/MessageThreadStore.js";
import {GroupChatWidget} from "../../../establishment/chat/js/ChatWidget.jsx";
import {Dispatcher} from "../../../stemjs/src/base/Dispatcher.js";
import {DelayedElement} from "../../../stemjs/src/ui/DelayedElement.js";
import {NavManager} from "../../../stemjs/src/ui/navmanager/NavManager.jsx";

class LoadingPoints extends UI.Primitive("span") {
    getContent() {
        let content = "";
        for (let i = 0; i < this.points; i += 1) {
            content += ".";
        }
        return content;
    }

    onMount() {
        this.points = 1;
        this.node.textContent = this.getContent();
        this.intervalId = setInterval(() => {
            this.points = this.points % 4 + 1;
            this.node.textContent = this.getContent();
        }, 350);
    }

    onUnmount() {
        clearInterval(this.intervalId);
    }
}

class NavGroupChatWidget extends GroupChatWidget {
    render() {
        return [
            <div ref="messageContainer" style={{flex: "5", overflowY: "auto"}}>
                {this.renderMessageView()}
            </div>,
            this.renderMessageBox()
        ];
    }

    renderMessageBox() {
        let messageBox = super.renderMessageBox();
        messageBox.setStyle({
            flex: "1",
            minHeight: "50px",
            maxHeight: "100px",
            height: "",
        });
        return messageBox;
    }

    observeMutations() {
        let node = this.messageContainer.node;
        let observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.addedNodes.length) {
                    if (node.scrollHeight - node.scrollTop - this.messageContainer.getHeight() < 100) {
                        setTimeout(() => {
                            node.scrollTop = node.scrollHeight;
                        }, 10);
                        return;
                    }
                }
            }
        });
        observer.observe(node, {
            subtree: true,
            childList: true
        });
    }

    handleResize() {
        let scroll = false;
        if (this.messageContainer.node.scrollHeight - this.messageContainer.node.scrollTop - this.messageContainer.getHeight() < 100) {
            scroll = true;
        }
        if (scroll) {
            this.messageContainer.node.scrollTop = this.messageContainer.node.scrollHeight;
        }
    }

    addResizeListeners() {
        this.handleResize();
        NavManager.Global.addListener("changedAccordion", () => {
            this.handleResize();
        });
        window.addEventListener("resize", () => {
            this.handleResize();
        });
        this.observeMutations();
    }

    onMount() {
        super.onMount();
        this.chatInput.setStyle("height", "100%");
        this.applyScrollPosition();
    }
}

class NavGlobalChat extends DelayedElement(UI.Element) {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.setStyle("position", "relative");
    }

    beforeRedrawNotLoaded() {
        Dispatcher.Global.addListener("initNavManagerDone", () => {
            if (NavManager.Global.rightSidePanel.visible) {
                this.setLoaded();
            }
            NavManager.Global.addListener("toggledRightSide", (visible) => {
                if (visible) {
                    this.setLoaded();
                }
            });
        });
    }

    renderNotLoaded() {
        return [
            <div style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textTransform: "uppercase",
            }}>
                <LoadingPoints style={{opacity: 0}}/> Loading <LoadingPoints/>
            </div>,
        ];
    }

    renderLoaded() {
        let messageThread = GroupChatStore.get(FRONT_PAGE_CHAT_ID).getMessageThread();
        let groupChatStyle = {
            marginLeft: "0px",
            marginRight: "0px",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            position: "absolute",
        };
        return [
            <NavGroupChatWidget style={groupChatStyle}
                             extraHeightOffset={75}
                             ref="chat"
                             chatId={FRONT_PAGE_CHAT_ID}
                             messageThread={messageThread} />
        ];
    }

    setLoaded() {
        if (this._loaded) {
            return;
        }
        GroupChatStore.fetch(FRONT_PAGE_CHAT_ID, () => {
            super.setLoaded();
        });
    }

    onDelayedMount() {
        this.chat.messageContainer.node.scrollTop = this.chat.messageContainer.node.scrollHeight;
        this.onlineUsers = this.chat.messageThread.online || new Set();
        this.dispatch("updateOnlineUsers");
        this.attachChangeListener(this.chat.messageThread, () => {
            this.onlineUsers = this.chat.messageThread.online;
            this.dispatch("updateOnlineUsers");
        });
    }
}

export {NavGlobalChat};
