import {
    Plugin
} from "../../../stemjs/src/base/Plugin.js";


export class WorkspacePlugin extends Plugin {
    linkToParent(parent) {
        this.workspaceIDE = parent;
    }

    refLink(name) {
        return {
            parent: this,
            name: name
        };
    }
}