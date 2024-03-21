import {Button, Level, Modal, Panel, Select, Size, TableRow, TextInput, Theme, UI} from "../../../csabase/js/UI.js";
import {SortableTable} from "../../../stemjs/src/ui/table/SortableTable.jsx";
import {EntriesManager, RangeTableInterface} from "../../../stemjs/src/ui/RangePanel.jsx";
import {CallThrottler} from "../../../stemjs/src/base/Utils.js";
import {SubmissionSummaryPanel} from "../../../eval/js/SubmissionSummary.jsx";
import {UserHandle} from "../../../csaaccounts/js/UserHandle.jsx";
import {PublicUserStore} from "../../../csaaccounts/js/state/UserStore.js";
import {Formatter} from "../../../csabase/js/util.js";
import {StemDate} from "../../../stemjs/src/time/Date.js";
import {Duration} from "../../../stemjs/src/time/Duration.js";
import {ServerTime} from "../../../stemjs/src/time/Time.js";
import {GlobalStyle} from "../../../stemjs/src/ui/GlobalStyle.js";
import {PopupSpan} from "../../../establishment/content/js/PopupSpan.jsx";
import {enhance} from "../../../stemjs/src/ui/Color.js";

import {Contest, ContestStore} from "../state/ContestStore.js";
import {ContestUserStore} from "../state/ContestUserStore.js";
import {ContestRegistererStore} from "../state/ContestRegistererStore";
import {compareContestUsers} from "../state/ScoringHelpers";
import {CSVBuilder} from "../../../stemjs/src/base/CSV.js";
import {RawCheckboxInput} from "../../../stemjs/src/ui/input/Input.jsx";
import {FormField} from "../../../stemjs/src/ui/form/Form.jsx";

const USERS_FILTER = {
    ALL_PARTICIPANTS: 0,
    ONLY_OFFICIAL: 1,
    ONLY_UNOFFICIAL: 2
};


class ContestEntriesManager extends EntriesManager {
    constructor(contest, virtualContest, comparator) {
        super([], {comparator});

        this.addContestListeners(contest);
        this.addContestListeners(virtualContest);

        this.contest = contest;
        this.virtualContest = virtualContest;

        this.cacheEntries();
    }

    addContestListeners(contest) {
        if (!contest) {
            return;
        }

        this.attachChangeListener(contest, () => {
            this.updateEntries();
        });
        this.attachListener(contest, "rankingsChange", () => {
            this.updateEntries();
        });
    }

    getRawEntries() {
        if (!this.contest) {
            return [];
        }
        let contestUsers = this.contest.getUsers();
        if (this.virtualContest) {
            contestUsers = [...contestUsers, ...this.virtualContest.getUsers()];
        }
        return contestUsers;
    }
}


class ContestUsersTableWithoutRangeInterface extends SortableTable {
    setOptions(options) {
        super.setOptions(options);

        // First by rating, second by name
        const {columns} = this.options;
        this.columnSortingOrder = [columns[2], columns[1]];
    }

    getEntriesManager() {
        if (!this.entriesManager) {
            this.entriesManager = new ContestEntriesManager(this.options.contest, this.options.virtualContest, this.getComparator());
        }
        return this.entriesManager;
    }

    applyFilter(filter) {
        this.getEntriesManager().setFilter(filter);
    }

    onMount() {
        super.onMount();

        // TODO: remove this when only using RangeTableInterface (move it to RangeTable)
        this.addListener("reorder", () => {
            this.getEntriesManager().setComparator(this.getComparator());
        });

        this.attachChangeListener(this.getEntriesManager(), () => {
            if (!document.body.contains(this.node)) {
                this.parent.dispatch("shouldRedrawChild", {child: this});
            } else {
                this.redraw();
            }
        });
    }

    getRowClass() {
        return ScoreboardEntryRow;
    }

    getEntries() {
        return this.getEntriesManager().getEntries();
    }

    getDefaultColumns() {
        let numberStyle = {
            textAlign: "right",
            width: "1%",
            verticalAlign: "middle",
        };

        let centerStyle = {
            textAlign: "center",
            margin: "auto",
            verticalAlign: "middle",
        };

        return [{
            value: (contestUser, index) => index + 1,
            headerName: "#",
            sortDescending: false,
            headerStyle: {verticalAlign: "middle"},
            cellStyle: numberStyle,
        }, {
            value: (contestUser) => {
                let handle = <UserHandle userId={contestUser.userId} showCountry/>;
                if (!contestUser.getContest().isVirtual()) {
                    return handle;
                } else {
                    //TODO: refactor this to update every minute
                    return <span>{handle} virtual {
                        contestUser.getContestStartTime() < ServerTime.now().unix() && ServerTime.now().unix() < contestUser.getContestEndTime() ?
                            new Duration((ServerTime.now().unix() - contestUser.getContestStartTime()) * 1000).format("HH:mm") : ""
                    }</span>;
                }
            },
            rawValue: (contestUser) => {
                let publicUser = PublicUserStore.get(contestUser.userId);
                if (!publicUser) {
                    return "publicUser-" + contestUser.userId;
                }
                return publicUser.getDisplayHandle();
            },
            headerName: "User",
            sortDescending: false,
            headerStyle: {verticalAlign: "middle", width: "80%"},
            cellStyle: {verticalAlign: "middle"},
        }, {
            value: (contestUser) => {
                //TODO: send publicUser when someone registers
                let user = PublicUserStore.get(contestUser.userId);
                if (!user) {
                    return "-";
                }
                return user.rating || "-";
            },
            rawValue: (contestUser) => {
                let user = PublicUserStore.get(contestUser.userId);
                if (!user) {
                    return 0;
                }
                return user.rating || 0;
            },
            headerName: "Rating",
            sortDescending: true,
            headerStyle: centerStyle,
            cellStyle: centerStyle,
        }];
    }
}

class ContestUsersTable extends RangeTableInterface(ContestUsersTableWithoutRangeInterface) {
    getEntriesManager() {
        if (!this.entriesManager) {
            this.entriesManager = new ContestEntriesManager(this.options.contest, this.options.virtualContest, this.getComparator());
        }
        return this.entriesManager;
    }

    getEntries() {
        return this.getEntriesManager().getEntries();
    }
}


export class ScoreboardEntryRow extends TableRow {
    extraNodeAttributes(attr) {
        if (this.options.entry.userId === USER.id) {
            attr.setAttribute("id", "currentUserRow");
            attr.setStyle("backgroundColor", enhance(Theme.Global.properties.COLOR_BACKGROUND, 0.15));
        }
    }
}


export class ScoreboardEntriesManager extends ContestEntriesManager {
    cacheEntries() {
        const entries = this.getRawEntries();
        Contest.calculateRanks(entries);
        this.cachedEntries = this.sortEntries(this.filterEntries(entries));
        this.dispatchChange();
    }
}


class ScoreboardTableWithoutRangeInterface extends SortableTable {
    setOptions(options) {
        super.setOptions(options);

        // First by score, second by name
        const {columns} = this.options;
        this.columnSortingOrder = [columns[2], columns[1]];
    }

    getRowClass() {
        return ScoreboardEntryRow;
    }

    getEntriesManager() {
        if (!this.entriesManager) {
            this.entriesManager = new ScoreboardEntriesManager(this.options.contest, this.options.virtualContest, this.getComparator());
        }
        return this.entriesManager;
    }

    getEntries() {
        return this.getEntriesManager().getEntries();
    }

    applyFilter(filter) {
        this.getEntriesManager().setFilter(filter);
    }

    showSubmissions(contestUser, contestTask) {
        let sourcesNotPublic;
        if (!this.options.originalContest.canShowPublicSources()) {
            sourcesNotPublic = <h3>Sources are NOT public! You can only see this as an admin!</h3>;
        }

        let filters = {
            contestId: contestUser.contestId,
            userId: contestUser.userId,
            contestTaskId: contestUser.getContest().getMatchingContestTask(contestTask).id,
        };

        Modal.show({
            fillScreen: true,
            children: [
                sourcesNotPublic,
                <SubmissionSummaryPanel filters={filters} style={{paddingRight: "5%"}}/>
            ]
        });
    }

    renderContestUserAndContestTaskCell(contestUser, contestTask) {
        if (!contestUser.scores) {
            return "-";
        }

        let userTaskSummary = contestUser.scores[contestTask.id];
        if (this.options.virtualContest) {
            let virtualContestTask = contestTask.getVirtualTask();
            userTaskSummary = userTaskSummary || contestUser.scores[virtualContestTask.id];
        }
        if (!userTaskSummary) {
            return "-";
        }

        const userScore = userTaskSummary.score || 0;
        let score, penalty;
        if (contestTask.hasPartialScore()) {
            score = <span>{Formatter.truncate(userScore * contestTask.pointsWorth, 2)}</span>;
        } else if (userScore === 1) {
            score = <span className="fa fa-check fa-lg" style={{color: "green"}}/>;
        } else {
            score = <span className="fa fa-times fa-lg" style={{color: "red"}}/>;
        }
        if (contestTask.hasPenalty()) {
            let numSubmissions = null;
            if (userScore === 1) {
                if (userTaskSummary.scoreSubmissionNumber > 1) {
                    numSubmissions = <span style={{fontSize: "0.8em"}}>
                                        ({userTaskSummary.scoreSubmissionNumber - 1})
                                    </span>;
                }
            } else if (userTaskSummary.numSubmissions > 0) {
                numSubmissions = <span style={{fontSize: "0.8em"}}>
                                    ({userTaskSummary.numSubmissions})
                                </span>;
            }
            score = [score, numSubmissions];
            let contestStartTime = new StemDate(contestUser.getContestStartTime());
            let solutionTime = new StemDate(userTaskSummary.scoreTime);
            let solutionTimeRelative = solutionTime.diffDuration(contestStartTime);
            if (contestTask.hasPartialScore() || userScore === 1) {
                penalty = <div style={{fontSize: "0.8em", color: "grey"}}>
                    {solutionTimeRelative.format("HH:mm")}
                </div>;
            }
        }

        const containerOptions = {
            style: {}
        };

        if (USER.isSuperUser || this.options.originalContest.canShowPublicSources()) {
            containerOptions.onClick = () => this.showSubmissions(contestUser, contestTask);
            Object.assign(containerOptions.style, {
                cursor: "pointer",
                pointerEvents: "auto",
            });
        }


        return <div {...containerOptions}>
            {[score, penalty]}
        </div>;
    }

    getContestUserAndContestTaskCellRawValue(contestUser, contestTask) {
        if (!contestUser.scores) {
            return -1;
        }

        let userTaskSummary = contestUser.scores[contestTask.id];
        if (this.options.virtualContest) {
            let virtualContestTask = contestTask.getVirtualTask();
            userTaskSummary = userTaskSummary || contestUser.scores[virtualContestTask.id];
        }
        if (!userTaskSummary) {
            return -1;
        }

        if (contestTask.hasPartialScore()) {
            return userTaskSummary.score;
        }

        if (userTaskSummary.score) {
            return 1;
        }
        return 0;
    }

    renderContestTaskHeader(contestTask, index) {
        let taskName;
        if (this.options.contest.scoreboardType === Contest.scoreboardType.TASK_NAME) {
            taskName = <div>{UI.T(contestTask.longName)}</div>;
        } else {
            taskName = <PopupSpan popupContent={UI.T(contestTask.longName)}>
                {String.fromCharCode("A".charCodeAt(0) + index)}
            </PopupSpan>
        }
        let taskScore = null;
        if (contestTask.hasScore()) {
            taskScore = <div style={{fontSize: "0.9em"}}>{Formatter.truncate(contestTask.pointsWorth, 2)}</div>;
        }
        return [
            taskName,
            taskScore
        ];
    }

    shouldShowTaskColumns() {
        return this.options.contest.scoreboardType !== Contest.scoreboardType.TOTAL_SCORE_ONLY;
    }

    getDefaultColumns() {
        const {contest} = this.options;

        const columnWidths = {
            rank: 1,
            user: 29,
            score: 10,
            tasks: 60,
        }

        const numberStyle = {
            textAlign: "right",
            width: "1%",
            verticalAlign: "middle",
        };

        const centerStyle = {
            textAlign: "center",
            margin: "auto",
            verticalAlign: "middle",
        };

        const scoreColumns = this.options.scoreColumns;
        scoreColumns[0].headerStyle = scoreColumns[0].cellStyle = {
            ...centerStyle,
            width: columnWidths.score + "%",
        };

        const columns = [{
            headerName: UI.T("Rank"),
            rawValue: contestUser => contestUser.rank,
            value: contestUser => {
                let displayRank = contestUser.rank;
                const {globalRank} = contestUser;
                if (globalRank && globalRank != contestUser.rank) {
                    displayRank = displayRank + " (" + globalRank + ")";
                }
                return displayRank;
            },
            sortDescending: false,
            headerStyle: {verticalAlign: "middle", width: columnWidths.rank + "%", maxWidth: "50px"},
            cellStyle: {...numberStyle, width: columnWidths.rank + "%", maxWidth: "50px"},
        }, {
            headerName: UI.T("User"),
            value: (contestUser) => {
                let handle = <UserHandle userId={contestUser.userId} showCountry/>;
                if (!contestUser.getContest().isVirtual() || ContestRegistererStore.getForContest(contestUser.getContest().getBaseContest().id)) {
                    return handle;
                } else {
                    //TODO: refactor this to update every minute
                    return <span>{handle} {UI.T("virtual")} {
                        contestUser.getContestStartTime() < ServerTime.now().unix() && ServerTime.now().unix() < contestUser.getContestEndTime() ?
                            new Duration((ServerTime.now().unix() - contestUser.getContestStartTime()) * 1000).format("HH:mm") : ""
                    }</span>;
                }
            },
            rawValue: (contestUser) => {
                let publicUser = PublicUserStore.get(contestUser.userId);
                if (!publicUser) {
                    return "publicUser-" + contestUser.userId;
                }
                return publicUser.getDisplayHandle();
            },
            sortDescending: false,
            headerStyle: {verticalAlign: "middle", width: columnWidths.user + "%"},
            cellStyle: {verticalAlign: "middle", width: columnWidths.user + "%"},
        },
            ...scoreColumns,
        //     {
        //     headerName: () => [
        //         <span style={{fontSize: "1.2em"}}>{UI.T("Score")}</span>,
        //         contest.hasPenalty() ? <span style={{fontSize: "0.8em"}}> ({UI.T("Penalty")})</span> : null
        //     ],
        //     value: (contestUser) => {
        //         let penalty;
        //         if (contestUser.penalty && contest.hasPenalty()) {
        //             penalty = <span style={{fontSize: "0.8em"}}> ({Math.round(contestUser.penalty)})</span>
        //         }
        //         let score = (contestUser.numSubmissions) ? Formatter.truncate(contestUser.totalScore, 2) : "-";
        //         return [<strong style={{fontSize: "1.2em"}}>{score}</strong>, penalty];
        //     },
        //     rawValue: entry => entry,
        //     cmp: compareContestUsers,
        //     headerStyle: {...centerStyle, width: columnWidths.score + "%"},
        //     cellStyle: {...centerStyle, width: columnWidths.score + "%"},
        // }
        ];

        if (this.shouldShowTaskColumns()) {
            const contestTasks = contest.getContestTasks();
            for (let i = 0; i < contestTasks.length; i += 1) {
                const contestTask = contestTasks[i];
                columns.push({
                    headerName: () => this.renderContestTaskHeader(contestTask, i),
                    value: contestUser => this.renderContestUserAndContestTaskCell(contestUser, contestTask),
                    rawValue: contestUser => this.getContestUserAndContestTaskCellRawValue(contestUser, contestTask),
                    sortDescending: true,
                    headerStyle: {...centerStyle, width: columnWidths.tasks / contestTasks.length + "%"},
                    cellStyle: {...centerStyle, width: columnWidths.tasks / contestTasks.length + "%"},
                });
            }
        }

        return columns;
    }

    onMount() {
        super.onMount();

        this.addListener("reorder", () => {
            this.getEntriesManager().setComparator(this.getComparator());
        });
        this.attachChangeListener(this.getEntriesManager(), () => {
            this.redraw();
        });
    }
}

class ScoreboardTable extends RangeTableInterface(ScoreboardTableWithoutRangeInterface) {
    getEntriesManager() {
        if (!this.entriesManager) {
            this.entriesManager = new ScoreboardEntriesManager(this.options.contest, this.options.virtualContest, this.getComparator());
        }
        return this.entriesManager;
    }

    getEntries() {
        return this.getEntriesManager().getEntries();
    }
}


class PrivateArchiveUsersTable extends SortableTable {
    onMount() {
        super.onMount();

        // TODO: should be addListener("createOrUpdate")
        ContestUserStore.addCreateListener((data) => {
            this.parent.dispatch("shouldRedrawChild", {child: this});
        });
        ContestUserStore.addChangeListener((data) => {
            this.parent.dispatch("shouldRedrawChild", {child: this});
        });
    }

    getEntries() {
        if (!this.options.privateArchive) {
            return [];
        }
        return this.options.privateArchive.getUsers();
    }

    getDefaultColumns() {
        let numberStyle = {
            textAlign: "right",
            width: "1%",
            verticalAlign: "middle",
        };

        let centerStyle = {
            textAlign: "center",
            margin: "auto",
            verticalAlign: "middle",
        };

        let columns = [{
            value: (privateArchiveUser, index) => index + 1,
            headerName: "#",
            sortDescending: false,
            headerStyle: {verticalAlign: "middle"},
            cellStyle: numberStyle,
        }, {
            value: (privateArchiveUser) => {
                return <UserHandle userId={privateArchiveUser.userId} showCountry/>;
            },
            rawValue: (privateArchiveUser) => {
                return privateArchiveUser.userId;
            },
            headerName: "User",
            sortDescending: false,
            headerStyle: {verticalAlign: "middle"},
            cellStyle: {verticalAlign: "middle"},
        }];

        for (let contestTask of this.options.privateArchive.getContestTasks()) {
            columns.push({
                value: (privateArchiveUser) => {
                    let contestUser = privateArchiveUser.getContestUser(contestTask);
                    if (!contestUser) {
                        return "-";
                    }
                    if (!contestUser.scores) {
                        return "-";
                    }
                    let userTaskSummary = contestUser.scores[contestTask.id];
                    if (!userTaskSummary) {
                        return "-";
                    }

                    let showSubmissions = () => {
                        let filters = {
                            contestId: contestTask.getEvalTask().defaultContest.id,
                            userId: contestUser.userId,
                            contestTaskId: contestTask.id,
                        };

                        Modal.show({
                            fillScreen: true,
                            children: [
                                <SubmissionSummaryPanel filters={filters} style={{paddingRight: "5%"}}/>
                            ]
                        });
                    };

                    let score;
                    if (contestUser.solvedTask(contestTask)) {
                        score = <span className="fa fa-check fa-lg" style={{color: "green"}} onClick={showSubmissions} />
                    } else {
                        score = Formatter.truncate(userTaskSummary.score, 2);
                    }
                    return <span onClick={showSubmissions}>{score}</span>;
                },
                rawValue: (privateArchiveUser) => {
                    let contestUser = privateArchiveUser.getContestUser(contestTask);
                    if (!contestUser) {
                        return -1;
                    }
                    if (!contestUser.scores) {
                        return -1;
                    }
                    let userTaskSummary = contestUser.scores[contestTask.id];
                    if (!userTaskSummary) {
                        return -1;
                    }
                    return userTaskSummary.score || 0;
                },
                headerName: () => <div>{contestTask.longName}</div>,
                sortDescending: true,
                headerStyle: centerStyle,
                cellStyle: centerStyle,
            });
        }

        return columns;
    }
}


class ContestUsersFilter extends UI.Primitive("span") {
    extraNodeAttributes(attr) {
        attr.setStyle("whiteSpace", "nowrap");
    }

    render() {
        return [<Select ref="filterUsers" options={["All participants", "Only official", "Only unofficial"]}
                                    style={{height: "2.2em"}}/>,
            <Select ref="filterCountry" style={{height: "2.2em", marginLeft: "10px"}}
                                                                options={this.options.contest.getCountries()} />,
            <TextInput ref="findUserInput" style={{height: "2.03em", marginLeft: "10px", verticalAlign: "middle"}}
                            placeholder="Find user..."/>
        ];
    }

    getFilter() {
        return (contestUser) => {
            const usersFilter = this.filterUsers.getIndex();
            const countryIdFilter = this.filterCountry.get().id;
            const findUser = this.findUserInput.getValue() || "";
            const isOfficial = contestUser.isOfficial();
            if ((isOfficial && usersFilter === USERS_FILTER.ONLY_UNOFFICIAL) ||
                (!isOfficial && usersFilter === USERS_FILTER.ONLY_OFFICIAL)) {
                return false;
            }
            const keywords = findUser.trim().toLowerCase();
            const publicUser = PublicUserStore.get(contestUser.userId);
            // TODO: Public user should have been in state.
            if (!publicUser) {
                return false;
            }
            if (keywords !== "") {
                if ((publicUser.name || "").toLowerCase().indexOf(keywords) == -1 &&
                    (publicUser.username || "").toLowerCase().indexOf(keywords) == -1) {
                    return false;
                }
            }
            if (countryIdFilter) {
                return publicUser.countryId === countryIdFilter;
            }
            return true;
        };
    }

    updateFilter() {
        this.dispatch("filterChange");
    }

    onMount() {
        this.filterUsers.addChangeListener(() => {this.updateFilter();});
        this.filterCountry.addChangeListener(() => {this.updateFilter();});
        this.findUserInput.addNodeListener("keyup", () => {this.updateFilter();});

        this.updateFilter();

        const updateThrottler = new CallThrottler({throttle: 300});
        const updateCountryFilterThrottled = updateThrottler.wrap(
            () => this.filterCountry.updateOptions({options: this.options.contest.getCountries()})
        );
        this.attachListener(this.options.contest, "contestUserUpdate", updateCountryFilterThrottled);
    }
}


export class Scoreboard extends Panel {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.addClass(GlobalStyle.Utils.fullHeight);
        attr.setStyle({
            display: "flex",
            flexDirection: "column",
        })
    }

    getContestUsersFilter() {
        return <ContestUsersFilter ref="contestUsersFilter" contest={this.options.contest}/>;
    }

    getContestUsersTableClass() {
        return ContestUsersTable;
    }

    getScoreboardTableClass() {
        return ScoreboardTable;
    }

    getScoreColumns() {
        const {contest} = this.options;
        const linkedContests = contest.parentId ? ContestStore.filterBy({parentId: contest.parentId}) : [];

        const reverseCmp = (a, b) => b - a;



        const totalScoreColumn = [
            {
                toUI() {
                    return <span>
                        <span style={{fontSize: "1.2em"}}>{UI.T("Score")}</span>
                        {!!contest.hasPenalty() && <span style={{fontSize: "0.8em"}}> ({UI.T("Penalty")})</span>}
                    </span>
                },
                toString() {
                    return "Score"
                },
            },
            contestUser => ({
                toUI() {
                    return <span>
                        <strong style={{fontSize: "1.2em"}}>
                            {(contestUser.numSubmissions) ? Formatter.truncate(contestUser.totalScore, 2) : "-"}
                        </strong>
                        {contest.hasPenalty() && contestUser.penalty > 0 && <span style={{fontSize: "0.8em"}}>
                            ({Math.round(contestUser.penalty)})
                        </span>}
                    </span>;
                },
                toString() {
                    return contestUser.totalScore;
                }
            }),

            {rawValue: entry => entry, cmp: compareContestUsers}
        ];

        if (linkedContests.length <= 1 || !this.includeRelatedContestsInput?.getValue()) {
            return [totalScoreColumn];
        }

        const totalMetaScore = (contestUser) => {
            let result = 0;
            for (const linkedContest of linkedContests) {
                const relatedContestUser = linkedContest.getUser(contestUser.userId);
                if (relatedContestUser) {
                    relatedContestUser.recalculateTotalScore();
                    result += relatedContestUser.totalScore;
                }

            }
            return result;
        }

        const contestSharedPrefixLength = () => {
            const contestNames = linkedContests.map(c => c.longName);
            for (let sharedPrefixLength = 0; sharedPrefixLength + 1 < contestNames[0].length; sharedPrefixLength++) {
                const curChar = contestNames[0].charAt(sharedPrefixLength);

                for (let index = 1; index < contestNames.length; index++) {
                    if (contestNames[index].charAt(sharedPrefixLength) !== curChar) {
                        return 0; // or sharedPrefixLength;
                    }
                }

                if (curChar === ":" || curChar === "-") {
                    return sharedPrefixLength + 1;
                }
            }
            return 0;
        }

        const sharedPrefixLength = contestSharedPrefixLength();

        return [
            [
                UI.T("Total Score"),
                (contestUser) => ({
                    toUI() { return <strong style={{fontSize: "1.2em"}}>{Formatter.truncate(totalMetaScore(contestUser), 2)}</strong>},
                    toString() {return totalMetaScore(contestUser)},
                }),
                {cmp: reverseCmp}
            ],
            ...linkedContests.map(linkedContest => {
                const title = linkedContest.longName.substring(sharedPrefixLength).trim();
                const score = (contestUser) => {
                    const linkedContestUser = linkedContest.getUser(contestUser.userId);
                    return linkedContestUser?.numSubmissions ? Formatter.truncate(linkedContestUser.totalScore, 2) : "-";
                }
                return [title, score];
            }),
        ];
    }

    async downloadScores() {
        const {contest} = this.options;
        const contestUsers = Array.from(contest.contestUsers.values());
        Contest.calculateRanks(contestUsers);

        const csvColumns = [
            ["Username", u => u.getPublicUser().username],
            ["Name", u => u.getPublicUser().name],

            ...this.getScoreColumns(),

            ["Penalty", u => u.penalty],
            ["Country", u => u.getPublicUser().getCountry() || ""],
        ];

        for (const contestTask of contest.getContestTasks()) {
            const getStats = (contestUser) => contestUser.scores[contestTask.id];
            const getScore = (contestUser) => (getStats(contestUser)?.score || 0) * 100.0;
            const getPenalty = (contestUser) => (getStats(contestUser)?.scoreTime || contest.startTime) - contest.startTime;
            const name = contestTask.toString();
            csvColumns.push([name, getScore]);
            csvColumns.push([name + " Penalty", getPenalty]);
        }

        csvColumns.push(["Judge decision",
            contestUser => {
                if (contestUser.isDisqualified()) {
                    return "Disqualified";
                }
                return "-";
            }
        ]);

        CSVBuilder.saveFile(csvColumns, contestUsers, contest.name + "-Scores.csv");
    }

    getScoreboardActionableArea() {
        const {contest} = this.options;

        return [
            contest.getUser(USER.id) && <Button
                ref="showMeButton"
                label={UI.T("Show Me")}
                onClick={() => this.showMe()}
                style={{marginRight: "10px", height: "2.2em"}}
                level={Level.INFO}
                size={Size.SMALL}
            />,

            this.getContestUsersFilter(),

            // TODO: add this functionality for all contest owners
            USER.isSuperUser && [
                <Button
                    onClick={() => this.downloadScores()}
                    label="Download scores"
                    style={{marginLeft: "10px", height: "2.2em", paddingTop: 0, paddingBottom: 0}}
                    level={Level.PRIMARY}
                    size={Size.SMALL}
                />,
                contest.parentId && <label>
                    <RawCheckboxInput ref="includeRelatedContestsInput" value={this.includeRelatedContests} onChange={(value) => {
                        this.includeRelatedContests = value; // Ugh, fucking hell
                        this.redraw();
                    }}/>
                    Include related contests
                </label>
            ],
        ];
    }

    render() {
        const {contest, virtualContest, originalContest} = this.options;

        const ScoreboardTableClass = originalContest.hasStarted() ? this.getScoreboardTableClass() : this.getContestUsersTableClass();

        return [
            <div style={{padding: "20px 0"}}>
                {this.getScoreboardActionableArea()}
            </div>,
            <ScoreboardTableClass
                ref="scoreboardTable"
                contest={contest}
                virtualContest={virtualContest}
                originalContest={originalContest}
                scoreColumns={this.getScoreColumns()}
                style={{flex: "1"}}
            />
        ];
    }

    showMe() {
        const currentUserRow = document.getElementById("currentUserRow");
        if (currentUserRow) {
            document.body.scrollTop = Math.max(currentUserRow.offsetTop - window.innerHeight / 2, 0);
        } else {
            this.scoreboardTable.dispatch("showCurrentUser");
        }
    }

    onMount() {
        super.onMount();
        this.scoreboardTable.applyFilter(this.contestUsersFilter.getFilter());

        this.contestUsersFilter.addListener("filterChange", () => {
            this.scoreboardTable.applyFilter(this.contestUsersFilter.getFilter());
        });

        this.addListener("setActive", (active) => {
            setTimeout(() => {
                this.scoreboardTable.redraw();
            });
            if (active) {
                if (typeof this.scoreboardTable.applyScrollState == "function") {
                    this.scoreboardTable.applyScrollState();
                }
            } else {
                if (typeof this.scoreboardTable.saveScrollState == "function") {
                    this.scoreboardTable.saveScrollState();
                }
            }
        });

    }
}

export {ContestUsersTable, ContestUsersFilter, PrivateArchiveUsersTable, ScoreboardTable};
