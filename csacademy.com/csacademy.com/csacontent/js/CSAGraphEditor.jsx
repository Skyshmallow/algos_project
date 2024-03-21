import {UI} from "../../stemjs/src/ui/UIBase.js";
import {SVG} from "../../stemjs/src/ui/svg/SVGBase.js";
import {Button} from "../../stemjs/src/ui/button/Button.jsx";
import {ButtonGroup, RadioButtonGroup} from "../../stemjs/src/ui/button/ButtonGroup.jsx";
import {Panel} from "../../stemjs/src/ui/UIPrimitives.jsx";
import {registerStyle} from "../../stemjs/src/ui/style/Theme.js";
import {NumberInput, Select, TextInput, TextArea} from "../../stemjs/src/ui/input/Input.jsx";
import {Level} from "../../stemjs/src/ui/Constants.js";
import {CodeEditor} from "../../stemjs/src/ui/CodeEditor.jsx";
import {Device} from "../../stemjs/src/base/Device.js";
import {consoleTokenizer} from "../../csabase/js/util.js";

import {DropdownListStyle} from "./CSAAppStyle.jsx";
import {computeDFSCoordsDirected, computeDFSCoordsUndirected} from "./DFSCoords.js";
import {GraphEdge} from "./CSAGraphEdge.jsx";
import {GraphNode} from "./CSAGraphNode.jsx";
import {Graph} from "./CSAGraph.jsx";


class GraphCodeEditor extends CodeEditor {
    onDelayedMount() {
        super.onDelayedMount();
        this.setAceRendererOption("showLineNumber", false);
    }
}

class GraphInputPanel extends Panel {
    setOptions(options) {
        super.setOptions(options);
        this.nodes = new Map();
        this.edges = new Map();
    }

    getNodeString(node) {
        return node.getLabel();
    }

    getEdgeString(edge) {
        return edge.getSource().getLabel() + " "
                 + edge.getTarget().getLabel()
                 + (edge.getLabel() ? " " + edge.getLabel() : "");
    }

    addNode(node) {
        if (this.nodes.has(node)) {
            return;
        }
        let line = 0;
        for (let value of this.nodes.values()) {
            for (let otherLine of value) {
                line = Math.max(otherLine + 1, line);
            }
        }
        this.nodes.set(node, [line]);
        if (line === 0) {
            this.graphDataEditor.append(this.getNodeString(node) + "\n");
        } else {
            this.graphDataEditor.insertAtLine(line, "\n" + this.getNodeString(node));
        }
        for (let edge of this.edges.keys()) {
            if (this.edges.get(edge) >= line) {
                this.edges.set(edge, this.edges.get(edge) + 1);
            }
        }
        for (let otherNode of this.nodes.keys()) {
            if (otherNode !== node) {
                let lines = this.nodes.get(otherNode);
                for (let i = 0; i < lines.length; i += 1) {
                    if (lines[i] >= line) {
                        lines[i] += 1;
                    }
                }
            }
        }
        this.nodeCountEditor.setValue(this.graph.nodes.length.toString());
    }

    addEdge(edge) {
        let line = 0;
        for (let value of this.edges.values()) {
            line = Math.max(line, value + 1);
        }
        for (let value of this.nodes.values()) {
            for (let otherLine of value) {
                line = Math.max(otherLine + 1, line);
            }
        }
        this.edges.set(edge, line);
        this.graphDataEditor.append(this.getEdgeString(edge) + "\n");
    }

    deleteNode(node) {
        if (!this.nodes.has(node)) {
            return;
        }
        let lines = this.nodes.get(node);
        for (let line of lines) {
            for (let edge of this.edges.keys()) {
                if (this.edges.get(edge) >= line) {
                    this.edges.set(edge, this.edges.get(edge) - 1);
                }
            }
            for (let otherNode of this.nodes.keys()) {
                if (otherNode !== node) {
                    let otherNodeLines = this.nodes.get(otherNode);
                    for (let i = 0; i < otherNodeLines.length; i += 1) {
                        if (otherNodeLines[i] >= line) {
                            otherNodeLines[i] -= 1;
                        }
                    }
                }
            }
            this.graphDataEditor.removeLine(line);
        }
        this.nodes.delete(node);
        this.nodeCountEditor.setValue(this.graph.nodes.length.toString());
    }

    deleteEdge(edge) {
        if (!this.edges.has(edge)) {
            return;
        }
        let line = this.edges.get(edge);
        for (let otherEdge of this.edges.keys()) {
            if (this.edges.get(otherEdge) >= line) {
                this.edges.set(otherEdge, this.edges.get(otherEdge) - 1);
            }
        }
        for (let lines of this.nodes.values()) {
            for (let i = 0; i < lines.length; i += 1) {
                if (lines[i] >= line) {
                    lines[i] -= 1;
                }
            }
        }
        this.graphDataEditor.removeLine(line);
        this.edges.delete(edge);
    }

    changeNodeLabel(node) {
        let lines = this.nodes.get(node) || [];
        for (let line of lines) {
            this.graphDataEditor.replaceLine(line, this.getNodeString(node) + "\n");
        }
        for (let edge of node.getIncidentEdges()) {
            let edgeLine = this.edges.get(edge);
            this.graphDataEditor.replaceLine(edgeLine, this.getEdgeString(edge) + "\n");
        }
    }

    changeEdgeLabel(edge) {
        let line = this.edges.get(edge);
        if (!line) {
            return;
        }
        this.graphDataEditor.replaceLine(line, this.getEdgeString(edge) + "\n");
    }

    setNewData(data) {
        this.nodes.clear();
        this.edges.clear();
        let lines = data.split("\n");

        let getGraphData = () => {
            let annotations = [];

            let userNodes = [];
            let userEdges = [];

            for (let index = 0; index < lines.length; index += 1) {
                let dataString = lines[index];
                let graphElements;
                let sourceLabel, targetLabel, costLabel;
                try {
                    graphElements = consoleTokenizer(dataString);
                } catch (message) {
                    if (typeof message === "string") {
                        annotations.push({
                            row: index,
                            column: 1,
                            text: message,
                            type: "error"
                        });
                    }
                }
                if (graphElements == null) {
                    continue;
                }
                sourceLabel = (graphElements.length >= 1 ? graphElements[0] : null);
                targetLabel = (graphElements.length >= 2 ? graphElements[1] : null);
                costLabel = (graphElements.length >= 3 ? graphElements[2] : "");

                if (graphElements.length === 1) {
                    if (userNodes.indexOf(sourceLabel) === -1) {
                        userNodes.push(sourceLabel);
                    }
                } else if (graphElements.length === 2 || graphElements.length === 3) {
                    // Self loops are not allowed
                    if (sourceLabel == targetLabel) {
                        continue;
                    }
                    // Add source label in user nodes set
                    if (userNodes.indexOf(sourceLabel) === -1) {
                        userNodes.push(sourceLabel);
                    }
                    // Add target label in user nodes set
                    if (userNodes.indexOf(targetLabel) === -1) {
                        userNodes.push(targetLabel);
                    }

                    // Insert the edge in edge array
                    userEdges.push({
                        source: sourceLabel,
                        target: targetLabel,
                        cost: costLabel
                    });
                } else if (graphElements.length > 3) {
                    annotations.push({
                        row: index,
                        column: 1,
                        text: "No more than 4 elements allowed",
                        type: "error"
                    });
                }
            }
            this.graphDataEditor.setAnnotations(annotations);

            return [userNodes, userEdges];
        };

        let deleteBadEdges = (edges) => {
            // Use a copy, as elements will be deleted from userEdges array to allow multiple edges support.
            let userEdgesCopy = [...edges];

            // Find the graph edges that should be deleted
            for (let i = 0; i < this.graph.edges.length; i += 1) {
                let edge = this.graph.edges[i];

                let sourceLabel = edge.getSource().getLabel();
                let targetLabel = edge.getTarget().getLabel();
                let costLabel = edge.getLabel();
                let edgeExists = false;

                // Check if the edge exists and insert it in the bad edges array if it doesn't
                for (let j = 0; j < userEdgesCopy.length; j += 1) {
                    if (sourceLabel == userEdgesCopy[j].source && targetLabel == userEdgesCopy[j].target &&
                            costLabel === userEdgesCopy[j].cost) {
                        edgeExists = true;
                        userEdgesCopy.splice(j, 1);
                        break;
                    }
                }
                if (!edgeExists) {
                    this.graph.removeEdge(edge);
                    i -= 1;
                }
            }
        };

        let deleteBadNodes = (nodes) => {
            // Find the graph nodes that should be deleted
            for (let i = 0; i < this.graph.nodes.length; i += 1) {
                let node = this.graph.nodes[i];
                let nodeExists = false;

                // Check if the node exists
                for (let j = 0; j < nodes.length; j += 1) {
                    if (node.getLabel() == nodes[j]) {
                        nodeExists = true;
                        break;
                    }
                }
                if (!nodeExists) {
                    this.graph.removeNode(node);
                    i -= 1;
                }
            }
        };

        let createNewNodes = (nodes) => {
            for (let nodeString of nodes) {
                let nodeExists = false;
                // Check if the node exists
                for (let node of this.graph.nodes) {
                    if (nodeString == node.getLabel()) {
                        nodeExists = true;
                        break;
                    }
                }
                if (!nodeExists) {
                    this.graph.addNode(<GraphNode data={{
                        label: nodeString
                    }} />);
                }
            }
        };

        let createNewEdges = (edges) => {
            let edgeArrayCopy = [...this.graph.edges];

            for (let edge of edges) {
                // Check if the edge exists
                let appears = false;
                for (let i = 0; i < edgeArrayCopy.length; i += 1) {
                    if (edge.source == edgeArrayCopy[i].getSource().getLabel() &&
                            edge.target == edgeArrayCopy[i].getTarget().getLabel() &&
                            edge.cost == edgeArrayCopy[i].getLabel()) {
                        edgeArrayCopy.splice(i, 1);
                        appears = true;
                        break;
                    }
                }
                if (!appears) {
                    let sourceIndex, targetIndex;
                    // Find index of the source
                    for (let i = 0; i < this.graph.nodes.length; i += 1) {
                        if (this.graph.nodes[i].getLabel() == edge.source) {
                            sourceIndex = i;
                        }
                        if (this.graph.nodes[i].getLabel() == edge.target) {
                            targetIndex = i;
                        }
                    }
                    // Create the new edge
                    this.graph.addEdge(<GraphEdge data={{
                                                                source: sourceIndex,
                                                                target: targetIndex
                                                            }}
                                                         label={edge.cost}
                                                         directed={this.graph.isDirected()} />);
                }
            }
        };


        // Set the view mode to force to allow smooth creation/deletion of elements
        this.graph.enterDrawMode();

        let graphData = getGraphData(), nodes, edges;
        if (!graphData) {
            nodes = edges = [];
        } else {
            nodes = graphData[0];
            edges = graphData[1];
        }
        deleteBadEdges(edges);
        deleteBadNodes(nodes);
        createNewNodes(nodes);
        createNewEdges(edges);

        this.graph.removeListeners();
        this.graph.enterForceMode();

        // Update the node count input
        this.nodeCountEditor.setValue(this.graph.nodes.length.toString());

        // Recalculate the nodes and edges lines
        for (let i = 0; i < lines.length; i += 1) {
            let tokens;
            try {
                tokens = consoleTokenizer(lines[i]);
            } catch (message) {
                continue;
            }
            if (tokens.length === 0) {
                continue;
            }
            if (tokens.length === 1) {
                for (let node of this.graph.nodes) {
                    if (node.getLabel().toString() == tokens[0]) {
                        if (!this.nodes.has(node)) {
                            this.nodes.set(node, []);
                        }
                        this.nodes.get(node).push(i);
                    }
                }
            } else {
                for (let edge of this.graph.edges) {
                    if (tokens[0] != edge.getSource().getLabel()) {
                        continue;
                    }
                    if (tokens[1] != edge.getTarget().getLabel()) {
                        continue;
                    }
                    if (tokens.length === 3 && tokens[2] != edge.getLabel()) {
                        continue;
                    }
                    if (this.edges.has(edge)) {
                        continue;
                    }
                    this.edges.set(edge, i);
                    break;
                }
            }
        }
    }

    onMount() {
        this.nodeCountEditor.setReadOnly(true);
        this.nodeCountEditor.setAceOptions({
            autoScrollEditorIntoView: false,
            highlightActiveLine: false
        });

        this.addListener("changeInput", (data) => {
            this._selfChanged = true;
            switch(data.type) {
                case "newNode":
                    this.addNode(data.node);
                    break;
                case "newEdge":
                    this.addEdge(data.edge);
                    break;
                case "deleteNode":
                    for (let edge of data.node.getIncidentEdges()) {
                        this.deleteEdge(edge);
                    }
                    this.deleteNode(data.node);
                    break;
                case "deleteEdge":
                    this.deleteEdge(data.edge);
                    break;
                case "changeNodeLabel":
                    this.changeNodeLabel(data.node);
                    break;
                case "changeEdgeLabel":
                    this.changeEdgeLabel(data.edge);
                    break;
            }
            this._selfChanged = false;
        });

        this._timeout = null;
        this.graphDataEditor.addAceSessionChangeListener(() => {
            /// If the change is created by editing the graph
            if (this._selfChanged) {
                return;
            }
            this.graph.pauseForce();
            if (this._timeout) {
                clearTimeout(this._timeout);
            }
            this._timeout = setTimeout(() => {
                this.setNewData(this.graphDataEditor.getValue());
                this.graph.unpauseForce();
                this._timeout = null;
            }, 500);
        });
    }

    render() {
        return [
            <label> Node Count: </label>,
            <GraphCodeEditor ref="nodeCountEditor" value="" style={{width: "100%", height: "17px"}} />,
            <label> Graph Data: </label>,
            <GraphCodeEditor ref="graphDataEditor" value="" style={{width: "100%", height: "300px"}} />
        ];
    }
}

@registerStyle(DropdownListStyle)
class GraphEditorLegend extends Panel {
    render() {
        return [<div ref="Force">
                    <h4>Force mode</h4>
                    <p>In this mode, there is a gravitation pull that acts on the nodes and keeps them in
                        the center of the drawing area. Also, the nodes exert a force on each other, making
                        the whole graph look and act like real objects in space.</p>

                    <p>Ways you can interact with the graph:</p>
                    <ul>
                        <li>Nodes support drag and drop.</li>
                        <li>At the end of the drop the node becomes fixed.</li>
                        <li>You can fix/unfix a node by simple click.</li>
                    </ul>
                </div>,
                <div ref="Draw">
                    <h4>Draw mode</h4>
                    <p>This mode allows you to draw new nodes and/or edges.</p>

                    <p>Ways you can interact with the graph:</p>
                    <ul>
                        <li>Clicking anywhere on the graph canvas creates a new node.</li>
                        <li>Clicking on a node starts the drawing process of a new edge.</li>
                        <li>To cancel the new edge, click anywhere on the canvas.</li>
                        <li>To finish drawing the edge, click on the desired neighbour.</li>
                    </ul>
                </div>,
                <div ref="Edit">
                    <h4>Edit mode</h4>
                    <p>This mode allows you to edit nodes' labels and edges' costs.</p>

                    <p>Ways you can interact with the graph:</p>
                    <ul>
                        <li>Click on a node label to change it. Now you can start typing in order to edit the
                            label. Click anywhere or press Enter to finish editing.</li>
                        <li>Click on an edge to change it's cost. Now you can start typing in order to edit the
                            cost. Click anywhere or press Enter to finish editing.</li>
                    </ul>
                </div>,
                <div ref="Delete">
                    <h4>Delete mode</h4>
                    <p>This mode allows you to delete nodes and/or edges.</p>

                    <p>Ways you can interact with the graph:</p>
                    <ul>
                        <li>Click on a node to delete it</li>
                        <li>Click on an edge to delete it.</li>
                    </ul>
                </div>,
                <div ref="Config" style={{"padding-left": "20px"}}>
                    <div style={{"margin-top": "20px"}}>
                        <div HTMLtitle="Set the size of nodes"
                             className="fa fa-question-circle" style={{"margin-right": "3px"}}> </div>
                        <div style={{width: "50%", display: "inline-block"}}>Node radius:</div>
                        <NumberInput ref="nodeSize" min="3" max="25" value="19"
                                            style={{display: "inline-block", width: "30%", "padding-left": "3px"}}/>
                    </div>
                    <div style={{"margin-top": "20px"}}>
                        <div HTMLtitle="How much nodes connected by an edge attract each other"
                             className="fa fa-question-circle" style={{"margin-right": "3px"}}> </div>
                        <div style={{width: "50%", display: "inline-block"}}>Edge ideal length:</div>
                        <NumberInput ref="edgeIdealLength" min="40" max="200" value="140"
                                            style={{display: "inline-block", width: "30%", "padding-left": "3px"}}/>
                    </div>
                    <div style={{"margin-top": "20px"}}>
                        <div style={{width: "50%", display: "inline-block"}}>Node background:</div>
                        <Select ref="nodeFillSelect" options={["white", "red", "blue", "black", "purple", "orange", "green"]}/>
                    </div>
                    <div style={{"margin-top": "20px"}}>
                        <div style={{width: "50%", display: "inline-block"}}>Node color:</div>
                        <Select ref="nodeStrokeSelect" selected={"black"}
                                   options={["white", "red", "blue", "black", "purple", "orange", "green"]}/>
                    </div>
                    <div style={{"margin-top": "20px"}}>
                        <div style={{width: "50%", display: "inline-block"}}>Edge color:</div>
                        <Select ref="edgeColorSelect" selected={"black"}
                                   options={["white", "red", "blue", "black", "purple", "orange", "green"]}/>
                    </div>
                    <div>
                        <Button ref="runCommandButton" level={Level.INFO} style={{"border-radius": "0"}}>
                            Run Command
                        </Button>
                        <div ref="commandsList" style={{width: "8.2em"}} className={`${this.styleSheet.default} hidden`}>
                            <div ref="fixAllNodesButton">
                                Fix all nodes
                            </div>
                            <div ref="unfixAllNodesButton">
                                Unfix all nodes
                            </div>
                            <div ref="treeButton">
                                Arrange as tree
                            </div>
                        </div>
                    </div>
                </div>
        ];
    }

    showMode() {
        this.Force.hide();
        this.Draw.hide();
        this.Edit.hide();
        this.Delete.hide();
        this.Config.hide();
        this[this.options.viewMode].show();
    }

    onMount() {
        this.showMode();
        this.addListener("changeLegend", (value) => {
            this.options.viewMode = value;
            this.showMode();
        });
        this.nodeSize.addNodeListener("change", () => {
            this.graph.dispatch("changeNodeRadius", parseInt(this.nodeSize.getValue()));
        });
        this.edgeIdealLength.addNodeListener("change", () => {
            this.graph.dispatch("changeEdgeIdealLength", parseInt(this.edgeIdealLength.getValue()));
        });
        this.nodeFillSelect.addNodeListener("change", () => {
            this.graph.dispatch("changeNodeFill", this.nodeFillSelect.get());
        });
        this.nodeStrokeSelect.addNodeListener("change", () => {
            this.graph.dispatch("changeNodeStroke", this.nodeStrokeSelect.get());
        });
        this.edgeColorSelect.addNodeListener("change", () => {
            this.graph.dispatch("changeEdgeColor", this.edgeColorSelect.get());
        });

        this.runCommandButton.addClickListener(() => {this.commandsList.toggleClass("hidden");});

        this.treeButton.addClickListener(() => {
            this.graph.dispatch("viewTree");
        });
        this.fixAllNodesButton.addClickListener(() => {
            for (let node of this.graph.nodes) {
                node.setFixed(true);
            }
        });
        this.unfixAllNodesButton.addClickListener(() => {
            for (let node of this.graph.nodes) {
                node.setFixed(false);
            }
            this.graph.runForces();
        });
    }
}

class EditableGraph extends Graph {
    setOptions(options) {
        options.nodeRadius = GraphNode.prototype.getDefaultOptions().circleAttr.radius;
        super.setOptions(options);
    }

    removeListeners() {
        for (let node of this.nodes) {
            node.removeClickListener(node.click);
            if (this.mode === "Edit" || this.mode === "Draw") {
                node.addClickListener(node._fixNodeCallback);
            }
        }
        for (let edge of this.edges) {
            edge.removeClickListener(edge.click);
        }
        if (this.mode === "Draw") {
            this.parent.removeClickListener(this.parent.click);
        }
    }

    enterForceMode() {
        this.unpauseForce();
        this.mode = "Force";
    }

    enterDrawMode() {
        this.mode = "Draw";
        this.pauseForce();

        let nodeClickFunc = (node) => {
            for (let otherNode of this.nodes) {
                otherNode.removeClickListener(otherNode.click);
            }
            // start an edge draw
            let line = <SVG.Line x1={node.x} x2={node.x} y1={node.y} y2={node.y} />;
            line.mount(this.parent, this.node);

            let offsets = this.parent.node.getBoundingClientRect();
            let moveLine = (event) => {
                if (line.node) {
                    line.setAttribute("x2", Device.getEventX(event) - offsets.left);
                    line.setAttribute("y2", Device.getEventY(event) - offsets.top);
                }
            };
            window.addEventListener("mousemove", moveLine);

            let finishEdgeDraw = (event) => {
                for (let target of this.nodes) {
                    if (target !== node && (event.target === target.circle.node || event.target === target.label.node)) {
                        let edge = this.addEdge(<GraphEdge data={{  source: this.nodes.indexOf(node),
                                                                target: this.nodes.indexOf(target)}} directed={this.isDirected()} />);
                        this.dispatch("changeInput", {
                            type: "newEdge",
                            edge: edge
                        });
                        break;
                    }
                }
                this.parent.removeClickListener(finishEdgeDraw);
                window.removeEventListener("mousemove", moveLine);
                line.destroyNode();
                for (let otherNode of this.nodes) {
                    otherNode.addClickListener(otherNode.click);
                }
            };
            this.parent.addClickListener(finishEdgeDraw);
        };

        this.parent.click = (event) => {
            if (event.target !== this.parent.node) {
                return;
            }
            let offsets = this.parent.node.getBoundingClientRect();
            let node = this.addNode(<GraphNode data={{
                center: {
                    x: Device.getEventX(event) - offsets.left,
                    y: Device.getEventY(event) - offsets.top
                },
                label: this.getNextLabel()
            }}
            />);
            node.removeClickListener(node._fixNodeCallback);
            node.click = () => {
                nodeClickFunc(node);
            };
            node.addClickListener(node.click);

            this.dispatch("changeInput", {
                type: "newNode",
                node: node
            });
        };
        this.parent.addClickListener(this.parent.click);
        for (let node of this.nodes) {
            node.removeClickListener(node._fixNodeCallback);
            node.click = () => {
                nodeClickFunc(node);
            };
            node.addClickListener(node.click);
        }
    }

    enterEditMode() {
        this.mode = "Edit";
        this.pauseForce();
        for (let node of this.nodes) {
            node.click = () => {
                let oldLabel = node.getLabel();
                node.setLabel("");
                this.dispatch("needTextArea", {
                    coords: node.getCenter(),
                    initialValue: oldLabel,
                    target: node
                });
                node.addListener("doneEditing", (value) => {
                    for (let otherNode of this.nodes) {
                        if (otherNode !== node && otherNode.getLabel() == value) {
                            value = this.getNextLabel();
                            break;
                        }
                    }
                    node.setLabel(value);
                    this.dispatch("changeInput", {
                        type: "changeNodeLabel",
                        node: node
                    });
                });
            };
            node.addClickListener(node.click);
            node.removeClickListener(node._fixNodeCallback);
        }
        for (let edge of this.edges) {
            edge.click = (event) => {
                event.stopPropagation();
                event.preventDefault();
                if (edge._clicked) {
                    return;
                }
                edge._clicked = true;
                setTimeout(() => {edge._clicked = false;}, 20);
                let oldLabel = edge.getLabel() || "";
                edge.setLabel("");
                this.dispatch("needTextArea", {
                    coords: {x: edge.costLabel.getX(), y: edge.costLabel.getY()},
                    initialValue: oldLabel,
                    target: edge
                });
                edge.addListener("doneEditing", (value) => {
                    edge.setLabel(value);
                    this.dispatch("changeInput", {
                        type: "changeEdgeLabel",
                        edge: edge
                    });
                });
            };
            edge.addClickListener(edge.click);
        }
    }

    enterDeleteMode() {
        this.mode = "Delete";
        this.pauseForce();
        for (let node of this.nodes) {
            node.click = () => {
                this.dispatch("changeInput", {
                    type: "deleteNode",
                    node: node
                });
                this.removeNode(node);
            };
            node.addClickListener(node.click);
        }
        for (let edge of this.edges) {
            edge.click = () => {
                this.dispatch("changeInput", {
                    type: "deleteEdge",
                    edge: edge
                });
                this.removeEdge(edge);
            };
            edge.addClickListener(edge.click);
        }
    }

    dispatchInitialGraphData() {
        for (let node of this.nodes) {
            this.dispatch("changeInput", {
                type: "newNode",
                node: node
            });
        }
        for (let edge of this.edges) {
            this.dispatch("changeInput", {
                type: "newEdge",
                edge: edge
            })
        }
    }

    onMount() {
        super.onMount();
        this.addListener("resize", () => {
            let oldHeight = this.getBox().height,
                oldWidth = this.getBox().width;
            this.setBox({
                x: 20,
                y: 20,
                height: this.parent.getHeight() - 40,
                width: this.parent.getWidth() - 40
            });
            this.options.gravityCenterXPercentage = 0.5;
            this.options.gravityCenterYPercentage = 0.5;
            this.options.gravityCenter = {
                x: this.parent.getWidth() / 2,
                y: this.parent.getHeight() / 2
            };
            for (let node of this.nodes) {
                node.setCenter({
                    x: node.getCenter().x * this.getBox().width / oldWidth,
                    y: node.getCenter().y * this.getBox().height / oldHeight
                });
            }
        });

        this.enterForceMode();
        this.addListener("changeViewMode", (view) => {
            this.removeListeners();
            switch(view) {
                case "Force":
                    this.enterForceMode();
                    break;
                case "Draw":
                    this.enterDrawMode();
                    break;
                case "Edit":
                    this.enterEditMode();
                    break;
                case "Delete":
                    this.enterDeleteMode();
            }
        });
        this.addListener("changeDirected", (value) => {
            if (value === "directed") {
                this.setDirected(true);
            } else {
                this.setDirected(false);
            }
        });
        this.addListener("changeIndexType", (value) => {
            this.options.indexType = value;
            this.populateNodeData();
            for (let i = 0; i < this.nodes.length; i += 1) {
                this.nodes[i].setLabel(this.options.nodes[i].label);
                this.dispatch("changeInput", {
                    type: "changeNodeLabel",
                    node: this.nodes[i]
                });
            }
        });

        this.addListener("changeNodeRadius", (value) => {
            value = Math.max(value, 3);
            value = Math.min(value, 30);
            this.setNodeRadius(value);
        });
        this.addListener("changeEdgeIdealLength", (value) => {
            value = Math.max(value, 40);
            this.setIdealEdgeDistance(value);
        });
        this.addListener("changeNodeFill", (value) => {
            this.options.nodeFill = value;
            for (let node of this.nodes) {
                node.setInnerColor(value);
            }
        });
        this.addListener("changeNodeStroke", (value) => {
            this.options.nodeStroke = value;
            for (let node of this.nodes) {
                node.setColor(value);
            }
        });
        this.addListener("changeEdgeColor", (value) => {
            this.options.edgeColor = value;
            for (let edge of this.edges) {
                edge.setColor(value);
            }
        });

        this.addListener("viewTree", () => {
            let coords = this.getDFSCoords();
            for (let node of this.nodes) {
                node.setFixed(true);
                node.setCenter(coords.get(node));
            }
        })
    }

    getDFSCoords() {
        if (this.isDirected()) {
            return computeDFSCoordsDirected(this);
        }
        return computeDFSCoordsUndirected(this);
    }

    setNodeRadius(value) {
        this.options.nodeRadius = value;
        for (let node of this.nodes) {
            node.setRadius(value);
        }
    }

    setIdealEdgeDistance(value) {
        this.options.idealEdgeDistance = value;
        this.runForces();
    }

    getNextLabel() {
        let v = [];
        for (let node of this.nodes) {
            v.push(parseInt(node.getLabel()));
        }
        let start = 1;
        if (this.getIndexType() === "0") {
            start = 0;
        }
        for (let i = start; ; i += 1) {
            if (v.indexOf(i) === -1) {
                return i;
            }
        }
    }
}

class GraphEditor extends UI.Element {
    onMount() {
        setTimeout(() => {
            this.resize(window.innerHeight - 200, (window.innerWidth) * 80 / 100 - 700);
            // dispatching the original graph data
            this.graph.dispatchInitialGraphData();
        }, 0);

        window.addEventListener("resize", () => {
            this.resize(window.innerHeight - 200, (window.innerWidth) * 80 / 100 - 700);
        });

        this.inputPanel.graph = this.graph;
        this.editorLegend.graph = this.graph;

        // toggle buttons (Directed/Undirected, IndexType, View Mode)
        this.toggleDirected.addListener("setIndex", (event) => {
            this.graph.dispatch("changeDirected", event.value.toLocaleLowerCase());
        });

        this.toggleIndexType.addListener("setIndex", (event) => {
            if (event.value === "0-index") {
                event.value = "0";
            } else if (event.value === "1-index") {
                event.value = "1";
            } else if (event.value === "Custom Labels") {
                event.value = "custom";
            }
            this.graph.dispatch("changeIndexType", event.value);
        });

        this.toggleViewMode.addListener("setIndex", (event) => {
            this.editorLegend.dispatch("changeLegend", event.value);
            if (event.value === "Config") {
                event.value = "Force";
            }
            this.graph.dispatch("changeViewMode", event.value);
        });

        // in edit mode, the graph may request a text area
        // since the SVG cannot have a text input child
        // the text area must come from here
        this.graph.addListener("needTextArea", (data) => {
            if (this._editing) {
                this._editTarget.dispatch("doneEditing", this.textArea.getValue());
            }
            this._editing = true;
            this._editTarget = data.target;
            this.textArea.setStyle("display", "inline");
            this.textArea.setStyle("left", (data.coords.x - 10) + "px");
            this.textArea.setStyle("top", (data.coords.y - 10) + "px");
            this.textArea.setValue(data.initialValue);
            this.textArea.node.focus();
            this.textArea.node.select();
            let finishEvent = () => {
                data.target.dispatch("doneEditing", this.textArea.getValue());
                this.textArea.setStyle("display", "none");
                this.textArea.removeNodeListener("keypress", keypressEventWrapper);
                window.removeEventListener("click", finishEvent);
                this._editing = false;
            };
            let keypressEventWrapper = (event) => {
                if (event.keyCode === 13) {
                    finishEvent();
                }
            };
            this.textArea.addNodeListener("keypress", keypressEventWrapper);
            window.addEventListener("click", finishEvent);
        });
        // This is so the window listeners do not trigger
        this.textArea.addClickListener((event) => {
            event.stopPropagation();
        });

        // changes in graph in draw, edit or delete
        this.graph.addListener("changeInput", (data) => {
            this.inputPanel.dispatch("changeInput", data);
        });

        // Exporting starts here
        this.exportToPngButton.addClickListener(() => {
            this.exportToPng();
        });

        this.exportToMarkupButton.addClickListener(() => {
            let markup = this.graph.getMarkup();
            if (this.markupArea.options.isHidden) {
                this.markupArea.show();
                this.markupArea.options.isHidden = false;
            }
            this.markupArea.setValue(markup);
            this.markupArea.node.focus();
            this.markupArea.node.select();
            this.markupArea.node.scrollTop = 0;
        });
    }

    getDefaultOptions() {
        return {
            "nodes": [
                {"name": "0", "x": 120, "y": 150},
                {"name": "1", "x": 350, "y": 300},
                {"name": "2", "x": 50, "y": 50},
                {"name": "3", "x": 350, "y": 50},
                {"name": "4", "x": 50, "y": 300},
                {"name": "5", "x": 270, "y": 150}
            ],
            "edges": [
                {"source": 0, "target": 2},
                {"source": 0, "target": 4},
                {"source": 0, "target": 5},
                {"source": 1, "target": 4},
                {"source": 1, "target": 5},
                {"source": 2, "target": 3},
                {"source": 2, "target": 4},
                {"source": 4, "target": 5}
            ]
        };
    }

    resize(newHeight, newWidth) {
        newWidth = Math.max(newWidth, 300);
        newHeight = Math.max(newHeight, 300);
        newHeight = newWidth = Math.min(newHeight, newWidth);
        this.widgetBlock.setStyle("width", newWidth + 700 + "px");
        this.graphBlock.setStyle("width", newWidth + "px");
        this.graphBlock.setStyle("height", newHeight + "px");
        this.svgBlock.setStyle("width", newWidth + "px");
        this.svgBlock.setStyle("height", newHeight + "px");
        this.svg.setAttribute("width", newWidth + "px");
        this.svg.setAttribute("height", newHeight + "px");
        this.graph.dispatch("resize");
    }

    exportToPng() {
        // data will be the svg DOM node, serialized as a string
        let data = (new XMLSerializer()).serializeToString(this.svg.node);
        // this is to make the background color white instead of transparent
        data = data.replace("<svg", "<svg style='background-color: white;'");

        let DOMURL = window.URL || window.webkitURL || window;
        let svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
        let url = DOMURL.createObjectURL(svgBlob);
        let image = document.createElement('img');
        image.onload = () => {
            let canvas = document.createElement("canvas");
            let context = canvas.getContext('2d');
            canvas.height = this.svg.getHeight();
            canvas.width = this.svg.getWidth();
            context.drawImage(image, 0, 0);
            DOMURL.revokeObjectURL(url);
            let imageURI = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            let a = document.createElement("a");
            a.setAttribute("download", "graph.png");
            a.setAttribute("href", imageURI);
            a.setAttribute("target", "_blank");
            a.dispatchEvent(new MouseEvent("click", {
                view: window,
                bubbles: false,
                cancelable: true
            }));
        };
        image.src = url;
    }

    render() {
        return [
            <div ref="widgetBlock" style={{margin: "0 auto"}}>
                <div style={{width: "320px", display: "inline-block", "margin-right": "30px", float: "left"}}>
                    <div className="text-center">
                        <RadioButtonGroup level={Level.PRIMARY} ref="toggleDirected" givenOptions={["Undirected", "Directed"]}/>
                    </div>
                    <GraphInputPanel ref="inputPanel" style={{"margin-top": "30px"}} />
                </div>
                <div ref="graphBlock" style={{width: "600px", display: "inline-block"}}>
                    <div className="text-center">
                        <RadioButtonGroup level={Level.PRIMARY} ref="toggleIndexType" givenOptions={["0-index", "1-index", "Custom Labels"]}/>
                    </div>
                    <div ref="svgBlock" style={{
                        "width": "100%",
                        height: "500px",
                        "border": "1px solid black",
                        "border-radius": "5px",
                        "margin-top": "30px",
                        "position": "relative"}}>
                        <SVG.SVGRoot ref="svg" width="100%" height="100%">
                            <EditableGraph ref="graph" nodes={this.options.nodes} edges={this.options.edges} />
                        </SVG.SVGRoot>
                        <TextInput ref="textArea" style={{"position": "absolute", "display": "none",
                                                            "height": "25px", "line-height": "25px",
                                                            "width": "45px"}} />
                     </div>
                </div>
                <div style={{width: "320px", display: "inline-block", "margin-left": "30px", float: "right"}}>
                    <div className="text-center">
                        <RadioButtonGroup level={Level.PRIMARY} ref="toggleViewMode" givenOptions={["Force", "Draw", "Edit", "Delete", "Config"]}/>
                    </div>
                    <GraphEditorLegend ref="editorLegend" viewMode="Force"
                                       style={{ "border": "1px solid black",
                                                "border-radius": "5px",
                                                "margin-top": "30px",
                                                "padding": "10px",
                                                "min-height": "400px" }}/>
                    <ButtonGroup style={{marginTop: "5px"}}>
                        <Button ref="exportToPngButton" level={Level.INFO} >Download as PNG</Button>
                        <Button ref="exportToMarkupButton" level={Level.INFO} >Generate Markup</Button>
                    </ButtonGroup>
                    <TextArea ref="markupArea" isHidden={true} className="hidden" style={{width: "100%", marginTop: "10px", minHeight: "100px"}}/>
                </div>
            </div>
        ];
    }
}

export {GraphEditor};
