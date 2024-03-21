import {UI} from "../../stemjs/src/ui/UIBase.js";
import {SVG} from "../../stemjs/src/ui/svg/SVGBase.js";
import * as math from "../../stemjs/src/math.js";
import {Transition, TransitionList, Modifier} from "../../stemjs/src/ui/Transition.js";
import {Color} from "../../stemjs/src/ui/Color.js";
import {eraseFirst} from "../../stemjs/src/base/Utils.js";


export class GraphEdge extends SVG.Group {
    getDefaultOptions() {
        return {
            color: "black",
            pathAttr: {
                fill: "none",
                strokeWidth: 2
            },
            invisiblePathAttr: {
                opacity: 0,
                fill: "none",
                strokeWidth: 30
            },
            curveArcRadius: 0,
            supportsBending: true
        };
    }

    setOptions(options) {
        super.setOptions(options);
        this.options.color = this.options.color || this.getDefaultOptions().color;
    }

    render() {
        let sourceCenter = this.getGraph().options.nodes[this.options.data.source].center;
        if (this.getSource()) {
            // If this is not the first time drawing the edge, take the data from the node itself,
            // as the options of the graph might be outdated
            sourceCenter = this.getSource().getCenter();
        }
        let targetCenter = this.getGraph().options.nodes[this.options.data.target].center;
        if (this.getTarget()) {
            // Same as above
            targetCenter = this.getTarget().getCenter();
        }
        this.options.children = [
            <SVG.Path ref={"path"}
                d={"M " + sourceCenter.x + " "  + sourceCenter.y + " L " + targetCenter.x + " " + targetCenter.y}
                {...this.options.pathAttr}
                stroke={this.options.color}
            />,
            <SVG.Path ref={"invisiblePath"}
                d={"M " + sourceCenter.x + " "  + sourceCenter.y + " L " + targetCenter.x + " " + targetCenter.y}
                {...this.options.invisiblePathAttr}
                stroke={this.options.color}
            />
        ];
        this.arrow = <SVG.Polygon ref={"arrow"}
            points={[{x:-15, y:7.5}, {x:0, y:0}, {x:-15, y:-7.5}]}
            stroke={this.options.color} fill={this.options.color}
        />;
        if (this.options.label) {
            this.options.children.push(<SVG.Text ref="costLabel" text={this.options.label}/>);
        }
        if (this.options.directed) {
            this.options.children.push(this.arrow);
        }
        return this.options.children;
    }

    getLabel() {
        return this.options.label;
    }

    setLabel(label) {
        if (!this.costLabel) {
            this.costLabel = <SVG.Text text={label} />;
            this.costLabel.mount(this);
            this.drawCost(true);
        }
        this.costLabel.setText(label);
        this.options.label = label;
        this.update();
    }

    drawCost(forced=false) {
        if (!this.getLabel() && !forced) {
            return;
        }
        let costLabelPadding = 5;
        let pathLength = this.path.node.getTotalLength();
        let midPoint = this.path.node.getPointAtLength(pathLength / 2);
        let vector;

        if (midPoint.x <= 0 || midPoint. y <= 0) {
            return;
        }

        vector = this.computeBisectorVector(pathLength, midPoint);
        this.costLabel.setPosition(midPoint.x + vector.x * (this.costLabel.getWidth() / 2 + costLabelPadding),
            midPoint.y + vector.y * (this.costLabel.getHeight() / 2 + costLabelPadding));
    };

    computeBisectorVector(pathLength=this.path.node.getTotalLength(),
                          midPoint=this.path.node.getPointAtLength(pathLength / 2)) {
        const EPS = 1;
        const SLOPE_EPS = 0.15;
        let normalizationUnit;
        // Take a the vector characterizing the slope at the midpoint of the path
        let auxiliaryPoint = this.path.node.getPointAtLength(pathLength / 2 + EPS);
        let vector = math.normalizeVector({
            x: (auxiliaryPoint.x - midPoint.x),
            y: (auxiliaryPoint.y - midPoint.y)
        });

        // Get the perpendicular vector
        vector = math.rotatePoint(vector, 0, Math.PI/2);
        // Negate the vector if it doesn't have the right orientation (we want to bring the text ABOVE the edge)
        if (vector.y >= 0) {
            vector = math.rotatePoint(vector, 0, Math.PI);
        }
        // The biggest direction vector will be set to 1 in its absolute value, and so the values must be normalized
        normalizationUnit = Math.max(Math.abs(vector.x), Math.abs(vector.y));

        // If the path has length 0, the vector is null
        if (pathLength === 0) {
            return {
                x: 0,
                y: 1
            };
        }

        vector.x /= normalizationUnit;
        vector.y /= normalizationUnit;

        // For paths with small slope the x coordinate is calculated using a linear function.
        // For paths with bigger slope the x coordinate is a constant.
        if (Math.abs(vector.x) < SLOPE_EPS) {
            vector.x = Math.sign(vector.x) * (1 - (SLOPE_EPS - Math.abs(vector.x)) / SLOPE_EPS);
        } else {
            vector.x = Math.sign(vector.x);
        }

        return vector;
    };

    getArrowStartPercent() {
        let totalLen = this.path.getLength();
        const EPS = 0.1;

        for (let curLen = this.getSource().getRadius(); curLen < totalLen; curLen += EPS) {
            let point = this.path.getPointAtLength(curLen);
             if (math.distance(this.getSource().getCenter(), point) > this.getSource().getRadius()) {
                return curLen / totalLen;
            }
        }

        return 1;
    }

    getMarkup() {
        let options = {};
        let defaultOptions = this.getDefaultOptions();
        if (this.options.color !== defaultOptions.color) {
            options.color = this.options.color;
        }
        if (this.options.pathAttr.strokeWidth !== defaultOptions.pathAttr.strokeWidth) {
            options.pathAttr = options.pathAttr || {};
            options.pathAttr.strokeWidth = this.options.pathAttr.strokeWidth;
        }
        if (this.getLabel()) {
            options.label = this.getLabel();
        }
        options.source = this.getSourceIndex();
        options.target = this.getTargetIndex();
        return JSON.stringify(options).replace(/\"[^\"]*\":/g, (str) => {
            return str.substring(1, str.length - 2) + ":";
        });
    }

    getArrowEndPercent() {
        let totalLen = this.path.getLength();
        const EPS = 0.1;

        for (let curLen = totalLen - this.getTarget().getRadius(); curLen >= 0; curLen -= EPS) {
            let point = this.path.node.getPointAtLength(curLen);
            if (math.distance(this.getTarget().getCenter(), point) > this.getTarget().getRadius()) {
                return curLen / totalLen;
            }
        }

        return 0;
    }

    setDirected(boolFlag) {
        if (this.options.directed === boolFlag) {
            return;
        }
        this.options.directed = boolFlag;
        if (!this.options.directed) {
            this.eraseChild(this.arrow, false);
        } else {
            this.appendChild(this.arrow);
            this.setArrowOnPath(1);
        }
    }

    getPathString() {
        if (this.options.curveArcRadius === 0) {
            // If the curve ratio is 0, the path is a line
            return "M " + this.getSource().x + " " + this.getSource().y +
                " L " + this.getTarget().x + " " + this.getTarget().y;
        } else {
            // Draw a quadratic Bezier curve
            // Compute Bezier control point
            let edgeMidPoint = {
                x: (this.getSource().x + this.getTarget().x) / 2,
                y: (this.getSource().y + this.getTarget().y) / 2
            };
            let bezierControlPoint = math.addVectors(
                math.scaleVector(
                    math.normalizeVector(
                        math.subtractVectors(
                            math.rotatePoint(this.getSource().getCenter(),
                                edgeMidPoint, Math.PI / 2),
                            edgeMidPoint
                        )
                    ),
                    this.options.curveArcRadius * 2
                ),
                edgeMidPoint
            );

            return "M" + this.getSource().x + "," + this.getSource().y + "Q" +
                bezierControlPoint.x + "," + bezierControlPoint.y + "," +
                this.getTarget().x + "," + this.getTarget().y;
        }
    }

    setArrowOnPath(percent) {
        let endPercent = this.getArrowEndPercent();
        let startPercent = this.getArrowStartPercent();
        let length = (startPercent + percent * (endPercent - startPercent)) * this.path.getLength();
        let point = this.path.getPointAtLengthWithAngle(length);
        this.arrow.node.setAttribute("transform", "translate (" + point.x + " " + point.y + ") " +
            "rotate(" + (point.alpha + 180) + ")");
    };

    setCurveArcRadius(newCurveArcRadius) {
        this.options.curveArcRadius = newCurveArcRadius;
    }

    getCurveArcRadius() {
        return this.options.curveArcRadius;
    }

    setBendingSupport(value) {
        this.options.supportsBending = value;
    }

    update() {
        let newPath = this.getPathString();
        this.path.setPath(newPath);
        this.invisiblePath.setPath(newPath);

        this.drawCost();

        if (this.options.directed) {
            this.setArrowOnPath(1);
        }
    }

    getGraph() {
        return this.options.graph;
    }

    delete() {
        eraseFirst(this.getGraph().options.edges, this.data);
        this.getGraph().edgeGroup.eraseChild(this);
    }

    reverse() {
        let aux = this.options.data.source;
        this.options.data.source = this.options.data.target;
        this.options.data.target = aux;
    }

    getSourceIndex() {
        return this.options.data.source;
    }

    getTargetIndex() {
        return this.options.data.target;
    }

    getSource() {
        return this.getGraph().nodes[this.options.data.source];
    }

    getTarget() {
        return this.getGraph().nodes[this.options.data.target];
    }

    getColor() {
        return this.options.color;
    }

    isDirected() {
        return this.options.directed;
    }

    setColor(color) {
        this.options.color = color;
        if (this.node) {
            this.path.setAttribute("stroke", color);
            this.invisiblePath.setAttribute("stroke", color);
            if (this.arrow.node) {
                this.arrow.setAttribute("stroke", color);
                this.arrow.setAttribute("fill", color);
            }
        }
    }

    onMount() {
        super.onMount();
        this.drawCost();
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

    bendingTransition(targetCurveArcRadius, duration, dependsOn=[], startTime = 0) {
        return new Transition({
            func: (t, context) => {
                this.setCurveArcRadius(context.curveArcRadius
                    + t * (targetCurveArcRadius - context.curveArcRadius));
                this.update();
            },
            context: {
                curveArcRadius: this.options.curveArcRadius
            },
            duration: duration,
            startTime: startTime,
            dependsOn: dependsOn
        })
    }

    arrowTravelTransition(duration, dependsOn=[], startTime=0, keepArrow=false) {
        let transitionList = new TransitionList();
        transitionList.dependsOn = dependsOn;
        // Make the edge undirected
        let currentDependencies = [];
        if (this.isDirected()) {
            let modifier = new Modifier({
                func: () => {
                    this.setDirected(false);
                },
                reverseFunc: () => {
                    this.setDirected(true);
                }
            });
            transitionList.push(modifier, false);
            currentDependencies = [modifier];
        }

        // Append the arrow
        let appendArrowModifier = new Modifier({
            func: () => {
                this.appendChild(this.arrow);
            },
            reverseFunc: () => {
                this.eraseChild(this.arrow, false);
            },
            dependsOn: currentDependencies
        });
        transitionList.push(appendArrowModifier, false);

        // Move the arrow
        let moveArrowTransition = new Transition({
            func: (t) => {
                this.setArrowOnPath(t);
            },
            duration: duration,
            dependsOn: [appendArrowModifier]
        });
        transitionList.push(moveArrowTransition, false);

        // Remove the arrow
        let removeArrowModifier = new Modifier({
            func: () => {
                this.eraseChild(this.arrow, false);
            },
            reverseFunc: () => {
                this.appendChild(this.arrow);
            },
            dependsOn: [moveArrowTransition]
        });
        transitionList.push(removeArrowModifier, false);

        transitionList.push(new Transition({
            func: () => {},
            duration: 1
        }), false);

        // Make the edge directed
        if (keepArrow) {
            transitionList.push(new Modifier({
                func: () => {
                    this.setDirected(true);
                },
                reverseFunc: () => {
                    this.setDirected(false);
                },
                dependsOn: [removeArrowModifier]
            }), false);
        }

        transitionList.setStartTime(startTime);
        return transitionList;
    }

    getPopupPosition(deltaX=0, deltaY=0, forceTransition=null) {
        if (forceTransition && forceTransition.lines.has(this)) {
            let options = forceTransition.lines.get(this);
            this.setCurveArcRadius(options.curveArcRadius);
            this.getSource().setCenter(forceTransition.points.get(this.getSource()));
            this.getTarget().setCenter(forceTransition.points.get(this.getTarget()));
            this.update();
        }
        let midpoint = this.path.node.getPointAtLength(this.path.node.getTotalLength() / 2);
        return {
            x: midpoint.x + deltaX,
            y: midpoint.y + deltaY
        };
    }

    // Only works for straight-line edges
    turnToDashesTransition(duration, dashArray="3,3", forceTransition=null, dependsOn=[], startTime=0) {
        let transitionList = new TransitionList();
        transitionList.dependsOn = dependsOn;

        let appendDummy = new Modifier({
            func: () => {
                let sourceCenter;
                let targetCenter;
                if (!forceTransition) {
                    sourceCenter = this.getSource().getCenter();
                    targetCenter = this.getTarget().getCenter();
                } else {
                    sourceCenter = forceTransition.points.get(this.getSource());
                    targetCenter = forceTransition.points.get(this.getTarget());
                }
                // Append the dummy line
                let dummyPath = <SVG.Line x1={sourceCenter.x} x2={sourceCenter.x}
                                             y1={sourceCenter.y} y2={sourceCenter.y}
                                             ref={this.refLink("dummyPath")}
                                             strokeDasharray={dashArray} {...this.options.pathAttr} />;

                let fakePath = <SVG.Line x1={sourceCenter.x} x2={targetCenter.x}
                                            y1={sourceCenter.y} y2={targetCenter.y}
                                            ref={this.refLink("fakePath")}
                                            {...this.options.pathAttr} />;
                this.appendChild(dummyPath);
                this.appendChild(fakePath);
                this.path.setAttribute("opacity", 0);
            },
            reverseFunc: () => {
                this.eraseChild(this.dummyPath, true);
                this.eraseChild(this.fakePath, true);
                this.path.setAttribute("opacity", 1);
            }
        });
        transitionList.push(appendDummy, false);

        // Dash the dummy path
        let strokeDummy = new Transition({
            func: (t) => {
                let sourceCenter = this.getSource().getCenter();
                let targetCenter = this.getTarget().getCenter();
                let x2 = (1 - t) * sourceCenter.x + t * targetCenter.x;
                let y2 = (1 - t) * sourceCenter.y + t * targetCenter.y;
                this.dummyPath.setAttribute("x2", x2);
                this.dummyPath.setAttribute("y2", y2);
                this.fakePath.setAttribute("x1", x2);
                this.fakePath.setAttribute("y1", y2);
            },
            dependsOn: [appendDummy],
            duration: duration
        });
        transitionList.push(strokeDummy, false);

        // Remove the dummy and dash the path itself
        let removeDummy = new Modifier({
            func: () => {
                this.path.setAttribute("stroke-dasharray", dashArray);
                this.path.setAttribute("opacity", 1);
                this.eraseChild(this.dummyPath, false);
                this.eraseChild(this.fakePath, false);
            },
            reverseFunc: () => {
                this.path.setAttribute("stroke-dasharray", null);
                this.path.setAttribute("opacity", 0);
                this.appendChild(this.dummyPath);
                this.appendChild(this.fakePath);
            },
            dependsOn: [strokeDummy]
        });
        transitionList.push(removeDummy, false);

        transitionList.setStartTime(startTime);
        return transitionList;
    }
};
