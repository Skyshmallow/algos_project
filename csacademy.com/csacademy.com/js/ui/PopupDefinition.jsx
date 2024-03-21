import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {Panel} from "../../../stemjs/src/ui/UIPrimitives.jsx";
import {Button} from "../../../stemjs/src/ui/button/Button.jsx";
import {Direction} from "../../../stemjs/src/ui/Constants.js";
import {MarkupRenderer} from "../../../stemjs/src/markup/MarkupRenderer.js";
import {TermDefinition} from "../state/TermDefinitionStore.js";
import {Transition, Modifier, TransitionList} from "../../../stemjs/src/ui/Transition.js";
import {BasePopup, Popup} from "../../../establishment/content/js/Popup.jsx";

//YOU CANNOT SET A NEW PARENT IN PLAYER POPUP!
export class PlayerPopup extends BasePopup {
    getDefaultOptions() {
        let options = super.getDefaultOptions();
        options.backgroundColor = "#F7F2CB";
        options.arrowColor = "#F7F2CB";
        options.arrowDirection = Direction.DOWN;
        options.className = (options.className || "") + " hidden";
        return options;
    }

    setContent(content) {
        this.contentArea.options.children = content;
        this.contentArea.redraw();
    }

    getPopupData() {
        return {panel: this.parentNode, content: this.options.children, center: {x: this.options.x, y: this.options.y}};
    }

    setPopupData(data) {
        this.setContent(data.content);
        this.setCenter(data.center);
    }

    show() {
        if (this.hasClass("hidden")) {
            this.removeClass("hidden");
        }
    }

    hide() {
        if (!this.hasClass("hidden")) {
            this.addClass("hidden");
        }
    }

    showPopupTransition(content, rawPosition, duration, dependsOn=[], startTime=0, inMovie=true) {
        let position;
        if (typeof rawPosition === "function") {
            position = rawPosition();
        } else {
            position = rawPosition;
        }
        let result = new TransitionList();
        result.dependsOn = dependsOn;
        let showPopupModifier = new Modifier({
            func: (context) => {
                context.content = this.options.children;
                //context.parent = this.options.parentNode;
                context.center = {x: this.options.x, y: this.options.y};
                if (this.options.style) {
                    context.opacity = this.options.style.opacity || 1;
                } else {
                    context.opacity = 1;
                }
                this.setContent(content);
                this.setCenter(position, true);
                this.setStyle("opacity", 0);
                this.show();
            },
            reverseFunc: (context) => {
                this.setContent(context.content);
                this.setCenter(context.center, true);
                this.setStyle("opacity", context.opacity);
                this.hide();
            },
            context: {}
        });
        result.push(showPopupModifier, false);
        let changeOpacityTransition = new Transition({
            func: (t) => {
                this.setStyle("opacity", t);
            },
            duration: duration / 2,
            dependsOn: [showPopupModifier],
            inMovie: inMovie
        });
        result.push(changeOpacityTransition, false);
        result.push(new Transition({
            func: (t) => {},
            duration: duration / 2,
            inMovie: inMovie
        }), false);
        result.setStartTime(startTime);
        return result;
    }

    hidePopupTransition(duration, dependsOn=[], startTime=0, inMovie=true) {
        let result = new TransitionList();
        result.dependsOn = dependsOn;
        let changeOpacityTransition = new Transition({
            func: (t) => {
                this.setStyle("opacity", 1 - t);
            },
            duration: duration,
            dependsOn: [],
            inMovie: inMovie
        });
        result.push(changeOpacityTransition, false);
        result.push(new Modifier({
            func: () => {
                this.hide();
            },
            reverseFunc: () => {
                this.show();
            },
            dependsOn: [changeOpacityTransition]
        }), false);
        result.setStartTime(startTime);
        return result;
    }
}


class PopupDefinition extends Popup {
    constructor(options) {
        super(options);
        this.stack = [{content: this.options.content, title: this.options.title}];
    }

    getTitleAreaContent() {
        return [
            <Button ref="backButton" className="pull-left" style={{
                border: "none", backgroundColor: "transparent",
                fontSize: "18pt", color: "#888888", padding: "2px", marginTop: "-12px", marginLeft: "-15px",
                marginRight: "-15px"
            }} label="<"/>,
            ...super.getTitleAreaContent()
        ];
    }

    getContent() {
        return [<Panel ref="titleArea" style={{
            backgroundColor: "#F3F3F3", paddingLeft: "20px", fontSize: this.options.titleFontSize,
            fontWeight: "bold", paddingTop: "6px", paddingBottom: "6px", textAlign: "center",
            borderBottom: "1px solid #BEBEBE"
        }}>
            {this.getTitleAreaContent()}
        </Panel>,
            <MarkupRenderer value={this.options.content} style={{padding: "8px"}}/>
        ];
    }

    pushDefinition(definition) {
        this.stack.push(definition);
        this.setStyle("left", "0px");
        this.setStyle("top", "0px");
        this.options.content = definition.content;
        this.options.title = definition.title;
        this.redraw();
        //this.recalculatePosition();
        this.bindInsideParent();
        if (this.stack.length > 1) {
            this.backButton.removeClass("hidden");
        }
    }

    popDefinition() {
        this.stack.pop();
        this.setStyle("left", "0px");
        this.setStyle("top", "0px");
        this.options.content = this.stack[this.stack.length - 1].content;
        this.options.title = this.stack[this.stack.length - 1].title;
        this.redraw();
        //this.recalculatePosition();
        this.bindInsideParent();
        if (this.stack.length === 1) {
            this.backButton.addClass("hidden");
        }
    }

    recalculatePosition() {
        // Compute the x and y coordinates of the popup
        let element = this.options.definition.node;
        let x = element.offsetWidth / 2;
        let y = element.offsetHeight;
        while (element !== this.parentNode && element.style.position !== "relative") {
            x += element.offsetLeft - element.scrollLeft;
            y += element.offsetTop - element.scrollTop;
            element = element.offsetParent;
        }
        this.setCenter({x: x, y: y});
    }

    onMount() {
        //this.recalculatePosition();
        super.onMount();
        //Recompute position as it is not calculated properly

        //Back button behavior
        this.backButton.addClickListener((event) => {
            event.stopPropagation();
            this.popDefinition();
            this.backButton.node.blur();
        });
        let backButtonColor = this.backButton.options.style.color;
        this.backButton.node.addEventListener("mouseover", () => {
            this.backButton.setStyle("color", "#0082AD");
        });
        this.backButton.node.addEventListener("mouseout", () => {
            this.backButton.setStyle("color", backButtonColor);
        });

        if (this.stack.length > 1) {
            this.backButton.removeClass("hidden");
        } else {
            this.backButton.addClass("hidden");
        }
    }
}

export class Definition extends UI.Element {
    setOptions(options) {
        super.setOptions(options);
        this.options.term = this.options.term || this.options.value;
        if (this.options.term) {
            this.options.definition = TermDefinition.getDefinition(this.options.term.trim());
        }
        if (this.options.children.length == 0) {
            this.options.children = [this.options.value || this.options.term];
        }
    }

    getNodeType() {
        return "span";
    }

    getNodeAttributes() {
        let attr = super.getNodeAttributes();
        attr.setStyle("position", "relative");
        return attr;
    }

    render() {
        return [
            <span ref="termDefinition" style={{fontWeight: "bold", color: "#0082AD", cursor: "pointer"}}>
                {this.options.children}
            </span>
        ]
    }

    onMount() {
        this.addClickListener((event) => {
            event.stopPropagation();
            let element = this;
            let popupContained = false;
            while (element) {
                if (element instanceof PopupDefinition) {
                    popupContained = true;
                }
                element = element.parent;
            }

            let title = this.options.definition.title;
            let definition = this.options.definition.definition;

            if (!popupContained) {
                if (this.constructor.activeDefinition === this) {
                    this.constructor.Popup.hide();
                    this.constructor.Popup = null;
                    this.constructor.activeDefinition = null;
                    return;
                }
                if (this.constructor.Popup && this.constructor.Popup.isInDocument()) {
                    this.constructor.Popup.hide();
                }
                this.constructor.Popup = PopupDefinition.create(this, {
                    target: this.termDefinition,
                    definition: this,
                    title: title,
                    content: definition,
                    width: "300px"
                });
            } else {
                this.constructor.Popup.pushDefinition({
                    title: title,
                    content: definition
                });
            }
            this.constructor.activeDefinition = this;
        });
    }
}
