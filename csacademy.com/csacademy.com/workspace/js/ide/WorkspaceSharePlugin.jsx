// import {UI, Button, Size, Direction, Link} from "UI";
import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {Button} from "../../../stemjs/src/ui/button/Button.jsx";
import {Link} from "../../../stemjs/src/ui/primitives/Link.jsx";
import {Size, Direction} from "../../../stemjs/src/ui/Constants.js";
import {FAIcon} from "../../../stemjs/src/ui/FontAwesome.jsx";
import {Ajax} from "../../../stemjs/src/base/Ajax.js";
import {CustomRunStore} from "../../../eval/js/state/CustomRunStore.js";
import {BasePopup} from "../../../establishment/content/js/Popup.jsx";

import {WorkspacePlugin} from "./WorkspacePlugin.js";


class WorkspaceSharePlugin extends WorkspacePlugin {
    static priorityIndex = 300;

    constructor(workspaceIDE) {
        super(workspaceIDE);

        this.workspace = workspaceIDE.workspace;

        this.workspaceIDE.optionButtonsTopLeft.insertChild(
                <Button ref={this.refLink("shareButton")} icon="share-square-o" HTMLtitle="Click to share the code"
                        className={this.workspaceIDE.styleSheet.menuButton} label={UI.T("Share")} />
        , 0);
        this.workspaceIDE.codeEditor.file.addListener("userChanged", () => {
            this.customRun = undefined;
            this.popup && this.popup.hide();
            delete this.popup;
        });
        this.workspaceIDE.addListener("compileStarted", () => {
            this.popup && this.popup.hide();
            delete this.popup;
        });
        this.workspaceIDE.addListener("customRunFinished", (event) => {
            if (event.objectType !== "customrun") {
                return;
            }
            this.customRun = CustomRunStore.get(event.objectId);
            this.popup && this.popup.hide();
            delete this.popup;
        });

        this.shareButton.addClickListener((event) => {
            event.stopPropagation();
            this.togglePopup();
        });
    };

    static pluginName() {
        return "Share";
    }

    getPopupContent() {
        let buildContent = () => {
            return [
                <Link ref={this.refLink("popupUrl")} newTab
                      href={this.customRun.buildPublicUrl()}
                      value={this.customRun.buildPublicUrl()} />,
                <Button ref={this.refLink("copyUrlButton")} size={Size.SMALL} onClick={() => this.copyUrl()}
                        style={{marginLeft: "5px"}} icon="files-o" label={UI.T("Copy")}/>,
            ];
        };
        const updatePopup = () => {
            this.popup.setContent(buildContent());
            this.popup.bindInsideParent();
        };
        if (!this.customRun) {
            this.createCustomRun(updatePopup);
            return <FAIcon icon="spinner fa-spin" />;
        }
        if (this.customRun && !this.customRun.isPublic) {
            this.customRun.setPublic(updatePopup);
            return <FAIcon icon="spinner fa-spin" />;
        }

        return buildContent();
    }

    createCustomRun(callback) {
        const workspaceFile = this.workspaceIDE.codeEditor.getFile();

        let request = this.workspace.getBaseRequest();

        request.sourceCode = workspaceFile.getValue();
        //TODO: this should be rename to languageId
        request.programmingLanguageId = this.workspaceIDE.getPlugin("FileManager").getSelectedProgrammingLanguage().id;

        Ajax.postJSON("/eval/create_share_custom_run/", request).then(
            (data) => {
                this.customRun = CustomRunStore.get(data.customRunId);
                callback();
            }
        );
    }

    copyUrl() {
        window.getSelection().removeAllRanges();
        let range = document.createRange();
        range.selectNode(this.popupUrl.node);
        window.getSelection().addRange(range);
        let successful;
        try {
            // https://developers.google.com/web/updates/2015/04/cut-and-copy-commands?hl=en
            // Now that we've selected the anchor text, execute the copy command
            successful = document.execCommand('copy');
            let msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copy command was ' + msg);
        } catch(err) {
            successful = false;
            console.log('Oops, unable to copy');
        }
        if (!successful) {
            this.copyUrlButton.hide();
            this.popup.bindInsideParent();
        }
        window.getSelection().removeAllRanges();
    }

    togglePopup() {
        if (this.popup && this.popup.isInDocument()) {
            this.popup.hide();
            delete this.popup;
            return;
        }
        this.popup = BasePopup.create(document.body, {
            target: this.shareButton,
            children: this.getPopupContent(),
            arrowDirection: Direction.UP,
            bodyPlaced: true,
        });
    }
}

export {WorkspaceSharePlugin};
