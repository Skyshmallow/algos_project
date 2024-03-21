import {UI, Select, TextInput, Button, Level, Size} from "../../csabase/js/UI.js";
import {Formatter} from "../../csabase/js/util.js";
import {CallThrottler} from "../../stemjs/src/base/Utils.js";
import {Contest} from "../../contest/js/state/ContestStore.js";
import {
    Scoreboard, ContestUsersFilter, ScoreboardTable,
    ContestUsersTable, ScoreboardEntriesManager
} from "../../contest/js/scoreboard/Scoreboard.jsx";

import {PublicUserStore} from "../../csaaccounts/js/state/UserStore.js";
import {IEEEXtremeUserHandle} from "./IEEEXtremeUserHandle.jsx";
import {StemDate} from "../../stemjs/src/time/Date.js";
import {ServerTime} from "../../stemjs/src/time/Time.js";
import {Duration} from "../../stemjs/src/time/Time.js";
import {CSVBuilder} from "../../stemjs/src/base/CSV.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {ContestUserStore} from "../../contest/js/state/ContestUserStore.js";


export const IEEETeamType = {
    OFFICIAL: 1,
    LATE_REGISTRATION: 2,
    PROCTOR: 3,
    HIGH_SCHOOL: 4,
};

const IEEERegion = {
    "R1": "(R1) Northeastern US",
    "R2": "(R2) Eastern US",
    "R3": "(R3) Southern US",
    "R4": "(R4) Central US",
    "R5": "(R5) Southwestern US",
    "R6": "(R6) Western US",
    "R7": "(R7) Canada",
    "R8": "(R8) Africa, Europe, Middle East",
    "R9": "(R9) Latin America",
    "R0": "(R10) Asia and Pacific",
};

const TEAM_TYPE_SET_PARTICIPANTS = new Set([
    IEEETeamType.OFFICIAL,
    IEEETeamType.LATE_REGISTRATION,
]);

const isXtremeParticipant = (contestUser) => TEAM_TYPE_SET_PARTICIPANTS.has(contestUser?.ieeeTeamType);

class IEEEXtremeContestUsersFilter extends ContestUsersFilter {
    render() {
        const teamTypeOptions = [
            ["Teams", TEAM_TYPE_SET_PARTICIPANTS],
            ["Proctor", new Set([
                IEEETeamType.PROCTOR,
            ])],
            ["High School", new Set([
                IEEETeamType.HIGH_SCHOOL,
            ])],
        ].map(([name, typeSet]) => {
            return {
                toString: () => name,
                typeSet: typeSet,
            }
        });

        let regions = [];
        regions.push({
            toString: () => "All regions",
            region: "",
        });
        for (let key in IEEERegion) {
            regions.push({
                toString: () => IEEERegion[key],
                region: key,
            });
        }

        return [
            <Select ref="filterUsers" style={{height: "2.2em", marginLeft: "10px"}}
                    options={teamTypeOptions} selected={teamTypeOptions[0]}/>,
            <Select ref="filterCountry" style={{height: "2.2em", marginLeft: "10px"}}
                    options={this.options.contest.getCountries()} />,
            <Select ref="filterRegion" style={{height: "2.2em", marginLeft: "10px"}}
                    options={regions} />,
            <TextInput ref="findTeamInput" style={{height: "2.03em", marginLeft: "10px", verticalAlign: "middle"}}
                       placeholder="Find team..." />,
        ];
    }

    getFilter() {
        this.options.findUser = this.findTeamInput.getValue();
        this.options.countryIdFilter = this.filterCountry.get().id;
        this.options.regionIdFilter = this.filterRegion.get().region;

        return (contestTeam) => {
            const keywords = (this.options.findUser || "").trim().toLowerCase();
            const publicUser = PublicUserStore.get(contestTeam.userId);

            const teamTypeSet = this.filterUsers.get().typeSet;
            const {ieeeTeamType} = contestTeam; // TODO: get from contest user

            if (!teamTypeSet.has(ieeeTeamType)) {
                return false;
            }
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
            if (this.options.countryIdFilter && publicUser.countryId !== this.options.countryIdFilter) {
                return false;
            }
            // check this one, might be regionIdFilter - 1
            if (this.options.regionIdFilter && contestTeam.region !== this.options.regionIdFilter) {
                return false;
            }
            return true;
        };
    }

    onMount() {
        this.filterUsers.addChangeListener(() => {this.updateFilter();});
        this.filterCountry.addChangeListener(() => {this.updateFilter();});
        this.filterRegion.addChangeListener(() => {this.updateFilter();});
        this.findTeamInput.addNodeListener("keyup", () => {this.updateFilter();});

        this.updateFilter();

        const updateThrottler = new CallThrottler({throttle: 300});
        const updateCountryFilterThrottled = updateThrottler.wrap(
            () => this.filterCountry.updateOptions({options: this.options.contest.getCountries()})
        );
        this.attachListener(this.options.contest, "contestUserUpdate", updateCountryFilterThrottled);
    }
}

class IEEEXtremeContestUsersTable extends ContestUsersTable {
    getUniversityAndRegionColumns() {
        let centerStyle = {
            textAlign: "left",
            margin: "auto",
            verticalAlign: "middle",
        };

        const columns = [{
            value: (contestTeam) => {
                return contestTeam.university || "-";
            },
            rawValue: (contestTeam) => {
                return contestTeam.university || "-";
            },
            headerName: "University",
            sortDescending: true,
            headerStyle: centerStyle,
            cellStyle: centerStyle,
        }, {
            value: (contestTeam) => {
                return (contestTeam.region && IEEERegion[contestTeam.region]) || "-";
            },
            rawValue: (contestTeam) => {
                return (contestTeam.region && IEEERegion[contestTeam.region]) || "-";
            },
            headerName: "Region",
            sortDescending: true,
            headerStyle: centerStyle,
            cellStyle: centerStyle,
        }];

        return columns;
    }

    getUserColumn() {
        let centerStyle = {
            textAlign: "left",
            margin: "auto",
            verticalAlign: "middle",
        };

        return [{
            value: (contestTeam) => {
                let handle = <IEEEXtremeUserHandle userId={contestTeam.userId}
                                                   contestTeam={contestTeam}
                                                   showCountry
                                                   noPopup />;

                if (!contestTeam.getContest().isVirtual()) {
                    return handle;
                } else {
                    //TODO: refactor this to update every minute
                    return <span>{handle} virtual {
                        contestTeam.getContestStartTime() < ServerTime.now().unix() && ServerTime.now().unix() < contestTeam.getContestEndTime() ?
                            new Duration((ServerTime.now().unix() - contestTeam.getContestStartTime()) * 1000).format("HH:mm") : ""
                    }</span>;
                }
            },
            rawValue: (contestTeam) => {
                return contestTeam.getPublicUser().username || "publicuser-" + contestTeam.userId;
            },
            headerName: "Team",
            sortDescending: true,
            headerStyle: centerStyle,
            cellStyle: centerStyle,
        }];
    }

    getDefaultColumns() {
        let numberStyle = {
            textAlign: "right",
            width: "1%",
            verticalAlign: "middle",
        };

        let centerStyle = {
            textAlign: "left",
            margin: "auto",
            verticalAlign: "middle",
        };

        let columns = [{
            value: (contestTeam, index) => (index + 1),
            headerName: "#",
            sortDescending: false,
            headerStyle: {verticalAlign: "middle"},
            cellStyle: numberStyle,
        }, ...this.getUserColumn(), ...this.getUniversityAndRegionColumns()];

        if (this.options.contest.hasStarted()) {
            columns.push({
                value: contestTeam => contestTeam.totalScore,
                rawValue: contestTeam => contestTeam.totalScore,
                headerName: "Total Score",
                sortDescending: true,
                headerStyle: centerStyle,
                cellStyle: centerStyle,
            });
        }

        return columns;
    }
}


class IEEEXtremeScoreboardEntriesManager extends ScoreboardEntriesManager {
    cacheEntries() {
        const officialEntries = this.getRawEntries().filter(entry => isXtremeParticipant(entry));
        Contest.calculateRanks(officialEntries);
        for (let entry of officialEntries) {
            entry.globalRank = entry.rank;
        }
        const entries = this.filterEntries(this.getRawEntries());
        Contest.calculateRanks(entries);
        this.cachedEntries = this.sortEntries(entries);
        this.dispatchChange();
    }
}


class IEEEXtremeScoreboardTable extends ScoreboardTable {
    shouldShowTaskColumns() {
        return this.options.showFullScoreboard;
    }

    getEntriesManager() {
        if (!this.entriesManager) {
            this.entriesManager = new IEEEXtremeScoreboardEntriesManager(this.options.contest, this.options.virtualContest, this.getComparator());
        }
        return this.entriesManager;
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
        } else if (userScore == 1) {
            score = <span className="fa fa-check fa-lg" style={{color: "green"}}/>;
        } else {
            score = <span className="fa fa-times fa-lg" style={{color: "red"}}/>;
        }
        if (contestTask.hasPenalty()) {
            let contestStartTime = new StemDate(contestUser.getContestStartTime());
            let solutionTime = new StemDate(userTaskSummary.scoreTime);
            let solutionTimeRelative = solutionTime.diffDuration(contestStartTime);
            if (contestTask.hasPartialScore() || userScore == 1) {
                penalty = <div style={{fontSize: "0.8em", color: "grey"}}>
                    {solutionTimeRelative.format("HH:mm")}
                </div>;
            }
        }
        return <div onClick={() => this.showSubmissions(contestUser, contestTask)}>
            {[score, penalty]}
        </div>;
    }

    getDefaultColumns(options) {
        const columns = super.getDefaultColumns(options);

        columns.splice(1, 1, ...this.getUserColumn());
        if (!this.options.showFullScoreboard) {
            columns.splice(3, 0, ...this.getUniversityAndRegionColumns());
        }

        delete this.options?.columns; // TODO we do this to not overwrite us

        return columns;
    }
}
IEEEXtremeScoreboardTable.prototype.getUniversityAndRegionColumns = IEEEXtremeContestUsersTable.prototype.getUniversityAndRegionColumns;
IEEEXtremeScoreboardTable.prototype.getUserColumn = IEEEXtremeContestUsersTable.prototype.getUserColumn;


export class IEEEXtremeScoreboard extends Scoreboard {
    getContestUsersFilter() {
        return <IEEEXtremeContestUsersFilter ref="contestUsersFilter" contest={this.options.contest}/>;
    }

    getContestUsersTableClass() {
        return IEEEXtremeContestUsersTable;
    }

    getScoreboardTableClass() {
        return IEEEXtremeScoreboardTable;
    }

    toggleScoreboard() {
        this.showFullScoreboard = !this.showFullScoreboard;

        this.showFullScoreboardButton.setLabel(this.showFullScoreboard ? "Show region & university" : "Show scores on tasks");

        this.scoreboardTable.updateOptions({
            showFullScoreboard: this.showFullScoreboard,
        });
    }

    async downloadScores() {
        const {contest} = this.options;
        let contestUsers = Array.from(contest.contestUsers.values());
        contestUsers = contestUsers.filter(cu => isXtremeParticipant(cu));
        Contest.calculateRanks(contestUsers);

        let csvColumns = [
            {name: "Team Name", value: u => u.getPublicUser().name},
            {name: "Internal Team Id", value: u => u.getPublicUser().username},
            {name: "Total score", value: u => u.totalScore},
            {name: "Penalty", value: u => u.penalty},
            {name: "University", value: u => u.university || ""},
            {name: "Country", value: u => u.getPublicUser().getCountry() || ""},
            {name: "Region", value: u => u.region || ""},
        ];

        if (window.FULL_IEEE_DATA || (USER.id === 1 && confirm("Get full scoreboard with emails?"))) {
            const response = await Ajax.getJSON("/contest/all_ieee_teams/", {
                contestId: contest.id,
            });

            for (const team of response.state.IEEExtremeTeam) {
                const contestUser = ContestUserStore.get(team.contestUserId);
                contestUser.ieeeData = team.ieeeData;
            }

            csvColumns[0].value = u => u.ieeeData.Name;

            const members = ["Member 1", "Member 2", "Member 3", "Proctor"];
            const fields = ["Email", "ID", "First Name", "Last Name"];

            for (const member of members) {
                for (const field of fields) {
                    const keyName = member + " " + field;
                    csvColumns.push({
                        name: keyName,
                        value: u => u.ieeeData?.[keyName] || "",
                    });
                }
            }

        }

        for (const contestTask of contest.getContestTasks()) {
            const getStats = (contestUser) => contestUser.scores[contestTask.id];
            const getScore = (contestUser) => (getStats(contestUser)?.score || 0) * 100.0;
            const getPenalty = (contestUser) => (getStats(contestUser)?.scoreTime || contest.startTime) - contest.startTime;
            const name = contestTask.toString();
            csvColumns.push({name: name + " Raw Score", value: getScore});
            csvColumns.push({name: name + " Penalty", value: getPenalty});
        }

        csvColumns.push({
            name: "Judge decision",
            value: contestUser => {
                if (contestUser.isDisqualified()) {
                    return "disqualified";
                }
                return "ok";
            }
        })

        CSVBuilder.saveFile(csvColumns, contestUsers, "XtremeScores.csv");
    }

    getScoreboardActionableArea() {
        let buttons = [];
        if (this.options.contest.hasStarted()) {
            buttons.push(<Button ref="showFullScoreboardButton"
                             onClick={() => this.toggleScoreboard()}
                             label="Show scores on tasks"
                             style={{marginLeft: "10px", height: "2.2em", paddingTop: 0, paddingBottom: 0}}
                             level={Level.PRIMARY}
                             size={Size.SMALL} />);
        }
        return [super.getScoreboardActionableArea(), buttons];
    }
}