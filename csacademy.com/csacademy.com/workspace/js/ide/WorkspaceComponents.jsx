import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {registerStyle} from "../../../stemjs/src/ui/style/Theme.js";
import {TabArea} from "../../../stemjs/src/ui/tabs/TabArea.jsx";
import {SectionDivider} from "../../../stemjs/src/ui/section-divider/SectionDivider.jsx";
import {Label} from "../../../stemjs/src/ui/SimpleElements.jsx";
import {DividerBar} from "../../../stemjs/src/ui/section-divider/SectionDivider.jsx";
import {HorizontalOverflow} from "../../../stemjs/src/ui/horizontal-overflow/HorizontalOverflow.jsx";
import {CleanupJobs} from "../../../stemjs/src/base/Dispatcher.js";
import {WorkspaceTabAreaStyle, WorkspaceSectionDividerStyle, WorkspaceHorizontalOverflowStyle} from "./WorkspaceStyle.js";


export class FileSavingLabel extends Label {
    constructor(options) {
        super(options);
        this.fileUnsavedListener = () => {
            this.updateLabel();
        };

        this.fileSavingListener = () => {
            this.updateLabel();
        };

        this.fileSavedListener = () => {
            this.updateLabel();
            setTimeout(() => {
                if (this.file.isSaved()) {
                    this.hide();
                }
            }, 1500);
        };
    }

    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        if (!this.file) {
            attr.addClass("hidden");
        }
    }

    updateLabel() {
        this.show();
        if (this.file.isSaved()) {
            this.setLabel(UI.T("Saved"));
        } else {
            if (this.file.isSavedInBrowser()) {
                this.setLabel(UI.T("Saved locally"));
                return;
            }
            if (this.file.isSaving) {
                this.setLabel(UI.T("Saving..."));
            } else {
                this.setLabel(UI.T("Unsaved changes"));
            }
        }
    }

    setFile(file) {
        if (this.fileListeners) {
            this.fileListeners.cleanup();
        }
        this.file = file;
        this.updateLabel();
        if (this.file.isSaved) {
            this.hide();
        }
        this.fileListeners = new CleanupJobs([
            this.file.addListener("unsaved", this.fileUnsavedListener),
            this.file.addListener("saving", this.fileSavingListener),
            this.file.addListener("saved", this.fileSavedListener),
        ]);

    }
}


@registerStyle(WorkspaceTabAreaStyle)
export class WorkspaceTabArea extends TabArea {
    getSwitcher(tabPanels) {
        let switcher = super.getSwitcher(tabPanels);
        switcher.addClass(this.styleSheet.workspaceTab);
        return switcher;
    }

    getTitleArea(tabTitles) {
        return <HorizontalOverflow ref="titleArea" className={this.styleSheet.nav}
                                   styleSheet={WorkspaceHorizontalOverflowStyle}>
            {tabTitles}
        </HorizontalOverflow>;
    }
}


@registerStyle(WorkspaceSectionDividerStyle)
class WorkspaceDividerBar extends DividerBar {}


@registerStyle(WorkspaceSectionDividerStyle)
export class WorkspaceSectionDivider extends SectionDivider {
    getDefaultOptions() {
        return Object.assign({}, super.getDefaultOptions(), {
            autoCollapse: true,
        })
    }

    getDividerBarClass() {
        return WorkspaceDividerBar;
    }

    isCollapsed(child) {
        return child.collapsed;
    }

    animateAceResize() {
        const dispatchResize = () => {
            this.panels[0].dispatch("resize");
            this.animationId = requestAnimationFrame(dispatchResize)
        };
        this.animationId = requestAnimationFrame(dispatchResize);
    }

    cancelAceResizeAnimation() {
        cancelAnimationFrame(this.animationId);
        delete this.animationId;
    }

    collapseChild(index) {
        if (index === 0) {
            return;
        }

        if (this.clearListeners) {
            this.clearListeners();
        }

        const topPanel = this.panels[0];
        const bottomPanel = this.panels[1];

        this.addClass(this.styleSheet.animatedSectionDivider);
        this.dividers[0].hide();
        this.setDimension(topPanel, "100%");
        this.setDimension(bottomPanel, 0);

        this.animateAceResize();

        setTimeout(() => {
            this.removeClass(this.styleSheet.animatedSectionDivider);
            this.cancelAceResizeAnimation();
            bottomPanel.collapsed = true;
        }, this.styleSheet.transitionTime * 1000);

        this.dispatch("collapse");
    }

    expandChild(index) {
        if (index === 0) {
            return;
        }
        const topPanel = this.panels[0];
        const bottomPanel = this.panels[1];

        this.addClass(this.styleSheet.animatedSectionDivider);
        this.setDimension(bottomPanel, "30%");
        this.setDimension(topPanel, "70%");

        this.animateAceResize();

        setTimeout(() => {
            this.removeClass(this.styleSheet.animatedSectionDivider);
            this.cancelAceResizeAnimation();
            this.dividers[0].show();
            bottomPanel.collapsed = false;
        }, this.styleSheet.transitionTime * 1000);
    }
};