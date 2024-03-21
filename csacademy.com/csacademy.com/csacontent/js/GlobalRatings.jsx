// import {UI, RangeTableInterface, SortableTable} from "UI";
import {UI} from "../../stemjs/src/ui/UIBase.js";
import {RangeTableInterface} from "../../stemjs/src/ui/RangePanel.jsx";
import {SortableTable} from "../../stemjs/src/ui/table/SortableTable.jsx";
import {PublicUserStore} from "../../csaaccounts/js/state/UserStore.js";
import {UserHandle} from "../../csaaccounts/js/UserHandle.jsx";
import {CountryUsersFilter} from "../../contest/js/ArchiveWidget.jsx"; // TODO: merge that with ContestUsersFilter somehow
import {EntriesManager} from "../../stemjs/src/ui/RangePanel.jsx";

class RankingTable extends SortableTable {
    setOptions(options) {
        super.setOptions(options);
        const {columns} = this.options;
        this.columnSortingOrder = [columns[0], columns[1]];
    }

    getEntries() {
        return this.sortEntries(PublicUserStore.all().filter(user => user.rating));
    }

    getDefaultColumns() {
        let numberStyle = {
            textAlign: "right",
            width: "1%",
            verticalAlign: "middle",
        };

        const paddingStyle = {
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft:  4,
            paddingRight: 3,
        };
        const rankStyle = {
            width: "0%",
        };
        const userStyle = {
            width: "80%",
            whiteSpace: "nowrap",
        };
        const scoreStyle = {
            width: "20%",
        };

        return [{
            value: user => user.globalRatingRank,
            headerName: UI.T("Rank"),
            sortDescending: false,
            headerStyle: Object.assign({verticalAlign: "middle"}, rankStyle, paddingStyle),
            cellStyle: Object.assign(numberStyle, rankStyle, paddingStyle),
        }, {
            value: user => <UserHandle userId={user.id} showCountry/>,
            headerName: UI.T("User"),
            sortDescending: false,
            headerStyle: Object.assign({verticalAlign: "middle"}, userStyle, paddingStyle),
            cellStyle: Object.assign({verticalAlign: "middle"}, userStyle, paddingStyle),
        }, {
            value: user => user.rating || "-",
            headerName: UI.T("Rating"),
            sortDescending: false,
            headerStyle: Object.assign({verticalAlign: "middle"}, scoreStyle, paddingStyle),
            cellStyle: Object.assign({verticalAllign: "middle"}, scoreStyle, paddingStyle),
        }];
    }
}


class RankingsEntriesManager extends EntriesManager {
    constructor(comparator) {
        super([], {comparator});

        this.cacheEntries();
    }

    getRawEntries() {
        return PublicUserStore.all().filter(user => user.rating);
    }
}


class RankingRangeTable extends RangeTableInterface(RankingTable) {
    getEntriesManager() {
        if (!this.entriesManager) {
            this.entriesManager = new RankingsEntriesManager(this.getComparator());
        }
        return this.entriesManager;
    }

    getEntries() {
        return this.getEntriesManager().getEntries();
    }

    applyFilter(filter) {
        this.getEntriesManager().setFilter(filter);
    }

    onMount() {
        super.onMount();
        this.addListener("reorder", () => {
            this.getEntriesManager().setComparator(this.getComparator());
        });
    }
}


export class MinRanking extends RankingTable {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.setStyle("margin-bottom", "0");
    }

    getEntries() {
        if (this.shortList) {
            return this.sortEntries(this.shortList);
        }
        let allUsers = PublicUserStore.all().filter((user) => !user.isAdmin);
        allUsers.sort((a, b) => {return (b.rating || 0) - (a.rating || 0);});
        this.shortList = allUsers.slice(0, 10);
        return this.sortEntries(this.shortList);
    }
}


class ReputationRanking extends RankingRangeTable {
    getDefaultColumns(options) {
        const columns = super.getDefaultColumns(options);

        Object.assign(columns[0], {
            value: user => this.options.reputationDict[user.id].rank,
        });

        Object.assign(columns[2], {
            value: user => parseInt(this.options.reputationDict[user.id].reputation),
            headerName: "Reputation",
        });

        return columns;
    }
}


export class GlobalRatings extends SortableTable {
    getDefaultOptions() {
        return {
            style: {
                margin: "0 auto",
                maxWidth: "1000px",
                width: "90%",
                display: "flex",
                flexDirection: "column",
                height: "100%"
            }
        };
    }

    render() {
        let ranking;
        if (this.options.type === "reputation") {
            ranking = <ReputationRanking ref="ranking" reputationDict={this.options.reputationDict} style={{flex: "1", overflow: "hidden"}}/>;
        } else {
            ranking = <RankingRangeTable ref="ranking" style={{flex: "1", overflow: "hidden"}}/>;
        }
        return [
            <h3 className="text-center">{UI.T("Leaderboard")}</h3>,
            <CountryUsersFilter ref="usersFilter" countries={PublicUserStore.getCountries()}/>,
            ranking
        ]
    }

    onMount() {
        this.usersFilter.addListener("filterChange", () => {
            this.ranking.applyFilter(this.usersFilter.getFilter());
        })
    }
}
