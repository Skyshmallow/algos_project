import {UI} from "../../stemjs/src/ui/UIBase.js";
import {SVG} from "../../stemjs/src/ui/svg/SVGBase.js";
import {Transition, TransitionList} from "../../stemjs/src/ui/Transition.js";
import {deepCopy} from "../../stemjs/src/base/Utils.js";

import {VisualList} from "./CSAVisualList.jsx";


export class VisualArray extends VisualList {
    getDefaultOptions() {
        return deepCopy({}, super.getDefaultOptions(), {
            indexFontSize: 14,
            elementOptions: {
                lineLength: 0
            }
        })
    }

    render() {
        let result = super.render();
        this.indices = [];

        let fontSize = this.options.indexFontSize;
        let cellHeight = this.options.elementOptions.cellHeight;
        let cellWidth = this.options.elementOptions.cellWidth;
        let color = this.options.elementOptions.color;
        let strokeWidth = this.options.elementOptions.textStrokeWidth;

        for (let i = 0; i < this.options.labels.length; i += 1) {
            let cellCoords = this.getCellCoords(i);
            let x = cellCoords.x + cellWidth / 2;
            let y = cellCoords.y + cellHeight + fontSize;

            this.indices.push(<SVG.Text text={i} x={x} y={y}
                fill={color} stroke={color} strokeWidth={strokeWidth}
                fontSize={fontSize} textAnchor="middle" dy="0.35em"
            />);
        }

        return result.concat(this.indices);
    }

    decrementValueTransition(cellIndex, duration, dependsOn=[], inMovie=true, startTime=0) {
        let newValue = parseInt(this.elements[cellIndex].getLabel()) - 1;
        return this.changeValueTransition(cellIndex, newValue, "up", duration, dependsOn, startTime, inMovie);
    }

    getPopupPosition(index, deltaX=0, deltaY=0) {
        let position = this.elements[index].getCoords();
        return {
            x: position.x + deltaX,
            y: position.y + deltaY
        };
    }

    hideTransition(index, duration, dependsOn=[], startTime=0, inMovie=true) {
        let result = new TransitionList();
        result.dependsOn = dependsOn;
        result.add(this.elements[index].changeOpacityTransition(0, duration, [], 0, inMovie), false);
        result.add(this.indices[index].changeOpacityTransition(0, duration, [], 0, inMovie), false);
        result.setStartTime(startTime);
        return result;
    }

    moveElementTransition(index, finalPosition, duration, dependsOn=[], startTime=0) {
        return new Transition({
            func: (t, context) => {
                let fontSize = this.options.indexFontSize;
                let cellHeight = this.options.elementOptions.cellHeight;
                let cellWidth = this.options.elementOptions.cellWidth;
                let cellCoords = {
                    x: context.coords.x * (1 - t) + finalPosition.x * t,
                    y: context.coords.y * (1 - t) + finalPosition.y * t
                };
                this.elements[index].setCoords(cellCoords);
                this.indices[index].setAttribute("x", cellCoords.x + cellWidth / 2);
                this.indices[index].setAttribute("y", cellCoords.y + cellHeight + fontSize);
            },
            context: {
                coords: this.elements[index].getCoords()
            },
            dependsOn: dependsOn,
            startTime: startTime,
            duration: duration
        });
    }
}
