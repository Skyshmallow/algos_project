import {UI, registerStyle, styleRuleInherit, styleRule} from "../../csabase/js/UI.js";
import {enhance} from "../../stemjs/src/ui/Color.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";

import {LoginWidget} from "../../establishment/accounts/js/Login.jsx";
import {LoginStyle} from "../../establishment/accounts/js/LoginStyle.js";


class PasswordChangeStyle extends LoginStyle {
    @styleRule
    className = {
        width: "30%",
        minWidth: "300px",
        margin: "0 auto"
    };

    @styleRuleInherit
    loginWidget = {
        padding: 0,
        width: "auto",
        height: "auto",
    };

    @styleRuleInherit
    forgotPassword = {
        visibility: "hidden"
    };

    @styleRuleInherit
    signInButtonContainer = {
        height: "auto",
    };

    @styleRuleInherit
    signInButton = {
        backgroundColor: this.themeProps.COLOR_PRIMARY,
        color: enhance(this.themeProps.COLOR_PRIMARY, 1),
        minWidth: "initial",
        paddingLeft: 20,
        paddingRight: 20,
        outline: "none",
        ":hover": {
            backgroundColor: enhance(this.themeProps.COLOR_PRIMARY, 0.15),
            color: enhance(this.themeProps.COLOR_PRIMARY, 1),
            border: 0,
        }
    };

    @styleRule
    rememberMeContainer = {
        marginLeft: "29px",
    };

    @styleRuleInherit
    input = {
        backgroundColor: "inherit !important",
        borderBottom: "2px solid " + this.themeProps.COLOR_PRIMARY,
        borderRadius: "0 !important",
        ":hover": {
            borderBottom: "2px solid " + this.themeProps.COLOR_PRIMARY + " !important",
        },
        ":focus": {
            borderBottom: "2px solid " + this.themeProps.COLOR_PRIMARY + " !important",
        },
    };
}


@registerStyle(PasswordChangeStyle)
export class AccountActivation extends LoginWidget {
    extraNodeAttributes(attr) {
        attr.addClass(this.styleSheet.className);
    }

    getThirdPartyLogin() {}

    getClearBothArea() {}

    getRememberMeCheckbox() {
        return <div className={this.styleSheet.rememberMeContainer}>
            {super.getRememberMeCheckbox()}
        </div>;
    }

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
            () => location.href = "/",
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
