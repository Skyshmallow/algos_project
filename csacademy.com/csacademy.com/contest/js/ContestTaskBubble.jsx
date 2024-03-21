import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Label} from "../../stemjs/src/ui/SimpleElements.jsx";
import {Link} from "../../stemjs/src/ui/primitives/Link.jsx";
import {registerStyle} from "../../stemjs/src/ui/style/Theme.js";
import {StyleSheet} from "../../stemjs/src/ui/Style.js";
import {styleRule} from "../../stemjs/src/decorators/Style.js";
import {Level} from "../../stemjs/src/ui/Constants.js";
import {SVG} from "../../stemjs/src/ui/svg/SVGBase.js";
import {CallThrottler} from "../../stemjs/src/base/Utils.js";
import {Formatter} from "../../csabase/js/util.js";
import {EvalTaskStatisticsStore} from "../../eval/js/state/EvalTaskStatisticsStore.js";
import {EvalTaskUserSummaryStore} from "../../eval/js/state/EvalTaskUserSummaryStore.js";
import {TagStore} from "../../establishment/content/js/state/TagStore.js";
import {Difficulty} from "../../csabase/js/state/DifficultyStore.js";
import {Dispatcher} from "../../stemjs/src/base/Dispatcher.js";

export const tasksTagsDispatcher = new Dispatcher();


class TagsHiddenLabel extends Label {
    render() {
        return [
            <UI.TextElement ref={this.refLink("content")} value={this.getLabel() || "show tags"}/>
        ];
    }

    onMount() {
        this.addClickListener((event) => {
            event.preventDefault();
            event.stopPropagation();
            this.options.bubble.updateOptions({showTags: true});
        });
    }
}

export class ContestTaskBubbleStyle extends StyleSheet {
    fontColor = "rgb(55, 55, 55)"; // default CSAcademy navbar color
    height = 110;

    constructor() {
        super({updateOnResize: true});
    }

    @styleRule
    className = {
        cursor: "pointer",
        boxShadow: "0px 0px 1px " + this.fontColor,
        width: "99%",
        marginLeft: "0.5%",
        marginRight: "0.5%",
        height: this.height,
        fontColor: this.fontColor,
        display: "block",
        marginTop: "20px",
        whiteSpace: "nowrap",
        userSelect: "none",
        ":hover": {
            transition: "0.23s",
            boxShadow: "0px 0px 5px " + this.fontColor,
            textDecoration: "none",
        },
        ">*": {
            verticalAlign: "top",
            display: "inline-block",
            height: "100%",
            lineHeight: this.height,
            textAlign: "center",
            float: "initial !important",
        }
    };

    @styleRule
    tags = {
        width: "22%",
        padding: this.height / 6,
        paddingLeft: this.height / 12,
        paddingRight: this.height / 12,
    };

    @styleRule
    userScore = {
        width: "11%",
        color: this.fontColor,
        fontSize: "20px",
    };

    @styleRule
    taskDescription = {
        width: "35%",
        paddingLeft: "6%",
    };

    @styleRule
    taskName = {
        height: "50%",
        lineHeight: this.height / 2,
        width: "100%",
        fontSize: "130%",
        color: "black",
        textAlign: "left",
    };

    @styleRule
    originalContest = {
        height: "50%",
        width: "100%",
        fontSize: "100%",
        lineHeight: this.height / 2,
        textAlign: "left",
    };

    @styleRule
    taskDifficulty = {
        width: "9%",
        fontSize: "16px",
    };

    @styleRule
    taskStatistics = {
        width: "20%",
    };
}

@registerStyle(ContestTaskBubbleStyle)
export class ContestTaskBubble extends Link {
    getDefaultOptions() {
        return {
            svgColor: "#337AB7",
            showTags: true,
            circleStrokeWidth: 5,
            revealedTagIds: [],
            circlePadding: 15,
        };
    }

    getContestTask() {
        return this.options.contestTask;
    }

    getEvalTaskSummary() {
        return EvalTaskStatisticsStore.getByEvalTaskId(this.getContestTask().evalTaskId);
    }

    getTagIds() {
        return this.getContestTask().tagIds || [];
    }

    getTags() {
        return this.getTagIds().map(tagId => TagStore.get(tagId));
    }

    getRevealedTags() {
        return this.options.revealedTagIds.map(tagId => TagStore.get(tagId));
    }

    recalculateStatistics() {
        let usersTried = 0, usersSolved = 0;
        const updateUser = (user, contestTask) => {
            if (user.scores[contestTask.id]) {
                usersTried += 1;
                if (user.scores[contestTask.id].score == 1) {
                    usersSolved += 1;
                }
            }
        };

        /// used only if not in archive but during contest
        const contestTask = this.getContestTask();
        const contestUsers = contestTask.getContest().getUsers();
        for (const contestUser of contestUsers) {
            updateUser(contestUser, contestTask);
        }
        if (contestTask.getContest().isVirtual()) {
            const baseContestTask = contestTask.getContest().getBaseContest().getMatchingContestTask(contestTask);
            const baseContestUsers = contestTask.getContest().getBaseContest().getUsers();
            for (const user of baseContestUsers) {
                updateUser(user, baseContestTask);
            }
        }
        this.usersTried = usersTried;
        this.usersSolved = usersSolved;
    }

    getUsersTried() {
        if (this.options.isArchive) {
            return this.getEvalTaskSummary().usersTried || 0;
        } else {
            return this.usersTried || 0;
        }
    }

    getUsersSolved() {
        if (this.options.isArchive) {
            return this.getEvalTaskSummary().usersSolved || 0;
        } else {
            return this.usersSolved || 0;
        }
    }

    getSuccessRate() {
        const usersTried = this.getUsersTried();
        const usersSolved = this.getUsersSolved();
        if (usersTried) {
            return parseInt(usersSolved / usersTried * 100);
        }
        return 0;
    }

    setOptions(options) {
        options.href = options.href || options.contestTask.getFullURL();
        super.setOptions(options);
    }

    extraNodeAttributes(attr) {
        attr.addClass(this.styleSheet.className);
    }

    getTaskDescriptionSection() {
        let originalContest = this.getContestTask().getOriginalContest();
        if (originalContest) {
            originalContest = <Link href={"/contest/" + originalContest.name} value={originalContest.longName} />
        } else {
            originalContest = this.getContestTask().originalContestName;
        }

        return <div className={this.styleSheet.taskDescription}>
            <div className={this.styleSheet.taskName}>
                {UI.T(this.getContestTask().longName)}
            </div>
            <div className={this.styleSheet.originalContest}>
                {originalContest}
            </div>
        </div>
    }

    getUserScoreSection() {
        let points;
        let getPoints = (points) => [Formatter.truncate(points, 2), <span style={{"font-size": "13px"}}>pts</span>];
        let getSolvedIcon = () => <span className="fa fa-check fa-lg" style={{color: "green"}}/>;
        let getUnsolvedIcon = () => <span className="fa fa-times fa-lg" style={{color: "red"}}/>;
        if (this.options.isArchive) {
            let summary = EvalTaskUserSummaryStore.getByEvalTaskAndUserId(this.getContestTask().evalTaskId, USER.id);
            if (summary && summary.tried) {
                points = summary.solved ? getSolvedIcon() : getPoints(summary.bestScore);
            }
        } else {
            let contestTask = this.getContestTask();
            let contestUser = contestTask.getContest().getUser(USER.id);
            if (contestUser && contestUser.scores && contestUser.scores[contestTask.id]) {
                let score = contestUser.scores[contestTask.id].score;
                if (score == 1) {
                    points = getSolvedIcon();
                } else if (contestTask.hasPartialScore()) {
                    points = getPoints(score * contestTask.pointsWorth);
                } else {
                    points = getUnsolvedIcon();
                }
            }
        }
        return <div className={this.styleSheet.userScore}>
            {points}
        </div>;
    }

    getTagsSection() {
        let result = [];
        let tags = [];
        if (this.options.isArchive && !this.options.showTags) {
            tags = this.getRevealedTags();
            result.push(<TagsHiddenLabel bubble={this} label={tags.length ? "show all tags" : null}
                                         style={{display: "inline-block", float: "left", margin: ".1em"}}/>);
        } else {
            tags = this.getTags();
        }
        result = [tags.map(tag =>
            (tag && <Label level={Level.SUCCESS} style={{display: "inline-block", float: "left", margin: ".1em"}}
                                   onClick={() => {
                                       window.event.preventDefault();
                                       window.event.stopPropagation();
                                       tasksTagsDispatcher.dispatch(tag)
                                   }}>
                                {tag.name}
                            </Label>)), ...result];
        return <div className={this.styleSheet.tags}>
            {result}
        </div>;
    }

    getTaskDifficultySection() {
        let taskDifficulty = Difficulty.get(this.getContestTask().getDifficulty());

        if (!taskDifficulty) {
            return <div className={this.styleSheet.taskDifficulty} />;
        }

        return <div className={this.styleSheet.taskDifficulty} style={{"color": taskDifficulty.color}}>
            {taskDifficulty.toString()}
        </div>;
    }

    getCircleArgs() {
        return {
            strokeWidth: this.options.circleStrokeWidth,
            radius: (this.styleSheet.height - this.options.circleStrokeWidth) / 2 - this.options.circlePadding,
            fill: "transparent",
            center: {x: this.styleSheet.height / 2, y: this.styleSheet.height / 2},
            stroke: this.options.svgColor,
        };
    }

    getCircleArc(ratio) {
        if (ratio === 1) {
            return <SVG.Circle {...this.getCircleArgs()}></SVG.Circle>;
        } else {
            return <SVG.CircleArc {...this.getCircleArgs()}
                                       startAngle={Math.PI * 1.5}
                                       endAngle={Math.PI * (1.5 + 2 * ratio)}/>;
        }
    }

    getTaskStatisticsSection() {
        return <div className={this.styleSheet.taskStatistics}>
            <SVG.SVGRoot height={this.styleSheet.height} width={this.styleSheet.height}>
                {this.getCircleArc(this.getSuccessRate()/100)}
                <SVG.Text x={this.styleSheet.height / 2} y={this.styleSheet.height / 2 - 9}
                          text={this.getSuccessRate() + "%"} fontSize="20" fill="#337AB7"/>
                <SVG.Text x={this.styleSheet.height / 2} y={this.styleSheet.height / 2 + 9}
                          text={this.getUsersSolved() + "/" + this.getUsersTried()} fontSize="10" fill="#337AB7"/>
            </SVG.SVGRoot>
        </div>
    }

    render() {
        if (!this.options.isArchive) {
            this.recalculateStatistics();
        }
        return [
            this.getTaskDescriptionSection(),
            this.getUserScoreSection(),
            this.getTagsSection(),
            this.getTaskDifficultySection(),
            this.getTaskStatisticsSection()
        ];
    }

    onMount() {
        super.onMount();
        if (this.options.isArchive) {
            let statistics = EvalTaskStatisticsStore.getByEvalTaskId(this.getContestTask().evalTaskId);
            statistics?.addChangeListener(() => {
                this.redraw();
            });
            EvalTaskUserSummaryStore.addChangeListener((data) => {
                if (data.evalTaskId === this.getContestTask().evalTaskId) {
                    this.redraw();
                }
            });
        } else {
            this.attachChangeListener(this.getContestTask().getContest(), () => {
                this.redraw();
            });
            const redrawThrottler = new CallThrottler({throttle: 300});
            const redrawThrottled = redrawThrottler.wrap(() => {
                this.redraw();
            });
            this.attachListener(this.getContestTask().getContest(), "contestUserUpdate", redrawThrottled);
        }
    }
}