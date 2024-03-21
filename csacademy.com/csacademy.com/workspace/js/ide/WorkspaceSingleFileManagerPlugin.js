// This plugin handles changing the language (is faked as opening a file)
import {
    GlobalState
} from "../../../stemjs/src/state/State.js";
import {
    ContestTaskStore
} from "../../../contest/js/state/ContestTaskStore.js";
import {
    ProgrammingLanguage
} from "../../../csabase/js/state/ProgrammingLanguageStore.js";

import {
    WorkspacePlugin
} from "./WorkspacePlugin.js";


export class WorkspaceSingleFileManagerPlugin extends WorkspacePlugin {
    static priorityIndex = 200;

    constructor(workspaceIDE) {
        super(workspaceIDE);

        this.workspace = workspaceIDE.workspace;
        GlobalState.registerStream(this.workspace.streamName());

        this.workspace.addListener("updateExternal", (event) => {
            console.log("Workspace update event data: ", event);
        });

        this.undoManagers = new Map();

        this.programmingLanguageSelect = this.workspaceIDE.programmingLanguageSelect;

        this.changeFileCallback = () => {
            this.updateProgrammingLanguage(this.programmingLanguageSelect.get());
        };
        this.programmingLanguageSelect.addChangeListener(this.changeFileCallback);

        this.loadFiles();
    };

    // We should have a different undo manager for each different language
    updateUndoManager(workspaceFile) {
        if (!this.undoManagers.has(workspaceFile)) {
            const UndoManager = window.ace.require("ace/undomanager").UndoManager;
            this.undoManagers.set(workspaceFile, new UndoManager());
        }
        this.workspaceIDE.codeEditor.setUndoManager(this.undoManagers.get(workspaceFile));
    }

    static pluginName() {
        return "FileManager";
    }

    updateProgrammingLanguage(programmingLanguage) {
        let defaultCode;
        [programmingLanguage, defaultCode] = this.getLanguageAndCode(programmingLanguage);
        if (programmingLanguage !== this.getSelectedProgrammingLanguage()) {
            this.setSelectedProgrammingLanguage(programmingLanguage);
        }
        let workspaceFile = this.workspace.getOrCreateFileForLanguage(programmingLanguage, defaultCode);

        this.setIDEOpenFile(workspaceFile, programmingLanguage);

        this.workspaceIDE.dispatch("changeLanguage", programmingLanguage);
    }

    getSelectedProgrammingLanguage() {
        return this.programmingLanguageSelect.get();
    };

    setSelectedProgrammingLanguage(programmingLanguage) {
        this.programmingLanguageSelect.set(programmingLanguage);
    };

    setIDEOpenFile(workspaceFile, programmingLanguage, updateLanguage = true) {
        programmingLanguage = programmingLanguage || ProgrammingLanguage.getLanguageForFileName(workspaceFile.getName());

        //TODO: these should not be set here, but through a dispatcher
        this.workspaceIDE.saveFileStatusLabel.setFile(workspaceFile);

        this.workspaceIDE.codeEditor.setFile(workspaceFile);
        this.workspaceIDE.codeEditor.setAceMode(programmingLanguage);
        if (updateLanguage) {
            this.setSelectedProgrammingLanguage(programmingLanguage);
        }
        this.updateUndoManager(workspaceFile);
    };

    // This function is for eval tasks with enforced templates.
    // It checks whether the language given is among the eval task's allowed languages.
    // Also gives the default code for the language or its replacer.
    getLanguageAndCode(language) {
        let defaultCode;
        if (this.workspaceIDE.options.contestTaskId) {
            let evalTask = ContestTaskStore.get(this.workspaceIDE.options.contestTaskId).getEvalTask();
            if (evalTask.hasEnforcedTemplates() && evalTask.getTemplate(language)) {
                defaultCode = evalTask.getTemplate(language);
            } else if (evalTask.hasEnforcedTemplates()) {
                defaultCode = language.getDefaultTemplateComment() + language.getDefaultSource();
            }
        }
        return [language, defaultCode];
    }

    getDefaultFile() {
        let workspace = this.workspace;
        // If there's a file, open the last modified on
        // Otherwise, open the file for the default programming language stored for this user
        // In case we don't have any file, just create one for the user's language

        let defaultFile = null;
        for (let workspaceFile of workspace.files.values()) {
            //Ignore files that start with a .
            if (!workspaceFile.name.startsWith(".") &&
                (defaultFile == null || workspaceFile.serverLastSaved > defaultFile.serverLastSaved)) {
                defaultFile = workspaceFile;
            }
        }

        if (defaultFile) {
            return defaultFile;
        }

        // If we have an eval task that enforces templates, we want to overwrite the initial template
        let language = ProgrammingLanguage.getDefaultLanguage();
        return workspace.getOrCreateFileForLanguage(...this.getLanguageAndCode(language));
    };

    loadFiles() {
        this.setIDEOpenFile(this.getDefaultFile());
    };
}