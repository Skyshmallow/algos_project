import {CallThrottler} from "../../../stemjs/src/base/Utils.js";
import {autoredraw} from "../../../stemjs/src/decorators/AutoRedraw.js";
import {RangeTableInterface} from "../../../stemjs/src/ui/RangePanel.jsx";
import {Table} from "../../../stemjs/src/ui/table/Table.jsx";
import {ArchiveUserStore} from "../state/ArchiveStore.js";
import {EntriesManager} from "../../../stemjs/src/ui/RangePanel.jsx";
import {ScoreboardEntryRow} from "./Scoreboard.jsx";
import {PublicUserStore} from "../../../csaaccounts/js/state/UserStore.js";
import {UserHandle} from "../../../csaaccounts/js/UserHandle.jsx";
import {Formatter} from "../../../csabase/js/util.js";


class MetaContestEntriesManager extends EntriesManager {
    constructor(metaContest) {
        super([], {
            comparator: (userA, userB) => userB.totalScore - userA.totalScore,
        });

        this.metaContest = metaContest;

        const updateEntriesThrottler = new CallThrottler({throttle: 250});
        this.updateEntriesThrottled = updateEntriesThrottler.wrap(() => this.updateEntries());

        this.cacheEntries();
    }

    getRawEntries() {
        if (!this.metaContest) {
            return [];
        }
        return this.metaContest.getUsers();
    }
}

@autoredraw(ArchiveUserStore)
export class MetaContestUsersTable extends RangeTableInterface(Table) {
    getRowClass() {
        return ScoreboardEntryRow;
    }

    getEntriesManager() {
        if (!this.entriesManager) {
            this.entriesManager = new MetaContestEntriesManager(this.options.metaContest);
        }
        return this.entriesManager;
    }

    getEntries() {
        return this.getEntriesManager().getEntries();
    }

    applyFilter(filter) {
        this.getEntriesManager().setFilter(filter);
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
            headerName: UI.T("Rank"),
            value: (metaContestUser, rowIndex) => rowIndex + 1,
            sortDescending: false,
            headerStyle: {verticalAlign: "middle",  width: "0%"},
            cellStyle: {...numberStyle, width: "0%"},
        }, {
            headerName: UI.T("User"),
            value: (metaContestUser) => <UserHandle userId={metaContestUser.userId} user={metaContestUser} showCountry/>,
            rawValue: (metaContestUser) => {
                let publicUser = PublicUserStore.get(metaContestUser.userId);
                if (!publicUser) {
                    return "publicUser-" + metaContestUser.userId;
                }
                return publicUser.getDisplayHandle();
            },
            headerStyle: {verticalAlign: "middle", width: "80%"},
            cellStyle: {verticalAlign: "middle", width: "80%"},
        }, {
            headerName: UI.T("Score"),
            value: (metaContestUser) => {
                //TODO: send publicUser when someone registers
                return Formatter.truncate(metaContestUser.totalScore, 2);
            },
            rawValue: (metaContestUser) => metaContestUser.totalScore,
            headerStyle: {...centerStyle,  width: "20%"},
            cellStyle:  {...centerStyle,  width: "20%"},
        }];
    }

    redraw(event) {
        if (event) {
            this.getEntriesManager().updateEntriesThrottled();
        } else {
            super.redraw();
        }
    }
}