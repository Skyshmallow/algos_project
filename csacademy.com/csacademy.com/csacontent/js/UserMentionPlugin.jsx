import {ChatPlugin} from "../../establishment/chat/js/ChatPlugin.js";
import {AbstractUsernameAutocomplete, AutocompleteWindow} from "../../establishment/accounts/js/UsersAutocompletion.jsx";

class UserMentionPlugin extends ChatPlugin {
    constructor() {
        super(...arguments);
        if (!this.getChatbox()) {
            return;
        }

        if (this.chatWidget.getPlugin("EnterToSendPlugin")) {
            this.chatWidget.removePlugin("EnterToSendPlugin");
            this._enterToSend = true;
        }
        this.getChatbox().addNodeListener("keydown", (event) => {
            if (event.keyCode === 39 || event.keyCode === 37) { // Left and right arrows
                setTimeout(() => {
                    // This needs to be wrapped in a setTimeout as the getCaretPosition needs selectionEnd which
                    // updates async and does not have an event attached to it.
                    this.handleChange();
                }, 0);
            }
            if (event.shiftKey || event.ctrlKey) {
                return;
            }
            if (event.key === "Enter" || event.keyCode === 13) {
                if (!this.duringAutocomplete && this._enterToSend) {
                    this.chatWidget.sendMessage();
                    event.preventDefault();
                }
            }
            AutocompleteWindow.handleKeydownEvent(this, event);
        });
        this.getChatbox().addNodeListener("input", () => {
            this.handleChange();
        });
        this.getChatbox().addClickListener(() => {
            setTimeout(() => {
                this.handleChange();
            }, 0);
        });

        this.addListener("autocomplete", (userIds) => {
            AutocompleteWindow.handleAutocomplete(this, userIds, this.getChatbox());
        });
        this.getChatbox().addListener("messageSent", () => {
            this.duringAutocomplete = false;
            this.dispatch("autocomplete", []);
        });
    }

    autocompleteUser(userId) {
        this.getChatbox().node.focus();
        let caretPosition = this.getCaretPosition();
        let text = this.getChatbox().getValue();
        let lastAtPosition = this.getLastAtPosition(caretPosition);
        const userMarkup = "<User id=\"" + userId + "\" /> ";
        text = text.substring(0, lastAtPosition + 1) + userMarkup + text.substring(caretPosition);
        this.getChatbox().setValue(text);
        this.setCaretPosition(lastAtPosition + 1 + userMarkup.length);
        this.dispatch("autocomplete", []);
    }

    handleChange() {
        let caretPosition = this.getCaretPosition();
        let lastAtPosition = this.getLastAtPosition(caretPosition);
        if (lastAtPosition === -1) {
            this.dispatch("autocomplete", []);
        } else {
            let prefix = this.getChatbox().getValue().substring(lastAtPosition + 1, caretPosition);
            AbstractUsernameAutocomplete.loadUsersForPrefix(prefix, (userIds) => {
                this.dispatch("autocomplete", userIds);
            });
        }
    }

    getCaretPosition() {
        let textArea = this.getChatbox().node;
        if (typeof textArea.selectionStart === "number" && typeof textArea.selectionEnd === "number") {
            return textArea.selectionEnd;
        }
        let range = document.selection.createRange();
        if (range && range.parentElement() == textArea) {
            let len = textArea.value.length;
            let normalizedValue = textArea.value.replace(/\r\n/g, "\n");

            // Create a working TextRange that lives only in the input
            let textInputRange = textArea.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());

            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn't return what we want
            // in those cases
            let endRange = textArea.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                return len;
            }
            let end = -textInputRange.moveEnd("character", -len);
            end += normalizedValue.slice(0, end).split("\n").length - 1;
            return end;
        }
        return null;
    }

    setCaretPosition(caretPosition) {
        let node = this.getChatbox().node;
        if(node.createTextRange) {
            let range = node.createTextRange();
            range.move("character", caretPosition);
            range.select();
        } else {
            node.focus();
            if(node.selectionStart) {
                node.setSelectionRange(caretPosition, caretPosition);
            }
        }
    }

    getLastAtPosition(caret) {
        let text = this.getChatbox().getValue();
        if (arguments.length < 1) {
            caret = text.length;
        }
        let lastAtPosition = caret - 1;
        while (lastAtPosition >= 0 && text.charCodeAt(lastAtPosition) !== 64) {
            let char = text[lastAtPosition];
            if (char !== "." && char !== "_" && !char.match(/\d/) && !char.match(/\w/)) {
                lastAtPosition = -1;
                break;
            }
            lastAtPosition -= 1;
        }
        return lastAtPosition;
    }
}

export {UserMentionPlugin};