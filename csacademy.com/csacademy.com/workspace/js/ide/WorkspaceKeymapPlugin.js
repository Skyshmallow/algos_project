import {
    WorkspacePlugin
} from "./WorkspacePlugin.js";


class KeyboardShortcut {
    constructor(keyCombo, name, callback) {}
}

export class WorkspaceKeymapPlugin extends WorkspacePlugin {
    static priorityIndex = 700;

    constructor(workspaceIDE) {
        super(workspaceIDE, "KeymapManager");

        this.keyboardShortcutsHandler = (event) => {
            if (!document.body.contains(this.workspaceIDE.node)) {
                return;
            }
            if (event.keyCode == 8) {
                // TODO: Disable the backspace key
                //event.preventDefault();
            }
            if (event.ctrlKey || event.metaKey) {
                let button, key, plugin;
                if (event.ctrlKey) {
                    key = "Ctrl";
                } else {
                    key = "Cmd";
                }
                //Enter case must be treated differently
                if (event.which === 13) {
                    event.preventDefault();
                    button = this.workspaceIDE.fullScreenButton;
                    if (button) {
                        button.node.click();
                    }
                }
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 's':
                        event.preventDefault();
                        this.workspaceIDE.workspace.saveAllFiles();
                        break;
                    case 'b':
                        event.preventDefault();
                        plugin = this.workspaceIDE.getPlugin("CustomRun");
                        if (plugin) {
                            plugin.compileButton.node.click();
                        }
                        break;
                    case 'o':
                        event.preventDefault();
                        this.workspaceIDE.uploadFile.node.click();
                        break;
                    case 'i':
                        event.preventDefault();
                        plugin = this.workspaceIDE.getPlugin("CustomRun");
                        if (plugin) {
                            plugin.runInputButton.node.click();
                        }
                        break;
                    case 'u':
                        event.preventDefault();
                        plugin = this.workspaceIDE.getPlugin("ContestSubmit");
                        if (plugin) {
                            plugin.submitButton.node.click();
                        }
                        break;
                    case 'e':
                        event.preventDefault();
                        plugin = this.workspaceIDE.getPlugin("ContestSubmit");
                        if (plugin) {
                            console.log(key + "+E pressed, running examples");
                            plugin.runExamplesButton.node.click();
                        }
                        break;
                    case 'm':
                        event.preventDefault();
                        button = this.workspaceIDE.toggleTabAreaButton;
                        if (button) {
                            button.node.click();
                        }
                        break;
                }
            }
            //TODO list of shortcuts to consider:
            //--Autoformat code
            //--Run lint checker
            //
        };

        window.addEventListener("keydown", this.keyboardShortcutsHandler);
    };

    register(keys, callback) {}

    unregister(keys, callback) {}
}