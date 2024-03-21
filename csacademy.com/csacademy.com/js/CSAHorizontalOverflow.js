import {
    UI
} from "../../stemjs/src/ui/UIBase.js";
import {
    HorizontalOverflow
} from "../../stemjs/src/ui/horizontal-overflow/HorizontalOverflow.jsx";
import {
    BasePopup
} from "../../establishment/content/js/Popup";


export class CSAHorizontalOverflow extends HorizontalOverflow {
    handleEventAndHandlePositionChange(...args) {
        super.handleEventAndHandlePositionChange(...args);
        BasePopup.clearBodyPopups();
    }
}