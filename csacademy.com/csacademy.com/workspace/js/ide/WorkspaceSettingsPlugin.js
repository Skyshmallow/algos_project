import {
    UserStore
} from "../../../csaaccounts/js/state/UserStore.js";
import {
    WorkspacePlugin
} from "./WorkspacePlugin.js";


export class WorkspaceSettingsPlugin extends WorkspacePlugin {
    static priorityIndex = 100;

    constructor(workspaceIDE) {
        super(workspaceIDE);
        this.workspaceIDE.addListener("initDone", () => {
            this.panel = this.workspaceIDE.workspaceSettings;
            this.addUserSettingsListeners();
        });
    }

    static pluginName() {
        return "SettingsManager";
    }

    addUserSettingsListeners() {
        this.attachListener(UserStore.getCurrentUser(), "updateCustomSetting", (event) => {
            this.dispatch(event.key, event.value);
        });
    };
}