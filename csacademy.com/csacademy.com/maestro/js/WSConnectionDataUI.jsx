import {UI} from "../../stemjs/src/ui/UIBase.js";
import {CollapsiblePanel} from "../../stemjs/src/ui/collapsible/CollapsiblePanel.jsx";
import {GlobalState} from "../../stemjs/src/state/State.js";

import {WSConnectionDataStore} from "./state/WSConnectionDataStore.js";


export class WSConnectionDataUI extends UI.Element {
    render() {
        return [
            <CollapsiblePanel ref="connectionsPanel" collapsed
                                 title={"Websocket connections: " + WSConnectionDataStore.all().length} />
        ];
    }

    onMount() {
        GlobalState.registerStream("meta_ws_data");
    }
}
