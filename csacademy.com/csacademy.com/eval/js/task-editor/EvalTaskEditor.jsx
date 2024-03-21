import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {MinimalistTabAreaStyle} from "../../../stemjs/src/ui/tabs/Style.js";
import {styleRule, styleRuleInherit} from "../../../stemjs/src/decorators/Style.js";
import {GlobalState} from "../../../stemjs/src/state/State.js";
import {Router} from "../../../stemjs/src/ui/Router.jsx";
import {GlobalStyle} from "../../../stemjs/src/ui/GlobalStyle.js";
import {registerStyle} from "../../../stemjs/src/ui/style/Theme.js";
import {TabArea} from "../../../stemjs/src/ui/tabs/TabArea.jsx";
import {EvalTaskStore} from "../state/EvalTaskStore.js";
import {GeneralPanel} from "./GeneralPanel.jsx";
import {StatementPanel} from "./StatementPanel.jsx";
import {EditTestsPanel} from "./tests/EditTestsPanel.jsx";
import {TestersPanel} from "./TestersPanel.jsx";
import {EditorialPanel} from "./EditorialPanel.jsx";
import {TemplatesPanel} from "./TemplatesPanel.jsx";
import {LimitsPanel} from "./LimitsPanel.jsx";
import {SubmissionsPanel} from "./submissions/SubmissionsPanel.jsx";
import {PreviewPanel} from "./PreviewPanel.jsx";
import {TaskChecklistPanel} from "./TaskChecklistPanel.js";
import {TaskFileUploadPanel} from "./TaskFileUploadPanel.jsx";


class EvalTaskEditorTabAreaStyle extends MinimalistTabAreaStyle {
    @styleRule
    activeTab = {
        color: "rgba(51,122,183,1)",
        borderTop: "1px solid rgba(51,122,183,1) !important",
        borderLeft: "1px solid rgba(51,122,183,1) !important",
        borderRight: "1px solid rgba(51,122,183,1) !important",
        borderTopLeftRadius: "7px",
        borderTopRightRadius: "7px",
        backgroundColor: "rgba(51, 122, 183, 0.15)"
    };

    @styleRuleInherit
    tab = {
        fontSize: "1.2em"
    }
}

@registerStyle(EvalTaskEditorTabAreaStyle)
class EvalTaskEditorTabArea extends TabArea {
    getTitleArea(tabTitles) {
        for (let tabTitle of tabTitles) {
            tabTitle.options.style = {
                flex: 1,
                textAlign: "center"
            };
        }
        return <div ref="titleArea" className={this.styleSheet.nav}
                    style={{display: "flex", borderBottom: "1px solid rgba(51,122,183,1) !important"}}>
            {tabTitles}
        </div>;
    }
}

class EvalTaskEditor extends UI.Element {
    getLocations() {
        return [
            ["general", GeneralPanel],
            ["statement", StatementPanel],
            ["preview", PreviewPanel],
            ["tests", EditTestsPanel],
            ["editorial", EditorialPanel],
            ["limits", LimitsPanel],
            ["templates", TemplatesPanel],
            ["submissions", SubmissionsPanel],
            ["testers", TestersPanel],
            ["checklist", TaskChecklistPanel],
            ["file-upload", TaskFileUploadPanel],
        ];
    }

    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.setStyle({
            height: "100%",
            display: "flex",
            flexDirection: "column",
        });
        attr.addClass(GlobalStyle.Container.SMALL);
    }

    getEvalTask() {
        return EvalTaskStore.all().find(evalTask => evalTask.urlName === Router.parseURL()[1]);
    }

    getUrlPrefix(urlPart) {
        let url = "/task/" + this.getEvalTask().urlName + "/edit/";
        if (urlPart) {
            url += urlPart + "/";
        }
        return url;
    }

    render() {
        const evalTask = this.getEvalTask();

        const panels = this.getLocations().map(([location, PanelClass]) => <PanelClass
            evalTask={evalTask}
            ref={location + "Panel"}
            tabHref={this.getUrlPrefix(location)}
            style={{height: "100%"}}
        />);

        return [
            <h2>Task "{evalTask.longName}" (id={evalTask.id})</h2>,
            <EvalTaskEditorTabArea style={{flex: "1"}}>
                {panels}
            </EvalTaskEditorTabArea>
        ];
    }

    setURL(urlParts) {
        // check if it's not loaded
        if (!this.generalPanel) {
            this.initialUrlParts = urlParts;
            return;
        }
        const urlPart = urlParts[0] || "general";
        if (this[urlPart + "Panel"]) {
            this[urlPart + "Panel"].dispatch("show");
        } else {
            Router.changeURL(this.getUrlPrefix());
        }
    }

    onMount() {
        this.setURL(this.initialUrlParts);
        delete this.initialUrlParts;
        const evalTask = this.getEvalTask();
        GlobalState.registerStream("contest-" + evalTask.defaultContestId + "-scores");
        GlobalState.registerStream("contest-" + evalTask.defaultContestId + "-announcements");
        GlobalState.registerStream("contest-" + evalTask.defaultContestId + "-scoreevents");
    }
}

export {EvalTaskEditor};
