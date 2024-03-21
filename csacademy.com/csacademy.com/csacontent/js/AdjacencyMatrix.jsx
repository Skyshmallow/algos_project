import {UI} from "../../stemjs/src/ui/UIBase.js";
import {SVG} from "../../stemjs/src/ui/svg/SVGBase.js";

class AdjacencyMatrixCell extends SVG.Group {
    getDefaultOptions() {
        return {
            x: 0,
            y: 0,
            size: 40,
            fontSize: 20,
            label: 0,
            strokeWidth: 2,
            textStrokeWidth: 1
        };
    }

    render() {
        return [
            <SVG.Rect ref="rect"
                x={this.options.x}
                y={this.options.y}
                width={this.options.size}
                height={this.options.size}
                fill="white"
                stroke="black"
                strokeWidth={this.options.strokeWidth}
            />,
            <SVG.Text
                ref="text"
                text={this.options.label}
                x={this.options.x + this.options.size / 2}
                y={this.options.y + this.options.size / 2}
                strokeWidth={this.options.textStrokeWidth}
                stroke="black"
            />
        ];
    }

    setFill(color) {
        this.rect.setAttribute("fill", color);
    }
}

class AdjacencyMatrix extends SVG.Group {
    getDefaultOptions() {
        return {
            cellOptions: AdjacencyMatrixCell.prototype.getDefaultOptions(),
            directed: false
        };
    }

    setOptions(options) {
        super.setOptions(options);
    }

    render() {
        let nodeCount = this.options.nodes.length;

        this.rowNumbers = [];
        this.colNumbers = [];
        for (let i = 0; i < nodeCount; i += 1) {
            this.rowNumbers.push(<SVG.Text
                text={this.options.nodes[i].label}
                x={this.options.box.x + this.options.cellOptions.size / 2}
                y={this.options.box.y + this.options.cellOptions.size * (i + 1.5)}
            />);
            this.colNumbers.push(<SVG.Text
                text={this.options.nodes[i].label}
                x={this.options.box.x + this.options.cellOptions.size * (i + 1.5)}
                y={this.options.box.y + this.options.cellOptions.size / 2}
            />);
        }

        // Create the cells
        let labels = new Array(nodeCount);
        for (let i = 0; i < nodeCount; i += 1) {
            labels[i] = new Array(nodeCount);
            for (let j = 0; j < nodeCount; j += 1) {
                labels[i][j] = 0;
            }
        }
        for (let i = 0; i < this.options.edges.length; i += 1) {
            let edge = this.options.edges[i];
            labels[edge.source][edge.target] += 1;
            if (!this.options.directed && !edge.directed) {
                labels[edge.target][edge.source] += 1;
            }
        }
        this.cells = new Array(nodeCount);
        for (let i = 0; i < nodeCount; i += 1) {
            this.cells[i] = new Array(nodeCount);
        }
        for (let i = 0; i < nodeCount; i += 1) {
            for (let j = 0; j < nodeCount; j += 1) {
                this.cells[i][j] = <AdjacencyMatrixCell
                    x={this.options.box.x + (j + 1) * this.options.cellOptions.size}
                    y={this.options.box.y + (i + 1) * this.options.cellOptions.size}
                    label={labels[i][j]}
                />
            }
        }
        return [
            <SVG.Group>{this.rowNumbers}</SVG.Group>,
            <SVG.Group>{this.colNumbers}</SVG.Group>,
            <SVG.Group>{this.cells}</SVG.Group>
        ];
    }
}

export class AdjacencyMatrixSVG extends SVG.SVGRoot {
    getDefaultOptions() {
        return {
            width: 400,
            height: 400,
            padding: 10,
            directed: false
        };
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
        return [<AdjacencyMatrix ref="adjacencyMatrix" {...this.options}
            box={{
                x: this.options.padding,
                y: this.options.padding,
                width: this.options.width - 2 * this.options.padding,
                height:this.options.height - 2 * this.options.padding
            }}
        />];
    }
}
