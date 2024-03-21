import {UI, Button, TemporaryMessageArea, Level, Size, Router} from "../../csabase/js/UI.js";
import {UserHandle} from "../../csaaccounts/js/UserHandle.jsx";
import {Ajax} from "../../stemjs/src/base/Ajax.js";

import {ContestRegistererStore} from "./state/ContestRegistererStore";

class ContestInvitePage extends UI.Element {
    renderRegistrationMessage() {
        let contestRegisterer = ContestRegistererStore.get(this.options.contestRegistererId);
        let error = this.options.reason || "noregisterer";
        if (this.options.canRegister) {
            let name = contestRegisterer.getContest().longName;
            return [
                <div style={{marginTop: "20px"}} >
                    {"Contest name: " + name.substr(0, name.length - 15)}
                </div>,
                <div style={{marginTop: "20px"}} >
                    {"Duration: " + contestRegisterer.getContest().getFormattedDuration()}
                </div>,
                <div style={{marginTop: "20px"}} >
                    {"Click the button to go to the contest page. Take care, you can only participate once!" +
                    " The contest will start when you click the button."}
                </div>
            ];
        }
        if (error === "toomany") {
            return [
                "The owner of this contest (",
                <UserHandle userId={contestRegisterer.ownerId} />,
                ") has reached his limit of contest registrations this month. Please contact ",
                <UserHandle userId={contestRegisterer.ownerId} />,
                " about this error."
            ];
        }
        if (error === "participated") {
            return "You have already participated in this contest.";
        }
        if (!USER.isAuthenticated) {
            return "You need to log-in to continue.";
        }
        return "Invalid invitation link.";
    }

    render() {
        return [
            <div style={{marginTop: "50px"}}>
                <div style={{fontSize: "2em", padding: "0 15%"}}>
                    {this.renderRegistrationMessage()}
                </div>
                <div style={{textAlign: "center"}}>
                    <TemporaryMessageArea ref="errorArea" />
                    <Button level={Level.PRIMARY} size={Size.LARGE} style={{margin: "20px auto", fontSize: "1.4em"}}
                            disabled={!this.options.canRegister} ref="registerButton">Participate</Button>
                </div>
            </div>,
        ];
    }

    onMount() {
        this.registerButton.addClickListener(() => {
            Ajax.postJSON("/contest/register_by_invite/", {
                contestRegistererId: this.options.contestRegistererId
            }).then(
                () => {
                    let name = ContestRegistererStore.get(this.options.contestRegistererId).getContest().longName;
                    Router.changeURL(["contest", "custom-v-" + name.substr(name.length - 12), "tasks"]);
                },
                (error) => {
                    this.registerButton.setLevel(Level.DANGER);
                    this.errorArea.showMessage(error.message, "red");
                    setTimeout(() => {
                        this.registerButton.setLevel(Level.PRIMARY);
                    }, 2000);
                }
            );
        });
    }
}

export {ContestInvitePage};