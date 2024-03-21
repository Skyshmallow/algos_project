import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {Direction} from "../../../stemjs/src/ui/Constants.js";
import {BasePopup} from "../../../establishment/content/js/Popup.jsx";
import {Formatter} from "../../../csabase/js/util.js";


class InQueuePopupManagerClass {
    static DELAY_BEFORE_POPUP = 1000;
    static POPUP_HANGTIME = 4000;

    static getTextForDuration(estimatedWait) {
        const formattedDuration = Formatter.duration(estimatedWait * 1000, {
            hours: true,
            minutes: true,
            seconds: true,
            lastSeparator: " and "
        });
        return "Your submission was received. The estimated queue time is " + formattedDuration + ".";
    }

    showPopup(target, estimatedWait) {
        this.popup = BasePopup.create(document.body, {
            target: target,
            bodyPlaced: true,
            children: this.constructor.getTextForDuration(estimatedWait),
            arrowDirection: Direction.DOWN,
            style: {
                width: "200px",
            }
        });
        const destroyPopupTimerId = setTimeout(() => {
            this.cancelInQueuePopup();
        }, this.constructor.POPUP_HANGTIME);
        this.popup.addCleanupJob(() => clearTimeout(destroyPopupTimerId));
    }

    scheduleInQueuePopup(target, estimatedWait, callback) {
        this.cancelInQueuePopup();
        this.inQueuePopupTimeout = setTimeout(() => {
            this.showPopup(target, estimatedWait);
            if (callback) {
                callback();
            }
        }, this.constructor.DELAY_BEFORE_POPUP);
    }

    cancelInQueuePopup() {
        if (this.inQueuePopupTimeout) {
            clearTimeout(this.inQueuePopupTimeout);
            delete this.inQueuePopupTimeout;
        }
        if (this.popup) {
            this.popup.destroyNode();
            delete this.popup;
        }
    }
}

export const InQueuePopupManager = new InQueuePopupManagerClass();
