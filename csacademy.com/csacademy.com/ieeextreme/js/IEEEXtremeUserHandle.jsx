import {UserHandle} from "../../csaaccounts/js/UserHandle.jsx";
import {enhance} from "../../stemjs/src/ui/Color.js";

import {IEEE_PRIMARY_COLOR, IEEE_SECONDARY_COLOR} from "./Constants";


export class IEEEXtremeUserHandle extends UserHandle {
    getRatingColor() {
        const {contestTeam} = this.options;

        if (contestTeam.ieeeTeamType === 3) { // proctor
            return enhance(IEEE_SECONDARY_COLOR, 0.3);
        }
        return enhance(IEEE_PRIMARY_COLOR, 0.3);
    }
}
