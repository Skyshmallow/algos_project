import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Link} from "../../stemjs/src/ui/primitives/Link.jsx";
import {ActionModal, ActionModalButton} from "../../stemjs/src/ui/modal/Modal.jsx";
import {Table} from "../../stemjs/src/ui/table/Table.jsx";
import {Panel} from "../../stemjs/src/ui/UIPrimitives.jsx";
import {Router} from "../../stemjs/src/ui/Router.jsx";
import {TabArea} from "../../stemjs/src/ui/tabs/TabArea.jsx";
import {Level} from "../../stemjs/src/ui/Constants.js";
import {ServerTime} from "../../stemjs/src/time/Time.js";
import {DateTimePicker} from "../../stemjs/src/ui/DateTimePicker.jsx";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {GlobalStyle} from "../../stemjs/src/ui/GlobalStyle.js";

import {ContestStore} from "./state/ContestStore";
import {ContestUserStore} from "./state/ContestUserStore";
import {CreateContestButton, getDefaultContestStartDate} from "./CreateContest";


class RegisterVirtualModal extends ActionModal {
    getContest() {
        return this.options.contest;
    }

    getVirtualContest() {
        return this.getContest().getVirtualContest();
    }

    getTitle() {
        return <h4>Register for {this.getVirtualContest().getName()}</h4>;
    }

    getDefaultStartDate() {
        let defaultDate = ServerTime.now().add({minutes: 1});
        let minutesToMilliseconds = 5 * 60 * 1000;
        let remainder = minutesToMilliseconds - defaultDate % minutesToMilliseconds;
        defaultDate.add(remainder, "milliseconds");
        return defaultDate;
    }

    getBody() {
        let alreadyRegistered = null;
        if (ContestUserStore.all().find(contestUser => contestUser.userId === USER.id && contestUser.getContest()
                                            && contestUser.getContest().getVirtualContest() === this.getVirtualContest())) {
            alreadyRegistered = <div>
                    Warning: You have another virtual participation for this contest.
                    If you register, you will delete your past virtual participation.
                </div>;
        }
        return [<label style={{"display": "inline-block", "padding-right": "8px"}}>
                Start date (<span ref="timeTracker"/>)
            </label>,
            <DateTimePicker style={{"display": "inline-block"}} ref="startDatePicker" date={getDefaultContestStartDate()} />,
            alreadyRegistered
        ];
    }

    getActionLevel() {
        return Level.PRIMARY;
    }

    getActionName() {
        return UI.T("Register");
    }

    // TODO: remove this, dupplicated from ContestWidget.ContestSummary
    action() {
        let startDate = this.startDatePicker.getDate();
        let request = {
            contestId: this.getVirtualContest().id,
            startTime: startDate.unix()
        };

        Ajax.postJSON("/contest/register/", request).then(
            () => {
                Router.changeURL(["contest", this.getVirtualContest().name]);
                this.hide();
            }
        );
    };

    onMount() {
        let timeTick = () => {
            let serverTime = ServerTime.now().format("HH:mm:ss");
            this.timeTracker.setChildren("Now " + serverTime);
        };
        timeTick();
        this.timerId = setInterval(timeTick, 1000);
    }

    onUnmount() {
        clearInterval(this.timerId);
        delete this.timerId;
    }
}

class VirtualParticipationButton extends ActionModalButton(RegisterVirtualModal) {
    getDefaultOptions() {
        return {
            level: Level.PRIMARY,
            label: UI.T("Virtual participation")
        };
    }
}

class ContestsTable extends Table {
    getDefaultColumns() {
        const numberStyle = {
            textAlign: "right",
            width: "1%",
            verticalAlign: "middle",
        };

        let columns = [{
            value: contest => <Link href={"/contest/" + contest.name} value={contest.getName()}/>,
            headerName: UI.T("Contest"),
            headerStyle: {verticalAlign: "middle"},
            cellStyle: {verticalAlign: "middle"},
        }, {
            value: contest => contest.getFormattedStartTime("DD/MM/YYYY, H:mm"),
            headerName: UI.T("Start time"),
            headerStyle: {verticalAlign: "middle"},
            cellStyle: {verticalAlign: "middle"},
        }, {
            value: contest => contest.getFormattedDuration(),
            headerName: UI.T("Duration"),
            headerStyle: {verticalAlign: "middle"},
            cellStyle: {verticalAllign: "middle"},
        }];

        if (USER.isAuthenticated && this.options.displayRank) {
            columns.push({
                value: (contest) => {
                    let contestUser = contest.getUser(USER.id);
                    if (!contestUser) {
                        return "-";
                    }
                    return contestUser.rank;
                },
                headerName: UI.T("Rank"),
                headerStyle: {verticalAlign: "middle"},
                cellStyle: numberStyle,
            });
        }

        if (USER.isSuperUser && this.options.displayEdit) {
            columns.push({
                value: contest => <Link href={"/contest/" + contest.name + "/edit/"} value={UI.T("Edit contest")} />,
                headerName: "",
                headerStyle: {verticalAlign: "middle"},
                cellStyle: {verticalAllign: "middle"},
            });
        }

        if (this.options.displayVirtual) {
            columns.push({
                value: contest => contest.virtualContestId ? <VirtualParticipationButton modalOptions={{contest}}/> : null,
                headerName: "",
                headerStyle: {verticalAlign: "middle"},
                cellStyle: {verticalAllign: "middle"},
            });
        }

        return columns;
    }
}

class RunningContestPanel extends Panel {
    render() {
        if (this.options.contests.length) {
            return [
                <h3>{UI.T("Running contests")}</h3>,
                <ContestsTable entries={this.options.contests} displayEdit/>
            ]
        } else {
            return [
                //<h3>Running contests</h3>,
                //<h5>No running contests</h5>
            ];
        }
    }
}

class FutureContestsPanel extends Panel {
    render() {
        if (this.options.contests.length) {
            return [
                <h3>{UI.T("Future contests")}</h3>,
                <ContestsTable entries={this.options.contests} displayEdit/>
            ]
        } else {
            return [
                //<h3>Future contests</h3>,
                //<h5>No future contests</h5>
            ];
        }
    }
}


const ContestTabs = [
    {
        tabName: UI.T("CSA Rounds"),
        displayRank: true,
        displayVirtual: true,
        check: (contest) => {
            for (let i = 1; i < ContestTabs.length; i += 1) {
                if (ContestTabs[i].check(contest)) {
                    return false;
                }
            }
            return true;
        }
    },
    {
        tabName: UI.T("CSA Hourly"),
        check: (contest) => {
            return contest.systemGenerated;
        }
    },
    {
        tabName: "IEEE",
        check: (contest) => {
            return contest.longName.indexOf("IEEE") !== -1;
        }
    }
];


class PastContestsPanel extends Panel {
    render() {
        let tabs = [];
        for (const contestTab of ContestTabs) {
            let entries = this.options.contests.filter(contest => contestTab.check(contest));
            if (entries.length) {
                tabs.push(<Panel title={<h4>{contestTab.tabName}</h4>}>
                    <ContestsTable entries={entries}
                                   displayRank={contestTab.displayRank} displayVirtual={contestTab.displayVirtual}/>
                </Panel>);
            }
        }
        if (this.options.contests.length) {
            return [
                <h3>{UI.T("Past contests")}</h3>,
                <TabArea>
                    {tabs}
                </TabArea>
            ]
        } else {
            return [
                <h3>{UI.T("Past contests")}</h3>,
                <h5>No past contests</h5>
            ];
        }
    }
}

class ContestList extends Panel {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.addClass(GlobalStyle.Container.MEDIUM);
    }

    render() {
        let runningContestsPanel;

        let contests = ContestStore.all().filter((contest) => {
            return contest.getStartTime() && contest.getEndTime() && !contest.isVirtual()
        });
        let virtualContests = ContestStore.all().filter((contest) => {
            return contest.isVirtual() && contest.getBaseContest().hasFinished() && !contest.hasFinished();
        });
        contests = [...contests, ...virtualContests];
        let pastContests = contests.filter((contest) => {return contest.hasFinished()})
            .sort((a, b) => {return b.getEndTime() - a.getEndTime()});
        let runningContests = contests.filter((contest) => {return contest.isRunning() && !contest.systemGenerated})
            .sort((a, b) => {return a.getStartTime() - b.getStartTime()});
        let futureContests = contests.filter((contest) => {return !contest.hasStarted() && !contest.systemGenerated})
            .sort((a, b) => {return a.getStartTime() - b.getStartTime()});

        if (runningContests.length) {
            runningContestsPanel = <RunningContestPanel contests={runningContests} />;
        }
        let createContestButton;
        if (USER.isSuperUser) {
            createContestButton = <CreateContestButton label={UI.T("Create contest")} level={Level.PRIMARY}/>;
        }
        return [
            createContestButton,
            <h2>{UI.T("Available contests")}:</h2>,
            runningContestsPanel,
            <FutureContestsPanel contests={futureContests} />,
            <PastContestsPanel contests={pastContests} />
        ];
    }
}

export {ContestList, VirtualParticipationButton};
