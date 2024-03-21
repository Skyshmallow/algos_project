import {UI} from "../../stemjs/src/ui/UIBase.js";
import {SVG} from "../../stemjs/src/ui/svg/SVGBase.js";
import {TimeChart} from "../../establishment/content/js/charts/BasicChart.jsx";
import {PointPlotElement, PointPlot} from "../../establishment/content/js/charts/PointPlot.jsx";
import {LinePlot} from "../../establishment/content/js/charts/LinePlot.jsx";
import {Popup} from "../../establishment/content/js/Popup.jsx";
import {area} from "d3-shape";


class CodeforcesUserRatingBackground extends SVG.Group {
    getDefaultOptions() {
        return {
            ratingBands: [
                {
                    color: "#AA0000",
                    minRating: 2900,
                    maxRating: 5000
                },
                {
                    color: "#FF3333",
                    minRating: 2600,
                    maxRating: 2900
                },
                {
                    color: "#FF7777",
                    minRating: 2400,
                    maxRating: 2600
                },
                {
                    color: "#FFBB55",
                    minRating: 2300,
                    maxRating: 2400
                },
                {
                    color: "#FFCC88",
                    minRating: 2200,
                    maxRating: 2300
                },
                {
                    color: "#FF88FF",
                    minRating: 1900,
                    maxRating: 2200
                },
                {
                    color: "#AAAAFF",
                    minRating: 1600,
                    maxRating: 1900
                },
                {
                    color: "#77DDBB",
                    minRating: 1400,
                    maxRating: 1600
                },
                {
                    color: "#77FF77",
                    minRating: 1200,
                    maxRating: 1400
                },
                {
                    color: "#CCCCCC",
                    minRating: 0,
                    maxRating: 1200
                }
            ],
            interpolation: "linear"
        };
    }

    getNodeAttributes() {
        let attr = super.getNodeAttributes();
        attr.setAttribute("pointer-events", "none");
        attr.setAttribute("clip-path", this.options.chart.clipPath);
        return attr;
    }

    getRatingBands() {
        this.ratingBands = [];
        this.showBandsAsPaths = true;

        if (this.showBandsAsPaths) {
            // Create the area path generator
            this.areaPathGenerator = area()
                .y0((bandData) => {return this.options.chart.yAxisOptions.scale(bandData.minRating);})
                .y1((bandData) => {return this.options.chart.yAxisOptions.scale(bandData.maxRating);})
                .x((bandData) => {return bandData.x});

            // Create the rating bands
            for (let i = 0; i < this.options.ratingBands.length; i += 1) {
                let bandData = this.options.ratingBands[i];
                this.ratingBands[i] = <SVG.Path ref={this.refLinkArray("ratingBands", i)} d={this.areaPathGenerator([
                    Object.assign({}, bandData, {x: this.options.chart.xAxisOptions.scale.range()[0]}),
                    Object.assign({}, bandData, {x: this.options.chart.xAxisOptions.scale.range()[1]})
                ])}
                    fill={bandData.color} stroke="none" />
            }
        } else {
            // Create the rating bands
            for (let i = 0; i < this.options.ratingBands.length; i += 1) {
                let bandData = this.options.ratingBands[i];
                this.ratingBands[i] = <SVG.Rect ref={this.refLinkArray("ratingBands", i)}
                    x={this.options.chart.xAxisOptions.scale.range()[0]}
                    y={this.options.chart.yAxisOptions.scale(bandData.maxRating)}
                    width={this.options.chart.xAxisOptions.scale.range()[1] - this.options.chart.xAxisOptions.scale.range()[0]}
                    height={this.options.chart.yAxisOptions.scale(bandData.minRating) - this.options.chart.yAxisOptions.scale(bandData.maxRating)}
                    fill={bandData.color} stroke="none" />
            }
        }
        return this.ratingBands;
    }

    render() {
        return this.getRatingBands();
    }
}

class CodeforcesUserRatingChart extends TimeChart {
    getDefaultOptions() {
        return Object.assign(super.getDefaultOptions(), {
            domainPadding: [0.4, 0.25],
            paddingYOnNoPoints: 500,
            zoomScaleExtent: [1, 50]
        });
    }

    defaultYNoPoints() {
        return [1000, 3000];
    }

    getBackground() {
        return <CodeforcesUserRatingBackground ref={this.refLink("background")} chart={this}/>
    }
}

class CodeforcesRatingPoint extends PointPlotElement {
    getDefaultOptions() {
        return Object.assign({}, super.getDefaultOptions(), {
            fill: "white",
            radius: 5,
            stroke: "rgba(0, 0, 0, .5)",
            strokeWidth: 1.5,
            style: {
                cursor: "pointer"
            }
        });
    }

    getPopupTitle(data=this.options.data) {
        let contestName = data.contestName.replace("Codeforces", "CF").replace("<br>", "\n");
        return <a href={"http://codeforces.com/contest/" + data.contestId} target="_blank">{contestName}</a>;
    }

    getPopupContent(data=this.options.data) {
        return [
            <p>{"Rating: " + data.newRating + " (" + data.ratingChange + ")"}</p>,
            <p>{"Title: " + data.title}</p>,
            <a href={"http://codeforces.com" + data.contestUrl} target="_blank">{"Contest rank: " + data.rank}</a>
        ];
    }

    getPopupPosition() {
        let boundingRect = this.getBoundingClientRect();
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
        //return (this.options.xAxisScale.range()[0] <= this.options.center.x &&
        //    this.options.center.x <= this.options.xAxisScale.range()[1]) &&
        //    (this.options.yAxisScale.range()[0] >= this.options.center.y &&
        //    this.options.center.y >= this.options.yAxisScale.range()[1]);
    }

    onMount() {
        this.addClickListener((event) => {
            event.preventDefault();
            event.stopPropagation();
            if (this.popup && this.popup.isInDocument()) {
                this.popup.hide();
                return;
            }
            this.popup = Popup.create(document.body, Object.assign({
                title: this.getPopupTitle(),
                children: this.getPopupContent(),
                transitionTime: 300,
                titleFontSize: "9pt",
                contentFontSize: "9pt",
                style: {
                    minWidth: "180px",
                    maxWidth: "250px",
                }
            }, this.getPopupPosition()));
        });
    }

    redraw() {
        super.redraw();
        if (this.popup) {
            if (this.popup.isInDocument()) {
                this.popup.setCenter(this.getPopupPosition());
            }
            if (!this.isPopupVisible()) {
                this.popup.hide();
            }
        }
    }
}

const CodeforcesRatingPointPlot = PointPlot(CodeforcesRatingPoint);

class CodeforcesUserRatingSVG extends SVG.SVGRoot {
    setOptions(options) {
        super.setOptions(options);

        this.chartOptions = {
            height: 500,
            width: 970
        };
        if (!this.options.data.hasOwnProperty("result")) {
            this.options.data["result"] = [];
        }
        this.plotOptions = {
            pointsAlias: (data) => {return data.result},
            xCoordinateAlias: (data) => {return data.contestTime},
            yCoordinateAlias: (data) => {return data.newRating}
        };

        this.linePlotOptions = Object.assign({}, this.plotOptions, {
            stroke: "rgba(0, 0, 0, .5)",
            strokeWidth: 2.5
        });
    }

    getNodeAttributes() {
        let attr = super.getNodeAttributes();
        attr.setAttribute("height", this.chartOptions.height);
        attr.setAttribute("width", this.chartOptions.width);
        return attr;
    }

    render() {

        return [
            <CodeforcesUserRatingChart chartOptions={Object.assign({}, this.chartOptions)}
                                    plotOptions={this.plotOptions} data={this.options.data}>
                <LinePlot plotOptions={this.linePlotOptions} data={this.options.data}/>
                <CodeforcesRatingPointPlot plotOptions={this.plotOptions} data={this.options.data}/>
            </CodeforcesUserRatingChart>
        ];
    }
}

class CSAUserRatingBackground extends SVG.Group {
    getDefaultOptions() {
        return {
            ratingBands: window.RATING_BANDS,
            interpolation: "linear"
        };
    }

    getNodeAttributes() {
        let attr = super.getNodeAttributes();
        attr.setAttribute("pointer-events", "none");
        attr.setAttribute("clip-path", this.options.chart.clipPath);
        return attr;
    }

    getRatingBands() {
        this.ratingBands = [];
        this.showBandsAsPaths = true;

        if (this.showBandsAsPaths) {
            // Create the area path generator
            this.areaPathGenerator = area()
                .y0((bandData) => {return this.options.chart.yAxisOptions.scale(bandData.minRating);})
                .y1((bandData) => {return this.options.chart.yAxisOptions.scale(bandData.maxRating);})
                .x((bandData) => {return bandData.x});

            // Create the rating bands
            for (let i = 0; i < this.options.ratingBands.length; i += 1) {
                let bandData = this.options.ratingBands[i];
                this.ratingBands[i] = <SVG.Path ref={this.refLinkArray("ratingBands", i)} d={this.areaPathGenerator([
                    Object.assign({}, bandData, {x: this.options.chart.xAxisOptions.scale.range()[0]}),
                    Object.assign({}, bandData, {x: this.options.chart.xAxisOptions.scale.range()[1]})
                ])}
                    fill={bandData.color} stroke="none" />
            }
        } else {
            // Create the rating bands
            for (let i = 0; i < this.options.ratingBands.length; i += 1) {
                let bandData = this.options.ratingBands[i];
                this.ratingBands[i] = <SVG.Rect ref={this.refLinkArray("ratingBands", i)}
                    x={this.options.chart.xAxisOptions.scale.range()[0]}
                    y={this.options.chart.yAxisOptions.scale(bandData.maxRating)}
                    width={this.options.chart.xAxisOptions.scale.range()[1] - this.options.chart.xAxisOptions.scale.range()[0]}
                    height={this.options.chart.yAxisOptions.scale(bandData.minRating) - this.options.chart.yAxisOptions.scale(bandData.maxRating)}
                    fill={bandData.color} stroke="none" />
            }
        }
        return this.ratingBands;
    }

    render() {
        return this.getRatingBands();
    }
}

export class CSAUserRatingChart extends TimeChart {
    getDefaultOptions() {
        return Object.assign(super.getDefaultOptions(), {
            domainPadding: [0.4, 0.25],
            zoomScaleExtent: [1, 20]
        });
    }

    getYAxisDomain(points, coordinateAlias) {
        if (!Array.isArray(points) || points.length === 0) {
            return [1450, 1750];
        }
        let domain = this.getMinMaxDomain(points, coordinateAlias, 200);
        return [Math.min(domain[0], 1450), Math.max(domain[1], 1750)];
    }

    getBackground() {
        return <CSAUserRatingBackground ref={this.refLink("background")} chart={this}/>
    }
}

class CSARatingPoint extends PointPlotElement {
    getDefaultOptions() {
        return Object.assign({}, super.getDefaultOptions(), {
            fill: "white",
            radius: 5,
            stroke: "rgba(0, 0, 0, .5)",
            strokeWidth: 1.5,
            style: {
                cursor: "pointer"
            }
        });
    }

    getPopupTitle(data=this.options.data) {
        return <a href={"/contest/" + data.contestURL} target="_blank">{data.contest}</a>;
    }

    getPopupContent(data=this.options.data) {
        let ratingChange = Math.floor(data.rating) - Math.floor(data.oldRating);

        let ratingChangeStyle;
        if (ratingChange < 0) {
            ratingChangeStyle = {
                color: "red",
            };
        } else {
            ratingChangeStyle = {
                color: "green",
            };
        }

        let ratingChangeDisplay = <span style={ratingChangeStyle}>{(ratingChange > 0 ? "+" : "") + ratingChange}</span>;

        return [
            <p>{"Rating: " + Math.floor(data.rating)} ({ratingChangeDisplay})</p>,
            <a href={"/contest/" + data.contestURL + "/scoreboard"} target="_blank">
                {"Contest rank: " + (data.rank)}
            </a>
        ];
    }

    getPopupPosition() {
        let boundingRect = this.getBoundingClientRect();
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
        //return (this.options.xAxisScale.range()[0] <= this.options.center.x &&
        //    this.options.center.x <= this.options.xAxisScale.range()[1]) &&
        //    (this.options.yAxisScale.range()[0] >= this.options.center.y &&
        //    this.options.center.y >= this.options.yAxisScale.range()[1]);
    }

    onMount() {
        this.addClickListener((event) => {
            event.preventDefault();
            event.stopPropagation();
            if (this.popup && this.popup.isInDocument()) {
                this.popup.hide();
                return;
            }
            this.popup = Popup.create(document.body, Object.assign({
                title: this.getPopupTitle(),
                children: this.getPopupContent(),
                transitionTime: 300,
                titleFontSize: "9pt",
                contentFontSize: "9pt",
                style: {
                    maxWidth: "270px",
                }
            }, this.getPopupPosition()));
        });
    }

    redraw() {
        super.redraw();
        if (this.popup) {
            if (this.popup.isInDocument()) {
                this.popup.setCenter(this.getPopupPosition());
            }
            if (!this.isPopupVisible()) {
                this.popup.hide();
            }
        }
    }
}

const CSARatingPointPlot = PointPlot(CSARatingPoint);

class CSAUserRatingSVG extends SVG.SVGRoot {
    setOptions(options) {
        super.setOptions(options);

        this.chartOptions = {
            height: 500,
            width: 970
        };
        if (!this.options.data.hasOwnProperty("contestHistory")) {
            this.options.data["contestHistory"] = [];
        }

        this.plotOptions = {
            pointsAlias: (data) => {return data.contestHistory},
            xCoordinateAlias: (data) => {return data.contestEndDate * 1000},
            yCoordinateAlias: (data) => {return Math.floor(data.rating)}
        };

        this.plotOptions.pointsAlias(this.options.data).sort((a, b) => {
            return this.plotOptions.xCoordinateAlias(a) - this.plotOptions.xCoordinateAlias(b);
        });

        this.linePlotOptions = Object.assign({}, this.plotOptions, {
            stroke: "rgba(0, 0, 0, .5)",
            strokeWidth: 2.5
        });
    }

    getNodeAttributes() {
        let attr = super.getNodeAttributes();
        attr.setAttribute("height", this.chartOptions.height);
        attr.setAttribute("width", this.chartOptions.width);
        return attr;
    }

    render() {
        return [
            <CSAUserRatingChart chartOptions={Object.assign({}, this.chartOptions)}
                                    plotOptions={this.plotOptions} data={this.options.data}>
                <LinePlot plotOptions={this.linePlotOptions} data={this.options.data}/>
                <CSARatingPointPlot plotOptions={this.plotOptions} data={this.options.data}/>
            </CSAUserRatingChart>
        ];
    }
}

export {CodeforcesUserRatingSVG, CSAUserRatingSVG};
