import {UI} from "../../stemjs/src/ui/UIBase.js";
import {SVG} from "../../stemjs/src/ui/svg/SVGBase.js";
import {DoubleClickable} from "../../stemjs/src/ui/DoubleClickable.js";
import {Draggable} from "../../stemjs/src/ui/Draggable.js";
import {Transition} from "../../stemjs/src/ui/Transition.js";
import {Color} from "../../stemjs/src/ui/Color.js";
import {Formatter} from "../../csabase/js/util.js";


export class GraphNode extends DoubleClickable(Draggable(SVG.Group)) {
    getDefaultOptions() {
        return {
            color: "black",
            innerColor: "white",
            circleAttr: {
                radius: 19,
                strokeWidth: 2
            },
            textAttr: {
                text: "N/A",
                dy: ".35em",
                textAnchor: "middle",
                strokeWidth: 1,
                fontSize: 14
            },
            fixed: false,
            dragging: false,
            secondLabelSign: 1, //whether the label NEXT to the node should be above or below
            secondLabelPadding: 10, //distance from node
        };
    }

    render() {
        let children = [
            <SVG.Circle ref={"circle"}
                {...this.options.circleAttr} fill={this.options.innerColor} stroke={this.options.color}
                           center={this.options.data.center}/>,
            <SVG.Text ref={"label"}
                {...this.options.textAttr} fill={this.options.color} stroke={this.options.color} text={this.options.data.label+""}
                         x={this.options.data.center.x}
                         y={this.options.data.center.y}/>
        ];
        if (this.options.data.hasOwnProperty("secondLabel")) {
            children.push(
                <SVG.Text ref="secondLabel"
                    {...this.options.textAttr} fill={this.options.color}
                     stroke={this.options.color} text={this.options.data.secondLabel+""}
                     x={this.options.data.center.x}
                     y={this.options.data.center.y + this.options.secondLabelSign * (this.options.circleAttr.radius + this.options.secondLabelPadding)}
                />
            );
        }
        return children;
    }

    onMount() {
        if (this.getRadius() < 7) {
            this.label.setOpacity(0);
            this.circle.setAttribute("fill", this.options.color);
        }

        this.setStyle("cursor", "pointer");

        // this is required for graph editor, so entering "edit" mode removes these listeners
        this._fixNodeCallback = () => {
            if (this.isFixed()) {
                this.setFixed(false);
            } else {
                this.setFixed(true);
            }
        };
        this.addClickListener(this._fixNodeCallback);

        this.addDragListener({
            onStart: () => {
                this.dragging = true;
                // this.getGraph().setFrictionCoef(0.01);
            },
            onDrag: (deltaX, deltaY) => {
                let x = this.getCenter().x + deltaX;
                let y = this.getCenter().y + deltaY;
                this.setCenter({x: x, y: y});
            },
            onEnd: () => {
                this.dragging = false;
                // this.getGraph().setFrictionCoef(this.getGraph().getDefaultOptions().frictionCoef);
            }
        });
    }

    getGraph() {
        return this.options.graph;
    }

    getMarkup(scaleX=1, scaleY=1) {
        let options = {};
        let defaultOptions = this.getDefaultOptions();
        if (this.options.color !== defaultOptions.color) {
            options.options = options.options || {};
            options.options.color = this.options.color;
        }
        if (this.options.innerColor !== defaultOptions.innerColor) {
            options.options = options.options || {};
            options.options.innerColor = this.options.innerColor;
        }
        if (this.getRadius() !== defaultOptions.circleAttr.radius) {
            options.options = options.options || {};
            options.options.circleAttr = options.options.circleAttr || {};
            options.options.circleAttr.radius = this.getRadius();
        }
        if (this.options.circleAttr.strokeWidth !== defaultOptions.circleAttr.strokeWidth) {
            options.options = options.options || {};
            options.options.circleAttr = options.options.circleAttr || {};
            options.options.circleAttr.strokeWidth = this.circle.getAttribute("stroke-width");
        }
        if (this.options.fixed) {
            options.options = options.options || {};
            options.options.fixed = true;
        }
        options.label = this.getLabel();
        options.center = {};
        options.center.x = Formatter.truncate(this.getCenter().x * scaleX, 1);
        options.center.y = Formatter.truncate(this.getCenter().y * scaleY, 1);
        return JSON.stringify(options).replace(/\"[^\"]*\":/g, (str) => {
            return str.substring(1, str.length - 2) + ":";
        });
    }

    getOutgoingEdges() {
        let graph = this.getGraph();
        let edges = [];
        for (let i = 0; i < graph.edges.length; i += 1) {
            let edge = graph.edges[i];
            if (edge.getSource() === this || (!edge.isDirected && edge.getTarget() === this)) {
                edges.push(edge);
            }
        }
        return edges;
    }

    getIngoingEdges() {
        let graph = this.getGraph();
        let edges = [];
        for (let i = 0; i < graph.edges.length; i += 1) {
            let edge = graph.edges[i];
            if (edge.getTarget() === this || (!edge.isDirected() && edge.getSource() === this)) {
                edges.push(edge);
            }
        }
        return edges;
    }

    getIncidentEdges() {
        let graph = this.getGraph();
        let edges = [];
        for (let i = 0; i < graph.edges.length; i += 1) {
            let edge = graph.edges[i];
            if (edge.getSource() === this || edge.getTarget() === this) {
                edges.push(edge);
            }
        }
        return edges;
    }

    setInnerColor(color) {
        this.options.innerColor = color;
        this.circle.setAttribute("fill", this.options.innerColor);
    }

    getInnerColor() {
        return this.options.innerColor;
    }

    setColor(color) {
        this.options.color = color;
        this.circle.setAttribute("stroke", this.options.color);
        this.label.setAttribute("stroke", this.options.color);
        this.label.setAttribute("fill", this.options.color);
        if (this.secondLabel) {
            this.secondLabel.setAttribute("stroke", this.options.color);
            this.secondLabel.setAttribute("fill", this.options.color);
        }
    }

    getColor() {
        return this.options.color;
    }

    setLabel(label) {
        this.options.data.label = label;
        this.getGraph().options.nodes[this.getGraph().nodes.indexOf(this)].label = label;
        this.label.setText(label);
    }

    getLabel() {
        return this.options.data.label;
    }

    boundCoords(coords) {
        let box = this.getGraph().getBox();
        let radius = this.getRadius();

        let x = coords.x;
        if (x < box.x + radius) {
            x = box.x + radius;
        }
        if (x > box.x + box.width - radius) {
            x = box.x + box.width - radius;
        }

        let y = coords.y;
        if (y < box.y + radius) {
            y = box.y + radius;
        }
        if (y > box.y + box.height - radius) {
            y = box.y + box.height - radius;
        }

        return {x: x, y: y};
    }

    setCenter(coords, updateEdges=true) {
        coords = this.boundCoords(coords);
        this.options.data.center = coords;

        this.circle.setCenter(coords.x, coords.y);
        this.label.setPosition(coords.x, coords.y);
        if (this.secondLabel) {
            this.secondLabel.setPosition(coords.x, coords.y + this.options.secondLabelSign * (this.getRadius() + this.options.secondLabelPadding));
        }

        if (updateEdges) {
            let edges = this.getIncidentEdges();
            for (let i = 0; i < edges.length; i += 1) {
                let edge = edges[i];
                edge.update();
            }
        }

        this.getGraph().nodeCenterChanged(this, coords);
    }

    getCenter() {
        return this.options.data.center;
    }

    get x() {
        return this.options.data.center.x;
    }

    get y() {
        return this.options.data.center.y;
    }

    setFixed(value, highlight=true) {
        this.options.fixed = value;
        if (highlight === true) {
            if (value === true) {
                this.circle.setAttribute("stroke-width", 5);
            } else {
                this.circle.setAttribute("stroke-width", 2);
            }
        }
    }

    isFixed() {
        return this.options.fixed;
    }

    setRadius(radius) {
        this.circle.setRadius(radius);
        if (radius < 7) {
            this.label.setOpacity(0);
            this.circle.setAttribute("fill", this.options.color);
        } else {
            this.label.setOpacity(1);
            this.circle.setAttribute("fill", this.options.innerColor);
        }
    }

    getRadius() {
        return this.circle.getRadius();
    }

    getPopupPosition(deltaX=0, deltaY=0, forceTransition=null) {
        if (forceTransition && forceTransition.points.has(this)) {
            let result;
            let coords = forceTransition.points.get(this);
            result = {
                x: coords.x + deltaX,
                y: coords.y + deltaY
            };
            return result;
        }
    }

    // Transitions start here
    changeColorTransition(color, duration, dependsOn=[], startTime=0) {
        return new Transition({
            func: (t, context) => {
                this.setColor(Color.interpolate(context.color, color, t));
            },
            context: {
                color: this.options.color
            },
            duration: duration,
            startTime: startTime,
            dependsOn: dependsOn
        });
    }

    moveTransition(options) {
        return new Transition({
            func: (t, context) => {
                this.setCenter({
                    x: (1 - t) * context.coords.x + t * options.newCoords.x,
                    y: (1 - t) * context.coords.y + t * options.newCoords.y
                });
            },
            context: {
                coords: this.getCenter()
            },
            duration: options.duration,
            startTime: options.startTime,
            dependsOn: options.dependsOn
        });
    }
}
