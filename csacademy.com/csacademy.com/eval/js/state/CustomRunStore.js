import {
    GenericObjectStore
} from "../../../stemjs/src/state/Store.js";
import {
    AjaxFetchMixin
} from "../../../stemjs/src/state/StoreMixins.js";
import {
    Ajax
} from "../../../stemjs/src/base/Ajax.js";
import {
    NOOP_FUNCTION
} from "../../../stemjs/src/base/Utils.js";
import {
    BaseUserSubmission
} from "./BaseUserSubmission.js";


export class CustomRun extends BaseUserSubmission {
    buildPublicUrl() {
        return location.origin + "/code/" + this.urlHash + "/";
    }

    setPublic(callback = NOOP_FUNCTION) {
        if (this.isPublic) {
            callback();
            return;
        }
        this.makePublic(callback);
    }

    makePublic(callback = NOOP_FUNCTION) {
        let request = {
            customRunId: this.id,
            makePublic: true,
        };

        Ajax.postJSON("/eval/edit_custom_run/", request).then(
            (data) => {
                // TODO: Data should be an event to trigger listeners
                this.isPublic = true;
                this.urlHash = data.urlHash;
                callback();
            },
            NOOP_FUNCTION
        );
    }
}

export const CustomRunStore = new(AjaxFetchMixin(GenericObjectStore))("customrun", CustomRun, {
    fetchURL: "/eval/get_custom_run/",
    maxFetchObjectCount: 1,
});