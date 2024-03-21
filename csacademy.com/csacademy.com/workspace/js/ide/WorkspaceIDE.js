import {
    Pluginable
} from "../../../stemjs/src/base/Plugin.js";

import {
    WorkspacePanel
} from "./WorkspacePanel.jsx";
import {
    WorkspaceSettingsPlugin
} from "./WorkspaceSettingsPlugin.js";
import {
    WorkspaceCustomRunPlugin
} from "./WorkspaceCustomRunPlugin.jsx";
import {
    WorkspaceContestSubmitPlugin
} from "./WorkspaceContestSubmitPlugin.jsx";
import {
    WorkspaceSingleFileManagerPlugin
} from "./WorkspaceSingleFileManagerPlugin.js";
import {
    WorkspaceCompilerParserPlugin
} from "./WorkspaceCompilerParserPlugin.js";
import {
    WorkspaceKeymapPlugin
} from "./WorkspaceKeymapPlugin.js";
import {
    WorkspaceSharePlugin
} from "./WorkspaceSharePlugin.jsx";
import {
    WorkspaceEnforcedTemplatePlugin
} from "./WorkspaceEnforcedTemplatePlugin.jsx";
import {
    WorkspaceCustomNamedFilesPlugin
} from "./WorkspaceCustomNamedFilesPlugin.jsx";


let PluginTypes = {};
PluginTypes.BASE = [WorkspaceSettingsPlugin, WorkspaceSingleFileManagerPlugin, WorkspaceCustomRunPlugin, WorkspaceKeymapPlugin, WorkspaceCompilerParserPlugin];
PluginTypes.CHECKER = [...PluginTypes.BASE, WorkspaceCustomNamedFilesPlugin];
PluginTypes.GLOBAL = [...PluginTypes.BASE, WorkspaceSharePlugin];
PluginTypes.CONTEST = [...PluginTypes.BASE, WorkspaceContestSubmitPlugin];
PluginTypes.CONTEST_PUBLIC_SOURCES = [...PluginTypes.CONTEST, WorkspaceSharePlugin];
PluginTypes.CONTEST_ENFORCED_TEMPLATE = [...PluginTypes.CONTEST, WorkspaceEnforcedTemplatePlugin];
PluginTypes.CONTEST_PUBLIC_SOURCES_ENFORCED_TEMPLATE = [...PluginTypes.CONTEST, WorkspaceSharePlugin, WorkspaceEnforcedTemplatePlugin];

class WorkspaceIDE extends Pluginable(WorkspacePanel) {
    constructor(options) {
        super(options);
        this.startTime = performance.now();
        this.options.aceTheme = this.options.aceTheme || "ace/theme/dawn";
    }

    registerPlugins() {
        this.options.plugins = (this.options.plugins || []).sort((a, b) => {
            return a.priorityIndex - b.priorityIndex;
        });
        for (let PluginConstructor of this.options.plugins) {
            this.registerPlugin(PluginConstructor);
        }
        this.addSettingsListeners();
        this.dispatch("initDone");
    }

    whenLoaded(callback) {
        if (this._loaded) {
            callback();
        } else {
            this.addListenerOnce("loaded", callback);
        }
    }

    onMount() {
        super.onMount();
        //TODO: Optimize the start time of the workspace
        //During this time the UI is frozen
        //We should batch some of these steps, separated by releasing the thread so that UI interaction can happen

        this.workspace = this.options.workspace;

        this.sessionId = Math.random().toString().substr(2);
        this.workspace.sessionId = this.sessionId;

        console.log("Init without plugin registrations: ", (performance.now() - this.startTime));

        this.codeEditor.whenLoaded(() => {
            this.registerPlugins();
            this._loaded = true;
            this.dispatch("loaded");
        });
    };

    addSettingsListeners() {
        let settingsPlugin = this.getPlugin("SettingsManager");
        // TODO: Complete this!
    }
}

export {
    PluginTypes,
    WorkspaceIDE
};