import {UI} from "../../stemjs/src/ui/UIBase.js";
import {ScriptDelayedElement} from "../../stemjs/src/ui/DelayedElement.js";
import {StateDependentElement} from "../../stemjs/src/ui/StateDependentElement.jsx";

class Donate extends ScriptDelayedElement(UI.Element) {
    renderLoaded() {
        return <div style={{paddingTop:48}} ref="blinkDonatePageContainer">
            <div ref="blinkDonatePage">
            </div>
        </div>;
    }

    renderNotLoaded() {
        return [StateDependentElement.renderLoading(), this.renderLoaded()];
    }

    setLoaded() {
        blink.createPanel(this.blinkDonatePage.node, blinkSDK.PANEL_TYPE.donationPage, {}, {
            onMount: () => super.setLoaded(),
        });
    }
}

export {Donate};
