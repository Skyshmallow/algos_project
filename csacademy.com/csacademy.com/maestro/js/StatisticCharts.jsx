import {UI, Button, ButtonGroup, FormField, NumberInput,
        Level, Size, StyleSheet, registerStyle, styleRule, TabArea, Panel, Table} from "../../csabase/js/UI.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {StemDate} from "../../stemjs/src/time/Date.js";
import {TimeUnit} from "../../stemjs/src/time/Duration.js";
import {DateTimePicker} from "../../stemjs/src/ui/DateTimePicker.jsx";
import {ChartSVG, TimeChart} from "../../establishment/content/js/charts/BasicChart.jsx";
import {LinePlot} from "../../establishment/content/js/charts/LinePlot.jsx";
import {ColorGenerator} from "../../stemjs/src/ui/Color.js";


class StatisticChart extends TimeChart {
    getDefaultOptions() {
        return Object.assign(super.getDefaultOptions(), {
            domainPadding: [0, 0]
        });
    }

    initZoom() {
        if (this.options.enableZoom) {
            super.initZoom(true);
        }
    }
}


class StatisticChartSVG extends ChartSVG {
    setOptions(options) {
        super.setOptions(options);
        this.plotOptions = {
            pointsAlias: (data) => [].concat(...data),
            xCoordinateAlias: (data) => data.moment,
            yCoordinateAlias: (data) => data.index
        };
        this.linePlotOptions = [];

        let startTime;
        for (let i = 0; i < this.options.timestamps.length; i += 1) {
            let timestamps = this.options.timestamps[i];
            timestamps.sort();
            if (i === 0) {
                startTime = timestamps[0];
            }
            let localStartTime = timestamps[0];
            for (let j = 0; j < timestamps.length; j += 1) {
                timestamps[j] = {
                    moment: 1000 * (timestamps[j] - localStartTime + startTime),
                    index: j
                };
            }
            while (timestamps.length > 5000) {
                timestamps = timestamps.filter((t, index) => index % 3 !== 2);
            }
            this.options.timestamps[i] = timestamps;

            this.linePlotOptions.push(Object.assign({}, this.plotOptions, {
                stroke: ColorGenerator.getPersistentColor(i),
                strokeWidth: 1.5,
                pointsAlias: (data) => data,
            }));
        }
    }

    render() {
        let linePlots = this.options.timestamps.map(
            (timestampArray, index) => <LinePlot plotOptions={this.linePlotOptions[index]} data={timestampArray} />
        );
        return [
            <StatisticChart chartOptions={Object.assign({}, this.chartOptions)} plotOptions={this.plotOptions}
                            xAxisDomain={this.options.xDomain} yAxisDomain={this.options.yDomain}
                            data={this.options.timestamps} enableZoom={this.options.enableZoom}>
                {linePlots}
            </StatisticChart>
        ];
    }
}


class StatisticChartsStyle extends StyleSheet {
    chartContainerPadding = 40;

    @styleRule
    className = {
        marginLeft: "10%",
        marginRight: "10%"
    };

    @styleRule
    select = {
        marginLeft: "10px"
    };

    @styleRule
    chartContainer = {
        height: "600px",
        width: "100%",
        border: "1px solid grey",
        borderRadius: "10px",
        padding: this.chartContainerPadding + "px",
        marginTop: "20px",
        backgroundImage: "linear-gradient(to top right, #fff 60%, #dfdfdf)",
        textAlign: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column"
    };

    @styleRule
    defaultMessage = {
        fontSize: "1.5em"
    };

    @styleRule
    statisticDataForm = {
        marginTop: "10px",
        textAlign: "initial",
        justifyContent: "initial"
    };

    @styleRule
    colorBubble = {
        height: "20px",
        width: "20px",
        borderRadius: "20px"
    };
}


class Timeframe extends UI.Element {
    extraNodeAttributes(attr) {
        attr.setStyle("margin-bottom", "5px");
    }

    render() {
        let date;
        if (this.options.value) {
            date = new StemDate(this.options.value);
        }
        return [
            <DateTimePicker date={date} ref="endDatePicker" style={{display: "inline-block", marginRight: "3px"}}/>,
            <ButtonGroup size={Size.EXTRA_SMALL} level={Level.PRIMARY} style={{display: "inline-block"}}>
                <Button icon="times" onClick={() => this.options.form.dispatch("removeTimeframe", this)}/>
                <Button icon="clock-o" onClick={() => this.endDatePicker.setDate(StemDate.now())} />
                <Button icon="level-down" onClick={() => this.options.form.dispatch("newTimeframe", this)}/>
            </ButtonGroup>
        ];
    }

    getValue() {
        if (!this.endDatePicker.getDate()) {
            return this.options.value;
        }
        return this.endDatePicker.getDate().toUnix();
    }

    fetchData(timeframeLength, callback) {
        if (!this._cachedData) {
            this._cachedData = new Map();
        }
        if (!this._cachedData.has(timeframeLength)) {
            const endDate = this.endDatePicker.getDate().toUnix();
            const startDate = endDate - timeframeLength;

            Ajax.getJSON("/manage/charts/", {
                objectType: this.options.objectType,
                startDate: startDate,
                endDate: endDate
            }).then(
                (data) => {
                    this._cachedData.set(timeframeLength, data.timestamps);
                    callback(this._cachedData.get(timeframeLength));
                }
            );
        } else {
            callback(this._cachedData.get(timeframeLength));
        }
    }

    setColor(color) {
        this.setStyle("background-color", color);
    }
}


@registerStyle(StatisticChartsStyle)
class StatisticDataInput extends UI.Element {
    extraNodeAttributes(attr) {
        attr.addClass(this.styleSheet.statisticDataForm);
    }

    setInterval(timeUnit) {
        return () => this.timeframeLengthInput.setValue((timeUnit / 1000).toString());
    }

    getTimeframeLength() {
        return parseInt(this.timeframeLengthInput.getValue());
    }

    render() {
        return [
            <FormField label="Interval length">
                <NumberInput ref="timeframeLengthInput" placehoder="seconds"/>
            </FormField>,
            <FormField label="Presets" style={{marginBottom: "10px"}}>
                <ButtonGroup level={Level.PRIMARY} size={Size.EXTRA_SMALL}>
                    <Button onClick={this.setInterval(TimeUnit.HOUR)}>Hour</Button>
                    <Button onClick={this.setInterval(TimeUnit.DAY)}>Day</Button>
                    <Button onClick={this.setInterval(TimeUnit.WEEK)}>Week</Button>
                    <Button onClick={this.setInterval(TimeUnit.MONTH)}>Month</Button>
                    <Button onClick={this.setInterval(TimeUnit.YEAR)}>Year</Button>
                </ButtonGroup>
            </FormField>,
            <div ref="timeframesArea">

            </div>,
            <ButtonGroup level={Level.PRIMARY} size={Size.EXTRA_SMALL}>
                <Button onClick={() => this.addTimeframe()}>Add timeframe</Button>
                <Button onClick={() => this.compute()}>Compute</Button>
            </ButtonGroup>
        ];
    }

    compute() {
        const numTimeframes = this.timeframesArea.children.length;
        const timeframeLength = this.getTimeframeLength();
        let loaded = 0;
        let timestampArrays = new Array(numTimeframes);
        let timeframesData = new Array(numTimeframes);
        for (let i = 0; i < numTimeframes; i += 1) {
            const timeframe = this.timeframesArea.children[i];
            timeframe.setColor(ColorGenerator.getPersistentColor(i));
            timeframe.fetchData(timeframeLength, (data) => {
                loaded += 1;
                timestampArrays[i] = data;
                timeframesData[i] = {
                    startDate: new StemDate(timeframe.getValue() - timeframeLength),
                    endDate: new StemDate(timeframe.getValue()),
                    color: ColorGenerator.getPersistentColor(i)
                };
                if (loaded === numTimeframes) {
                    this.dispatch("data", timestampArrays, timeframesData);
                }
            });
        }
    }

    addTimeframe() {
        this.timeframesArea.appendChild(<Timeframe form={this} objectType={this.options.objectType}/>);
    }

    onMount() {
        this.addListener("removeTimeframe", (timeframe) => {
            this.timeframesArea.eraseChild(timeframe);
        });
        this.addListener("newTimeframe", (parentTimeframe) => {
            this.timeframesArea.insertChild(
                <Timeframe value={parentTimeframe.getValue() - this.getTimeframeLength()}
                            form={this} objectType={this.options.objectType}/>,
                this.timeframesArea.options.children.indexOf(parentTimeframe) + 1
            );
        });
    }
}


@registerStyle(StatisticChartsStyle)
class SingleStatisticChart extends UI.Element {
    extraNodeAttributes(attr) {
        attr.addClass(this.styleSheet.className);
    }

    render() {
        return [
            <div ref="chartArea" className={this.styleSheet.chartContainer}>
                <em className={this.styleSheet.defaultMessage}>No data available</em>
                <div>
                    <Button onClick={() => this.loadFull()} level={Level.PRIMARY}>Load full chart</Button>
                    <Button onClick={() => this.enterCompareMode()} level={Level.PRIMARY} className={this.styleSheet.select}>Compare timeframes</Button>
                </div>
            </div>
        ];
    }

    loadFull() {
        Ajax.getJSON("/manage/charts/", {
            objectType: this.options.objectType
        }).then(
            (data) => {
                this.chartArea.setChildren([
                    <div>
                        <Button onClick={() => this.redraw()} level={Level.PRIMARY} style={{float: "left"}}>Back</Button>
                    </div>,
                    <StatisticChartSVG timestamps={[data.timestamps]} enableZoom
                                       width={this.chartArea.getWidth() - 2 * this.styleSheet.chartContainerPadding}/>
                ]);
            }
        );
    }

    getTableColumns() {
        const centeredText = {textAlign: "center"};
        return [
            {
                value: info => info.startDate.format("DD MMMM YYYY HH:mm"),
                headerName: "Start date",
                headerStyle: centeredText,
                cellStyle: centeredText
            }, {
                value: info => info.endDate.format("DD MMMM YYYY HH:mm"),
                headerName: "End date",
                headerStyle: centeredText,
                cellStyle: centeredText
            }, {
                value: info => <div style={{backgroundColor: info.color}} className={this.styleSheet.colorBubble}/>,
                headerName: "Color",
                headerStyle: {textAlign: "left"}
            }, {
                value: info => info.numTimestamps,
                headerName: "Number",
                headerStyle: centeredText,
                cellStyle: centeredText
            }
        ];
    }

    enterCompareMode() {
        const chartWidth = this.chartArea.getWidth() * 0.7 - 2 * this.styleSheet.chartContainerPadding;
        this.chartArea.setChildren([
            <div style={{height: "100%"}}>
                <div style={{float: "left", width: "30%", height: "100%"}}>
                    <Button onClick={() => this.redraw()} level={Level.PRIMARY} style={{float: "left"}}>Back</Button>
                    <div style={{clear: "both"}}/>
                    <StatisticDataInput ref={this.refLink("dataInput")} objectType={this.options.objectType} />
                </div>
                <div style={{float: "right", width: "70%", height: "100%"}}>
                    <TabArea>
                        <Panel title="Chart" ref={this.refLink("chartContainer")}>
                            <StatisticChartSVG timestamps={[]} width={chartWidth}/>
                        </Panel>
                        <Panel title="Table" ref={this.refLink("tableContainer")}>
                            <Table columns={this.getTableColumns()} entries={[]}/>
                        </Panel>
                    </TabArea>
                </div>
            </div>
        ]);
        this.chartContainer.attachListener(this.dataInput, "data", (data) => {
            this.chartContainer.setChildren([
                <StatisticChartSVG timestamps={data} width={chartWidth} key={Math.random()}/>
            ]);
        });
        this.tableContainer.attachListener(this.dataInput, "data", (data, timeframesInfo) => {
            let entries = [];
            for (let i = 0; i < data.length; i += 1) {
                entries.push(Object.assign({}, timeframesInfo[i], {
                    numTimestamps: data[i].length
                }));
            }
            this.tableContainer.setChildren([
                <Table columns={this.getTableColumns()} entries={entries} key={Math.random()} />
            ]);
        });
    }
}


export class StatisticCharts extends UI.Element {
    render() {
        return [
            <h3>Users</h3>,
            <SingleStatisticChart objectType="users"/>,
            <h3>Submissions</h3>,
            <SingleStatisticChart objectType="submissions"/>,
            <h3>Custom runs</h3>,
            <SingleStatisticChart objectType="customruns"/>
        ]
    }
}
