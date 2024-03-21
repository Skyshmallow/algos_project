import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {Panel} from "../../../stemjs/src/ui/UIPrimitives.jsx";
import {ContestTaskPanel} from "../../../contest/js/ContestTaskPanel.jsx";

class PreviewPanel extends Panel {
    extraNodeAttributes(attr) {
        attr.setStyle({
            textAlign: "center",
            paddingTop: "10px",
        });
    }

    getTitle() {
        return "Preview";
    }

    render() {
        return <ContestTaskPanel style={{textAlign: "initial"}} enableSubrouter={false}
                                 contestTaskId={this.options.evalTask.defaultContestTaskId} />;
    }

    onMount() {
        super.onMount();
        this.addListener("show", () => {
            this.redraw();
        });
    }
}

export {PreviewPanel};
