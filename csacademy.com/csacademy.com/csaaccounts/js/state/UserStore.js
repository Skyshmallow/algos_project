import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store.js";
import {
    AjaxFetchMixin
} from "../../../stemjs/src/state/StoreMixins.js";
import {
    Ajax
} from "../../../stemjs/src/base/Ajax.js";
import {
    CountryStore
} from "../../../establishment/localization/js/state/CountryStore.js";


class User extends StoreObject {
    constructor(obj) {
        super(obj);
        this.taskSummaries = new Map();
    }

    getName() {}

    getCustomSetting(key, defaultValue) {
        let keyChain = key.split(":");
        let currentDict = this.customSettings;
        for (let key of keyChain) {
            if (key in currentDict) {
                currentDict = currentDict[key];
            } else {
                return defaultValue;
            }
        }
        return currentDict;
    }

    getParsedCustomSetting(key, defaultValue) {
        return JSON.parse(this.getCustomSetting(key, defaultValue));
    }

    setCustomSetting(key, value) {
        let keyChain = key.split(":");
        let lastKey = keyChain.pop();
        if (!this.customSettings) {
            this.customSettings = {};
        }
        let currentDict = this.customSettings;
        for (let key of keyChain) {
            if (!(key in currentDict)) {
                currentDict[key] = {};
            }
            currentDict = currentDict[key];
        }
        currentDict[lastKey] = value;

        let event = {
            key: key,
            rawValue: value,
            origin: "set",
        };
        try {
            event.value = JSON.parse(value);
        } catch (e) {
            event.value = value;
        }
        this.dispatch("updateCustomSetting", event);
    }

    saveCustomSetting(key, value) {
        if (this.id != USER.id) {
            console.error("Invalid user");
            return;
        }

        this.dispatch("updateCustomSetting", {
            key: key,
            value: value,
            origin: "save",
        });

        let request = {
            customSettingsKey: key,
            customSettingsValue: value,
        };

        if (!this.timeouts) {
            this.timeouts = new Map();
        }
        if (this.timeouts.has(key)) {
            clearTimeout(this.timeouts.get(key));
        }
        this.timeouts.set(key, setTimeout(() => {
            Ajax.postJSON("/accounts/profile_changed/", request).then(() => {}, () => {});
        }));
    }

    applyEvent(event) {
        if (event.type === "setCustomSetting") {
            console.log("Updated custom settings: ", event);
            this.setCustomSetting(event["data"].key, event["data"].value);
        } else {
            super.applyEvent(event);
        }
    }

    getCodeFontSize() {
        return this.getParsedCustomSetting("workspace:codeFontSize", 14);
    }

    getFileFontSize() {
        return this.getParsedCustomSetting("workspace:fileFontSize", 14);
    }

    getTabSize() {
        return this.getParsedCustomSetting("workspace:tabSize", 4);
    }

    getShowLineNumber() {
        return this.getParsedCustomSetting("workspace:showLineNumber", true);
    }

    getShowPrintMargin() {
        return this.getParsedCustomSetting("workspace:showPrintMargin", false);
    }

    getPrintMarginSize() {
        return this.getParsedCustomSetting("workspace:printMarginSize", 80);
    }

    getBasicAutocompletionStatus() {
        return this.getParsedCustomSetting("workspace:enableBasicAutocompletion", true);
    }

    getLiveAutocompletionStatus() {
        return this.getParsedCustomSetting("workspace:enableLiveAutocompletion", true);
    }

    getSnippetsStatus() {
        return this.getParsedCustomSetting("workspace:enableSnippets", false);
    }

    getShowTagsInArchive(archiveId) {
        return this.getParsedCustomSetting("archive:showTags-" + archiveId, false);
    }
}

class UserStoreClass extends GenericObjectStore {
    constructor() {
        super("user", User);
    }

    getCurrentUser() {
        return USER;
    }
}

export const UserStore = new UserStoreClass();

class PublicUser extends StoreObject {
    getDisplayHandle() {
        let name;
        if (this.displayName) {
            name = this.name || this.username;
        } else {
            name = this.username || this.name;
        }
        return name || ("user-" + this.id);
    }

    getProfileUrl() {
        if (this.username) {
            return "/user/" + this.username;
        } else {
            return "/userid/" + this.id;
        }
    }

    getRating() {
        return this.rating;
    }

    getCountry() {
        return CountryStore.get(this.countryId);
    }
}

class PublicUserStoreClass extends AjaxFetchMixin(GenericObjectStore) {
    constructor() {
        super("publicuser", PublicUser, {
            fetchTimeoutDuration: 20,
            maxFetchObjectCount: 512,
            fetchURL: "/accounts/public_user_profiles/",
        });
    }

    getCountries() {
        let countryIds = new Set();
        const users = this.all();
        for (let user of users) {
            if (user && user.countryId && !countryIds.has(user.countryId)) {
                countryIds.add(user.countryId);
            }
        }

        return CountryStore.getCountriesFromIds(countryIds);
    }
}

export const PublicUserStore = new PublicUserStoreClass();

window.USER = Object.assign({
    id: 0,
    customSettings: {}
}, window.USER || {});

window.USER = UserStore.create(window.USER);

class UserNotification extends StoreObject {
    getUser() {
        return UserStore.get(this.userId);
    }

    isRead() {
        return (this.id <= this.getUser().lastReadNotificationId);
    }
}

export const UserNotificationStore = new GenericObjectStore("UserNotification", UserNotification, {
    dependencies: ["user"]
});