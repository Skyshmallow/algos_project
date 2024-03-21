import {UI, Panel, Table, Link} from "../../../csabase/js/UI.js";
import {ContestUserStore} from "../../../contest/js/state/ContestUserStore.js";
import {UserHandle} from "../../../csaaccounts/js/UserHandle.jsx";
import {Ajax} from "../../../stemjs/src/base/Ajax.js";
import {UserInputField} from "../../../establishment/accounts/js/UsersAutocompletion.jsx";
import {autoredraw} from "../../../stemjs/src/decorators/AutoRedraw.js";

@autoredraw(ContestUserStore)
class TestersTable extends Table {
    getEntries() {
        return ContestUserStore.all().filter(user => (user.contestId === this.options.evalTask.defaultContestId));
    }
    removeTester(user) {
        if (!confirm("Are you sure you want to remove the tester having userId " + user.userId + " ?")) {
            return;
        }
        Ajax.postJSON("/contest/external_deregister/", {
                contestId: this.options.evalTask.defaultContestId,
                userId: user.userId
            }).then(
                ContestUserStore.applyDeleteEvent({
                    type: "delete",
                    objectId: user.id
                })
        );
    }

    getDefaultColumns() {
        let numberCellStyle = {
            textAlign: "right"
        };

        return [ {
                value: user => <span className="fa fa-times fa-lg"
                                     style={{color: "red", cursor:"pointer"}}
                                     onClick={()=>this.removeTester(user)}/>
            },
            {
                value: (user, index) => index,
                headerName: "#",
                cellStyle: numberCellStyle,
                headerStyle: numberCellStyle
            }, {
                value: user => <UserHandle id={user.userId} />,
                headerName: "User"
            }, {
                value: user => (user.totalScore || 0),
                headerName: "Score",
                cellStyle: numberCellStyle,
                headerStyle: numberCellStyle
            }, {
                value: user => (user.numSubmissions || 0),
                headerName: "Num submissions",
                cellStyle: numberCellStyle,
                headerStyle: numberCellStyle
            } ];
    }
}

class TestersPanel extends Panel {
    getTitle() {
        return "Testers";
    }

    render() {
        const {evalTask} = this.options;
        const contestLink = "/contest/" + evalTask.defaultContest.name + "/";
        return [
            <h4>
                Besides the admins, the following people can test this task:
            </h4>,
            <h5>Link: <Link href={location.origin + contestLink} value={location.origin + contestLink}/></h5>,
            <TestersTable evalTask={this.options.evalTask} ref="testersTable"/>,
            <h4 style={{marginTop: "20px"}}>Give access to a new user:</h4>,
            <UserInputField ref="userInputField"/>
        ];
    }

    onMount() {
        this.attachListener(this.userInputField, "user", async (userId) => {
            this.userInputField.clear();
            await Ajax.postJSON("/contest/external_register/", {
                contestId: this.options.evalTask.defaultContestId,
                userId: userId
            });

            this.testersTable.redraw();
        })
    }
}

export {TestersPanel};