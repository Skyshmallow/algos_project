import {UI} from "../../stemjs/src/ui/UIBase.js";
import {SVG} from "../../stemjs/src/ui/svg/SVGBase.js";
import {Panel} from "../../stemjs/src/ui/UIPrimitives.jsx";
import {Select} from "../../stemjs/src/ui/input/Input.jsx";
import {Form, FormField} from "../../stemjs/src/ui/form/Form.jsx";
import {RawCheckboxInput} from "../../stemjs/src/ui/input/Input.jsx";
import {Size, Level} from "../../stemjs/src/ui/Constants.js";
import {ButtonGroup} from "../../stemjs/src/ui/button/ButtonGroup.jsx";
import {Button} from "../../stemjs/src/ui/button/Button.jsx";
import {BasicChart, ChartSVG} from "../../establishment/content/js/charts/BasicChart.jsx";
import {Device} from "../../stemjs/src/base/Device.js";
import {consoleTokenizer} from "../../csabase/js/util.js";
import {CodeEditor} from "../../stemjs/src/ui/CodeEditor.jsx";
import {DraggablePointWithCoords, GeometrySegment, GeometryLine, GeometryCircle, GeometryPolygon, formatCoord} from "./CSAGeometryObjects.jsx";
import {DropdownListStyle} from "./CSAAppStyle.jsx";
import {scaleLinear} from "d3-scale";
import {zoomIdentity} from "d3-zoom";

const dropdownList = DropdownListStyle.getInstance();

const defaultData = {
    points: [{ "x": 30, "y": 60, "label": "A" }, { "x": 100, "y": 55, "label": "C" }, { "x": 130, "y": 55, "label": "E" }, { "x": 115, "y": 20, "label": "D" }, { "x": 75, "y": 70, "label": "B" }],
    lines: [{ a: 1, b: 1, c: 0 }],
    segments: [{ "x1": 5, "y1": 7, "x2": 15, y2: 20 }],
    circles: [{ "x": 25, "y": 25, "r": 15 }],
    polygons: [[{ "x": 25, "y": 25 }, { "x": 40, "y": 40 }, { "x": 40, "y": 0 }]]
};

const decimalOptions = [{
        value: -1,
        toString: function toString() {
            return "Auto";
        }
    }, {
        value: 0,
        toString: function toString() {
            return "None";
        }
    }, {
        value: 1,
        toString: function toString() {
            return "One";
        }
    }, {
        value: 2,
        toString: function toString() {
            return "Two";
        }
    }, {
        value: 3,
        toString: function toString() {
            return "Three";
        }
    }, {
        value: 4,
        toString: function toString() {
            return "Four";
        }
    }, {
        value: 5,
        toString: function toString() {
            return "Five";
        }
    }, {
        value: 6,
        toString: function toString() {
            return "Six";
        }
    }];

const objects       = [                 "point",       "segment",       "line",       "circle",       "polygon"];
const objectClasses = [DraggablePointWithCoords, GeometrySegment, GeometryLine, GeometryCircle, GeometryPolygon];

class Stringifier {
    static c(value) {
        return formatCoord(parseFloat(value), this.scale, this.decimals);
    }

    static point(point) {
        let text = this.c(point.x) + " " + this.c(point.y);
        if (point.label) {
            text += " " + point.label;
        }
        return text + "\n";
    }
    static line(line) {
        return "Line " + this.c(line.a) + " " + this.c(line.b) + " " + this.c(line.c) + "\n";
    }
    static segment(segment) {
        return "Segment " + this.c(segment.x1) + " " + this.c(segment.y1) + " " + this.c(segment.x2) + " " + this.c(segment.y2) + "\n";
    }
    static circle(circle) {
        return "Circle " + this.c(circle.x) + " " + this.c(circle.y) + " " + this.c(circle.r) + "\n";
    }
    static polygon(polygon) {
        let text = "Polygon\n";
        for (let point of polygon) {
            text += this.c(point.x) + " " + this.c(point.y) + "\n";
        }
        text += "...\n";
        return text;
    }
}
Stringifier.decimals = -1;
Stringifier.scale = {
    domain: () => {
        return [0, 160];
    }
};

function getGeometryText(data) {
    let text = "";
    for (let i = 0; i < objects.length; i += 1) {
        for (let obj of (data[objects[i] + "s"] || [])) {
            text += Stringifier[objects[i]](obj);
        }
    }
    return text;
}

function Plot(BaseClass, className) {
    class ClassPlot extends SVG.Group {
        getNodeAttributes() {
            let attr = super.getNodeAttributes();
            attr.setAttribute("clip-path", this.options.chart.clipPath);
            return attr;
        }
        render() {
            this[className + "s"] = [];
            for (let i = 0; i < this.options.data[className + "s"].length; i += 1) {
                this[className + "s"][i] = <BaseClass ref={this.refLinkArray(className + "s", i)}
                                                          data={this.options.data[className + "s"][i]} coords={false} label={true}
                                                          chart={this.options.chart} widget={this.options.widget}
                                                            editable={this.options.editable} />;
            }
            return this[className + "s"];
        }
        redraw() {
            if (!this[className + "s"]) {
                super.redraw();
            } else {
                for (let element of this[className + "s"]) {
                    element.redraw();
                }
            }
        }
        onMount() {
            this.options.chart.addZoomListener(() => {
                this.redraw();
            });
        }
        remove(element) {
            let newElements = [];
            for (let i = 0; i < this[className + "s"].length; i += 1) {
                if (this[className + "s"][i] !== element) {
                    newElements.push(this[className + "s"][i]);
                }
            }
            delete this[className + "s"];
            this[className + "s"] = newElements;
            element.destroyNode();
        }
    }
    return ClassPlot;
}
let PlotClasses = [];
for (let i = 0; i < objects.length; i += 1) {
    PlotClasses.push(Plot(objectClasses[i], objects[i]));
}

class CSAGeometryWidgetSVG extends ChartSVG {
    getDefaultOptions() {
        return {
            editable: false,
            points: defaultData.points,
            lines: defaultData.lines,
            segments: defaultData.segments,
            circles: defaultData.circles,
            polygons: defaultData.polygons,
            xDomain: [0, 160],
            yDomain: [0, 100],
            width: 320,
            height: 200
        }
    }

    setOptions(options) {
        super.setOptions(options);
        this.chartOptions = {
            width: this.options.width + 70,
            height: this.options.height + 50
        };
        this.options.data = {};
        for (let objectName of objects) {
            this.options[objectName + "s"] = options[objectName + "s"] || this.options[objectName + "s"];
            this.options.data[objectName + "s"] = this.options[objectName + "s"];
        }
    }

    render() {
        let plots = [];
        for (let i = 0; i < objects.length; i += 1) {
            let PlotClass = PlotClasses[i];
            plots.push(<PlotClass editable={this.options.editable} ref={this.refLink(objects[i] + "Plot")}
                         data={this.options.data} widget={this.options.widget} />);
        }
        return [
            <BasicChart ref={this.refLink("chart")} cursorStyle="pointer"
                               chartOptions={Object.assign({}, this.chartOptions)}
                                xAxisDomain={this.options.xDomain} yAxisDomain={this.options.yDomain}>
                {plots}
            </BasicChart>
        ];
    }

    getCoords() {
        let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
        let ok = false;

        let update = (x, y) => {
            ok = true;
            xMin = Math.min(xMin, x);
            yMin = Math.min(yMin, y);
            xMax = Math.max(xMax, x);
            yMax = Math.max(yMax, y);
        };

        for (let point of this.pointPlot.points) {
            update(point.options.data.x, point.options.data.y);
        }
        for (let segm of this.segmentPlot.segments) {
            update(segm.options.data.x1, segm.options.data.y1);
            update(segm.options.data.x2, segm.options.data.y2);
        }
        for (let circle of this.circlePlot.circles) {
            update(circle.options.data.x - circle.options.data.r, circle.options.data.y - circle.options.data.r);
            update(circle.options.data.x + circle.options.data.r, circle.options.data.y + circle.options.data.r);
        }
        for (let polygon of this.polygonPlot.polygons) {
            for (let point of polygon.options.data) {
                update(point.x, point.y);
            }
        }
        if (!ok) {
            return null;
        }
        let diffX = xMax - xMin, diffY = yMax - yMin;
        if (Math.abs(diffX) < 0.001 && Math.abs(diffY) <= 0.001) {
            xMin -= 0.1; xMax += 0.1;
            yMin -= 0.1; yMax += 0.1;
        } else if (Math.abs(diffX) < 0.001) {
            xMin -= 0.25 * diffY;
            xMax += 0.25 * diffY;
        } else if (Math.abs(diffY) < 0.001) {
            yMin -= 0.25 * diffX;
            yMax += 0.25 * diffX;
        }
        xMin = xMin - 0.25 * diffX;
        xMax = xMax + 0.25 * diffX;
        yMin = yMin - 0.25 * diffY;
        yMax = yMax + 0.25 * diffY;

        let chart = this.chart;
        let rangeX = Math.abs(chart.xAxisOptions.scale.range()[0] - chart.xAxisOptions.scale.range()[1]);
        let rangeY = Math.abs(chart.yAxisOptions.scale.range()[0] - chart.yAxisOptions.scale.range()[1]);

        if ((xMax - xMin) / (yMax - yMin) < rangeX / rangeY) {
            diffX = rangeX / rangeY * (yMax - yMin);
            let midX = (xMin + xMax) * 0.5;
            xMin = midX - diffX / 2;
            xMax = midX + diffX / 2;
        } else {
            diffY = rangeY / rangeX * (xMax - xMin);
            let midY = (yMin + yMax) * 0.5;
            yMin = midY - diffY / 2;
            yMax = midY + diffY / 2;
        }
        return [xMin, xMax, yMin, yMax];
    }

    setDomain(x1, x2, y1, y2) {
        let chart = this.chart;
        chart.options.xAxisDomain = chart.getPaddedDomain([x1, x2],
            [chart.options.domainPadding[3], chart.options.domainPadding[1]]);
        chart.options.yAxisDomain = chart.getPaddedDomain([y1, y2],
            [chart.options.domainPadding[2], chart.options.domainPadding[0]]);
        chart.xAxisOptions.scale = scaleLinear()
            .domain(chart.options.xAxisDomain)
            .range([0, chart.options.chartOptions.width]);
        chart.yAxisOptions.scale = scaleLinear()
            .domain(chart.options.yAxisDomain)
            .range([chart.options.chartOptions.height, 0]);
        chart._initialXScale = chart.xAxisOptions.scale.copy();
        chart._initialYScale = chart.yAxisOptions.scale.copy();
        chart.redraw();
        let zoom = {
            x: 0,
            y: 0,
            k: 1,
        };
        zoom.__proto__ = zoomIdentity;
        chart.interactiveLayer.node.__zoom = zoomIdentity;
    }

    onMount() {
        this.addListener("centerPoints", () => {
            let coords = this.getCoords();
            if (!coords) {
                this.setDomain(0, 160, 0, 100);
            } else {
                this.setDomain(coords[0], coords[1], coords[2], coords[3]);
            }
        });
        for (let i = 0; i < objects.length; i += 1) {
            this.addListener("add" + objects[i][0].toUpperCase() + objects[i].slice(1, objects[i].length), (options) => {
                let Class = objectClasses[i];
                let object = <Class {...options} chart={this.chart} widget={this.options.widget}
                        editable={true} />;
                this[objects[i] + "Plot"][objects[i] + "s"].push(object);
                object.mount(this[objects[i] + "Plot"]);
                options[objects[i]] = object;
            })
        }
        this.addListener("resize", (height, width) => {
            this.chartOptions = {
                width: width + 70,
                height: height + 50
            };
            this.redraw();
            this.chart.initZoom();
            this.dispatch("centerPoints");
        });
        this.addListener("inputProvided", (data) => {
            let options = {};
            this.dispatch("needPointOptions", options);
            for (let i = 0; i < objects.length; i += 1) {
                let Class = objectClasses[i];
                let object = objects[i];
                let newObjects = data[object + "s"] || [];
                let oldObjects = this[object + "Plot"][object + "s"];
                for (let j = 0; j < Math.min(newObjects.length, oldObjects.length); j += 1) {
                    oldObjects[j].options.data = newObjects[j];
                    oldObjects[j].redraw();
                }
                while (newObjects.length < oldObjects.length) {
                    this[object + "Plot"].remove(oldObjects[oldObjects.length - 1]);
                    oldObjects.pop();
                }
                for (let j = oldObjects.length; j < newObjects.length; j += 1) {
                    let newObject = <Class data={newObjects[j]} chart={this.chart} widget={this.options.widget}
                                                                editable={this.options.editable} />;
                    if (object === "point") {
                        Object.assign(newObject.options, options);
                    }
                    oldObjects.push(newObject);
                    newObject.mount(this[object + "Plot"]);
                }
            }
        });
        this.addListener("updateDomain", (event) => {
            if (event.xDomain) {
                this.options.xDomain = event.xDomain;
            }
            if (event.yDomain) {
                this.options.yDomain = event.yDomain;
            }
            this.setDomain(this.options.xDomain[0], this.options.xDomain[1], this.options.yDomain[0], this.options.yDomain[1]);
        })
    }
}

class GeometryWidgetLegend extends Panel {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.setStyle("position", "relative");
    }

    render() {
        return [
            <div className="hidden" ref="settings" style={{position: "absolute", zIndex: "2016", right: "80px",
                                                           top: "40px", boxShadow: "0 5px 15px rgba(0,0,0,.5)",
                                                           backgroundColor: "#fff", padding: "5px", width: "200px"}}>
                <Form>
                    <FormField label="Decimals">
                        <Select options={decimalOptions} ref="decimalsSelect"/>
                    </FormField>
                    <FormField label="Coordinates" inline={false}>
                        <RawCheckboxInput ref="seeCoords"/>
                    </FormField>
                    <FormField label="Point Labels" inline={false}>
                        <RawCheckboxInput ref="seeLabels"/>
                    </FormField>
                    <FormField label="Ox parallels" inline={false}>
                        <RawCheckboxInput ref="seeOxParallels"/>
                    </FormField>
                    <FormField label="Oy parallels" inline={false}>
                        <RawCheckboxInput ref="seeOyParallels"/>
                    </FormField>
                </Form>
            </div>,
            <ButtonGroup>
                <Button size={Size.SMALL} level={Level.INFO}
                                       label={UI.T("View All")}
                                       icon="eye" ref="viewAllButton" style={{display: "inline", marginTop: "10px"}}/>
                <Button size={Size.SMALL} level={Level.INFO}
                               label={UI.T("Settings")}
                               icon="bars" ref="settingsButton" style={{display: "inline", marginTop: "10px"}} />
            </ButtonGroup>,
            <div style={{height: "500px", "overflow-y": "scroll"}}>
                <h4>Geometry Widget</h4>
                <p>Using this tool, you can easily manipulate a plane and any objects on it, like points, segments,
                    circles, polygons and so on. You can use the export button to generate a mark-up tag that renders
                    a copy of your plane anywhere on our website like in chats, comments or articles. The left-side
                    text panel and the middle graphic panel are kept in sync at all times, so you can input any set of
                    objects to draw them, or draw using the panel and then take the text version on the left.
                </p>

                <p>Ways you can interact with the widget:</p>
                <ul>
                    <li>Points support drag and drop.</li>
                    <li>You can toggle certain options for all points, or by clicking on a point you can display a menu,
                        for that point's individual settings.</li>
                    <li>Any point can be given a label, and it's label and coordinates can be manually changed from
                        the same menu as above.</li>

                </ul>
            </div>
        ];
    }

    getPointOptions() {
        return {
            coords: this.seeCoords.getValue(),
            label: this.seeLabels.getValue(),
            OxParallel: this.seeOxParallels.getValue(),
            OyParallel: this.seeOyParallels.getValue(),
        };
    }

    onMount() {
        let hideSettingsTab = () => {
            this.settings.addClass("hidden");
            document.body.removeEventListener("click", hideSettingsTab);
        };

        this.settingsButton.addClickListener((event) => {
            if (this.settings.hasClass("hidden")) {
                this.settings.removeClass("hidden");
                document.body.addEventListener("click", hideSettingsTab);
            } else {
                hideSettingsTab();
            }
            event.stopPropagation();
        });
        this.settings.addClickListener((event) => {
            event.stopPropagation();
        });
        this.seeCoords.addClickListener((event) => {
            for (let point of this.options.svg.pointPlot.points) {
                this.seeCoords.getValue() ? point.showCoords() : point.hideCoords();
            }
            event.stopPropagation();
        });


        this.seeLabels.setValue(true);
        this.seeLabels.addClickListener((event) => {
            for (let point of this.options.svg.pointPlot.points) {
                this.seeLabels.getValue() ? point.showLabel() : point.hideLabel();
            }
            event.stopPropagation();
        });
        this.seeOxParallels.addClickListener((event) => {
            for (let point of this.options.svg.pointPlot.points) {
                this.seeOxParallels.getValue() ? point.showOxParallel() : point.hideOxParallel();
            }
            event.stopPropagation();
        });
        this.seeOyParallels.addClickListener((event) => {
            for (let point of this.options.svg.pointPlot.points) {
                this.seeOyParallels.getValue() ? point.showOyParallel() : point.hideOyParallel();
            }
            event.stopPropagation();
        });

        this.addListener("needPointOptions", (options) => {
            Object.assign(options, this.getPointOptions());
        });
        this.decimalsSelect.addChangeListener(() => {
            Stringifier.decimals = this.decimalsSelect.get().value;
            this.options.widget.dispatch("decimalsChange", this.decimalsSelect.get().value);
        });

        this.viewAllButton.addClickListener(() => {
            this.options.svg.dispatch("centerPoints");
        });
    }
}

class GeometryCodeEditor extends CodeEditor {

    static getPoint(tokens) {
        if (tokens.length === 2) {
            let x = parseFloat(tokens[0]),
                y = parseFloat(tokens[1]);
            if (!isNaN(x) && !isNaN(y)) {
                return { x: x, y: y, label: "" };
            }
        }
        if (tokens.length === 3 && tokens[0] === "Point") {
            let x = parseFloat(tokens[1]),
                y = parseFloat(tokens[2]);
            if (!isNaN(x) && !isNaN(y)) {
                return { x: x, y: y, label: "" };
            }
        }
        if (tokens.length === 3) {
            let x = parseFloat(tokens[0]),
                y = parseFloat(tokens[1]);
            if (!isNaN(x) && !isNaN(y)) {
                return {x: x, y: y, label: tokens[2]};
            }
        }
        return null;
    }
    static getSegment(tokens) {
        if (tokens.length === 4) {
            let x1 = parseFloat(tokens[0]),
                y1 = parseFloat(tokens[1]),
                x2 = parseFloat(tokens[2]),
                y2 = parseFloat(tokens[3]);
            if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2)) {
                return { x1: x1, y1: y1, x2: x2, y2: y2 };
            }
        }
        if (tokens.length >= 5 && tokens[0] === "Segment") {
            let x2 = parseFloat(tokens[1]),
                y2 = parseFloat(tokens[2]),
                x3 = parseFloat(tokens[3]),
                y3 = parseFloat(tokens[4]);
            if (!isNaN(x2) && !isNaN(y2) && !isNaN(x3) && !isNaN(y3)) {
                return { x1: x2, y1: y2, x2: x3, y2: y3 };
            }
        }
        return null;
    }
    static getLine(tokens) {
        if (tokens.length === 3) {
            let a = parseFloat(tokens[0]),
                b = parseFloat(tokens[1]),
                c = parseFloat(tokens[2]);
            if (!isNaN(a) && !isNaN(b) && !isNaN(c)) {
                return { a: a, b: b, c: c };
            }
        }
        if (tokens.length >= 4 && tokens[0] === "Line") {
            let a = parseFloat(tokens[1]),
                b = parseFloat(tokens[2]),
                c = parseFloat(tokens[3]);
            if (!isNaN(a) && !isNaN(b) && !isNaN(c)) {
                return { a: a, b: b, c: c };
            }
        }
        return null;
    }
    static getCircle(tokens) {
        if (tokens.length === 3) {
            let x = parseFloat(tokens[0]),
                y = parseFloat(tokens[1]),
                r = parseFloat(tokens[2]);
            if (!isNaN(x) && !isNaN(y) && !isNaN(r)) {
                return { x: x, y: y, r: r };
            }
        }
        if (tokens.length >= 4 && tokens[0] === "Circle") {
            let x4 = parseFloat(tokens[1]),
                y4 = parseFloat(tokens[2]),
                r = parseFloat(tokens[3]);
            if (!isNaN(x4) && !isNaN(y4) && !isNaN(r)) {
                return { x: x4, y: y4, r: r };
            }
        }
        return null;
    }
    setNewData(text, dispatch=true) {
        var data = {
            points: [],
            segments: [],
            lines: [],
            circles: [],
            polygons: []
        };
        text = text.split('\n');
        for (let i = 0; i < text.length; i += 1) {
            if (!text[i]) {
                continue;
            }
            let tokens;
            try {
                tokens = consoleTokenizer(text[i]);
            } catch (message) {
                continue;
            }
            if (!tokens || !tokens.length) {
                continue;
            }
            let isPoint = this.constructor.getPoint(tokens),
                isSegment = this.constructor.getSegment(tokens),
                isLine = this.constructor.getLine(tokens),
                isCircle = this.constructor.getCircle(tokens);
            if (isPoint) {
                data.points.push(isPoint);
            } else if (isSegment) {
                data.segments.push(isSegment);
            } else if (isLine) {
                data.lines.push(isLine);
            } else if (isCircle) {
                data.circles.push(isCircle);
            } else {
                if (tokens[0] === "Polygon") {
                    let j = i + 1;
                    let polygon = [];
                    while (j < text.length) {
                        if (text[j] === "...") {
                            break;
                        }
                        try {
                            let point = this.constructor.getPoint(consoleTokenizer(text[j]));
                            if (point) {
                                polygon.push(point);
                            }
                        } catch (message) {}
                        j += 1;
                    }
                    if (text[j] === "..." && polygon.length >= 3) {
                        data.polygons.push(polygon);
                    }
                    i = j;
                }
            }
        }
        if (dispatch) {
            this.dispatch("inputProvided", data);
        }
    }

    onMount() {
        super.onMount();
        // Disable the indexing on the left margin
        this.setAceRendererOption("showLineNumber", false);
        this._timeout = null;
        this.addAceSessionChangeListener(() => {
            /// If the change is created by editing the widget
            if (this._selfChanged) {
                return;
            }
            if (this._timeout) {
                clearTimeout(this._timeout);
            }
            this._timeout = setTimeout(() => {
                this.setNewData(this.getValue());
                this._timeout = null;
            }, 500);
        });

        this.addListener("addObject", (type, object) => {
            this._selfChanged = true;
            let text = Stringifier[type](object.options.data);
            let editor = this.ace;
            let column = editor.session.getLine(0).length;
            editor.gotoLine(0, column);
            this.insert(text);
            this._selfChanged = false;
        });

        this.addListener("redraw", (data) => {
            this._selfChanged = true;
            this.setValue(getGeometryText(data));
            this._selfChanged = false;
        });
    }
}

class CSAGeometryWidget extends UI.Element {
    render() {
        return [
            <div ref="widgetBlock" style={{margin: "0 auto"}}>
                <div style={{ width: "320px", display: "inline-block", "margin-right": "30px", float: "left" }}>
                    <label> Input: </label>
                    <GeometryCodeEditor ref={this.refLink("textPanel")}
                                        value={getGeometryText(defaultData)}
                                        style={{width: "100%", height: "300px"}} />
                </div>
                <div ref="svgBlock" style={{width: "600px", height: "500px", display: "inline-block", "position": "relative" }} >
                    <div style={{position: "absolute", top: "20px", left: "70px"}}>
                        <Button ref="plusButton" level={Level.INFO} icon="plus" size={Size.LARGE} style={{"border-radius": "0"}}/>
                        <div ref="commandsList" className={`${dropdownList.default} hidden`} style={{width: "3.1em"}}>
                            <div ref="drawPoint"   className="fa fa-circle"         style={{"text-align": "center", "height": "40px", "line-height": "25px"}}> </div>
                            <div ref="drawSegment" className="fa fa-minus fa-2x"    style={{"text-align": "center"}}> </div>
                            <div ref="drawLine"                                     style={{"text-align": "center"}}>
                                /
                            </div>
                            <div ref="drawCircle"  className="fa fa-circle-o fa-2x" style={{"text-align": "center"}}> </div>
                            <div ref="drawPolygon" className="fa fa-square-o fa-2x" style={{"text-align": "center"}}> </div>
                        </div>
                    </div>
                    <CSAGeometryWidgetSVG ref="svg" textPanel={this.textPanel} {...this.options} data={defaultData} widget={this}/>
                </div>
                <div style={{ width: "320px", display: "inline-block", "margin-left": "30px", float: "right" }}>
                    <GeometryWidgetLegend ref="geometryWidgetLegend" widget={this} editable/>
                </div>
            </div>
        ];
    }

    resize(newHeight, newWidth) {
        newWidth = Math.max(newWidth, 500);
        newHeight = newWidth * 472.66 / 754;
        this.widgetBlock.setStyle("width", newWidth + 770 + "px");
        this.svgBlock.setStyle("width", newWidth + "px");
        this.svgBlock.setStyle("height", newHeight + "px");
        this.svg.setAttribute("width", newWidth + "px");
        this.svg.setAttribute("height", newHeight + "px");
        this.svg.dispatch("resize", newHeight, newWidth); // no clue why i need to subtract 70...
    }

    addDrawListeners() {
        let startDraw = () => {
            if (this._isDrawing) {
                this._forceEndDraw();
            }
            this._isDrawing = true;
            for (let point of this.svg.pointPlot.points) {
                point.removeClickListener(point.clickCallback);
                point.point.removeDragListener(point.dragFunc);
            }
            document.body.style["cursor"] = "crosshair";
            this.svg.chart.disableZoom();
            this.svg.chart.interactiveLayer.setStyle("cursor", "crosshair");
        };
        let endDraw = (type, object) => {
            this._isDrawing = false;
            for (let point of this.svg.pointPlot.points) {
                point.addClickListener(point.clickCallback);
                point.point.addDragListener(point.dragFunc);
            }
            document.body.style["cursor"] = "default";
            this.svg.chart.initZoom();
            this.svg.chart.interactiveLayer.setStyle("cursor", "move");
            if (type) {
                this.textPanel.dispatch("addObject", type, object);
            }
        };
        let rect = this.svg.chart.interactiveLayer;

        let getPoint = (event) => {
            let offsets = rect.node.getBoundingClientRect();
            let xDomain = this.svg.chart.xAxisOptions.scale.domain();
            let yDomain = this.svg.chart.yAxisOptions.scale.domain();
            let xRange = this.svg.chart.xAxisOptions.scale.range();
            let xRangeLength = Math.abs(xRange[0] - xRange[1]);
            let yRange = this.svg.chart.yAxisOptions.scale.range();
            let yRangeLength = Math.abs(yRange[0] - yRange[1]);
            return {
                x: xDomain[0] + (xDomain[1] - xDomain[0]) * (Device.getEventX(event) - offsets.left) / xRangeLength,
                y: yDomain[1] + (yDomain[0] - yDomain[1]) * (Device.getEventY(event) - offsets.top) / yRangeLength,
                label: ""
            };
        };

        let drawPointFunc = (event) => {
            event.stopPropagation();
            startDraw();
            let options = {data: getPoint(event)};
            this.geometryWidgetLegend.dispatch("needPointOptions", options);
            let originalCoords = options.coords;
            options.coords = true;
            this.svg.dispatch("addPoint", options);
            let point = options.point;
            point.removeClickListener(point.clickCallback);
            point.point.removeDragListener(point.dragFunc);


            let movePoint = (event) => {
                if (!point.node) {
                    return;
                }
                point.options.data = getPoint(event);
                point.redraw();
            };
            let addPointCallback = () => {
                window.removeEventListener("click", addPointCallback);
                if (!originalCoords) {
                    point.hideCoords();
                }
                window.removeEventListener("mousemove", movePoint);
                point.clickFunc(true);
                window.removeEventListener("contextmenu", this._forceEndDraw);
                endDraw("point", point);
                point.addListener("dataChanged", () => {
                    this.textPanel.dispatch("redraw", this.getData());
                });
            };
            this._forceEndDraw = (event) => {
                window.removeEventListener("click", addPointCallback);
                window.removeEventListener("mousemove", movePoint);
                window.removeEventListener("contextmenu", this._forceEndDraw);
                this.svg.pointPlot.remove(point);
                if (event) {
                    endDraw();
                    event.preventDefault();
                    return false;
                }
            };
            window.addEventListener("click", addPointCallback);
            window.addEventListener("mousemove", movePoint);
            window.addEventListener("contextmenu", this._forceEndDraw);
        };
        let drawSegmentFunc = (event) => {
            event.stopPropagation();
            startDraw();
            let rectClickListener = (event) => {
                event.stopPropagation();
                let data = getPoint(event);
                let options = {
                    data: {
                        x1: data.x, y1: data.y,
                        x2: data.x, y2: data.y
                    }
                };
                this.svg.dispatch("addSegment", options);
                let segment = options.segment;
                rect.removeClickListener(rectClickListener);

                let moveSegmentCallback = (event) => {
                    let newData = getPoint(event);
                    segment.options.data.x2 = newData.x;
                    segment.options.data.y2 = newData.y;
                    segment.redraw();
                };
                let addSegmentCallback = () => {
                    window.removeEventListener("click", addSegmentCallback);
                    window.removeEventListener("mousemove", moveSegmentCallback);
                    window.removeEventListener("contextmenu", this._forceEndDraw);
                    endDraw("segment", segment);
                };

                window.removeEventListener("contextmenu", this._forceEndDraw);
                this._forceEndDraw = (event) => {
                    window.removeEventListener("click", addSegmentCallback);
                    window.removeEventListener("mousemove", moveSegmentCallback);
                    window.removeEventListener("contextmenu", this._forceEndDraw);
                    this.svg.segmentPlot.remove(segment);
                    if (event) {
                        endDraw();
                        event.preventDefault();
                        return false;
                    }
                };
                window.addEventListener("click", addSegmentCallback);
                window.addEventListener("mousemove", moveSegmentCallback);
                window.addEventListener("contextmenu", this._forceEndDraw);
            };
            rect.addClickListener(rectClickListener);
            this._forceEndDraw = (event) => {
                rect.removeClickListener(rectClickListener);
                window.removeEventListener("contextmenu", this._forceEndDraw);
                if (event) {
                    endDraw();
                    event.preventDefault();
                    return false;
                }
            };
            window.addEventListener("contextmenu", this._forceEndDraw);
        };
        let drawCircleFunc = (event) => {
            event.stopPropagation();
            startDraw();
            let rectClickListener = (event) => {
                event.stopPropagation();
                let options = { data: getPoint(event) };
                options.data.r = 0;
                this.svg.dispatch("addCircle", options);
                let circle = options.circle;
                rect.removeClickListener(rectClickListener);
                let changeRadius = (event) => {
                    let newData = getPoint(event);
                    circle.options.data.r = Math.sqrt((newData.x - circle.options.data.x) * (newData.x - circle.options.data.x) +
                                                        (newData.y - circle.options.data.y) * (newData.y - circle.options.data.y));
                    circle.redraw();
                };
                let addCircleCallback = () => {
                    window.removeEventListener("click", addCircleCallback);
                    window.removeEventListener("mousemove", changeRadius);
                    window.removeEventListener("contextmenu", this._forceEndDraw);
                    endDraw("circle", circle);
                };

                window.removeEventListener("contextmenu", this._forceEndDraw);
                this._forceEndDraw = (event) => {
                    window.removeEventListener("click", addCircleCallback);
                    window.removeEventListener("mousemove", changeRadius);
                    window.removeEventListener("contextmenu", this._forceEndDraw);
                    this.svg.circlePlot.remove(circle);
                    if (event) {
                        endDraw();
                        event.preventDefault();
                        return false;
                    }
                };
                window.addEventListener("click", addCircleCallback);
                window.addEventListener("mousemove", changeRadius);
                window.addEventListener("contextmenu", this._forceEndDraw);
            };
            rect.addClickListener(rectClickListener);
            this._forceEndDraw = (event) => {
                rect.removeClickListener(rectClickListener);
                window.removeEventListener("contextmenu", this._forceEndDraw);
                if (event) {
                    endDraw();
                    event.preventDefault();
                    return false;
                }
            };
            window.addEventListener("contextmenu", this._forceEndDraw);
        };
        let drawLineFunc = (event) => {
            event.stopPropagation();
            startDraw();
            let rectClickListener = (event) => {
                event.stopPropagation();
                let originalData = getPoint(event);
                let options = {
                    data: {
                        a: 0,
                        b: 1 / originalData.y,
                        c: -1
                    }
                };
                this.svg.dispatch("addLine", options);
                let line = options.line;
                rect.removeClickListener(rectClickListener);

                let changeLine = (event) => {
                    let data = getPoint(event);
                    line.options.data.a = (data.y - originalData.y);
                    line.options.data.b = (originalData.x - data.x);
                    line.options.data.c = data.x * originalData.y - data.y * originalData.x;
                    line.redraw();
                };
                let addLineCallback = () => {
                    window.removeEventListener("click", addLineCallback);
                    window.removeEventListener("mousemove", changeLine);
                    window.removeEventListener("contextmenu", this._forceEndDraw);
                    endDraw("line", line);
                };

                window.removeEventListener("contextmenu", this._forceEndDraw);
                this._forceEndDraw = (event) => {
                    window.removeEventListener("click", addLineCallback);
                    window.removeEventListener("mousemove", changeLine);
                    window.removeEventListener("contextmenu", this._forceEndDraw);
                    this.svg.linePlot.remove(line);
                    if (event) {
                        endDraw();
                        event.preventDefault();
                        return false;
                    }
                };
                window.addEventListener("click", addLineCallback);
                window.addEventListener("mousemove", changeLine);
                window.addEventListener("contextmenu", this._forceEndDraw);
            };
            rect.addClickListener(rectClickListener);
            this._forceEndDraw = (event) => {
                rect.removeClickListener(rectClickListener);
                window.removeEventListener("contextmenu", this._forceEndDraw);
                if (event) {
                    endDraw();
                    event.preventDefault();
                    return false;
                }
            };
            window.addEventListener("contextmenu", this._forceEndDraw);
        };
        let drawPolygonFunc = (event) => {
            event.stopPropagation();
            startDraw();
            let rectClickListener = (event) => {
                event.stopPropagation();
                let data = getPoint(event);
                let options = {
                    data: [{x: data.x, y: data.y}, {x: data.x, y: data.y}]
                };
                this.svg.dispatch("addPolygon", options);
                let polygon = options.polygon;
                rect.removeClickListener(rectClickListener);

                let changePolygon = (event) => {
                    let newData = getPoint(event);
                    polygon.options.data[polygon.options.data.length - 1].x = newData.x;
                    polygon.options.data[polygon.options.data.length - 1].y = newData.y;
                    polygon.redraw();
                };
                let addSegmentCallback = (event) => {
                    polygon.options.data.push(getPoint(event));
                    polygon.redraw();
                };

                let rightClickFunc = (event) => {
                    event.preventDefault();
                    window.removeEventListener("contextmenu", rightClickFunc);
                    window.removeEventListener("click", addSegmentCallback);
                    window.removeEventListener("mousemove", changePolygon);
                    polygon.options.data.pop();
                    polygon.redraw();
                    endDraw("polygon", polygon);
                };
                window.removeEventListener("contextmenu", this._forceEndDraw);
                window.addEventListener("contextmenu", rightClickFunc);
                window.addEventListener("click", addSegmentCallback);
                window.addEventListener("mousemove", changePolygon);
                this._forceEndDraw = () => {
                    window.removeEventListener("contextmenu", rightClickFunc);
                    window.removeEventListener("click", addSegmentCallback);
                    window.removeEventListener("mousemove", changePolygon);
                    this.svg.polygonPlot.remove(polygon);
                }
            };
            rect.addClickListener(rectClickListener);
            this._forceEndDraw = (event) => {
                rect.removeClickListener(rectClickListener);
                window.removeEventListener("contextmenu", this._forceEndDraw);
                if (event) {
                    endDraw();
                    event.preventDefault();
                    return false;
                }
            };
            window.addEventListener("contextmenu", this._forceEndDraw);
        };

        this.drawPoint.addClickListener(drawPointFunc);
        this.drawSegment.addClickListener(drawSegmentFunc);
        this.drawCircle.addClickListener(drawCircleFunc);
        this.drawLine.addClickListener(drawLineFunc);
        this.drawPolygon.addClickListener(drawPolygonFunc);
    }

    getData() {
        let data = {
            points: [],
            segments: [],
            lines: [],
            circles: [],
            polygons: []
        };
        for (let i = 0; i < objects.length; i += 1) {
            for (let obj of this.svg[objects[i] + "Plot"][objects[i] + "s"]) {
                data[objects[i] + "s"].push(obj.options.data);
            }
        }
        return data;
    }

    onMount() {
        this.resize(window.innerHeight - 200, window.innerWidth * 80 / 100 - 700);
        window.addEventListener("resize", () => {
            this.resize(window.innerHeight - 200, window.innerWidth * 80 / 100 - 700);
        });
        Stringifier.scale = this.svg.chart.xAxisOptions.scale;
        this.geometryWidgetLegend.options.svg = this.svg;
        this.decimals = -1;
        this.addListener("decimalsChange", (decimals) => {
            if (this.decimals !== decimals) {
                this.decimals = decimals;
                this.textPanel.dispatch("redraw", this.getData());
                this.svg.pointPlot.redraw();
            }
        });
        this.textPanel.addListener("inputProvided", (data) => {
            this.svg.dispatch("inputProvided", data);
        });
        this.svg.addListener("needPointOptions", (options) => {
            this.geometryWidgetLegend.dispatch("needPointOptions", options);
        });

        for (let point of this.svg.pointPlot.points) {
            point.addListener("dataChanged", () => {
                this.textPanel.dispatch("redraw", this.getData());
            });
        }

        this.plusButton.addClickListener(() => {this.commandsList.toggleClass("hidden");});

        this.addDrawListeners();
    }
}

export {CSAGeometryWidget, CSAGeometryWidgetSVG};
