import {UI} from "../../stemjs/src/ui/UIBase.js";
import {SVG} from "../../stemjs/src/ui/svg/SVGBase.js";
import * as math from "../../stemjs/src/math.js";
import {Transition, TransitionList, Modifier} from "../../stemjs/src/ui/Transition.js";

import {GraphNode} from "./CSAGraphNode.jsx";
import {GraphEdge} from "./CSAGraphEdge.jsx";
import {CSAForceLayout} from "./CSAForceLayout.js";
import {eraseFirst} from "../../stemjs/src/base/Utils.js";


export class Graph extends SVG.Group {
    getDefaultOptions() {
        return {
            nodes: [],
            edges: [],
            gravityCenterXPercentage: 0.5,
            gravityCenterYPercentage: 0.5,
            box: {
                x: 0,
                y: 0,
                width: 400,
                height: 400
            },
            indexType: "0",
            directed: false,
            forcePaused: false,
            bendEdgesIfForcePaused: false,
            idlePaused: false,
            idlePauseThreshold: 0.05,
            idealEdgeDistance: CSAForceLayout.prototype.getDefaultOptions().idealEdgeDistance,
            nodeOptions: GraphNode.prototype.getDefaultOptions(),
            supportsBending: true
        };
    }

    populateNodeData() {
        for (let i = 0; i < this.options.nodes.length; i += 1) {
            let nodeData = this.options.nodes[i];
            // Set label
            if (this.options.indexType === "0") {
                nodeData.label = i;
            }
            else if (this.options.indexType === "1") {
                nodeData.label = i + 1;
            }
            else if (this.options.indexType === "custom") {
                if (!nodeData.hasOwnProperty("label") || nodeData.label === "") {
                    nodeData.label = i + 1;
                }
            } else {
                nodeData.label = "";
            }

            // Set center
            nodeData.center = nodeData.center || {
                x: Math.random() * this.options.box.width + this.options.box.x,
                y: Math.random() * this.options.box.height + this.options.box.y
            };
        }
    }

    setOptions(options) {
        super.setOptions(options);
        this.populateNodeData();
        this.options.gravityCenter = {
            x: this.options.gravityCenterXPercentage * this.options.box.width + this.options.box.x,
            y: this.options.gravityCenterYPercentage * this.options.box.height + this.options.box.y
        }
    }

    getMarkup() {
        let markup = "<Graph indexType=\"custom\" height=\"400\" width=\"400\" ";
        markup += "nodes={[";
        for (let node of this.nodes) {
            if (node !== this.nodes[0]) {
                markup += ",";
            }
            markup += node.getMarkup(400 / this.options.box.width, 400 / this.options.box.height);
        }
        markup += "]} edges={[";
        for (let edge of this.edges) {
            if (edge !== this.edges[0]) {
                markup += ",";
            }
            markup += edge.getMarkup();
        }
        markup += "]} />";
        return markup;
    }

    render() {
        let nodes = [];
        for (let i = 0; i < this.options.nodes.length; i += 1) {
            let nodeData = this.options.nodes[i];
            let nodeOptions = Object.assign({}, this.options.nodeOptions, nodeData.options);
            nodes.push(<GraphNode graph={this} data={nodeData} {...nodeOptions}/>);
        }

        let edges = [];
        for (let i = 0; i < this.options.edges.length; i += 1) {
            let edgeData = this.options.edges[i];
            let data = {source: edgeData.source, target: edgeData.target};
            let directed = edgeData.hasOwnProperty("directed") ? edgeData.directed : this.options.directed;
            let color = edgeData.color;
            edges.push(<GraphEdge graph={this} label={edgeData.label} data={data} directed={directed} color={color} {...edgeData.options}/>);
        }

        return [
            <SVG.Group ref="edgeGroup">{edges}</SVG.Group>,
            <SVG.Group ref="nodeGroup">{nodes}</SVG.Group>
        ];
    }

    redraw() {
        super.redraw();
        // HACK for bending edges to work if force is paused
        if (this.options.forcePaused && this.options.bendEdgesIfForcePaused) {
            this.getEdgeBendingTransitions().start();
        }
        for (let i = 0; i < this.edges.length; i += 1) {
            this.edges[i].update();
        }
        if (!this.options.forcePaused && !this.options.idlePaused) {
            this.startPerpetualForce();
        }
    }

    pauseForce() {
        this.options.forcePaused = true;
    }

    unpauseForce() {
        let initialValue = this.options.forcePaused;
        this.options.forcePaused = false;
        if (initialValue) {
            this.startPerpetualForce();
        }
    }

    pauseIdle() {
        this.options.idlePaused = true;
    }

    unpauseIdle() {
        let initialValue = this.options.idlePaused;
        this.options.idlePaused = false;
        if (initialValue) {
            this.startPerpetualForce();
        }
    }

    startPerpetualForce() {
        let lastUpdate = Date.now();
        let updateForces = () => {
            if (this.isInDocument()) {
                this.runForces();
            }

            if (!this.options.forcePaused && !this.options.idlePaused) {
                requestAnimationFrame(updateForces);
            } else if (this.options.forcePaused) {
                // Straighten any bended edges
                requestAnimationFrame(() => {
                    for (let i = 0; i < this.edges.length; ++i) {
                        this.edges[i].setCurveArcRadius(0);
                        this.edges[i].update();
                    }
                });
            }
        };
        requestAnimationFrame(updateForces);
    }

    // TODO(@mikester): This shouldn't call setOptions
    setData(nodes, edges) {
        this.options.nodes = nodes;
        this.options.edges = edges;
        this.setOptions(this.options);
        this.redraw();
    }

    get nodes() {
        if (!this.nodeGroup) {
            return false;
        }
        return this.nodeGroup.children;
    }

    get edges() {
        if (!this.edgeGroup) {
            return false;
        }
        return this.edgeGroup.children;
    }

    removeNode(node) {
        for (let edge of node.getIncidentEdges()) {
            this.removeEdge(edge);
        }
        // TODO bad practice to directly edit options
        eraseFirst(this.options.nodes, node.options.data);
        let oldIndices = new Map(), i = 0;
        for (let oldNode of this.nodes) {
            oldIndices.set(i ++, oldNode);
        }
        this.nodeGroup.eraseChild(node);

        // After erasing a node, all edges must be updated so the indices of their source and target
        // remain correct
        for (let edge of this.edges) {
            let source = oldIndices.get(edge.getSourceIndex());
            let target = oldIndices.get(edge.getTargetIndex());
            for (i = 0; i < this.nodes.length; i += 1) {
                if (this.nodes[i] === source) {
                    edge.options.data.source = i;
                } else if (this.nodes[i] === target) {
                    edge.options.data.target = i;
                }
            }
        }
    }

    addNode(node) {
        node.options.data = node.options.data || {};
        node.options.data.center = node.options.data.center || {
            x: Math.random() * this.options.box.width + this.options.box.x,
            y: Math.random() * this.options.box.height + this.options.box.y
        };
        node.options.circleAttr = node.options.circleAttr || {};
        if (this.options.nodeRadius) {
            node.options.circleAttr.radius = this.options.nodeRadius;
        }
        if (this.options.nodeFill) {
            node.options.innerColor = this.options.nodeFill;
        }
        if (this.options.nodeStroke) {
            node.options.color = this.options.nodeStroke;
        }
        node.options.graph = this;
        this.nodeGroup.appendChild(node);
        this.options.nodes.push(node.options.data);
        return node;
    }

    removeEdge(edge) {
        eraseFirst(this.options.edges, edge.options.data);
        this.edgeGroup.eraseChild(edge);
    }

    addEdge(edge) {
        edge.options.graph = this;
        if (this.options.edgeColor) {
            edge.options.color = this.options.edgeColor;
        }
        this.edgeGroup.appendChild(edge);
        this.options.edges.push(edge.options.data);
        if (this.isDirected()) {
            edge.setArrowOnPath(1);
        }
        return edge;
    }

    nodeCenterChanged(node, coords) {
        this.unpauseIdle();

        // Uncomment this if you ever need to listen on node center change
        // this.dispatch("setNodeCenter", {node: node, coords: coords});
    }

    getBox() {
        return this.options.box;
    }

    setBox(newBox) {
        this.options.box = newBox;
    }

    setAllCenters(forces) {
        // This function is implemented in order to cut the number of
        // edge redraws in half on a cycle of the forces

        // if (!this._lastForcesFrameTime) {
        //     this._lastForcesFrameTime = 16;
        // }
        // let equilibrium = true;
        for (let i = 0; i < this.nodes.length; i += 1) {
            let node = this.nodes[i];
            if (!node.isFixed() && !node.dragging) {
                // // The forces acting on nodes are NOT the the correct scale
                // // of how much they should move. Since the force is mass times
                // // acceleration, and considering all nodes have mass 1, the
                // // forces give the nodes a vectorial acceleration.
                // node.velocity = node.velocity || {x: 3, y: 3};
                //
                // // This is the time elapsed since the last frame, in seconds.
                // // We will consider that forces run at 5x the natural speed, so
                // // the movement seems more smooth and the equilibrium is reached faster
                // let time = this._lastForcesFrameTime / 1000 * 5;
                //
                // // The new velocity of the node, in ideal conditions, would be the old one
                // // + time * acceleration. Since in ideal conditions the equilibrium is never
                // // reached, we will introduce a force of friction between the nodes and the
                // // canvas itself. This force will make the nodes reach an equilibrium point
                // // faster or slower, depending on the coefficient of friction.
                // let applyFriction = (x) => {
                //     let u = this.options.frictionCoef;
                //     return x >= u ? x - u : (x <= -u ? x + u : x);
                // };
                // if (Math.abs(node.velocity.x) <= 1.5) {
                //     forces[i].dx *= 10;
                // }
                // if (Math.abs(node.velocity.y) <= 1.5) {
                //     forces[i].dy *= 10;
                // }
                // node.velocity.x = applyFriction(node.velocity.x + forces[i].dx * time);
                // node.velocity.y = applyFriction(node.velocity.y + forces[i].dy * time);
                //
                // if (Math.abs(node.velocity.x) > 30) {
                //     node.velocity.x = 30 * (node.velocity.x > 0 ? 1 : -1);
                // } else if (Math.abs(node.velocity.x) < 0.03) {
                //     node.velocity.x = 0;
                // }
                // if (Math.abs(node.velocity.y) > 30) {
                //     node.velocity.y = 30 * (node.velocity.y > 0 ? 1 : -1);
                // } else if (Math.abs(node.velocity.y) < 0.03) {
                //     node.velocity.y = 0;
                // }


                node.setCenter({
                    x: node.getCenter().x + forces[i].dx,
                    y: node.getCenter().y + forces[i].dy
                }, false);

                // if (node.velocity.x || node.velocity.y) {
                //     equilibrium = false;
                // }
            }
        }
        for (let i = 0; i < this.edges.length; i += 1) {
            this.edges[i].update();
        }

        // if (equilibrium) {
        //     this.setFrictionCoef(0.035);
        // }
    }
    
    // setFrictionCoef(frictionCoef) {
    //     this.options.frictionCoef = frictionCoef;
    // }

    runForces() {
        let forcesStartTime = performance.now();
        if (!this.nodes || !this.edges) {
            return;
        }
        let forceOptions = {
            idealEdgeDistance: this.options.idealEdgeDistance,
            points: this.nodes.map((node) => {
                return node.getCenter();
            }),
            edges: this.edges.map((edge) => {
                return {first: edge.options.data.source, second: edge.options.data.target};
            }),
            gravityCenter: this.getGravityCenter()
        };
        for (let node of this.nodes) {
            if (node.dragging) {
                forceOptions.gravityStrength = 0;
                break;
            }
        }
        let forceLayout = new CSAForceLayout(forceOptions);
        let points = forceLayout.calculateVectors(1);
        this.setAllCenters(points);

        let maxDelta = 0;
        for (let i = 0; i < this.nodes.length; i += 1) {
            if (!this.nodes[i].isFixed() && !this.nodes[i].dragging) {
                maxDelta = Math.max(maxDelta, math.vectorLength({x: points[i].dx, y: points[i].dy}));
            }
        }

        if (maxDelta < this.options.idlePauseThreshold) {
            this.pauseIdle();
        }

        if (this.options.supportsBending) {
            this.getEdgeBendingTransitions().start();
        }

        // This is the time it took to redraw the graph in the last frame
        // Needed to that on higher scale graphs the equilibrium will be reached
        // In the same time, not in the same number of frames
        this._lastForcesFrameTime = performance.now() - forcesStartTime;
    }

    getEdge(a, b) {
        for (let edge of this.edges) {
            if (edge.getSource().getLabel() === "" + a && edge.getTarget().getLabel() === "" + b) {
                return edge;
            }
            if (edge.getSource().getLabel() === "" + b && edge.getTarget().getLabel() === "" + a) {
                return edge;
            }
        }
    }

    getEdgeBendingTransitions() {
        let transitions = new TransitionList();
        for (let i = 0; i < this.edges.length; i += 1) {
            let edge = this.edges[i];

            if (!edge.options.supportsBending) {
                return;
            }

            let edgeStartCoords = edge.getSource().getCenter();
            let edgeEndCoords = edge.getTarget().getCenter();
            let edgeLine = math.lineEquation(edgeStartCoords, edgeEndCoords);
            let biggestNode = null;

            for (let i = 0; i < this.nodes.length; i += 1) {
                if (this.nodes[i] === edge.getSource() || this.nodes[i] === edge.getTarget()) {
                    continue;
                }
                let nodeCoords = this.nodes[i].getCenter();

                // Take the node's projection on this line
                let nodeProjection = math.perpendicularFoot(nodeCoords, edgeLine);

                // If the node almost intersects the line and
                // If the node's projection si on the segment determined by the edge points
                // In other words, if the node almost intersects the segemnt determined by the edge
                if (math.distancePointLine(nodeCoords, edgeLine) <= this.nodes[i].getRadius() + 10 &&
                    math.pointOnSegment(nodeProjection, edgeStartCoords, edgeEndCoords)) {
                    // Store the node with the biggest radius out of all the ones that respect the above restrictions
                    if (biggestNode === null ||
                        this.nodes[i].getRadius() > biggestNode.getRadius()) {
                        biggestNode = this.nodes[i];
                    }
                }
            }

            // Note that the code below is a little different than the one in CSAForceTransition
            // This one moves faster, it's more responsive to movement

            //If there exists a node that almost intersects the edge and current arc radius is 0
            if (biggestNode !== null && edge.options.curveArcRadius === 0) {
                let targetCurveArcRadius = 2.5 * biggestNode.getRadius() * ((math.signedDistancePointLine(
                        biggestNode.getCenter(), edgeLine)) > 0 ? -1 : 1);
                // Transition the edge(in 200 ms) to a bended state, in the direction opposite of where
                // the node is coming from and with a curve arc radius proportional to the incoming node's radius
                transitions.add(edge.bendingTransition(targetCurveArcRadius, 200), false);
            } else if (biggestNode === null && edge.options.curveArcRadius !== 0) {
                // Otherwise, if there is no obstruction but the edge isn't straight
                // Transition the edge(in 200 ms) to be straight
                transitions.add(edge.bendingTransition(0, 200), false);
            }
        }

        return transitions;
    }

    getIndexType() {
        return this.options.indexType;
    }

    isDirected() {
        return this.options.directed;
    }

    setDirected(value) {
        this.options.directed = value;
        for (let i = 0; i < this.edges.length; i += 1) {
            this.edges[i].setDirected(value);
        }
    }

    setFixed(value, highlight=true) {
        this.fixed = value;
        for (let i = 0; i < this.nodes.length; i += 1) {
            let node = this.nodes[i];
            node.setFixed(value, highlight);
        }
    }

    setGravityCenter(newCenter) {
        this.options.gravityCenter = newCenter;
    }

    getGravityCenter() {
        return {
            x: this.options.gravityCenter.x,
            y: this.options.gravityCenter.y
        };
    }

    nodeCount() {
        return this.options.nodes.length;
    }

    getNodeIndex(node) {
        return this.nodes.indexOf(node);
    }
    
    getNode(label) {
        for (let i = 0; i < this.nodes.length; i += 1) {
            if (this.nodes[i].getLabel() === label) {
                return this.nodes[i];
            }
        }
    }

    computeVector(node1, node2, way) {
        const EPS = 1;
        const SLOPE_EPS = 0.15;
        let pathLength = math.distance(node1.getCenter(), node2.getCenter());
        let normalizationUnit;
        // Take a the vector characterizing the slope at the midpoint of the path
        let midPoint = {
            x: (node1.x + node2.x) * 0.5,
            y: (node1.y + node2.y) * 0.5
        };
        let auxiliaryPoint = {
            x: node1.x * 0.55 + node2.x * 0.45,
            y: node1.y * 0.55 + node2.y * 0.45
        };
        let vector = math.normalizeVector({
            x: (auxiliaryPoint.x - midPoint.x),
            y: (auxiliaryPoint.y - midPoint.y)
        });

        // Get the perpendicular vector
        vector = math.rotatePoint(vector, 0, Math.PI/2);
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
    }
    getBentPosition(node1, node2, t, way=1) {
        let midPoint = {
            x: node1.x * t + node2.x * (1 - t),
            y: node1.y * t + node2.y * (1 - t)
        };
        let vector = this.computeVector(node1, node2, way);
        if (t > 0.5) {
            t = 1 - t;
        }
        return {
            x: midPoint.x + vector.x * t * 40,
            y: midPoint.y + vector.y * t * 40
        };
    }

    // The Transitions start here
    changeColorTransition(color, duration, dependsOn=[], startTime=0) {
        var transitionList = new TransitionList();
        transitionList.dependsOn = dependsOn;
        for (let i = 0; i < this.nodes.length; i += 1) {
            let node = this.nodes[i];
            transitionList.add(node.changeColorTransition(color, duration), false);
        }
        for (let i = 0; i < this.edges.length; i += 1) {
            let edge = this.edges[i];
            transitionList.add(edge.changeColorTransition(color, duration), false);
        }
        transitionList.setStartTime(startTime);
        return transitionList;
    }

    mergeNodesAnimated(toMerge=[], duration, dependsOn=[], startTime=0) {
        let transitionList = new TransitionList();
        transitionList.dependsOn = dependsOn;

        let centerX = 0;
        let centerY = 0;
        for (let i of toMerge) {
            this.nodes[i].setFixed(true);
            centerX += this.nodes[i].x;
            centerY += this.nodes[i].y;
        }
        centerX /= toMerge.length;
        centerY /= toMerge.length;

        let moveStartTime = transitionList.getLength();

        for (let i of toMerge) {
            transitionList.add(this.nodes[i].moveTransition({
                newCoords: {x: centerX, y: centerY},
                duration: duration,
                startTime: moveStartTime,
                dependsOn: dependsOn
            }));
        }

        transitionList.setStartTime(startTime);
        return transitionList;
    }

    swapNodeLabelsTransition(node1, node2, duration, dependsOn=[], startTime=0) {
        let label1 = node1.label;
        let label2 = node2.label;
        let swap = () => {
            let dataLabel1 = node1.options.data.label;
            let dataLabel2 = node2.options.data.label;
            node1.setLabel(dataLabel2);
            node2.setLabel(dataLabel1);
            let node1LabelX = node1.label.options.x;
            let node1LabelY = node1.label.options.y;
            let node2LabelX = node1.label.options.x;
            let node2LabelY = node1.label.options.y;
            node1.label.setPosition(node2LabelX, node2LabelY);
            node2.label.setPosition(node1LabelX, node1LabelY);
        };
        let firstHalf = new Transition({
            func: (t) => {
                t = 1 - t * 0.5;
                label1.setPosition(
                    this.getBentPosition(node1, node2, t).x,
                    this.getBentPosition(node1, node2, t).y
                );
                label2.setPosition(
                    this.getBentPosition(node2, node1, t).x,
                    this.getBentPosition(node2, node1, t).y
                );
            },
            duration: duration / 2,
            startTime: 0
        });
        let modifier = new Modifier({
            func: () => {
                swap();
            },
            reverseFunc: () => {
                swap();
            },
            startTime: duration / 2,
            dependsOn: [firstHalf]
        });
        let secondHalf = new Transition({
            func: (t) => {
                t = 0.5 - t * 0.5;
                label2.setPosition(
                    this.getBentPosition(node1, node2, t).x,
                    this.getBentPosition(node1, node2, t).y
                );
                label1.setPosition(
                    this.getBentPosition(node2, node1, t).x,
                    this.getBentPosition(node2, node1, t).y
                );
            },
            duration: duration / 2,
            startTime: duration / 2,
            dependsOn: [modifier]
        });
        let result = new TransitionList();
        result.dependsOn = dependsOn;
        result.push(firstHalf, false);
        result.push(modifier, false);
        result.push(secondHalf, false);
        result.setStartTime(startTime);
        return result;
    }

    addEdgeTransition(edgeData, duration, dependsOn=[], startTime=0, inMovie=false) {
        var transitionList = new TransitionList();
        transitionList.dependsOn = dependsOn;

        let edge = <GraphEdge graph={this} data={edgeData} {...edgeData.options} opacity={0}/>;
        let addEdgeModifier = new Modifier({
            func: () => {
                this.options.edges.push(edge.options.data);
                this.edgeGroup.appendChild(edge);
            },
            reverseFunc: () => {
                eraseFirst(this.options.edges, edge.options.data);
                this.edgeGroup.eraseChild(edge, !inMovie);
            },
            startTime: transitionList.getLength()
        });
        transitionList.add(addEdgeModifier, false);

        transitionList.add(edge.changeOpacityTransition(1, duration, [addEdgeModifier], transitionList.getLength()), false);

        transitionList.setStartTime(startTime);
        return transitionList;
    }

    addNodeTransition(nodeData, duration, dependsOn=[], startTime=0, inMovie=false) {
        var transitionList = new TransitionList();
        transitionList.dependsOn = dependsOn;

        nodeData = nodeData || {};
        nodeData.center = nodeData.center || {
            x: Math.random() * this.options.box.width + this.options.box.x,
            y: Math.random() * this.options.box.height + this.options.box.y
        };
        let nodeOptions = Object.assign({}, this.options.nodeOptions, nodeData.options);
        let node = <GraphNode graph={this} data={nodeData} {...nodeOptions} opacity={0}/>;

        let addNodeModifier = new Modifier({
            func: () => {
                this.options.nodes.push(node.options.data);
                this.nodeGroup.appendChild(node);
            },
            reverseFunc: () => {
                eraseFirst(this.options.nodes, node.options.data);
                this.nodeGroup.eraseChild(node, !inMovie);
            },
            startTime: transitionList.getLength()
        });
        transitionList.add(addNodeModifier, false);

        transitionList.add(node.changeOpacityTransition(1, duration, [addNodeModifier], transitionList.getLength()), false);

        transitionList.setStartTime(startTime);
        return transitionList;
    }

    removeEdgeTransition(edge, duration, dependsOn=[], startTime=0, inMovie=false) {
        var transitionList = new TransitionList();
        transitionList.dependsOn = dependsOn;

        let changeOpacityTransition = edge.changeOpacityTransition(0, duration, [], transitionList.getLength());
        transitionList.add(changeOpacityTransition, false);
        transitionList.add(new Modifier({
            func: () => {
                eraseFirst(this.options.edges, edge.options.data);
                this.edgeGroup.eraseChild(edge, !inMovie);
            },
            reverseFunc: () => {
                this.options.edges.unshift(edge.options.data);
                this.edgeGroup.appendChild(edge);
            },
            dependsOn: [changeOpacityTransition],
            startTime: transitionList.getLength()
        }), false);

        transitionList.setStartTime(startTime);
        return transitionList;
    }

    removeNodeTransition(node, duration, dependsOn=[], startTime=0, inMovie=false) {
        var transitionList = new TransitionList();
        transitionList.dependsOn = dependsOn;

        // Remove incident edges
        let edges = node.getIncidentEdges();
        let edgeOpacityStartTime = transitionList.getLength();
        for (let edge of edges) {
            transitionList.add(this.removeEdgeTransition(edge, duration, [], edgeOpacityStartTime, inMovie), false);
        }

        // Change node opacity
        let nodeOpacityTransition = node.changeOpacityTransition(0, duration, [], transitionList.getLength());
        transitionList.add(nodeOpacityTransition, false);

        transitionList.add(new Modifier({
            func: (context) => {
                context["nodeIndex"] = this.nodes.indexOf(node);
                eraseFirst(this.options.nodes, node.options.data);
                this.nodeGroup.eraseChild(node, !inMovie);

                for (let edge of this.edges) {
                    if (edge.options.data.source > context["nodeIndex"]) {
                        edge.options.data.source -= 1;
                    }
                    if (edge.options.data.target > context["nodeIndex"]) {
                        edge.options.data.target -= 1;
                    }
                }
            },
            reverseFunc: (context) => {
                this.options.nodes.splice(context["nodeIndex"], 0, node.options.data);
                this.nodeGroup.options.children.splice(context["nodeIndex"], 0, node);
                node.mount(this.nodeGroup, null);
                for (let edge of this.edges) {
                    if (edge.options.data.source >= context["nodeIndex"]) {
                        edge.options.data.source += 1;
                    }
                    if (edge.options.data.target >= context["nodeIndex"]) {
                        edge.options.data.target += 1;
                    }
                }
            },
            context: {},
            dependsOn: [nodeOpacityTransition],
            startTime: transitionList.getLength()
        }), false);

        transitionList.setStartTime(startTime);
        return transitionList;
    }

    showLabelsTransition(duration, dependsOn=[], startTime=0) {
        var transitionList = new TransitionList();
        transitionList.dependsOn = dependsOn;

        let showLabelsStartTime = transitionList.getLength();
        for (let node of this.nodes) {
            transitionList.add(node.label.changeOpacityTransition(1, duration, [], showLabelsStartTime), false);
        }

        transitionList.setStartTime(startTime);
        return transitionList;
    }
}

export class GraphSVG extends SVG.SVGRoot {
    getDefaultOptions() {
        return {
            width: 300,
            height: 200
        }
    }

    getNodeAttributes() {
        let attr = super.getNodeAttributes();
        attr.setStyle("height", this.options.height + "px");
        attr.setStyle("width", this.options.width + "px");
        return attr;
    }

    setOptions(options) {
        super.setOptions(options);
    }

    render() {
        //TODO: do NOT use {...this.options} in a new object
        return [<Graph ref="graph" {...this.options}
            box={{x:0, y:0, width: this.options.width, height:this.options.height}} />];
    }
}
