document.STEM_DEBUG = true;

import {
    GlobalState
} from "../../../stemjs/src/state/State";
import {
    SingletonStore
} from "../../../stemjs/src/state/Store";
import {
    Language
} from "../../../establishment/localization/js/state/LanguageStore";
import {
    setLanguageStore
} from "../../../stemjs/src/ui/Translation";
import "../../../establishment/localization/js/state/TranslationStore";
import {
    WebsocketSubscriber
} from "../../../stemjs/src/websocket/client/WebsocketSubscriber.js";

// Just make sure to have these stores loaded
import {
    UserStore
} from "../../../csaaccounts/js/state/UserStore";
import {
    TagStore
} from "../../../establishment/content/js/state/TagStore";
import {
    ProgrammingLanguage
} from "./ProgrammingLanguageStore.js";
import {
    TermDefinition
} from "./TermDefinitionStore.js";
import {
    AceTheme
} from "./AceStore.js";
import {
    Difficulty
} from "./DifficultyStore.js";
import {
    ContestScoring
} from "../../../contest/js/state/ContestScoringStore.js";
import {
    SocialApp
} from "../../../establishment/socialaccount/js/state/SocialAppStore.js";

let startTime = performance.now();


// GlobalState initialization
GlobalState.applyEventWrapper = (...args) => GlobalState.applyEvent(...args);

GlobalState.registerStream = function(streamName) {
    WebsocketSubscriber.addListener(streamName, GlobalState.applyEventWrapper);
};

GlobalState.importState(self.PUBLIC_STATE); // Set from PublicState.js

//Register on the global event stream
GlobalState.registerStream("global-events");
if (USER.id) {
    //Register on the user event stream
    GlobalState.registerStream("user-" + USER.id + "-events");
}

// CSASettings initialization
class CSASettingsClass extends SingletonStore {
    constructor() {
        super("CSASettings");
    }
}
const CSASettings = new CSASettingsClass();

// Load ISO 3 language codes
Object.assign(Language, {
    ENGLISH: Language.getLanguageForCode("eng"),
    ROMANIAN: Language.getLanguageForCode("ro") || Language.getLanguageForCode("rom"),
    BULGARIAN: Language.getLanguageForCode("bg"),
    UKRAINIAN: Language.getLanguageForCode("ukr") || Language.getLanguageForCode("uk"),
    RUSSIAN: Language.getLanguageForCode("rus"),
    MANDARIN: Language.getLanguageForCode("cmn"),
    JAPANESE: Language.getLanguageForCode("jpn"),
    ARABIC: Language.getLanguageForCode("ara"),
    SPANISH: Language.getLanguageForCode("spa"),
    FRENCH: Language.getLanguageForCode("fra"),
    GERMAN: Language.getLanguageForCode("deu"),
    ITALIAN: Language.getLanguageForCode("it"),
    POLISH: Language.getLanguageForCode("pol"),
    DUTCH: Language.getLanguageForCode("nld"),
    HUNGARIAN: Language.getLanguageForCode("hu"),
});
Language.setLocale(Language.get(USER.localeLanguageId) || Language.ENGLISH);
setLanguageStore(Language);

console.log("CSAState took", (performance.now() - startTime).toFixed(2), "ms at", performance.now().toFixed(2), "ms.");