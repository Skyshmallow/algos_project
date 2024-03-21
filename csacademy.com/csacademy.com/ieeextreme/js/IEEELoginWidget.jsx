import {enhance} from "../../stemjs/src/ui/Color.js";
import {styleRule, styleRuleInherit} from "../../stemjs/src/decorators/Style.js";
import {registerStyle} from "../../stemjs/src/ui/style/Theme.js";
import {LoginWidget} from "../../establishment/accounts/js/Login.jsx";
import {IEEE_PRIMARY_COLOR} from "./Constants.js";
import {LoginStyle} from "../../establishment/accounts/js/LoginStyle.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";


class IEEELoginStyle extends LoginStyle {
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
        backgroundColor: IEEE_PRIMARY_COLOR,
        color: enhance(IEEE_PRIMARY_COLOR, 1),
        minWidth: "initial",
        paddingLeft: 20,
        paddingRight: 20,
        outline: "none",
        ":hover": {
            backgroundColor: enhance(IEEE_PRIMARY_COLOR, 0.15),
            color: enhance(IEEE_PRIMARY_COLOR, 1),
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
        borderBottom: "2px solid " + IEEE_PRIMARY_COLOR,
        borderRadius: "0 !important",
        ":hover": {
            borderBottom: "2px solid " + IEEE_PRIMARY_COLOR + " !important",
        },
        ":focus": {
            borderBottom: "2px solid " + IEEE_PRIMARY_COLOR + " !important",
        },
    };
}


@registerStyle(IEEELoginStyle)
export class IEEELoginWidget extends LoginWidget {
    getThirdPartyLogin() {}

    getClearBothArea() {}

    getRememberMeCheckbox() {
        return <div className={this.styleSheet.rememberMeContainer}>
            {super.getRememberMeCheckbox()}
        </div>;
    }
}

export class IEEESSOLoginWidget extends IEEELoginWidget {
    getSignInValue() {
        return "Sign in with IEEE Account";
    }

    sendLogin() {
        window.location= location.origin + "/ieee/login-with-ieee/"
    }

    render() {
       return[
             <form ref="form">
                 {this.getSignInButton()}
             </form>
        ]
    }
}


export class IEEEPasswordResetRequestWidget extends IEEELoginWidget {
    getSignInValue() {
        return "Request password reset";
    }

    sendLogin() {
        this.clearErrorMessage();
        const data = {
            email: this.emailInput.getValue()
        };
        Ajax.postJSON("/ieee_password_reset_request/", data).then(
            () => this.setErrorMessage({message: "An email was sent to all members of your team, or just yourself if you're a proctor."}, false),
            (error) => this.setErrorMessage(error)
        );
    }

    render() {
        return [
            <form ref="form">
                {this.getEmailInput("envelope")}
                {this.getSignInButton()}
                <div style={{clear: "both", height: "20px"}}/>
                {this.getErrorArea()}
            </form>,
        ];
    }
}
