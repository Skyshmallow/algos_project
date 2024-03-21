import {UI, Panel, CardPanel, RadioButtonGroup, Level} from "../../csabase/js/UI.js";
import {WebsocketSubscriber} from "../../stemjs/src/websocket/client/WebsocketSubscriber.js";
import {MetricType, MetricSummary} from "../../stemjs/src/data-structures/MetricSummary.js";
import {StemDate} from "../../stemjs/src/time/Date.js";

import {TimeChart, ChartSVG} from "../../establishment/content/js/charts/BasicChart.jsx";
import {LinePlot} from "../../establishment/content/js/charts/LinePlot.jsx";

import {MachineInstanceStore} from "./state/MachineInstanceStore.js";
import {Formatter} from "../../csabase/js/util.js";


export class PerformanceMetricsSummarizer {
    machineMap = new Map();

    constructor(metricDescriptors) {
        this.metricDescriptors = metricDescriptors;
        for (let descriptor of this.metricDescriptors) {
            const [key, type] = descriptor;
            if (descriptor.length === 2) {
                const keyParts = key.split(".");
                descriptor.push((data) => {
                    for (const propKey of keyParts) {
                        if (!data.hasOwnProperty(propKey)) {
                            return;
                        } else {
                            data = data[propKey];
                        }
                    }
                    return data;
                });
            }
        }
    }

    getForMachineId(machineId) {
        if (this.machineMap.has(machineId)) {
            return this.machineMap.get(machineId);
        }

        const metricsMap = new Map();
        for (let [key, type] of this.metricDescriptors) {
            metricsMap.set(key, new MetricSummary(type, {maxLength: 8192}));
        }
        this.machineMap.set(machineId, metricsMap);

        return this.machineMap.get(machineId);
    }

    addMetrics(metrics) {
        const machineId = metrics.meta.machineId;
        const timestamp = metrics.meta.timestamp;
        const metricsMap = this.getForMachineId(machineId);
        for (let [key, type, func] of this.metricDescriptors) {
            const value = func(metrics);
            metricsMap.get(key).addValue(timestamp, value);
        }
    }
}

class MetricsChart extends TimeChart {

    setOptions(options) {
        super.setOptions(options);

        this.xAxisOptions.ticks = 3;
    }

    getDefaultOptions() {
        return Object.assign(super.getDefaultOptions(), {
            domainPadding: [0.1, 0.1],
            margin: {
                top: 0,
                bottom: 30,
                left: 80,
                right: 0
            },
        });
    }
}

class MetricsChartSVG extends ChartSVG {
    setOptions(options) {
        super.setOptions(options);
        this.plotOptions = {
            pointsAlias: (data) => [].concat(...data),
            xCoordinateAlias: (data) => data.timestamp,
            yCoordinateAlias: (data) => data.value
        };
        this.linePlotOptions = Object.assign({}, this.plotOptions, {
            strokeWidth: 1.5,
            stroke: "red",
            pointsAlias: (data) => data,
        });
    }

    render() {
        return [
            <MetricsChart chartOptions={Object.assign({}, this.chartOptions)} plotOptions={this.plotOptions}
                            xAxisDomain={this.options.xDomain} yAxisDomain={this.options.yDomain}
                            yAxisLabelFormatFunction={this.options.valueFormatter}
                            data={this.options.data} enableZoom={this.options.enableZoom}>
                <LinePlot plotOptions={this.linePlotOptions} data={this.options.data} />
            </MetricsChart>
        ];
    }
}

class MachineMetricsInfo extends CardPanel {
    getDefaultOptions() {
        return {
            style: {
                width: "400px",
                margin: "10px",
                display: "inline-block",
            },
            bodyStyle: {
                paddingTop: "10px"
            }
        };
    }

    getMachineId() {
        return this.options.machineId;
    }

    getMachineLabel() {
        const machineInstance = MachineInstanceStore.get(this.getMachineId());
        return (machineInstance && machineInstance.label) || "Machine " + this.getMachineId();
    }

    getVerboseMetrics() {
        const verboseMetricsNameMap = new Map([
            ["cpu.percent", "CPU %"],
            ["disk.space.percent", "Disk Space %"],
            ["network.counters.bytes_sent", "Data sent"],
            ["network.counters.bytes_recv", "Data received"],
            ["virtualMemory.percent", "VMemory %"]
        ]);
        return verboseMetricsNameMap.get(this.options.metricName) || this.options.metricsName;
    }

    getTitle() {
        return this.getMachineLabel() + " -- " + this.getVerboseMetrics();
    }

    render() {
        const metrics = this.options.metrics;
        let values;
        if (!this.options.timeframe) {
            values = metrics.getValues();
        } else {
            values = metrics.getValues(StemDate.now() - this.options.timeframe, StemDate.now());
        }
        return [
            <MetricsChartSVG data={values} width={400} height={350} valueFormatter={
                (x) => (metrics.type === MetricType.VALUE ? x + "%" : Formatter.memory(x, true))
            }/>
        ];
    }

    onMount() {
        this.attachChangeListener(this.options.metrics, () => this.redraw());
    }
}

export class PerformanceMetricsPanel extends Panel {
    performanceMetricsSummarizer = new PerformanceMetricsSummarizer([
        ["cpu.percent", MetricType.VALUE],
        ["disk.space.percent", MetricType.VALUE],
        ["network.counters.bytes_sent", MetricType.COUNTER_SUM],
        ["network.counters.bytes_recv", MetricType.COUNTER_SUM],
        ["virtualMemory.percent", MetricType.VALUE]
    ]);

    getDefaultOptions() {
        return {
            timeframe: 60 * 1000
        };
    }

    addPerformanceMetrics(metrics) {
        let oldSize = this.performanceMetricsSummarizer.machineMap.size;
        this.performanceMetricsSummarizer.addMetrics(metrics);
        if (this.performanceMetricsSummarizer.machineMap.size != oldSize) {
            this.redraw();
        }
    }

    render() {
        const result = [];

        for (let [machineId, metricsData] of this.performanceMetricsSummarizer.machineMap.entries()) {
            for (let [key, summary] of metricsData.entries()) {
                result.push(<MachineMetricsInfo machineId={machineId} metricName={key}
                                             metrics={summary} timeframe={this.options.timeframe} />);
            }
            result.push(<hr />);
        }

        return [
            <RadioButtonGroup
                level={Level.PRIMARY}
                givenOptions={["1m", "5m", "30m", "6h", "∞"]}
                style={{marginTop: "10px", textAlign: "center"}}
                ref="timeframeSelect"
            />,
            result,
        ];
    }

    onMount() {
        const timeframeSelectParser = new Map([
            ["1m", 60 * 1000],
            ["5m", 5 * 60 * 1000],
            ["30m", 30 * 60 * 1000],
            ["6h", 6 * 60 * 60 * 1000],
            ["∞", 0]
        ]);

        this.timeframeSelect.addListener("setIndex", (data) => {
            this.updateOptions({timeframe: timeframeSelectParser.get(data.value)});
        });
        this.attachListener(WebsocketSubscriber, "machine-performance-stats", (metrics) => this.addPerformanceMetrics(metrics))
    }
}
