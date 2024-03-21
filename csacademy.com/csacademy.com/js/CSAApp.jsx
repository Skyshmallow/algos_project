import "./state/CSAState.js"; // For dependency ordering
import "./CSAMarkup.js";
import "./CSAChatMarkup.jsx";

import {UI} from "../../stemjs/src/ui/UIBase.js";
import {ViewportMeta} from "../../stemjs/src/ui/ViewportMeta.jsx";
import {Theme} from "../../stemjs/src/ui/style/Theme.js";
import {Router} from "../../stemjs/src/ui/Router.jsx";
import {Button} from "../../stemjs/src/ui/button/Button.jsx";
import {Level} from "../../stemjs/src/ui/Constants.js";
import {GlobalContainer} from "../../stemjs/src/ui/global-container/GlobalContainer";
import {TabArea, MinimalistTabAreaStyle} from "../../stemjs/src/ui/tabs/TabArea";
import {CodeEditor} from "../../stemjs/src/ui/CodeEditor";
import {SVG} from "../../stemjs/src/ui/svg/SVGBase";
import {BasePopup} from "../../establishment/content/js/Popup.jsx";
import {deepCopy} from "../../stemjs/src/base/Utils.js";
import {ensure} from "../../stemjs/src/base/Require.js";
import {CSANavManager} from "./CSANavManager";
import {ROUTES} from "./CSARoutes.js";
import {Dispatcher} from "../../stemjs/src/base/Dispatcher.js";
import {ServerTime} from "../../stemjs/src/time/Time.js";
import {ArticleEditor} from "../../establishment/content/js/ArticleEditor.jsx";
import {DelayedDiffWidget} from "../../workspace/js/DiffWidget.jsx";
import {PageTitleManager} from "../../stemjs/src/base/PageTitleManager.js";
import {StateDependentElement} from "../../stemjs/src/ui/StateDependentElement.jsx";
import {CSALogo, CSALoadingLogo} from "./CSALogo.jsx";
import {UserMentionPlugin} from "../../csacontent/js/UserMentionPlugin.jsx";
import {EnterToSendPlugin} from "../../csacontent/js/EnterToSendPlugin.js";
import {ChatWidget} from "../../establishment/chat/js/ChatWidget.jsx";
import {CommentWidget} from "../../establishment/chat/js/CommentWidget.jsx";
import {EstablishmentApp} from "../../establishment/webapp/js/EstablishmentApp.js";
import {GlobalStyleSheet} from "../../establishment/webapp/js/GlobalStyleSheet.js";
import {BlockCodeModifier as MarkupBlockCodeModifier} from "../../stemjs/src/markup/MarkupParser.js";
import {jQueryCompatibilityPreprocessor} from "../../stemjs/src/base/Fetch.js";
import {Ajax} from "../../stemjs/src/base/Ajax";
import {logout} from "../../establishment/accounts/js/Logout";
import {GlobalState} from "../../stemjs/src/state/State";
import {attachProfileThemeListeners} from "./CSATheme.js";


// TODO Shit to not break old code
Array.prototype.last = function () {
    return this[this.length - 1];
}

attachProfileThemeListeners();

PageTitleManager.setDefaultTitle("CS Academy");

ServerTime.setPageLoadTime(window.SERVER_PAGE_LOAD);

Ajax.addPreprocessor(jQueryCompatibilityPreprocessor);

EstablishmentApp.addAjaxProcessors();

GlobalStyleSheet.initialize();

Theme.register(TabArea, MinimalistTabAreaStyle);

ArticleEditor.DiffWidgetClass = DelayedDiffWidget;

CodeEditor.requireAce = function(callback) {
    return ensure("/static/ext/ace/ace.js", () => {
        CodeEditor.AceRange = window.ace.require("ace/range").Range;
        callback && callback();
    });
};

MarkupBlockCodeModifier.prototype.getElement = (content) => {
    return {
        tag: "CodeSnippet",
        value: content,
    }
};

StateDependentElement.renderLoading = () => {
    return <div style={{textAlign: "center"}}>
        <CSALoadingLogo size={250} style={{marginTop: "100px"}}/>
    </div>;
};

StateDependentElement.renderError = (error) => {
    const ieeeErrorString = "Please login with the user provided for you in the official email";

    let extraElements = [];
    if (error.message.indexOf(ieeeErrorString) >= 0 && USER.isAuthenticated) {
        extraElements.push(<Button level={Level.PRIMARY} label="Log out" onClick={logout}/>);
    }

    return <div style={{textAlign: "center"}}>
                <CSALogo size={250} style={{marginTop: "100px"}}/>
                <h3>Error: {error.message}</h3>
        {extraElements}
    </div>;
};

ChatWidget.defaultPlugins = [EnterToSendPlugin, UserMentionPlugin];
CommentWidget.defaultPlugins = [UserMentionPlugin];

// TODO: get rid of this!
const oldSetOptions = SVG.Element.prototype.setOptions;
SVG.Element.prototype.setOptions = function (options) {
    if (typeof this.getDefaultOptions === "function") {
        let defaultOptions = this.getDefaultOptions(options) || {};
        // TODO: consider this deep copy, seems really shady!
        const goodRef = options.ref;
        options = deepCopy({}, defaultOptions, options);
        if (goodRef) {
            options.ref = goodRef;
        }
    }
    oldSetOptions.call(this, options);
};

// Require ace, to be sure we have it if needed
setTimeout(() => CodeEditor.requireAce(() => {}), 250);

// TODO: extend Establishment app
export class CSAApp extends UI.Element {
    render() {
        return [
            <CSANavManager ref="navManager"/>,
            <GlobalContainer>
                <Router routes={ROUTES} ref="router" style={{height: "100%"}}/>
            </GlobalContainer>
        ];
    }

    onMount() {
        Dispatcher.Global.addListener("externalURLChange", () => {
            if (this.navManager.leftSidePanel.visible) {
                this.navManager.toggleLeftSidePanel();
            }
        });
        this.router.addListener("change", () => {
            document.body.click();
            Dispatcher.Global.dispatch("closeAllModals");
            BasePopup.clearBodyPopups();
        });
        this.navManager.initGlobalRouterListener();
        Dispatcher.Global.dispatch("initNavManagerDone");

        this.addClickListener(() => BasePopup.clearBodyPopups());
    }
}

export const viewportMeta = ViewportMeta.create(document.head, {minDeviceWidth: 450});

window.UI = UI;
window.GlobalState = GlobalState;
window.Theme = Theme;
