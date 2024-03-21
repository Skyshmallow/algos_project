import {UI} from "../../stemjs/src/ui/UIBase.js";
import {CardPanel} from "../../stemjs/src/ui/CardPanel.jsx";
import {Level} from "../../stemjs/src/ui/Constants.js";


export class AnalyticsPanel extends UI.Element {
    render() {
        return <CardPanel title="Analytics Panel" level={Level.PRIMARY} style={{margin:"10px 30%"}}>
            <div style={{padding: "5px"}}>Analytics is not online right now!</div>
        </CardPanel>;
    }
}
