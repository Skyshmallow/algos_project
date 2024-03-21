import {UI} from "../../stemjs/src/ui/UIBase.js";
import {SVG} from "../../stemjs/src/ui/svg/SVGBase.js";

export class SVGHandDrawnCircle extends SVG.Element {
    getNodeType() {
        return "path";
    }

    getDefaultOptions() {
        return {
            minDeltaR: 0.1,       // When the circle overlaps, the R decides the
            maxDeltaR: 0.1,        // ratio between the diameter of the circle and the
                                   // "imperfection" at its union, and DeltaR is the
                                   // difference between R and 1 (bigger -> more like a spiral)

            minStartingAngle: 0,   // Where the overlapping starts (0-360)
            maxStartingAngle: 0,

            minOverlap: 0.15,      // How much the circle goes over itself (ratio to circumference)
            maxOverlap: 0.15,

            minSquash: 0.7,        // How alike it is to an ellipse (1 is perfectly circular)
            maxSquash: 0.7,

            minSquashAngle: 150,      // Angle of the axis by which its elliptical
            maxSquashAngle: 150,

            r: 19,                  // Radius

            x: 0,                   // Center
            y: 0,

            fill: "transparent",
            stroke: "black",
            strokeWidth: "2px"
        }
    }

    setParameters(parameters) {
        Object.assign(this.options, parameters);
        this.setAttribute("d", this.getPath());
        this.setAttribute("transform", this.getTransform());
    }

    setCenter(x, y) {
        this.options.x = x;
        this.options.y = y;
        this.setAttribute("transform", this.getTransform());
    }
    setRadius(r) {
        this.options.r = r;
        this.setAttribute("d", this.getPath());
    }

    getNodeAttributes() {
        let attr = super.getNodeAttributes();
        attr.setAttribute("d", this.getPath());
        attr.setAttribute("transform", this.getTransform());
        return attr;
    }

    getPath() {
        let r = this.options.r;
        let dR1 = this.options.minDeltaR;
        let dR2 = this.options.maxDeltaR;
        let minAngle = this.options.minStartingAngle;
        let maxAngle = this.options.maxStartingAngle;
        let minDAngle = this.options.minOverlap;
        let maxDAngle = this.options.maxOverlap;
        let c = 0.551915024494;
        let beta = Math.atan(c);
        let d = Math.sqrt(c*c+1);
        let alpha = (minAngle + Math.random()*(maxAngle - minAngle))*Math.PI/180;

        let path = 'M' + [r * Math.sin(alpha), r * Math.cos(alpha)];
        path += ' C' + [d * r * Math.sin(alpha + beta), d * r * Math.cos(alpha + beta)];

        for (let i = 0; i < 4; i += 1) {
            let dAngle = minDAngle + Math.random() * (maxDAngle - minDAngle);
            alpha += Math.PI/2 * (1 + dAngle);
            r *= (1 + dR1 + Math.random() * (dR2 - dR1));
            path += ' ' + (i ? 'S' : '') + [d * r * Math.sin(alpha - beta), d * r * Math.cos(alpha - beta)];
            path += ' ' + [r * Math.sin(alpha), r * Math.cos(alpha)];
        }

        return path;
    }

    getTransform() {
        let minL = this.options.minSquash;
        let maxL = this.options.maxSquash;
        let minAlpha = this.options.minSquashAngle;
        let maxAlpha = this.options.maxSquashAngle;
        let alpha = (minAlpha + Math.random() * (maxAlpha - minAlpha));
        let lambda = (minL + Math.random() * (maxL - minL));

        return 'translate(' + [this.options.x, this.options.y] + ') ' +
            'rotate(' + alpha + ') scale(1, ' + lambda + ') rotate(' + (-alpha) + ')';
    }
}

export class SVGPartiallyFilledCircle extends SVG.Group {
    getDefaultOptions() {
        return {
            strokeWidth: 1,
            angle: 0
        };
    }

    getTransform() {
        return  "translate(" + this.options.circleAttr.center.x + "," + this.options.circleAttr.center.y + ") " +
                "rotate(" + this.options.angle + ")" +
                "translate(-" + this.options.circleAttr.center.x + ",-" + this.options.circleAttr.center.y + ") ";
    }

    render() {
        return [
            <SVG.Circle {...this.options.circleAttr} stroke={this.options.color} fill={this.options.color} />,
            <SVG.ClipPath id="clipPath">
                <SVG.Rect fill={this.options.color}
                                    x={this.options.circleAttr.center.x - this.options.circleAttr.radius}
                                    y={this.options.circleAttr.center.y - this.options.circleAttr.radius}
                                    height={2 * this.options.circleAttr.radius * (1 - this.options.percent)}
                                    width={2 * this.options.circleAttr.radius}
                />
            </SVG.ClipPath>,
            <SVG.Circle clipPath="url(#clipPath)" radius={this.options.circleAttr.radius - 2 * this.options.strokeWidth}
                           center={this.options.circleAttr.center}
                           fill="#FFF" />
        ]
    }
}

export class SVGVisualMatrix extends SVG.SVGRoot {
    getDefaultOptions() {
        return {
            cellSize: 45,
            n: 0,
            m: 0,
            matrix: [],
            rectAttr: {
                fill: "transparent",
                stroke: "black"
            },
            textAttr: {

            }
        };
    }

    setOptions(options) {
        super.setOptions(options);
        this.options.height = this.options.cellSize * this.options.n;
        this.options.width = this.options.cellSize * this.options.m;

        for (let i = 0; i < this.options.matrix.length; i += 1) {
            while (this.options.matrix[i].length < this.options.m) {
                this.options.matrix[i].push(0);
            }
        }
        if (this.options.matrix.length < this.options.n) {
            for (let i = this.options.matrix.length; i <= this.options.n; i += 1) {
                this.options.matrix.push(new Array(this.options.m));
                this.options.matrix[i].fill(0);
            }
        }
    }

    render() {
        let n = this.options.n, m = this.options.m, cellSize = this.options.cellSize;
        let cells = [];
        for (let i = 0; i < n; i += 1) {
            for (let j = 0; j < m; j += 1) {
                cells.push(<SVG.Group>
                        <SVG.Rect x={j * cellSize} y={i * cellSize} width={cellSize} height={cellSize} {...this.options.rectAttr} />
                        <SVG.Text x={(j + 0.5) * cellSize} y={(i + 0.5) * cellSize} text={this.options.matrix[i][j]} {...this.options.textAttr}/>
                    </SVG.Group>);
            }
        }
        return <SVG.Group>
            {cells}
        </SVG.Group>;
    }
}

export class SVGGrid extends SVG.Group {
    getDefaultOptions() {
        return {
            xZones: 1,
            yZones: 1,
            rectAttr: {
                fill: "transparent",
                stroke: "black"
            },
            axisAttr: {
                stroke: "grey",
                strokeWidth: 1
            }
        };
    }

    render() {
        let children = [
            <SVG.Rect {...this.options.rectAttr} x={this.options.x} y={this.options.y}
                                                height={this.options.height} width={this.options.width} />
        ];
        let xZoneSize = this.options.width / this.options.xZones;
        let yZoneSize = this.options.height / this.options.yZones;
        for (let i = 1; i < this.options.yZones; i += 1) {
            children.push(<SVG.Line x1={this.options.x} x2={this.options.x + this.options.width}
                            y1={this.options.y + i * yZoneSize}
                            y2={this.options.y + i * yZoneSize}
                             {...this.options.axisAttr}
                            />);
        }
        for (let i = 1; i < this.options.xZones; i += 1) {
            children.push(<SVG.Line y1={this.options.y} y2={this.options.y + this.options.height}
                            x1={this.options.x + i * xZoneSize}
                            x2={this.options.x + i * xZoneSize}
                             {...this.options.axisAttr}
                            />);
        }
        return children;
    }
}
