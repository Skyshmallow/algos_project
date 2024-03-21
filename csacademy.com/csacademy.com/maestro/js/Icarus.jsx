import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Panel} from "../../stemjs/src/ui/UIPrimitives.jsx";
import {TabArea} from "../../stemjs/src/ui/tabs/TabArea.jsx";

import {MachineInstanceWidget} from "./MachineInstanceWidget";
import {WebsiteLoggingWidget} from "./WebsiteLoggingWidget";
import {MachineLoggingWidget} from "./MachineLoggingWidget";
import {PerformanceMetricsPanel} from "./PerformanceMetricsPanel";

export class Icarus extends Panel {
    extraNodeAttributes(attr) {
        attr.setStyle("margin", "20px 10%");
    }

    getUrlPrefix(urlPart) {
        let url = "/manage/icarus/";
        if (urlPart) {
            url += urlPart + "/";
        }
        return url;
    }

    render() {
        return [
            <TabArea ref="tabArea" variableHeightPanels >
                <MachineInstanceWidget ref="machineInstanceWidget" tabHref={this.getUrlPrefix("machines")} title="Machines" active />
                <MachineLoggingWidget ref="machineLoggingWidget" tabHref={this.getUrlPrefix("machine-logging")} title="Machines Logging" />
                <WebsiteLoggingWidget ref="websiteLoggingWidget" tabHref={this.getUrlPrefix("website-logging")} title="Website Logging" />
                <PerformanceMetricsPanel tabHref={this.getUrlPrefix("performance-metrics")} title="Performance metrics" />
            </TabArea>
        ];
    }
    
    setURL(urlParts) {
        if (!this.tabArea) {
            this.initialUrlParts = urlParts;
        } else {
            this.showUrlTab(urlParts[0] || "machines");
        }
    }

    onMount() {
        super.onMount();
        
        this.setURL(this.initialUrlParts);
        delete this.initialUrlParts;
    }

    showUrlTab(urlPart) {
        if (urlPart === "machines") {
            this.machineInstanceWidget.dispatch("show");
        } else if (urlPart === "machine-logging") {
            this.machineLoggingWidget.dispatch("show");
        } else if (urlPart === "website-logging") {
            this.websiteLoggingWidget.dispatch("show");
        } else if (urlPart === "general-control-panel") {
            this.generalControlPanelWidget.dispatch("show");
        }
    }
}
