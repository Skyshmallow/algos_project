import {
    UI, FormField, TextInput,
    Panel,
    Button, Select, Level, Size,
    Theme, StyleSheet, styleRule, registerStyle
} from "../../csabase/js/UI.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {AjaxButton} from "../../stemjs/src/ui/button/AjaxButton.jsx";
import {CountryStore} from "../../establishment/localization/js/state/CountryStore.js";
import {
    GeneralInformationPanel,
    SecuritySettingsPanel,
    EmailPanel,
    SocialAccountsPanel,
    UserSettingsPanel
} from "../../establishment/accounts/js/UserSettingsPanel.jsx";
import {enhance} from "../../stemjs/src/ui/Color.js";
import {defaultThemeProperties} from "../../csabase/js/CSATheme.js";

import {UserStore} from "./state/UserStore.js";

class CSAGeneralInformationPanel extends GeneralInformationPanel {
    getFormFields() {
        const userLimits = USER_CONSTANTS;
        return [
            <FormField ref="firstNameFormField" label={UI.T("First Name")}>
                <TextInput ref="firstNameFormInput" maxLength={userLimits.first_name_max_length || 30} placeholder="John" value={this.options.user.firstName}/>
            </FormField>,
            <FormField ref="lastNameFormField" label={UI.T("Last Name")}>
                <TextInput ref="lastNameFormInput" maxLength={userLimits.last_name_max_length || 30} placeholder="Smith" value={this.options.user.lastName}/>
            </FormField>,
            <FormField ref="userNameFormField" label={UI.T("Username")}>
                <TextInput ref="userNameFormInput" maxLength={userLimits.username_max_length || 30} placeholder="johnsmith" value={this.options.user.username || ""}/>
            </FormField>,
            <FormField ref="displayNameFormField" label={UI.T("Display name")}>
                <Select ref="displayNameSelect" options={["Name", "Username"]}/>
            </FormField>,
            <FormField ref="countryFormField" label={UI.T("Country")}>
                <Select ref="countrySelect" options={CountryStore.allWithNone()} selected={CountryStore.get(USER.countryId)}/>
            </FormField>
        ];
    }

    onMount() {
        super.onMount();
        this.userNameFormInput.addChangeListener(() => {
            this.validateUsername();
        });
    }

    validateUsername() {
        let userName = this.userNameFormInput.getValue();
        let validators = USER_CONSTANTS.username_regexes;

        let usernameErrors = false;
        for (let validator of validators) {
            let usernameRegex = new RegExp(String.raw`${validator.pattern}`);
            if (!usernameRegex.test(userName)) {
                this.userNameFormField.setError(validator.message);
                usernameErrors = true;
            }
        }
        if (!usernameErrors) {
            this.userNameFormField.removeError();
            this.saveProfileButton.enable();
        } else {
            this.saveProfileButton.disable();
        }
    }

    getSaveRequestData() {
        const request = super.getSaveRequestData();
        request.countryId = this.countrySelect.get().id;
        return request;
    }
}


class ExternalAccountsPanel extends Panel {
    render() {
        if (this.options.user.codeforcesHandle) {
            let showImportHandle = this.options.user.username !== this.options.user.codeforcesHandle;
            for (let validator of USER_CONSTANTS.username_regexes) {
                let usernameRegex = new RegExp(String.raw`${validator.pattern}`);
                if (!usernameRegex.test(this.options.user.codeforcesHandle)) {
                    showImportHandle = false;
                    break;
                }
            }
            let importHandleButtonClass = "pull-right" + (showImportHandle ? "" : " hidden");
            return [
                <h3>{UI.T("Codeforces account")}</h3>,
                <p>{UI.T("The following codeforces account is linked with your account:")}</p>,

                <div style={{"margin-top": "15px"}}>
                    <a href={"http://www.codeforces.com/profile/" + this.options.user.codeforcesHandle} target="_blank">
                        {this.options.user.codeforcesHandle}
                    </a>
                    <Button label={UI.T("Unlink")} className="pull-right" size={Size.EXTRA_SMALL} level={Level.DANGER}
                               onClick={() => {this.unlinkCodeforces()}}/>
                    <Button ref="importHandleButton" label={UI.T("Import handle")} className={importHandleButtonClass} style={{"margin-right": "7px"}}
                               size={Size.EXTRA_SMALL} level={Level.SUCCESS} onClick={() => {this.importCodeforcesHandle()}}/>
                </div>
            ];
        } else {
            return [
                <h3>{UI.T("Link Codeforces account")}</h3>,
                <div>
                    <FormField ref="handleGroup" label={UI.T("Handle")}>
                        <TextInput ref="handleInput"/>
                    </FormField>
                    <FormField label=" ">
                        <div><AjaxButton ref="getTokenButton" level={Level.PRIMARY} onClick={() => {this.linkCodeforces()}}
                          statusOptions={["Verify user", {icon: "spinner fa-spin", label:" Verifying user..."}, "User verified", "Failed"]}/></div>
                    </FormField>
                    <div ref="sendTokenGroup" style={{"margin-top":"40px"}} className="hidden">
                        <p>{UI.T("Send us a private message with this token:")}</p>
                        <FormField label="Token">
                            <TextInput ref="tokenInput" readonly={true}/>
                        </FormField>
                        <p>{UI.T("Click bellow to open Codeforces (in a new window) to send us this token:")}</p>
                        <Button label={UI.T("Open Codeforces")} level={Level.PRIMARY}
                                   onClick={() => {window.open("http://codeforces.com/usertalk?other=csacademy", "_blank")}}/>
                    </div>
                </div>
            ];
        }
    }

    linkCodeforces() {
        this.handleGroup.removeError();
        this.sendTokenGroup.hide();

        this.getTokenButton.postJSON("/accounts/link_external_account/", {
            platform: "codeforces",
            username: this.handleInput.getValue()
        }).then(
            (data) => {
                this.tokenInput.setValue(data.token);
                this.tokenInput.addClickListener(() => {
                    this.tokenInput.node.select();
                });
                this.sendTokenGroup.show();

                if (this.codeforcesTokenTimeout != null) {
                    clearTimeout(this.codeforcesTokenTimeout);
                }
                this.codeforcesTokenTimeout = setTimeout(() => {
                    this.sendTokenGroup.hide();
                }, 10 * 60 * 1000);
            },
            (error) => {
                this.handleGroup.setError(error.message);
            }
        );
    }

    unlinkCodeforces() {
        let request = {
            platform: "codeforces"
        };
        Ajax.postJSON("/accounts/unlink_external_account/", request).then(
            (data) => {
                UserStore.applyEvent({
                    objectId: data.user.id,
                    data: data.user,
                });
            }
        );
    }

    importCodeforcesHandle() {
        var request = {
            platform: "codeforces"
        };
        if (this.options.user.username && !confirm("Your current username (" + this.options.user.username + ")" +
                " will be available for other users to use. Are you sure you want to change your username?")) {
            return;
        }
        Ajax.postJSON("/accounts/import_external_username/", request).then(
            (data) => {
                UserStore.applyEvent({
                    objectId: data.user.id,
                    data: data.user,
                });
            }
        );
    }
}


function setUserThemeProperty(key, value) {
    UserStore.getCurrentUser().saveCustomSetting("theme:" + key, value);
}

function setUserPredefinedTheme(value) {
    UserStore.getCurrentUser().saveCustomSetting("themeId", value);
}

class ThemeSettingsStyle extends StyleSheet {
    dimensions = 26;
    horizontalMargin = "1em";
    verticalMargin = 12;

    @styleRule
    themeSettingsPanel = {
        width: "100%",
    };

    @styleRule
    themeSettingsContainer = {
        // maxWidth: "600px",
        // width: "600px",
    };

    @styleRule
    themeSettingsField = {
        margin: "0 auto",
        marginTop: this.verticalMargin,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        maxWidth: "600px",
    };

    @styleRule
    label = {
        width: "40%",
        textAlign: "right",
        lineHeight: this.dimensions,
        marginRight: this.horizontalMargin,
        color: "#555",
    };

    @styleRule
    colorBox = {
        height: this.dimensions,
        width: this.dimensions,
        marginRight: this.horizontalMargin,
    };

    @styleRule
    textInput = {
        height: this.dimensions,
        marginRight: this.horizontalMargin,
        flex: 1,
        outline: 0,
        minWidth: "30px",
        fontSize: "14px",
    };

    @styleRule
    button = {
        height: this.dimensions,
        padding: "0 10px !important",
        marginRight: this.horizontalMargin,
    };

    @styleRule
    paragraph = {
        fontSize: "16px",
        wordBreak: "break-all",
    }
}

@registerStyle(ThemeSettingsStyle)
class ThemeSettingsField extends UI.Element {
    extraNodeAttributes(attr) {
        attr.addClass(this.styleSheet.themeSettingsField);
    }

    getDefaultOptions() {
        return {
            textInputStyle: this.options.textInputStyle || {},
            colorBoxStyle: this.options.colorBoxStyle || {},
        }
    }

    getCurrentThemeFieldValue() {
        return Theme.props[this.options.fieldName];
    }

    getCustomThemeFieldValue() {
        const customTheme = USER.getCustomSetting("theme", {});
        const value = customTheme[this.options.fieldName];
        if (typeof value === "function") {
            return value();
        }
        return value;
    }

    getDefaultFieldValue() {
        const value = defaultThemeProperties[this.options.fieldName];
        if (typeof value === "function") {
            return value();
        }
        return value;
    }

    getInputValue() {
        return this.input.getValue();
    }

    render() {
        return [
            <label className={this.styleSheet.label}>
                <strong>
                    {this.options.label}
                </strong>
            </label>,

            <TextInput value={this.options.fieldValue}
                       ref="input"
                       onChange={() => this.updateField()}
                       className={this.styleSheet.textInput}
                       style={this.options.textInputStyle} />,

            <div className={this.styleSheet.colorBox}
                 style={this.options.colorBoxStyle} />,

            <Button ref="changeThemeButton"
                    onClick={() => this.applyThemeField()}
                    level={Level.PRIMARY}
                    className={this.styleSheet.button}>
                Apply
            </Button>,

            <Button ref="resetThemeButton"
                    onClick={() => this.resetThemeField()}
                    level={Level.PRIMARY}
                    className={this.styleSheet.button}>
                Reset
            </Button>,
        ];
    }

    updateField() {
        this.updateOptions({
            fieldValue: this.getInputValue()
        });
    }

    applyThemeField() {
        const inputValue = this.getInputValue();

        setUserThemeProperty(this.options.fieldName, inputValue);
        this.updateOptions({
            fieldValue: inputValue
        });

        this.updateStyle();
    }

    resetThemeField() {
        setUserThemeProperty(this.options.fieldName, null);
        this.updateOptions({
            fieldValue: this.getDefaultFieldValue()
        });

        this.updateStyle();
    }
}

class ThemeSettingsColorField extends ThemeSettingsField {
    getDefaultOptions() {
        let fieldValue = this.getCustomThemeFieldValue();
        if (fieldValue == null || fieldValue === "null") {
            fieldValue = this.getCurrentThemeFieldValue();
        }

        return Object.assign({}, super.getDefaultOptions(), {
            fieldValue,
            colorBoxStyle: {
                backgroundColor: fieldValue,
                border: "2px solid " + ((fieldValue && enhance(fieldValue, 0.2)) || "black"),
            }
        });
    }

    updateStyle() {
        this.updateOptions({
            colorBoxStyle: {
                backgroundColor: this.options.fieldValue,
                border: "2px solid " + ((fieldValue && enhance(fieldValue, 0.2)) || "black"),
            },
        });
    }
}

class ThemeSettingsFontFamilyField extends ThemeSettingsField {
    getDefaultOptions() {
        let fieldValue = this.getCustomThemeFieldValue();
        if (fieldValue == null || fieldValue === "null") {
            fieldValue = this.getCurrentThemeFieldValue();
        }

        return Object.assign({}, super.getDefaultOptions(), {
            fieldValue,
            textInputStyle: {
                fontFamily: fieldValue,
            },
        });
    }

    updateStyle() {
        this.updateOptions({
            textInputStyle: {
                fontFamily: this.options.fieldValue,
            },
        });
    }
}

@registerStyle(ThemeSettingsStyle)
export class ThemeSettingsPanel extends Panel {
    constructor(options) {
        super(options);

        this.colorFields = [
            {
                label: "Primary Color",
                fieldName: "COLOR_PRIMARY",
            },
            {
                label: "Secondary Color",
                fieldName: "COLOR_SECONDARY",
            },
            {
                label: "Primary Background Color",
                fieldName: "COLOR_BACKGROUND_BODY",
            },
            {
                label: "Secondary Background Color",
                fieldName: "COLOR_BACKGROUND_ALTERNATIVE",
            },
        ];
        this.fontFamilyFields = [
            {
                label: "Primary Font Family",
                fieldName: "FONT_FAMILY_DEFAULT",
            },
        ];
    }

    extraNodeAttributes(attr) {
        attr.addClass(this.styleSheet.themeSettingsPanel);
    }

    render() {
        let themeSettingsColorFields = this.colorFields.map((colorField, index) => {
            return <ThemeSettingsColorField label={colorField.label}
                                            fieldName={colorField.fieldName} />;
        });

        let themeSettingsFontFamilyFields = this.fontFamilyFields.map((fontFamilyField, index) => {
            return <ThemeSettingsFontFamilyField label={fontFamilyField.label}
                                                 fieldName={fontFamilyField.fieldName} />;
        });

        return [
            <h3>Theme</h3>,

            <p className={this.styleSheet.paragraph}>
                Color examples:
                <code>#345abc</code>,
                <code>#678</code>,
                <code>rgb(123,123,123)</code>,
                <code>rgba(123,123,123,0.5)</code>,
                <code>blue</code>,
                <code>aqua</code>.
            </p>,

            <p className={this.styleSheet.paragraph}>
                Font examples:
                <code>monospace</code>,
                <code>Arial</code>,
                <code>cursive</code>,
                <code>Helvetica</code>.
            </p>,

            <p className={this.styleSheet.paragraph}>
                Select your theme:&nbsp;
                <Select options={[{
                    value: "",
                    toString: () => "Current theme",
                }, {
                    value: "1",
                    toString: () => "Default",
                }, {
                    value: "2",
                    toString: () => "Dark",
                }, {
                    value: "3",
                    toString: () => "Console",
                }, {
                    value: "custom",
                    toString: () => "Custom",
                }]} ref="select" />
            </p>,

            <p className={this.styleSheet.paragraph}>
                Configure custom theme settings:
            </p>,

            <div className={this.styleSheet.themeSettingsContainer}>
                {themeSettingsColorFields}
                {themeSettingsFontFamilyFields}
            </div>,
        ];
    }

    onMount() {
        this.select.addChangeListener(() => {
            setUserPredefinedTheme(this.select.get().value);
        });
    }
}


class AccountSettingsPanel extends UserSettingsPanel {
    getPanels() {
        return [
            <CSAGeneralInformationPanel title={UI.T("General Info")} active={true}
                                     user={this.getUser()} ref="generalPanel" tabHref={this.getUrlPrefix("general")} />,
            <EmailPanel title={UI.T("Email")} user={this.getUser()}
                        ref="emailPanel" tabHref={this.getUrlPrefix("email")} />,
            <ExternalAccountsPanel title={UI.T("External accounts")}
                                   user={this.getUser()} ref="externalPanel" tabHref={this.getUrlPrefix("external")} />,
            <SocialAccountsPanel title={UI.T("Social accounts")} user={this.getUser()}
                        ref="socialPanel" tabHref={this.getUrlPrefix("social")} />,
            <SecuritySettingsPanel title={UI.T("Security")}
                                   user={this.getUser()} ref="securityPanel" tabHref={this.getUrlPrefix("security")} />,
            <ThemeSettingsPanel title={UI.T("Theme")}
                                   user={this.getUser()} ref="themePanel" tabHref={this.getUrlPrefix("theme")} />,
        ];
    }
}


export {AccountSettingsPanel};
