import {UI} from "../../stemjs/src/ui/UIBase.js";
import {StateDependentElement} from "../../stemjs/src/ui/StateDependentElement.jsx";
import {ContestPanel} from "./ContestWidget.jsx";
import {ArchivePanel} from "./ArchiveWidget.jsx";


class DelayedArchiveOrContestPanel extends StateDependentElement(UI.Element) {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.setStyle({
            height: "100%",
        });
    }

    importState(data) {
        super.importState(data);
        if (data.contest) {
            this.contestId = data.contest.id;
        } else {
            this.archiveId = data.archive.id;
        }
    }

    renderLoaded() {
        if (this.options.error) {
            return this.renderError();
        }
        if (this.contestId) {
            return <ContestPanel contestId={this.contestId} ref="child"/>;
        }
        return <ArchivePanel archiveId={this.archiveId} ref="child"/>;
    }

    setURL(urlParts) {
        if (this.child) {
            this.child.setURL(urlParts);
        } else {
            this.urlParts = urlParts;
        }
    }

    dispatchUrlChange() {
        setTimeout(() => {
            if (!this.options.error) {
                this.child.setURL(this.urlParts);
            }
        });
    }

    onDelayedMount() {
        this.dispatchUrlChange();
        this.addListener("urlExit", () => {
            if (!this.options.error) {
                this.child.navHandler.reset();
            }
        });
        this.addListener("urlEnter", () => {
            // This works because the very first time the child is create, it makes sure to update the Navbar
            if (this.child && !this.options.error) {
                this.child.navHandler.apply();
            }
        });
    }
}

export {DelayedArchiveOrContestPanel};