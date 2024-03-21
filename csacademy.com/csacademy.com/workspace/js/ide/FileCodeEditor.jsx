import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {enqueueIfNotLoaded} from "../../../stemjs/src/base/EnqueueableMethodMixin.js";
import {UserStore} from "../../../csaaccounts/js/state/UserStore.js";
import {AceTheme, AceKeyboardHandler} from "../../../csabase/js/state/AceStore.js";
import {CodeEditor} from "../../../stemjs/src/ui/CodeEditor.jsx";


export class UserEditor extends CodeEditor {
    getDefaultOptions() {
        let user = UserStore.getCurrentUser();
        let defaultOptions = {
            aceKeyboardHandler: AceKeyboardHandler.getDefaultKeyboardHandler(),
            aceTheme: AceTheme.getDefaultTheme(),
            fontSize: user.getFileFontSize(),
            tabSize: user.getTabSize(),
            showLineNumber: user.getShowLineNumber(),
        };
        return defaultOptions;
    }

    onMount() {
        let currentUser = UserStore.getCurrentUser();
        if (currentUser) {
            this.attachListener(currentUser, "updateCustomSetting", (event) => {
                this.dispatch(event.key, event.value);
            });
        }
        this.addListener("workspace:aceTheme", (aceThemeId) => {
            let aceTheme = AceTheme.get(aceThemeId);
            this.setAceTheme(aceTheme);
        });
        this.addListener("workspace:tabSize", (tabSize) => {
            this.setAceTabSize(tabSize);
        });
        this.addListener("workspace:showLineNumber", (showLineNumber) => {
            this.setAceLineNumberVisible(showLineNumber);
        });
        this.addListener("workspace:enableBasicAutocompletion", (value) => {
            this.setBasicAutocompletion(value);
        });
        this.addListener("workspace:enableLiveAutocompletion", (value) => {
            this.setLiveAutocompletion(value);
        });
        this.addListener("workspace:enableSnippets", (value) => {
            this.setSnippets(value);
        });
        this.addListener("workspace:aceKeyboardHandler", (aceKeyboardHandlerId) => {
            let aceKeyboardHandler = AceKeyboardHandler.get(aceKeyboardHandlerId);
            this.setAceKeyboardHandler(aceKeyboardHandler);
        });
        super.onMount();
    }
}

export class UserInputEditor extends UserEditor {
    onMount() {
        this.addListener("workspace:fileFontSize", (fontSize) => {
            this.setAceFontSize(fontSize);
        });
        super.onMount();
    }
}

export class UserCodeEditor extends UserEditor {
    getDefaultOptions() {
        let options = super.getDefaultOptions();
        options.fontSize = UserStore.getCurrentUser().getCodeFontSize();
        return options;
    }

    onMount() {
        this.addListener("workspace:codeFontSize", (fontSize) => {
            this.setAceFontSize(fontSize);
        });
        this.addListener("workspace:showPrintMargin", (showPrintMargin) => {
            this.setAcePrintMarginVisible(showPrintMargin);
        });
        this.addListener("workspace:printMarginSize", (printMarginSize) => {
            this.setAcePrintMarginSize(printMarginSize);
        });
        super.onMount();
    }
}

// Class that acts like a CodeEditor backed by a file-like object
// The file-like object needs to support
// - setValue(newValue, shouldSaveNow)
// - getValue()
// - addChangeListener(fileUpdateEvent);
// - dispatch("changeByUser", fileUpdateEvent);
let FileCodeEditorMixin = function (BaseCodeEditor) {
    return class FileCodeEditor extends BaseCodeEditor {
        onDelayedMount() {
            super.onDelayedMount();
            if (this.options.file) {
                this.setFile(this.options.file);
            }
            this.addAceSessionChangeListener((event) => {
                //Ignore when we're setting these values in code
                //Whoever changes the value manually should issue a custom events if he want
                if (this.apiChange) {
                    return;
                }

                event.newValue = this.getValue();
                event.file = this.file;

                this.file.setValue(event.newValue, true);
                this.file.dispatch("userChanged", event);
            });

        };

        @enqueueIfNotLoaded
        setFile(file, programmingLanguage) {
            this.file = file;
            this.setValue(file.getValue());
            if (!programmingLanguage && file.hasOwnProperty("getProgrammingLanguage")) {
                programmingLanguage = file.getProgrammingLanguage();
            }
            if (programmingLanguage) {
                this.setAceMode(programmingLanguage);
            }

            let browserFileVersion = file.getBrowserVersion();

            if (browserFileVersion &&
                browserFileVersion.serverTime > (file.serverLastSaved || 0) &&
                browserFileVersion.value != file.getValue()) {
                console.log("Using browser version for file ", file.getName())
                this.setValue(browserFileVersion.value);
                file.setValue(browserFileVersion.value);
            }

            if (this.fileListener) {
                this.fileListener.remove();
            }

            this.fileListener = this.file.addListener("updateExternal", (event) => {
                console.log("File listener for file: ", this.file);
                this.setValue(this.file.getValue());
            });
        };

        getFile() {
            return this.file;
        };
    };
};

export let InputFileEditor = FileCodeEditorMixin(UserInputEditor);
export let FileCodeEditor = FileCodeEditorMixin(UserCodeEditor);
