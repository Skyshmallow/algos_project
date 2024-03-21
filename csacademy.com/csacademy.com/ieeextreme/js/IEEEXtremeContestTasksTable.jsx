import {UI, SVG, Label, registerStyle, Level, styleRule, styleRuleInherit} from "../../csabase/js/UI.js";
import {Color} from "../../stemjs/src/ui/Color.js";
import {Formatter} from "../../csabase/js/util.js";
import {CallThrottler} from "../../stemjs/src/base/Utils.js";
import {Duration} from "../../stemjs/src/time/Duration.js";
import {ServerTime} from "../../stemjs/src/time/Time.js";

import {ColumnContentGetters, ContestTaskListHeader, ContestTaskListHeaderStyle, SortableHeaderMixin} from "../../contest/js/ContestTaskListHeader.jsx";
import {ContestTaskList} from "../../contest/js/ContestTasksTable.jsx";
import {ContestTaskBubble, ContestTaskBubbleStyle} from "../../contest/js/ContestTaskBubble.jsx";


const formatFloat = (score) => {
    score = Math.ceil(parseFloat(score) * 100);
    if (score % 100 === 0) {
        return parseInt(score / 100);
    } else if (score % 10 === 0) {
        return parseFloat(score/100).toFixed(1);
    } else {
        return parseFloat(score/100).toFixed(2);
    }
};


function hiddenBelowWidth(width) {
    return (window.innerWidth <= width) ? "none !important" : null;
}


class IEEEXtremeContestTaskBubbleStyle extends ContestTaskBubbleStyle {
    height = 100;

    @styleRuleInherit
    className = {
        display: "flex",
        flexDirection: "row",
    };

    @styleRule
    timeAdded = {
        color: "#999",
        fontSize: "14px",
        lineHeight: this.height / 2,
        textAlign: "left",
    };

    @styleRule
    averageScore = {
        lineHeight: this.height / 2,
        fontSize: "30px",
        marginTop: "15px",
        marginBottom: "-15px",
    };

    @styleRule
    attemptsCount = {
        lineHeight: this.height / 2,
    };

    @styleRuleInherit
    taskDescription = {
        flex: "1",
        paddingLeft: "5%",
        overflow: "hidden",
        position: "relative",
    };

    @styleRuleInherit
    taskName = {
        textAlign: "left",
        paddingLeft: 0,
        marginBottom: "-10px",
        marginTop: "10px",
    };

    @styleRule
    pointsWorth = {
        minWidth: "94px",
        fontSize: "20px",
        fontWeight: "bold",
        color: "black",
        display: hiddenBelowWidth(672),
    };

    @styleRule
    attempted = {
        display: hiddenBelowWidth(772),
        minWidth: "100px",
    };

    @styleRule
    average = {
        display: hiddenBelowWidth(872),
        minWidth: "90px",
    };

    @styleRuleInherit
    userScore = {
        minWidth: "100px",
    }
}


@registerStyle(IEEEXtremeContestTaskBubbleStyle)
export class IEEEXtremeContestTaskBubble extends ContestTaskBubble {
    getDefaultOptions() {
        return Object.assign({}, super.getDefaultOptions(), {
            circleStrokeWidth: 4,
            circlePadding: 4,
        });
    }

    getTaskDescriptionSection() {
        const timeAdded = this.getContestTask().getBroadcastDelay();
        let timeAddedMessage;
        if (timeAdded > 0) {
            timeAddedMessage = "added after " + Formatter.duration(timeAdded, {
                hours: true,
                minutes: true,
                lastSeparator: " and ",
            });
        } else {
            timeAddedMessage = "added at contest start";
        }
        let newLabel;
        const duration = ServerTime.now().diffDuration(this.getContestTask().getTimeAvailable());
        if (timeAdded > 0 && duration.toMinutes() < 10) {
            newLabel = <Label label="NEW !" level={Level.DANGER} style={{
                position: "absolute",
                left: "-28px",
                top: "14px",
                padding: "0 30px",
                transform: "rotate(-45deg)",
                pointerEvents: "none",
                userSelect: "none",
            }}/>;
            setTimeout(() => this.redraw(), 10 * 60 * 1000 - duration.toMilliseconds() + 2000);
        }
        return <div className={this.styleSheet.taskDescription}>
            {newLabel}
            <div className={this.styleSheet.taskName}>
                {UI.T(this.getContestTask().longName)}
            </div>
            <div className={this.styleSheet.timeAdded}>
                {timeAddedMessage}
            </div>
        </div>;
    }

    getPointsWorthSection() {
        const pointsWorth = formatFloat(this.getContestTask().pointsWorth);
        return <div className={this.styleSheet.pointsWorth} ref="pointsWorth">{pointsWorth}</div>
    }

    getCircleArgs() {
        return Object.assign({}, super.getCircleArgs(), {
            radius: (this.styleSheet.height * 0.8 - this.options.circleStrokeWidth) / 2 - this.options.circlePadding,
            stroke: this.getScoreColor(this.getContestTask().getContest().getUser(USER.id).scores[this.getContestTask().id].score),
        });
    }

    getSVGContent(firstText, secondText, hasCircle, circleRatio, fill = "black") {
        let circle;
        if (hasCircle) {
            circle = this.getCircleArc(circleRatio);
        }
        return [
            circle,
            <SVG.Text x={this.styleSheet.height / 2} y={this.styleSheet.height / 2 - 9}
                          text={firstText} fontSize="16" fill={fill}/>,
            <SVG.Text x={this.styleSheet.height / 2} y={this.styleSheet.height / 2 + 9}
                      text={secondText} fontSize="10" fill={fill}/>
        ];
    }

    getUserScoreSection() {
        const contestTask = this.getContestTask();
        let contestUser = contestTask.getContest().getUser(USER.id);
        let pointsSVG;

        if (contestUser && contestUser.scores && contestUser.scores[contestTask.id]) {
            const scoreRatio = contestUser.scores[contestTask.id].score;
            const score = formatFloat(scoreRatio * this.getContestTask().pointsWorth);
            const scorePercent = formatFloat(scoreRatio * 100) + "%";
            pointsSVG = <SVG.SVGRoot height={this.styleSheet.height} width={this.styleSheet.height}>
                {this.getSVGContent(score + "p", scorePercent, true, scoreRatio, this.getScoreColor(scoreRatio))}
            </SVG.SVGRoot>;
        }
        return <div className={this.styleSheet.userScore}>{pointsSVG}</div>
    }

    getAttemptedSection() {
        let content;
        const userCount = this.getContestTask().getContest().getUsers()
                              .filter(contestUser => contestUser.ieeeTeamType <= 2).length;
        if (this.getContestTask().getContest()._loadedScoreboard) {
            const attemptsRatio = this.attemptsCount / userCount;
            const attemptsPercent = formatFloat(attemptsRatio ? attemptsRatio * 100 : 0) + "%";
            const attemptsMessage = this.attemptsCount ? (
                this.attemptsCount == 1 ? "1 team" : this.attemptsCount + " teams"
            ) : "no attempts";
            content = <SVG.SVGRoot height={this.styleSheet.height} width={this.styleSheet.height}>
                {this.getSVGContent(attemptsPercent, attemptsMessage, false, 0)}
            </SVG.SVGRoot>;
        }
        return <div className={this.styleSheet.attempted} ref="attempted">
            {content}
        </div>
    }

    redraw() {
        if (!this.redrawThrottler) {
            this.redrawThrottler = new CallThrottler({throttle: 1000});
            this.redrawThrottled = this.redrawThrottler.wrap(() => super.redraw());
        }
        this.redrawThrottled();
    }

    getAverageSection() {
        let content;
        if (this.getContestTask().getContest()._loadedScoreboard) {
            const average = this.attemptsCount ? this.averageScore + "p" : "-";
            const averageRatio = this.averageScore / this.getContestTask().pointsWorth;
            const averagePercent = formatFloat(averageRatio * 100) + "%";
            content = <SVG.SVGRoot height={this.styleSheet.height} width={this.styleSheet.height}>
                {this.getSVGContent(average, averagePercent, false, 0)}
            </SVG.SVGRoot>
        }
        return <div className={this.styleSheet.average} ref="averageScore">
            {content}
        </div>
    }

    computeStatistics() {
        let count = 0, sum = 0;
        const contestTask = this.getContestTask();
        const users = contestTask.getContest().getUsers().filter(contestUser => contestUser.ieeeTeamType <= 2);
        for (const user of users) {
            if (user.scores && user.scores[contestTask.id]) {
                count += 1;
                sum += user.scores[contestTask.id].score;
            }
        }
        this.attemptsCount = count;
        this.averageScore = formatFloat(count ? sum / count * this.getContestTask().pointsWorth : 0);
    }

    render() {
        this.computeStatistics();
        return [
            this.getTaskDescriptionSection(),
            this.getUserScoreSection(),
            this.getPointsWorthSection(),
            this.getAttemptedSection(),
            this.getAverageSection(),
        ]
    }

    getScoreColor(percent) {
        const colorSuccess = "#185f9c";
        const colorDanger = "#e2722d";
        return Color.interpolate(colorDanger, colorSuccess, percent);
        if (percent < 0.5) {
            return Color.interpolate(colorDanger, colorWarning, 2 * percent);
        }
        return Color.interpolate(colorWarning, colorSuccess, 2 * percent - 1);
    }
}


class IEEEXtremeColumnContentGetters extends ColumnContentGetters {
    static getTimeAdded(contestTask, isArchive) {
        // TODO: Add code for Archive when needed.
        return contestTask.getBroadcastDelay();
    }

    static getAverageScore(contestTask, isArchive) {
        // TODO: Add code for Archive when needed.
        let count = 0, sum = 0;
        const users = contestTask.getContest().getUsers().filter(contestUser => contestUser.ieeeTeamType <= 2);
        for (const user of users) {
            if (user.scores && user.scores[contestTask.id]) {
                count += 1;
                sum += user.scores[contestTask.id].score;
            }
        }
        return sum / count;
    }

    static getPointsWorth(contestTask, isArchive) {
        return contestTask.pointsWorth;
    }

    static getTried(contestTask, isArchive) {
        let users = contestTask.getContest().getUsers().filter(contestUser => contestUser.ieeeTeamType <= 2);
        let tried = 0;
        for (let user of users) {
            if (user.scores && user.scores[contestTask.id]) {
                tried += 1;
            }
        }
        return tried;
    }
}


class IEEEXtremeContestTaskListHeaderStyle extends ContestTaskListHeaderStyle {
    @styleRuleInherit
    className = {
        display: "flex",
        textAlign: "left",
    };

    @styleRule
    timeAdded = {
        height: this.height,
        lineHeight: this.height + "px",
        minWidth: "34%",
        color: "rgb(55,55,55)",
        fontSize: "14px",
    };

    @styleRuleInherit
    taskDescription = {
        flex: "1",
        flexDirection: "row",
    };

    @styleRuleInherit
    userScore = {
        minWidth: "100px",
    };

    @styleRule
    pointsWorth = {
        minWidth: "94px",
        display: hiddenBelowWidth(672),
    };

    @styleRule
    attempted = {
        minWidth: "100px",
        display: hiddenBelowWidth(872),
    };

    @styleRule
    averageScore = {
        minWidth: "90px",
        display: hiddenBelowWidth(772),
    };

    @styleRule
    taskName = {
        marginLeft: "-10px",
    };

}


@registerStyle(IEEEXtremeContestTaskListHeaderStyle)
class IEEEXtremeTaskListHeader extends ContestTaskListHeader {
    createSortableHeaders() {
        this.NameSort         = SortableHeaderMixin(this, IEEEXtremeColumnContentGetters.getName);
        this.ScoreSort        = SortableHeaderMixin(this, IEEEXtremeColumnContentGetters.getScore, this.NameSort.cmp);
        this.AttemptedSort    = SortableHeaderMixin(this, IEEEXtremeColumnContentGetters.getTried, this.NameSort.cmp);
        this.PointsWorthSort  = SortableHeaderMixin(this, IEEEXtremeColumnContentGetters.getPointsWorth, this.NameSort.cmp);
        this.TimeAddedSort    = SortableHeaderMixin(this, IEEEXtremeColumnContentGetters.getTimeAdded, this.NameSort.cmp);
        this.AverageScoreSort = SortableHeaderMixin(this, IEEEXtremeColumnContentGetters.getAverageScore, this.NameSort.cmp);
    }

    render() {
        this.headers = [];
        const name = <this.NameSort name={UI.T("Task")} className={this.styleSheet.taskName} style={{marginRight: "2px", display: "inline-block"}}/>;
        const timeAdded = <this.TimeAddedSort name={UI.T("Time added")} state={-1}/>;
        const score = <this.ScoreSort name={UI.T("Your score")} className={this.styleSheet.userScore} />;
        const pointsWorth = <this.PointsWorthSort ref="pointsWorth" name={UI.T("Points worth")} className={this.styleSheet.pointsWorth} />;
        const attempted = <this.AttemptedSort ref="attempted" name={UI.T("Teams tried")} className={this.styleSheet.attempted} />;
        const averageScore = <this.AverageScoreSort ref="averageScore" name={UI.T("Average score")} className={this.styleSheet.averageScore}/>;
        this.headers.push(...[name, score, timeAdded, attempted, averageScore]);
        return [
            <div className={this.styleSheet.className}>
                <div className={this.styleSheet.taskDescription}>
                    {name}|{timeAdded}
                </div>
                {score}
                {pointsWorth}
                {attempted}
                {averageScore}
            </div>
        ];
    }
}


class NextTaskIntervalCounter extends UI.Element {
    getDefaultOptions() {
        return {
            style: {
                textAlign: "center",
            }
        }
    }

    render() {
        let nextTaskAnnouncement;
        const nextTaskUnix = this.options.contest.getNextTaskTimestamp();
        const formatUnit = (value) => {
            if (value <= 9) {
                return "0" + value;
            }
            return value;
        };

        if (nextTaskUnix) {
            let diff = (nextTaskUnix - ServerTime.now().unix()) * 1000;
            if (diff >= - 30 * 1000) {
                if (diff < 0) {
                    diff = 0;
                }
                const diffDuration = new Duration(diff);
                const diffFormat = formatUnit(diffDuration.getHours()) + ":"
                    + formatUnit(diffDuration.getMinutes()) + ":"
                    + formatUnit(diffDuration.getSeconds());
                const message = `Next task will be added in ${diffFormat}`;
                nextTaskAnnouncement = <h3>{message}</h3>;
            }
        }
        return nextTaskAnnouncement;
    }

    onMount() {
        this.interval = setInterval(() => this.redraw(), 1000);
    }

    onUnmount() {
        clearInterval(this.interval);
    }
}


export class IEEEXtremeContestTasksList extends ContestTaskList {
    getHeader() {
        return <IEEEXtremeTaskListHeader ref="header" isArchive={this.options.isArchive} contest={this.getContest()}/>;
    }

    getContestTaskBubble(task) {
        return <IEEEXtremeContestTaskBubble key={task.id} isArchive={this.options.isArchive} contestTask={task}/>;
    }

    handleResize() {
        if (window.innerWidth > 1106) {
            this.setStyle("margin", null);
        }
        if (window.innerWidth <= 1106) {
            this.setStyle("margin", "0");
        }
    }

    render() {
        return [<NextTaskIntervalCounter contest={this.getContest()} />, ...super.render()];
    }

    onMount() {
        super.onMount();
        this.handleResize();
        window.addEventListener("resize", () => this.handleResize());
    }
}