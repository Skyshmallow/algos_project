import {UI} from "../../stemjs/src/ui/UIBase.js";

import {WSUserDataUI} from "./WSUserDataUI";
import {WSConnectionDataUI} from "./WSConnectionDataUI";
import {WSStreamDataUI} from "./WSStreamDataUI";


export class UserStats extends UI.Element {
    extraNodeAttributes(attr) {
        attr.setStyle("margin", "20px 10%");
    }

    render() {
        return [
            <WSUserDataUI ref="wsUserDataUI"/>,
            <WSConnectionDataUI ref="wsConnectionDataUI"/>,
            <WSStreamDataUI ref="wsStreamDataUI"/>
        ];
    }
}
