// TODO should this be removed?
import {UI} from "../../stemjs/src/ui/UIBase.js";
import {StateDependentElement} from "../../stemjs/src/ui/StateDependentElement.jsx";
import {Ajax} from "../../stemjs/src/base/Ajax.js";

import {IEEELoginWidget} from "./IEEELoginWidget.jsx";
import {IEEEXtremeContestSummary} from "./IEEEXtremeContestSummary.jsx";


class IEEEPasswordResetWidget extends IEEELoginWidget {
    getSignInValue() {
        return "Set password";
    }

    sendLogin() {
        this.clearErrorMessage();

        const password = this.passwordInput.getValue();
        const passwordConfirm = this.passwordConfirmInput.getValue();
        if (password !== passwordConfirm) {
            this.setErrorMessage({message: "Passwords don't match."});
            return;
        }

        Ajax.postJSON("/accounts/password_change/", {
            newPassword: password
        }).then(
            () => this.setErrorMessage({message: "Successfully set the new password"}, false),
            (error) => this.setErrorMessage(error)
        );
    }

    render() {
        return [
            <form ref="form">
                {this.getPasswordInput()}
                {this.getPasswordInput({
                    ref: "passwordConfirmInput",
                    name: "passwordConfirm",
                    placeholder: "Confirm Password"
                })}
                {this.getSignInButton()}
                <div style={{clear: "both", height: "20px"}}/>
                {this.getErrorArea()}
            </form>,
        ];
    }
}

// TODO @ieee why the inheritance? UI.Element not ok?
export class IEEEXtremePasswordResetPage extends StateDependentElement(IEEEXtremeContestSummary) {
    getPasswordResetArea() {
        let text = "Enter a new password:";
        let passwordResetWidget = null;

        if (this.options.error) {
            text = <span style={{color: "red"}}>{this.options.error.message}</span>;
        } else {
            passwordResetWidget = <div className={this.styleSheet.loginContainer} style={{width: 500}}>
                <IEEEPasswordResetWidget />
            </div>;
        }

        return [
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                <div className={this.styleSheet.textSection}>
                    <p>{text}</p>
                </div>
                {passwordResetWidget}
            </div>
        ];
    }

    getLogo() {
        return [];
    }

    renderLoaded() {
        return [
            this.getLogo(),
            this.getSectionTitle("Password reset"),
            this.getPasswordResetArea()
        ];
    }

    onDelayedMount() {
    }
}