import {
    Transition
} from "../../stemjs/src/ui/Transition.js";
import {
    CSAForceLayout
} from "./CSAForceLayout.js";
import * as math from "../../stemjs/src/math.js";

const SLOWING_FACTOR = 5;

class CSAForceTransition extends Transition {
    constructor(options) {
        super({
            func: (t) => {
                let frameIndex = Math.floor(t * (this.nodeFrames.length - 1));
                let frame = this.nodeFrames[frameIndex];

                if (frame === this.nodeFrames.length - 1) {
                    return;
                }

                let nextFrame = this.nodeFrames[frameIndex + 1];
                let percent = 1 - (t * (this.nodeFrames.length - 1) - frameIndex);

                for (let node of this.graph.nodes) {
                    let currentCoords = frame.get(node);
                    let nextCoords;
                    if (nextFrame) {
                        nextCoords = nextFrame.get(node);
                    } else {
                        nextCoords = currentCoords;
                    }
                    node.setCenter({
                        x: percent * currentCoords.x + (1 - percent) * nextCoords.x,
                        y: percent * currentCoords.y + (1 - percent) * nextCoords.y
                    });
                }

                frame = this.edgeFrames[frameIndex];
                nextFrame = this.edgeFrames[frameIndex + 1];
                percent = 1 - (t * (this.edgeFrames.length - 1) - frameIndex);

                for (let edge of this.graph.edges) {
                    let currentArcRadius = frame.get(edge).curveArcRadius;
                    let nextArcRadius;
                    if (nextFrame) {
                        nextArcRadius = nextFrame.get(edge).curveArcRadius;
                    } else {
                        nextArcRadius = currentArcRadius;
                    }
                    edge.setCurveArcRadius(percent * currentArcRadius + (1 - percent) * nextArcRadius);
                    edge.update();
                }
            },
            startTime: options.startTime,
            duration: options.duration
        });
        //TODO(@darius) Name these nodes and edges
        this.points = new Map();
        for (let i = 0; i < options.graph.nodes.length; i += 1) {
            this.points.set(options.graph.nodes[i], options.graph.nodes[i].getCenter());
        }

        this.lines = new Map();
        for (let i = 0; i < options.graph.edges.length; i += 1) {
            this.lines.set(options.graph.edges[i], {
                curveArcRadius: options.graph.edges[i].getCurveArcRadius()
            });
        }
        this.graph = options.graph;
        this.fps = options.fps || 60;
        this.realFps = options.realFps || 10;
        this.nodeFrames = [];
        this.edgeFrames = [];
        this.auxiliaryTransitions = [];
    }

    setDuration(duration) {
        this.duration = duration;
    }

    generateNewFrame() {
        let graph = this.graph;

        // Generate first frame
        if (this.nodeFrames.length === 0) {
            this.nodeFrames.push(new Map(this.points));
            this.edgeFrames.push(new Map(this.lines));
            return;
        }

        // Create a force layout and run 1 step
        let forceLayout = new CSAForceLayout({
            points: this.graph.nodes.map((node) => {
                return this.points.get(node);
            }),
            edges: graph.options.edges.map((edge) => {
                return {
                    first: edge.source,
                    second: edge.target
                };
            }),
            gravityCenter: graph.getGravityCenter()
        });
        let points = forceLayout.calculateVectors(1);
        for (let i = 0; i < graph.nodes.length; i += 1) {
            let node = graph.nodes[i];
            let coords = {
                x: points[i].x + points[i].dx,
                y: points[i].y + points[i].dy
            };
            if (!node.isFixed()) {
                this.points.delete(node);
                this.points.set(node, coords);
            }
        }

        //Calculate edge bending
        if (graph.options.supportsBending) {
            let bendingDelta = this.getBendingDelta();
            for (let i = 0; i < graph.edges.length; i += 1) {
                let edge = graph.edges[i];
                let currentValue = this.lines.get(edge).curveArcRadius;
                if (edge.options.supportsBending) {
                    this.lines.set(edge, {
                        curveArcRadius: currentValue + bendingDelta[i]
                    });
                }
            }
        }

        // Run auxiliary transitions
        let frameTime = this.nodeFrames.length * 1000 / this.realFps;
        this.runAuxiliaryTransitions(frameTime);
        this.nodeFrames.push(new Map(this.points));
        this.edgeFrames.push(new Map(this.lines));
    }

    getBendingDelta() {
        let delta = new Array(this.graph.edges.length);
        for (let i = 0; i < this.graph.edges.length; i += 1) {
            let edge = this.graph.edges[i];

            if (!edge.options.supportsBending) {
                delta[i] = 0;
                return;
            }

            let edgeStartCoords = this.points.get(edge.getSource());
            let edgeEndCoords = this.points.get(edge.getTarget());
            let edgeLine = math.lineEquation(edgeStartCoords, edgeEndCoords);
            let biggestNode = null;

            for (let i = 0; i < this.graph.nodes.length; i += 1) {
                if (this.graph.nodes[i] === edge.getSource() || this.graph.nodes[i] === edge.getTarget()) {
                    continue;
                }
                let nodeCoords = this.points.get(this.graph.nodes[i]);

                // Take the node's projection on this line
                let nodeProjection = math.perpendicularFoot(nodeCoords, edgeLine);

                // If the node almost intersects the line and
                // If the node's projection si on the segment determined by the edge points
                // In other words, if the node almost intersects the segemnt determined by the edge
                if (math.distancePointLine(nodeCoords, edgeLine) <= this.graph.nodes[i].getRadius() + 10 &&
                    math.pointOnSegment(nodeProjection, edgeStartCoords, edgeEndCoords)) {
                    // Store the node with the biggest radius out of all the ones that respect the above restrictions
                    if (biggestNode === null ||
                        this.graph.nodes[i].getRadius() > biggestNode.getRadius()) {
                        biggestNode = this.graph.nodes[i];
                    }
                }
            }

            // Note that the code below is a little different than the one in CSAGraph
            // of the interactive graph
            // This one is slower and behaves more smoothly
            let currentCurveArcRadius = this.lines.get(edge).curveArcRadius;

            let targetCurveArcRadius;
            // If there exists a node that almost intersects the edge
            if (biggestNode !== null) {
                // If the current edge's arc radius is 0
                if (currentCurveArcRadius === 0) {
                    // Set the target arc radius to be opposite of the direction from which the node is coming
                    // Set it proportional to the node's radius
                    targetCurveArcRadius = 2.5 * biggestNode.getRadius() * ((math.signedDistancePointLine(
                        this.points.get(biggestNode), edgeLine)) > 0 ? -1 : 1);
                } else {
                    // Set the target arc radius radius to be in the direction that it's already going in
                    // This is to minimize annoying wiggling by the edges
                    targetCurveArcRadius = 2.5 * biggestNode.getRadius() * (currentCurveArcRadius < 0 ? -1 : 1);
                }
            } else {
                // Set the edge to be straight
                targetCurveArcRadius = 0;
            }

            // With this delta, the edge will head towards its target radius with exponentially decaying speed
            delta[i] = (targetCurveArcRadius - currentCurveArcRadius) / SLOWING_FACTOR;
        }

        return delta;
    }

    forceFinish() {
        let totalFrames = 1 + Math.ceil(this.duration * this.realFps / 1000);
        while (this.nodeFrames.length < totalFrames) {
            this.generateNewFrame();
        }

        return this;
    }

    runAuxiliaryTransitions(time) {
        for (let i = 0; i < this.auxiliaryTransitions.length; i += 1) {
            let transition = this.auxiliaryTransitions[i];
            if (time < transition.startTime || transition.isStopped()) {
                continue;
            }
            transition.nextStep(time);
        }
    }

    moveNodeTransition(options) {
        return new Transition({
            func: (t, context) => {
                this.points.set(context.node, {
                    x: (1 - t) * context.coords.x + t * options.newCoords.x,
                    y: (1 - t) * context.coords.y + t * options.newCoords.y
                });
            },
            context: {
                coords: this.points.get(options.node),
                node: options.node
            },
            duration: options.duration,
            startTime: options.startTime,
            dependsOn: options.dependsOn
        });
    }
    addTransition(transition) {
        this.auxiliaryTransitions.push(transition);
    }
}

export {
    CSAForceTransition
};