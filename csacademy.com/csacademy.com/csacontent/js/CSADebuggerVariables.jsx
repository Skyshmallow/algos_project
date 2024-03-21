import {UI} from "../../stemjs/src/ui/UIBase.js";
import {SVG} from "../../stemjs/src/ui/svg/SVGBase.js";
import {Transition} from "../../stemjs/src/ui/Transition.js";


export class DebuggerVariable extends SVG.Group {
    render() {
        return [
            <SVG.Rect ref="rect"
                x={this.options.x} width={10000} y={this.options.y - this.options.height / 2} height={this.options.height}
                stroke="yellow" fill="yellow" opacity="0"
            />,
            <SVG.Text
                ref="text"
                text={this.options.name + ": " + this.options.value}
                x={this.options.x}
                y={this.options.y}
                fontFamily="courier"
                textAnchor="left"
            />
        ];
    }

    setText(text) {
        this.text.setText(text);
    }

    getText() {
        return this.options.name + ": " + this.options.value;
    }

    flashTransition(duration, dependsOn=[], startTime=0) {
        return new Transition({
            func: (t) => {
                if (t === 0) {
                    this.rect.setAttribute("opacity", 0);
                } else {
                    this.rect.setAttribute("opacity", 0.33 * (1 - t));
                }
            },
            startTime: startTime,
            duration: duration,
            dependsOn: dependsOn
        });
    }
}
