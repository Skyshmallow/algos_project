import {
    Ajax
} from "../../stemjs/src/base/Ajax.js";

export const Logout = {
    logout: () => {
        Ajax.postJSON("/accounts/logout/", {}).then(
            () => location.reload()
        );
    }
};