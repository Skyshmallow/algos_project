import {
    Theme
} from "../../stemjs/src/ui/style/Theme.js";
import {
    UserStore
} from "../../csaaccounts/js/state/UserStore.js";

const DEFAULT_THEME = {
    COLOR_PRIMARY: "#202e3e",
    FONT_MONOSPACE: "'Source Code Pro', 'Monaco', 'Consolas', monospace",
    FONT_FAMILY_DEFAULT: "Lato, 'Segoe UI', 'Lucida Sans Unicode', 'Helvetica Neue', Helvetica, Arial, sans-serif",

    CSA_PLAYER_COLOR_FOCUSED: "#9bc",
    CSA_PLAYER_COLOR_UNFOCUSED: "#555",

    CARD_PANEL_TEXT_TRANSFORM: "initial",

    CONTEST_QUESTION_CARD_PANEL_WIDTH: 450,
    CONTEST_QUESTION_CARD_PANEL_MIN_WIDTH: 350,
    CONTEST_QUESTION_CARD_PANEL_PADDING: 10,
    CONTEST_QUESTION_CARD_PANEL_BODY_PADDING: 15,
    CONTEST_QUESTION_CARD_PANEL_LINE_HEIGHT: 18,

    CONTEST_QUESTION_CONTAINER: 920,
    MAIN_CONTAINER_EXTRA_PADDING_TOP_DESKTOP: 10,
    MAIN_CONTAINER_EXTRA_PADDING_TOP_MOBILE: 25,
    MAIN_CONTAINER_EXTRA_PADDING_BOTTOM_DESKTOP: 0,
    MAIN_CONTAINER_EXTRA_PADDING_BOTTOM_MOBILE: 0,

    NAV_MANAGER_BOX_SHADOW_NAVBAR: "0px 1px 0px rgb(0, 0, 0)",

    COLOR_COMPILE: "#3DB7C6",
    COLOR_RUN: "#3D7FC6",
    COLOR_SUBMIT: "#CC4949",
    COLOR_WORKSPACE: "#34435b",
}

Object.assign(DEFAULT_THEME, self.THEME_PROPS);

Theme.setProperties(DEFAULT_THEME);


const predefinedThemes = {
    "1": {
        COLOR_SECONDARY: "#358ba4",
        COLOR_BACKGROUND_BODY: "#f8f8f8",
        COLOR_BACKGROUND_ALTERNATIVE: "#eee",
    },
    "2": {
        COLOR_PRIMARY: "#202",
        COLOR_SECONDARY: "#358ba4",
        COLOR_BACKGROUND_BODY: "#493349",
        COLOR_BACKGROUND_ALTERNATIVE: "#392339",
        FONT_FAMILY_DEFAULT: "Lato, 'Segoe UI', 'Lucida Sans Unicode', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    },
    "3": {
        COLOR_PRIMARY: "#000",
        COLOR_SECONDARY: "#070",
        COLOR_BACKGROUND_BODY: "#222",
        COLOR_BACKGROUND_ALTERNATIVE: "#392339",
        FONT_FAMILY_DEFAULT: "monospace",
    },
    "custom": {
        // leave this empty
    }
};


export const defaultThemeProperties = Object.assign({}, Theme.Global.properties);

export function setUserThemeProperties() {
    let userThemeProperties = Object.assign({}, UserStore.getCurrentUser().getCustomSetting("theme", {}));
    let userThemeId = UserStore.getCurrentUser().getCustomSetting("themeId");

    if (!userThemeId) {
        return;
    }

    if (userThemeId === "custom") {
        for (let key in userThemeProperties) {
            let value = userThemeProperties[key];
            if (value === "null" || value === null) {
                value = defaultThemeProperties[key];
            }

            Theme.setProperties({
                [key]: value,
            });
        }
        return;
    }

    Theme.setProperties(predefinedThemes[userThemeId]);
}

export function attachProfileThemeListeners() {
    if (USER.isAuthenticated) {
        setUserThemeProperties();
        UserStore.getCurrentUser().addListener("updateCustomSetting", (event) => {
            if (event.key.startsWith("theme:") && event.origin === "set" || (event.key === "themeId")) {
                setUserThemeProperties();
            }
        });
    }
}