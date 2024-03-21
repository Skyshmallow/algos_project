import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store.js";
import {
    UserStore
} from "../../../csaaccounts/js/state/UserStore.js";

class AceSettingObject extends StoreObject {
    toString() {
        return this.name;
    }
};


const AceTheme = new GenericObjectStore("AceTheme", AceSettingObject);
AceTheme.getDefaultTheme = function() {
    let aceThemeId = 1; // Dawn
    let user = UserStore.getCurrentUser();
    if (user) {
        aceThemeId = user.getParsedCustomSetting("workspace:aceTheme", aceThemeId);
    }
    return AceTheme.get(aceThemeId);
};


const AceKeyboardHandler = new GenericObjectStore("AceEditorKeyboardHandler", AceSettingObject);
AceKeyboardHandler.getDefaultKeyboardHandler = function() {
    let aceKeyboardHandlerId = 1; // ace
    let user = UserStore.getCurrentUser();
    if (user) {
        aceKeyboardHandlerId = user.getParsedCustomSetting("workspace:aceKeyboardHandler", aceKeyboardHandlerId);
    }
    return AceKeyboardHandler.get(aceKeyboardHandlerId);
};


export {
    AceTheme,
    AceKeyboardHandler
}