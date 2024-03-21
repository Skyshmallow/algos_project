import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {TabArea} from "../../../stemjs/src/ui/tabs/TabArea.jsx";
import {Panel} from "../../../stemjs/src/ui/UIPrimitives.jsx";
import {Table} from "../../../stemjs/src/ui/table/Table.jsx";
import {CollapsibleTable} from "../../../stemjs/src/ui/table/CollapsibleTable.jsx";
import {PlagiarismReportStore} from "../state/PlagiarismReportStore.js";
import {Button} from "../../../stemjs/src/ui/button/Button.jsx";
import {NumberInput} from "../../../stemjs/src/ui/input/Input.jsx";
import {Ajax} from "../../../stemjs/src/base/Ajax.js";
import {compareContestUsers} from "../state/ScoringHelpers.js";
import {NOOP_FUNCTION} from "../../../stemjs/src/base/Utils.js";
import {Input, RawCheckboxInput} from "../../../stemjs/src/ui/input/Input.jsx";
import {CollapsiblePanel} from "../../../stemjs/src/ui/collapsible/CollapsiblePanel.jsx";
import {StemDate} from "../../../stemjs/src/time/Date.js";
import {autoredraw} from "../../../stemjs/src/decorators/AutoRedraw.js";
import {PlagiarismReportBatchStore} from "../state/PlagiarismReportBatchStore.js";
import {ContestTaskStore} from "../state/ContestTaskStore.js";
import {ProgrammingLanguage} from "../../../csabase/js/state/ProgrammingLanguageStore.js";
import {Link} from "../../../stemjs/src/ui/UIPrimitives.jsx";
import {PlagiarismBatchModal} from "./PlagiarismBatchModal.jsx";
import {ContestUserComparatorModal} from "./ContestUserComparator.js";
import {ContestUserWithDecision} from "./ContestUserWithDecision.jsx";


class MultiselectInput extends UI.Element {
    getAllOptions() {
        return this.options.options;
    }

    getValue() {
        return this.getAllOptions().filter((entry, index) => this["checkbox" + index].getValue());
    }

    render() {
        return this.getAllOptions().map((entry, index) => <div>
            <RawCheckboxInput
                onChange={() => this.dispatch("change")}
                ref={"checkbox" + index}
                noStupid
            />{" " + (entry || "None")}
        </div>)
    }
}

class ContestUserAttributeFilter extends CollapsiblePanel {
    getTitle() {
        let numSelected = this.getSelectedOptions().size;
        if (numSelected === 0) {
            numSelected = "All";
        }
        return `Filter by ${this.options.attrName} (${numSelected} selected)`;
    }

    getAllOptions() {
        const {attrName, contestUsers} = this.options;
        const allOptions = new Set(contestUsers.map(cu => cu[attrName]));
        return Array.from(allOptions);
    }

    getSelectedOptions() {
        return new Set(this.input?.getValue() || []);
    }

    filterContestUsers(contestUsers) {
        const {attrName} = this.options;
        const validAttributes = this.getSelectedOptions();
        if (validAttributes.size === 0) {
            return contestUsers;
        }

        return contestUsers.filter(cu => validAttributes.has(cu[attrName]));
    }

    render() {
        return [
            <MultiselectInput
                ref="input"
                options={this.getAllOptions()}
                onChange={() => {
                    this.redraw();
                    this.options.onChange();
                }}
            />
        ]
    }
}


class ContestUserMultiselectInput extends UI.Element {
    selectedContestUsers = new Set();

    getSelectedUsers() {
        return Array.from(this.selectedContestUsers);
    }

    dispatchChange() {
        this.options.onChange();
        this.redraw();
    }

    removeContestUser(contestUser) {
        this.selectedContestUsers.delete(contestUser);
        this.dispatchChange();
    }

    addUserFromInput() {
        const {contest} = this.options;
        const username = this.userInput.getValue().trim();
        if (!username) {
            return;
        }

        for (const contestUser of contest.getUsers()) {
            const user = contestUser.getPublicUser();
            if (user.name === username || user.username === username) {
                this.selectedContestUsers.add(contestUser);
            }
        }

        this.dispatchChange();
    }

    render() {
        const entries = Array.from(this.selectedContestUsers);
        const columns = [
            ["User", contestUser => <ContestUserWithDecision contestUser={contestUser} />],
            ["Score", contestUser => contestUser.totalScore],
            ["", contestUser => <div>
                <Button label="Remove" onClick={() => this.removeContestUser(contestUser)} />
            </div>],
        ]

        return [
            <div>
                Add user manually: <Input ref="userInput" /> <Button label="Add User" onClick={() => this.addUserFromInput()} />
            </div>,
            <div>
                {entries.length} users selected manually.
            </div>,
            (entries.length > 0) && <Table entries={entries} columns={columns} />
        ]
    }
}


class ContestTaskFilter extends CollapsiblePanel {
    getTitle() {
        let numSelected = this.getContestTaskIds().length;
        if (numSelected === this.getAllContestTasks().length) {
            numSelected = "All";
        }
        return `Only for certain tasks (${numSelected} selected)`;
    }

    getAllContestTasks() {
        return this.options.contest.getContestTasks();
    }

    getContestTaskIds() {
        let selected = this.input?.getValue() || [];
        if (selected.length == 0) {
            selected = this.getAllContestTasks();
        }
        return selected.map(task => task.id);
    }

    render() {
        return [
            <MultiselectInput
                ref="input"
                options={this.getAllContestTasks()}
                onChange={() => {
                    this.redraw();
                }}
            />
        ]
    }
}

class PlagiarismReportPanel extends UI.Element {
    reviewBatch(batch) {
        PlagiarismBatchModal.show({batch});
    }

    render() {
        const {plagiarismReport} = this.options;
        const entries = PlagiarismReportBatchStore.all().filter(batch => batch.reportId === plagiarismReport.id);

        const columns = [
            ["Task", reportBatch => ContestTaskStore.get(reportBatch.contestTaskId)],
            ["Language", reportBatch => {
                const languageName = String(ProgrammingLanguage.get(reportBatch.programmingLanguageId));
                return languageName.startsWith("Python") ? "Python" : languageName;
            }],
            ["Moss link", reportBatch => <Link href={reportBatch.mossOriginalURL} newTab>{reportBatch.mossOriginalURL}</Link>],
            ["Num matches", reportBatch => reportBatch.numMatches],
            ["Actions", reportBatch => <div>
                <Button label="Review" onClick={() => this.reviewBatch(reportBatch)}/>
            </div>]
        ];

        return <Table columns={columns} entries={entries} />;
    }
}


class NewPlagiarismReportPanel extends Panel {
    cachedRequest = null;
    allContestUsers = [];
    filteredContestUsers = [];

    getDefaultOptions() {
        return {
            contest: null,
            title: "New Run",
            style: { margin: 8},
        }
    }

    async updateFilteredUsers() {
        await this.ensureUsersLoaded(); // Make sure we're ready

        let contestUsers = this.allContestUsers;
        const manuallySelectedUsers = this.individualUserInput.getSelectedUsers();

        contestUsers = this.countryFilter.filterContestUsers(contestUsers);
        contestUsers = this.universityFilter.filterContestUsers(contestUsers);

        if (manuallySelectedUsers.length) {
            contestUsers = manuallySelectedUsers;
        }

        this.filteredContestUsers = contestUsers;
        this.redraw();
    }

    async ensureUsersLoaded() {
        if (this.cachedRequest) {
            return this.cachedRequest;
        }

        const {contest} = this.options;

        this.cachedRequest = Ajax.getJSON("/contest/scoreboard_state/", {contestId: contest.id});
        await this.cachedRequest;

        this.allContestUsers = contest.getUsers().filter(cu => cu.haveSubmitted());
        for (const cu of this.allContestUsers) {
            cu.country = cu.getPublicUser().getCountry();
        }
        this.allContestUsers.sort(compareContestUsers);
        this.updateFilteredUsers().then();
    }

    async createReport() {
        const {contest} = this.options;
        const teamsCap = this.numTeamsCapInput.getValue();
        const contestUsers = this.filteredContestUsers.slice(0, teamsCap);
        const userIds = contestUsers.map(cu => cu.userId);
        const contestTaskIds = this.contestTaskInput.getContestTaskIds();

        await Ajax.postJSON("/contest/create_plagiarism_report/", {
            contestId: contest.id,
            name: this.reportNameInput.getValue() || "Report-" + new StemDate().format("YYYY-MM-DD-HH:mm"),
            userIds,
            contestTaskIds,
        });

        this.options.onNewReport();
    }

    render() {
        const {contest} = this.options;

        return [
            <div>
                New report name: <Input ref="reportNameInput" placeholder={"Report-" + new StemDate().format("YYYY-MM-DD-HH:mm")} />
            </div>,

            <div>
                <ContestTaskFilter
                    ref="contestTaskInput"
                    contest={contest}
                />
            </div>,

            <div>
                <ContestUserAttributeFilter
                    ref="countryFilter"
                    attrName="country"
                    contestUsers={this.allContestUsers}
                    onChange={() => this.updateFilteredUsers()}
                />
            </div>,

            <div>
                <ContestUserAttributeFilter
                    ref="universityFilter"
                    attrName="university"
                    contestUsers={this.allContestUsers}
                    onChange={() => this.updateFilteredUsers()}
                />
            </div>,

            <div>
                <CollapsiblePanel title="Add individual contestants">
                    <ContestUserMultiselectInput
                        ref={"individualUserInput"}
                        contest={contest}
                        onChange={() => this.updateFilteredUsers()}
                    />
                </CollapsiblePanel>
            </div>,

            <div>
                {this.filteredContestUsers.length} filtered contest users.
                <div>
                    Limit to the top (by score): <NumberInput ref="numTeamsCapInput" min={2} max={150} initialValue={15} />
                </div>
            </div>,
            <div>
                <Button
                    label="Create Report"
                    onClick={() => this.createReport()}
                    disabled={this.filteredContestUsers.length < 2}
                />
            </div>
        ]
    }

    onMount() {
        this.ensureUsersLoaded().then();
    }
}

@autoredraw(PlagiarismReportStore, PlagiarismReportBatchStore)
class PlagiarismReportsPanel extends Panel {
    selectedReport = null;

    getDefaultOptions() {
        return {
            contest: null,
            title: "Runs",
            style: {margin: 8},
            onNewReport: NOOP_FUNCTION,
        }
    }

    setSelectedReport(report) {
        this.selectedReport = report;
        this.redraw();
    }

    async rerunReport(report) {
        if (!confirm("Are you sure you want to rerun this report?")) {
            return;
        }
        const batches = PlagiarismReportBatchStore.filterBy({reportId: report.id});
        for (const batch of batches) {
            PlagiarismReportBatchStore.applyDeleteEvent({objectId: batch.id});
        }
        await Ajax.postJSON("/contest/rerun_plagiarism_report/", {id: report.id});
    }

    async deleteReport(report) {
        if (!confirm("Are you sure you want to delete this report?")) {
            return;
        }
        await Ajax.postJSON("/contest/delete_plagiarism_report/", {id: report.id});
    }

    render() {
        const reports = PlagiarismReportStore.all();
        reports.sort((a, b) => b.createdAt - a.createdAt);

        const columns = [
            ["ID", report => report.id],
            ["Name", report => report.name],
            ["Num users", report => report.userIds.length],
            ["Status", report => {
                const STATUS = ["Waiting", "In progress", "Failed", "Done"];
                return STATUS[report.status];
            }],
            ["Actions", report => <div>
                <Button><a href={`/static/storage/plagiarism/report-${report.urlKey}.zip`} target="_blank">Download</a></Button>
                <Button label="Rerun" onClick={() => this.rerunReport(report)}/>
                <Button label="Delete" onClick={() => this.deleteReport(report)}/>
            </div>
            ],
        ];

        if (reports.length === 0) {
            return [
                "No plagiarism reports, create one in the New Report tab",
            ]
        }

        return [
            <CollapsibleTable entries={reports} columns={columns}
                              renderCollapsible={(report) => <PlagiarismReportPanel plagiarismReport={report}/>}/>
        ]
    }
}

class ManualUserComparatorPanel extends Panel {
    render() {
        const {contest} = this.options;

        const selectedContestUsers = this.contestUserInput?.getSelectedUsers() || [];

        return [
            <div>
                {selectedContestUsers.length == 2 ? <Button
                    onClick={() => ContestUserComparatorModal.promptForContestUsers(selectedContestUsers)}
                    label="Compare selected participants"
                /> : "Select exactly two participants to compare"}
            </div>,

            <ContestUserMultiselectInput
                ref="contestUserInput"
                contest={contest}
                onChange={() => this.redraw()}
            />
        ]
    }
}

export class ContestPlagiarismPanel extends UI.Element {
    render() {
        const {contest} = this.options;
        return [
            <TabArea ref="tabArea">
                <PlagiarismReportsPanel ref="reportsTab" contest={contest} />
                <NewPlagiarismReportPanel
                    contest={contest}
                    onNewReport={() => this.tabArea.setActive(this.reportsTab)}
                />
                <ManualUserComparatorPanel
                    title="Custom user comparator"
                    contest={contest}
                />
            </TabArea>
        ]
    }
}
