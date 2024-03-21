import {StyleSheet} from "../../stemjs/src/ui/Style.js";
import {styleRule} from "../../stemjs/src/ui/Style.js";

// TODO WTF why is this called this?
export class DropdownListStyle extends StyleSheet {
    @styleRule
    default = {
        ">*" : {
            padding: "7px",
            cursor: "pointer",
            backgroundColor: "#eeeeee",
            width: "100%",
            ":hover": {
                backgroundColor: "#dddddd",
            }
        }
    };
}
