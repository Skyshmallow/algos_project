import {UI} from "../../stemjs/src/ui/UIBase.js";
import {SVG} from "../../stemjs/src/ui/svg/SVGBase.js";
import {FormField, Form} from "../../stemjs/src/ui/form/Form.jsx";
import {TextInput, RawCheckboxInput} from "../../stemjs/src/ui/input/Input.jsx";
import {Draggable} from "../../stemjs/src/ui/Draggable.js";
import {DoubleClickable} from "../../stemjs/src/ui/DoubleClickable.js";
import {Popup} from "../../establishment/content/js/Popup.jsx";
import {Device} from "../../stemjs/src/base/Device.js";

export function formatCoord(value, scale, decimals = -1) {
    let size = Math.abs(scale.domain()[0] - scale.domain()[1]);
    //not very ethic way of doing this, but it should work fine...
    if (decimals === -1) {
        //default
        let d = 0;
        if (size > 1000) {
            d = 0;
        } else if (size > 1) {
            let exp = 0, pwr = 1;
            while (pwr < size) {
                exp += 1;
                pwr *= 10;
            }
            d = 4 - exp;
        } else {
            let exp = 0, pwr = 1;
            while (pwr * 0.1 > size) {
                exp += 1;
                pwr *= 0.1;
            }
            d = 3 + exp;
        }
        value = "" + value.toFixed(d);
    } else {
        value = "" + value.toFixed(decimals);
    }
    while (value.indexOf(".") !== -1 && value.endsWith('0')) {
        value = value.slice(0, value.length - 1);
    }
    if (value.endsWith('.')) {
        value = value.slice(0, value.length - 1);
    }
    return value;
}

export function scaleCoord(scale, dataCoord) {
    let d = scale.domain();
    let r = scale.range();
    return r[0] + (r[1] - r[0]) * (dataCoord - d[0]) / (d[1] - d[0]);
}

function getLineAndSegmIntersection(a, b, c, x1, y1, x2, y2) {
    if (x1 === x2) {
        if (Math.abs(b) < 0.000001) {
            return undefined;
        }
        let y = -(a * x1 + c) / b;
        if (Math.min(y1, y2) > y || Math.max(y1, y2) < y) {
            return undefined;
        }
        return {
            x: x1,
            y: y
        };
    }
    if (Math.abs(a) < 0.000001) {
        return undefined;
    }
    let x = -(b * y1 + c) / a;
    if (Math.min(x1, x2) > x || Math.max(x1, x2) < x) {
        return undefined;
    }
    return {
        x: x,
        y: y1
    };
}

function getLineAndRectIntersection(a, b, c, rectX, rectY) {
    let p1 = getLineAndSegmIntersection(a, b, c, rectX[0], rectY[0], rectX[0], rectY[1]);
    let p2 = getLineAndSegmIntersection(a, b, c, rectX[1], rectY[0], rectX[1], rectY[1]);
    let p3 = getLineAndSegmIntersection(a, b, c, rectX[0], rectY[0], rectX[1], rectY[0]);
    let p4 = getLineAndSegmIntersection(a, b, c, rectX[0], rectY[1], rectX[1], rectY[1]);
    if (p1) {
        if (p2) {
            return [p1.x, p1.y, p2.x, p2.y];
        }
        if (p3) {
            return [p1.x, p1.y, p3.x, p3.y];
        }
        if (p4) {
            return [p1.x, p1.y, p4.x, p4.y];
        }
        return [p1.x, p1.y, p1.x, p1.y];
    }
    if (p2) {
        if (p3) {
            return [p2.x, p2.y, p3.x, p3.y];
        }
        if (p4) {
            return [p2.x, p2.y, p4.x, p4.y];
        }
        return [p2.x, p2.y, p2.x, p2.y];
    }
    if (p3) {
        if (p4) {
            return [p3.x, p3.y, p4.x, p4.y];
        }
        return [p3.x, p3.y, p3.x, p3.y];
    }
    if (p4) {
        return [p4.x, p4.y, p4.x, p4.y];
    }
    return [0, 0, 0, 0];
}

let InvisibleCircleClass = DoubleClickable(Draggable(SVG.Circle));

export class DraggablePointWithCoords extends SVG.Group {
    setOptions(options) {
        super.setOptions(options);
        this.options.center = {};
        this.options.center.x = this.options.data.x / this.getXScale();
        this.options.center.y = this.options.data.y / this.getYScale();
        this.options.color = this.options.data.color || this.options.color || "black";
    }

    getXScale() {
        let scale = this.options.chart.xAxisOptions.scale;
        return Math.abs(scale.domain()[1] - scale.domain()[0]) / Math.abs(scale.range()[1] - scale.range()[0]);
    }

    getYScale() {
        let scale = this.options.chart.yAxisOptions.scale;
        return Math.abs(scale.domain()[1] - scale.domain()[0]) / Math.abs(scale.range()[1] - scale.range()[0]);
    }

    formatCoords() {
        let x = this.options.data.x;
        let y = this.options.data.y;
        let decimals = -1;
        if (this.options.widget) {
            decimals = this.options.widget.decimals;
        }
        x = formatCoord(x, this.options.chart.xAxisOptions.scale, decimals);
        y = formatCoord(y, this.options.chart.yAxisOptions.scale, decimals);
        return (this.options.label ? this.options.data.label : "") + (this.options.coords ? "(" + x + "," + y + ")" : "");
    }

    render() {
        return [
            <SVG.Circle ref="realPoint" radius="5" fill={this.options.color} parent={this}
                        style={{cursor: "move"}} center={this.options.center}/>,
            <SVG.Text ref="coords" textAnchor="left" x={this.options.center.x + 4} y={this.options.center.y + 10}
                      style={{"-webkit-user-select": "none"}}
                      text={this.formatCoords()}/>,
            <SVG.Line ref="lineDown" x1={this.options.center.x} y1={this.options.center.y}
                      strokeWidth={1} strokeDasharray="3,3" stroke="grey" fill="grey"
                      x2={this.options.center.x} y2={this.options.chart.yAxisOptions.scale.range()[0]}/>,
            <SVG.Line ref="lineLeft" x1={this.options.center.x} y1={this.options.center.y}
                      strokeWidth={1} strokeDasharray="3,3" stroke="grey" fill="grey"
                      x2={this.options.chart.xAxisOptions.scale.range()[0]} y2={this.options.center.y}/>,
            //the circle we actually use for drags and clicks
            <InvisibleCircleClass ref="point" opacity="0" fill="transparent" radius="15" style={{cursor: "move"}}
                                  parent={this}
                                  stroke="red" strokeWidth="2"
                                  center={this.options.center} editable={this.options.editable}/>,
        ];
    }

    onMount() {
        this.point.addNodeListener("mouseover", () => {
            this.point.setOpacity(1);
        });
        this.point.addNodeListener("mouseout", () => {
            this.point.setOpacity(0);
        });
        this.realPoint.addNodeListener("mouseover", () => {
            this.point.setOpacity(1);
        });
        this.realPoint.addNodeListener("mouseout", () => {
            this.point.setOpacity(0);
        });

        this.addClickListener((event) => {
            this.clickFunc();
            event.stopPropagation();
            event.preventDefault();
        });

        if (this.options.editable) {
            this.dragFunc = {
                onStart: () => {
                    this.dragging = true;
                    this.prevCoords = this.options.coords;
                },
                onDrag: (deltaX, deltaY) => {
                    this.showCoords(false);
                    this.dragged = true;
                    this.options.data.x += deltaX * this.getXScale();
                    this.options.data.y -= deltaY * this.getYScale();
                    this.options.center.x += deltaX;
                    this.options.center.y -= deltaY;
                    if (this.hasPopup) {
                        this.popup.hide();
                        this.hasPopup = false;
                    }
                    this.redraw();
                },
                onEnd: () => {
                    if (this.dragging && this.dragged) {
                        this.options.coords = this.prevCoords;
                        let decimals = -1;
                        if (this.options.widget && this.options.widget.hasOwnProperty("decimals")) {
                            decimals = this.options.widget.decimals;
                        }
                        this.options.data.x = parseFloat(formatCoord(this.options.data.x, this.options.chart.xAxisOptions.scale, decimals));
                        this.options.data.y = parseFloat(formatCoord(this.options.data.y, this.options.chart.yAxisOptions.scale, decimals));
                        this.redraw();
                        this.dispatch("dataChanged");
                        this.hasPopup = true;
                        this.dragged = false;
                        setTimeout(() => {
                            this.hasPopup = false;
                        }, 0);
                    }
                    this.dragging = false;
                }
            };
            this.point.addDragListener(this.dragFunc);
        }
    }


    redraw() {
        this.options.center = {
            x: scaleCoord(this.options.chart.xAxisOptions.scale, this.options.data.x),
            y: scaleCoord(this.options.chart.yAxisOptions.scale, this.options.data.y)
        };
        if (this.coords) {
            this.coords.options.text = this.formatCoords();
        }
        super.redraw();
        if (!this.options.coords && !this.options.label) {
            this.node.removeChild(this.coords.node);
        }
        if (!this.options.OxParallel) {
            this.node.removeChild(this.lineLeft.node);
        }
        if (!this.options.OyParallel) {
            this.node.removeChild(this.lineDown.node);
        }
        if (this.hasPopup) {
            if (this.popup.isInDocument()) {
                this.popup.setCenter(this.getPopupPosition());
            }
            if (!this.isPopupVisible()) {
                this.popup.hide();
            }
        }
    }

    showCoords(prev = true) {
        if (!this.options.coords) {
            this.options.coords = true;
            if (prev) {
                this.prevCoords = true;
            }
            this.redraw();
        }
    }

    hideCoords(prev = true) {
        if (this.options.coords) {
            this.options.coords = false;
            if (prev) {
                this.prevCoords = false;
            }
            this.redraw();
        }
    }

    showLabel() {
        if (!this.options.label) {
            this.options.label = true;
            this.redraw();
        }
    }

    hideLabel() {
        if (this.options.label) {
            this.options.label = false;
            this.redraw();
        }
    }

    showOxParallel() {
        if (!this.options.OxParallel) {
            this.options.OxParallel = true;
            this.redraw();
        }
    }

    hideOxParallel() {
        if (this.options.OxParallel) {
            this.options.OxParallel = false;
            this.redraw();
        }
    }

    showOyParallel() {
        if (!this.options.OyParallel) {
            this.options.OyParallel = true;
            this.redraw();
        }
    }

    hideOyParallel() {
        if (this.options.OyParallel) {
            this.options.OyParallel = false;
            this.redraw();
        }
    }

    changeLabelFunc() {
        this.popup.setTitle(
            <TextInput ref={this.refLink("inputLabel")} value={this.options.data.label} style={{width: "60px"}}/>
        );
        this.inputLabel.node.focus();
        this.inputLabel.node.select();
        let func = () => {
            this.options.data.label = this.inputLabel.getValue().trim();
            this.dispatch("dataChanged");
            this.popup.setTitle(this.getPopupTitle());
            this.changeLabel.addClickListener((event) => {
                event.stopPropagation();
                this.changeLabelFunc();
            });

            if (this.coords) {
                this.coords.options.text = this.formatCoords();
                this.coords.redraw();
            }
            if (!Device.supportsEvent("click")) {
                window.removeEventListener("touchstart", func);
            } else {
                window.removeEventListener("click", func);
            }
            this.popup.removeClickListener(func);
        };
        this.inputLabel.node.addEventListener("keypress", (event) => {
            let key = event.which || event.keyCode;
            if (key === 13) { // 13 is enter
                func();
            }
        });
        if (!Device.supportsEvent("click")) {
            window.addEventListener("touchstart", func);
        } else {
            window.addEventListener("click", func);
        }
        this.inputLabel.addClickListener((event) => {
            event.stopPropagation();
        });
        ///a timeout is needed in order to actually change the current state of the title,
        ///otherwise the click on the edit button itself will trigger, changing it back
        setTimeout(() => {
            this.popup.addClickListener(func);
        }, 0);

    };

    clickFunc(changeLabel = false) {
        if (this.hasPopup) {
            if (this.popup) {
                this.popup.hide();
            }
            this.hasPopup = false;
        } else {
            if (!this.dragged) {
                this.popup = Popup.create(document.body, Object.assign({
                    title: this.getPopupTitle(),
                    children: this.getPopupContent(),
                    transitionTime: 300,
                    titleFontSize: "9pt",
                    contentFontSize: "9pt",
                    style: {
                        maxWidth: "270px"
                    }
                }, this.getPopupPosition()));
                this.seeCoordsButton.addClickListener(() => {
                    if (this.seeCoordsButton.getValue()) {
                        this.showCoords();
                    } else {
                        this.hideCoords();
                    }
                });
                this.seeLabelButton.addClickListener(() => {
                    if (this.seeLabelButton.getValue()) {
                        this.showLabel();
                    } else {
                        this.hideLabel();
                    }
                });
                this.seeOxButton.addClickListener(() => {
                    if (this.seeOxButton.getValue()) {
                        this.showOxParallel();
                    } else {
                        this.hideOxParallel();
                    }
                });
                this.seeOyButton.addClickListener(() => {
                    if (this.seeOyButton.getValue()) {
                        this.showOyParallel();
                    } else {
                        this.hideOyParallel();
                    }
                });

                this.changeLabel.addClickListener(() => {
                    this.changeLabelFunc();
                });
                this.hasPopup = true;

                if (changeLabel) {
                    this.changeLabelFunc();
                    this.inputLabel.node.focus();
                    this.inputLabel.node.select();
                }
            }
        }
    }

    getPopupTitle() {
        let decimals = -1;
        if (this.options.widget) {
            decimals = this.options.widget.decimals || -1;
        }
        return [
            this.options.data.label + " (" + formatCoord(this.options.data.x, this.options.chart.xAxisOptions.scale, decimals)
            + ", " + formatCoord(this.options.data.y, this.options.chart.yAxisOptions.scale, decimals) + ")",
            <div ref={this.refLink("changeLabel")} className="pull-right"
                 style={{marginRight: "4px", marginLeft: "4px"}}>
                <i className="fa fa-pencil-square-o" aria-hidden="true" style={{cursor: "pointer"}}/>
            </div>
        ];
    }

    getPopupContent() {
        return [
            <Form>
                <FormField label="Coordinates" style={{display: "inline", float: "initial"}}>
                    <RawCheckboxInput ref={this.refLink("seeCoordsButton")} initialValue={this.options.coords}/>
                </FormField>
                <FormField label="Point Label" style={{display: "inline", float: "initial"}}>
                    <RawCheckboxInput ref={this.refLink("seeLabelButton")} initialValue={this.options.label}/>
                </FormField>
                <FormField label="Parallel to Ox" style={{display: "inline", float: "initial"}}>
                    <RawCheckboxInput ref={this.refLink("seeOxButton")} initialValue={this.options.OxParallel}/>
                </FormField>
                <FormField label="Parallel to Oy" style={{display: "inline", float: "initial"}}>
                    <RawCheckboxInput ref={this.refLink("seeOyButton")} initialValue={this.options.OyParallel}/>
                </FormField>
            </Form>
        ];
    }

    getPopupPosition() {
        let boundingRect = this.point.getBoundingClientRect();
        return {
            x: boundingRect.left + boundingRect.width / 2,
            y: boundingRect.bottom - boundingRect.height * 0.1
        }
    }

    isPopupVisible() {
        let chartBoundingRect = this.parent.options.chart.interactiveLayer.getBoundingClientRect();
        let popupPosition = this.getPopupPosition();
        return ((chartBoundingRect.left <= popupPosition.x && popupPosition.x <= chartBoundingRect.right) &&
            (chartBoundingRect.top <= popupPosition.y && popupPosition.y <= chartBoundingRect.bottom));
    }
}

export class GeometryLine extends SVG.Line {
    redraw() {
        let xScale = this.options.chart.xAxisOptions.scale;
        let yScale = this.options.chart.yAxisOptions.scale;
        let intersection = getLineAndRectIntersection(
            this.options.data.a, this.options.data.b, this.options.data.c,
            xScale.domain(), yScale.domain());
        this.options.x1 = scaleCoord(xScale, intersection[0]);
        this.options.y1 = scaleCoord(yScale, intersection[1]);
        this.options.x2 = scaleCoord(xScale, intersection[2]);
        this.options.y2 = scaleCoord(yScale, intersection[3]);
        super.redraw();
    }
}

export class GeometrySegment extends SVG.Line {
    redraw() {
        let xScale = this.options.chart.xAxisOptions.scale;
        let yScale = this.options.chart.yAxisOptions.scale;
        this.options.x1 = scaleCoord(xScale, this.options.data.x1);
        this.options.y1 = scaleCoord(yScale, this.options.data.y1);
        this.options.x2 = scaleCoord(xScale, this.options.data.x2);
        this.options.y2 = scaleCoord(yScale, this.options.data.y2);
        super.redraw();
    }
}

export class GeometryPolygon extends SVG.Group {
    render() {
        let segments = [];
        for (let i = 1; i < this.points.length; i += 1) {
            segments.push(<SVG.Line x1={this.points[i - 1].x} y1={this.points[i - 1].y} x2={this.points[i].x}
                                    y2={this.points[i].y}/>);
        }
        segments.push(<SVG.Line x1={this.points[this.points.length - 1].x} y1={this.points[this.points.length - 1].y}
                                x2={this.points[0].x} y2={this.points[0].y}/>);
        return segments;
    }

    redraw() {
        let xScale = this.options.chart.xAxisOptions.scale;
        let yScale = this.options.chart.yAxisOptions.scale;
        this.points = this.points || [];
        this.points.splice(0, this.points.length);
        for (let i = 0; i < this.options.data.length; i += 1) {
            this.points.push({
                x: scaleCoord(xScale, this.options.data[i].x),
                y: scaleCoord(yScale, this.options.data[i].y)
            });
        }
        super.redraw();
    }
}

export class GeometryCircle extends SVG.Circle {
    getDefaultOptions() {
        return Object.assign(super.getDefaultOptions(), {
            fill: "none",
            stroke: "black"
        })
    }

    redraw() {
        let xScale = this.options.chart.xAxisOptions.scale;
        let yScale = this.options.chart.yAxisOptions.scale;
        this.options.center.x = scaleCoord(xScale, this.options.data.x);
        this.options.center.y = scaleCoord(yScale, this.options.data.y);
        let range = Math.abs(yScale.range()[1] - yScale.range()[0]);
        let domain = Math.abs(yScale.domain()[1] - yScale.domain()[0]);
        this.options.radius = this.options.data.r * range / domain;
        super.redraw();
    }
}
