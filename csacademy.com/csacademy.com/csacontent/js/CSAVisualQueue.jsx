import {UI} from "../../stemjs/src/ui/UIBase.js";
import {VisualList} from "./CSAVisualList.jsx";


export class VisualQueue extends VisualList {
    pushTransition(label, maxDuration, dependsOn = [], startTime = 0, inMovie = true) {
        return this.insertTransition(this.elements.length, label, maxDuration, dependsOn, startTime, inMovie);
    }


    popTransition(maxDuration, dependsOn = [], startTime = 0, inMovie = true) {
        return this.deleteTransition(0, maxDuration, dependsOn, startTime, inMovie);
    }

    getPushQueuePosition(deltaX = 0, deltaY = 0) {
        let cellCoords = this.getCellCoords(this.elements.length - 1);
        return {
            x: cellCoords.x + deltaX,
            y: cellCoords.y + deltaY
        };
    }

    getPopQueuePosition(deltaX = 0, deltaY = 0) {
        let cellCoords = this.getCellCoords(0);
        return {
            x: cellCoords.x + deltaX,
            y: cellCoords.y + deltaY
        };
    }
}
