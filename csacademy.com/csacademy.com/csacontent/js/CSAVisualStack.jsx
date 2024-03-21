import {SVG} from "../../stemjs/src/ui/svg/SVGBase.js";
import {VisualListElement, VisualList} from "./CSAVisualList.jsx";


export class VisualStack extends VisualList {
    getDefaultOptions() {
        return {
            orientation: "up",
            batchSpacing: 12,
            box: {
                x: 0,
                y: 0,
                width: 400,
                height: 400
            },
            elementOptions: Object.assign(VisualListElement.prototype.getDefaultOptions(), {
                lineLength: 0,
                cellHeight: 25,
                cellWidth: 40,
                fontSize: 15
            })
        };
    }

    getPopupPosition(deltaX=0, deltaY=0) {
        let cellCoords = this.getCellCoords(this.elements.length - 1);
        return {
            x: cellCoords.x + deltaX,
            y: cellCoords.y + deltaY
        };
    }

    pushTransition(label, maxDuration, dependsOn=[], startTime=0, inMovie=true) {
        return this.insertTransition(
            this.elements.length, label, maxDuration, dependsOn, startTime, inMovie);
    }


    popTransition(maxDuration, dependsOn=[], startTime=0, inMovie=true) {
        return this.deleteTransition(this.elements.length - 1, maxDuration, dependsOn, startTime, inMovie);
    }
}
