import {UI, registerStyle, styleRule, styleRuleInherit, Direction} from "../../csabase/js/UI.js";
import {EvalTaskStatisticsStore} from "../../eval/js/state/EvalTaskStatisticsStore.js";
import {EvalTaskUserSummaryStore} from "../../eval/js/state/EvalTaskUserSummaryStore.js";
import {TagStore} from "../../establishment/content/js/state/TagStore.js";
import {FASortIcon} from "../../stemjs/src/ui/FontAwesome.jsx";

import {ContestTaskBubbleStyle} from "./ContestTaskBubble.jsx";

function cmp(a, b, isArchive, getKey, fallbackComparer) {
    let keyA = getKey(a, isArchive);
    let keyB = getKey(b, isArchive);
    if (keyA < keyB) {
        return -1;
    }
    if (keyA > keyB) {
        return 1;
    }
    // The 4th argument can be the next function to call in case of equality
    if (fallbackComparer) {
        return fallbackComparer(a, b, isArchive);
    }
    return 0;
}

export class ColumnContentGetters {
    static getName(contestTask, isArchive) {
        return contestTask.longName;
    }

    static getContest(contestTask, isArchive) {
        let contest = contestTask.getOriginalContest();
        return contest ? contest.name : contestTask.originalContestName;
    }

    static getScore(contestTask, isArchive) {
        if (isArchive) {
            let evalTaskUserSummary = EvalTaskUserSummaryStore.getByEvalTaskAndUserId(contestTask.evalTaskId, USER.id);
            if (evalTaskUserSummary && evalTaskUserSummary.bestScore) {
                return evalTaskUserSummary.bestScore;
            }
            return 0;
        }
        let user = contestTask.getContest().getUser(USER.id);
        if (user && user.scores && user.scores[contestTask.id]) {
            return user.scores[contestTask.id].score * contestTask.pointsWorth;
        }
        return 0;
    }

    static getTags(contestTask, isArchive) {
        let str = [];
        for (let tagId of (contestTask.tagIds || [])) {
            str.push(TagStore.get(tagId).name);
        }
        return str.sort().join(" ");
    }

    static getDifficulty(contestTask, isArchive) {
        return contestTask.getDifficulty();
    }

    static getSolved(contestTask, isArchive) {
        if (isArchive) {
            return (EvalTaskStatisticsStore.getByEvalTaskId(contestTask.evalTaskId) || {}).usersSolved || 0;
        }
        let users = contestTask.getContest().getUsers();
        let solved = 0;
        for (let user of users) {
            if (user.scores && user.scores[contestTask.id] && user.scores[contestTask.id].score == 1) {
                solved += 1;
            }
        }
        return solved;
    }

    static getTried(contestTask, isArchive) {
        if (isArchive) {
            return (EvalTaskStatisticsStore.getByEvalTaskId(contestTask.evalTaskId) || {}).usersTried || 0;
        }
        let users = contestTask.getContest().getUsers();
        let tried = 0;
        for (let user of users) {
            if (user.scores && user.scores[contestTask.id]) {
                tried += 1;
            }
        }
        return tried;
    }

    static getRatio(contestTask, isArchive) {
        let solved = this.getSolved(contestTask, isArchive);
        let tried = this.getTried(contestTask, isArchive);
        return tried ? (solved / tried) : 0;
    }
}


export const SortableHeaderMixin = (parent, compareFunction, fallbackCompareFunction) => class SortableHeader extends UI.Element {
    static cmp(a, b) {
        return cmp(a, b, parent.options.isArchive, compareFunction, fallbackCompareFunction);
    }

    getDefaultOptions() {
        return {
            state: 0,
            style: {
                display: "inline-block",
                cursor: "pointer"
            }
        };
    }

    render() {
        return [
            <FASortIcon ref="icon" style={{display: "inline-block", opacity: 0}} />,
            <div ref="header" style={{marginRight: "7.44px", display: "inline-block"}}>{this.options.name}</div>
        ];
    }

    updateIcon() {
        let direction;
        if (this.options.state === 1) {
            direction = Direction.DOWN;
        }
        if (this.options.state === -1) {
            direction = Direction.UP;
        }
        if (direction) {
            this.icon.updateOptions({direction});
            this.icon.setStyle("opacity", 1);
        } else {
            this.icon.setStyle("opacity", 0);
        }
    }

    setState(state) {
        // console.warn("Setting state of", this.options.name.value, "from", this.options.state, "to", state);
        this.options.state = state;
        this.updateIcon();
    }

    onMount() {
        this.updateIcon();
        if (this.options.state === 1 || this.options.state === -1) {
            setTimeout(() => parent.promoteCmp(this));
        }
        this.addClickListener(() => {
            this.setState(this.options.state === 1 ? -1 : 1);
            parent.promoteCmp(this);
            this.updateIcon();
        });
    }
};

export class ContestTaskListHeaderStyle extends ContestTaskBubbleStyle {
    height = 35;

    @styleRuleInherit
    className = {
        cursor: "pointer",
        pointerEvents: "cursor",
    };

    @styleRuleInherit
    taskDescription = {
        lineHeight: () => this.height + "px",
        fontSize: "13px",
        paddingLeft: "5.25%",
        textAlign: "left",
    };

    @styleRuleInherit
    userScore = {
        fontSize: "14px"
    };

    @styleRuleInherit
    tags = {
        padding: 0,
        textAlign: "center",
        lineHeight: () => this.height + "px"
    };

    @styleRuleInherit
    taskDifficulty = {
        fontSize: "14px"
    };

    @styleRuleInherit
    taskStatistics = {
        textAlign: "auto"
    };

    @styleRule
    taskStatisticsTitle = {
        height: () => this.height / 2 + "px",
        width: "100%",
        fontSize: "12px",
        textAlign: "center",
        lineHeight: () => this.height / 2 + "px"
    };

    @styleRule
    taskStatisticsSubtitle = {
        height: () => this.height / 2 + "px",
        lineHeight: () => this.height / 2 + "px",
        width: "100%",
        fontSize: "12px",
        textAlign: "center"
    };
}

@registerStyle(ContestTaskListHeaderStyle)
export class ContestTaskListHeader extends UI.Element {
    constructor(obj) {
        super(obj);
        this.createSortableHeaders();
        this.headers = [];
    }

    createSortableHeaders() {
        this.NameSort = SortableHeaderMixin(this, ColumnContentGetters.getName);
        this.ContestSort = SortableHeaderMixin(this, ColumnContentGetters.getContest, this.NameSort.cmp);
        this.ScoreSort = SortableHeaderMixin(this, ColumnContentGetters.getScore, this.NameSort.cmp);
        this.TagsSort = SortableHeaderMixin(this, ColumnContentGetters.getTags, this.NameSort.cmp);
        this.DifficultySort = SortableHeaderMixin(this, ColumnContentGetters.getDifficulty, this.NameSort.cmp);
        this.SolvedSort = SortableHeaderMixin(this, ColumnContentGetters.getSolved, this.NameSort.cmp);
        this.TriedSort = SortableHeaderMixin(this, ColumnContentGetters.getTried, this.NameSort.cmp);
        this.RatioSort = SortableHeaderMixin(this, ColumnContentGetters.getRatio, this.NameSort.cmp);
    }

    render() {
        let archiveChildren;
        this.headers = [];
        if (this.options.isArchive || !this.options.contest.isRunning()) {
            archiveChildren = [
                <this.TagsSort name={UI.T("Tags")} className={this.styleSheet.tags}/>,
                <this.DifficultySort name={UI.T("Difficulty")} className={this.styleSheet.taskDifficulty}/>
            ];
            this.headers.push(...archiveChildren);
        } else {
            archiveChildren = <div style={{width: "31%", height: "100%", display: "inline-block", float: "left"}} />
        }
        const name = <this.NameSort name={UI.T("Task")} style={{marginRight: "2px", display: "inline-block"}}/>;
        const contest = <this.ContestSort name={UI.T("Contest")} style={{marginLeft: "2px", display: "inline-block"}}/>;
        const score = <this.ScoreSort name={UI.T("Score")} className={this.styleSheet.userScore}/>;
        const solved = <this.SolvedSort name={UI.T("Solved")}/>;
        const tried = <this.TriedSort name={UI.T("Tried")}/>;
        const ratio = <this.RatioSort name={UI.T("Ratio")}/>;
        this.headers.push(...[name, contest, score, solved, tried, ratio]);
        return [
            <div className={this.styleSheet.className}>
                <div className={this.styleSheet.taskDescription}>
                    {name}|{contest}
                </div>
                {score}
                {archiveChildren}
                <div className={this.styleSheet.taskStatistics}>
                    <div className={this.styleSheet.taskStatisticsTitle} style={{paddingLeft: (2 * 6.86) + "px"}}>
                        {UI.T("Stats")}
                    </div>
                    <div className={this.styleSheet.taskStatisticsSubtitle}>
                        {solved}|{tried}|{ratio}
                    </div>
                </div>
            </div>
        ];
    }

    promoteCmp(selectedHeader) {
        for (let header of this.headers) {
            if (header !== selectedHeader) {
                header.setState(0);
            }
        }
        this.dispatch("setOrderCriterion", (a, b) => selectedHeader.options.state * selectedHeader.constructor.cmp(a, b));
    }
}
