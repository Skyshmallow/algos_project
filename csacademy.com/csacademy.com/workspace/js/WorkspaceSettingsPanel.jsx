import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Panel} from "../../stemjs/src/ui/UIPrimitives.jsx";
import {Switcher} from "../../stemjs/src/ui/Switcher.jsx";
import {Button} from "../../stemjs/src/ui/button/Button.jsx";
import {FormField, Form} from "../../stemjs/src/ui/form/Form.jsx";
import {Select} from "../../stemjs/src/ui/input/Input.jsx";
import {NumberInput} from "../../stemjs/src/ui/input/Input.jsx";
import {RawCheckboxInput} from "../../stemjs/src/ui/input/Input.jsx";
import {Orientation, Size, Level} from "../../stemjs/src/ui/Constants.js";
import {UserStore} from "../../csaaccounts/js/state/UserStore.js";
import "Translation";
import {GlobalStyle} from "../../stemjs/src/ui/GlobalStyle.js";
import {CodeEditor} from "../../stemjs/src/ui/CodeEditor.jsx";
import {ProgrammingLanguage} from "../../csabase/js/state/ProgrammingLanguageStore.js";
import {AceTheme, AceKeyboardHandler} from "../../csabase/js/state/AceStore.js";


class WorkspaceSettingsPanel extends UI.Element {
    onMount() {
        let user = UserStore.getCurrentUser();
        // TODO(@gem): Ugly hack, fix this in Select
        this.aceThemeSelect.set(AceTheme.getDefaultTheme());
        this.aceThemeSelect.addChangeListener(() => {
            user.saveCustomSetting("workspace:aceTheme", this.aceThemeSelect.get().id);
        });
        this.codeFontSizeInput.addChangeListener(() => {
            user.saveCustomSetting("workspace:codeFontSize", this.codeFontSizeInput.getValue());
        });
        this.fileFontSizeInput.addChangeListener(() => {
            user.saveCustomSetting("workspace:fileFontSize", this.fileFontSizeInput.getValue());
        });
        this.tabSizeInput.addChangeListener(() => {
            user.saveCustomSetting("workspace:tabSize", this.tabSizeInput.getValue());
        });
        this.showLineNumberInput.addChangeListener(() => {
            user.saveCustomSetting("workspace:showLineNumber", this.showLineNumberInput.getValue());
        });
        this.showPrintMarginInput.addChangeListener(() => {
            user.saveCustomSetting("workspace:showPrintMargin", this.showPrintMarginInput.getValue());
        });
        this.printMarginSizeInput.addChangeListener(() => {
            user.saveCustomSetting("workspace:printMarginSize", this.printMarginSizeInput.getValue());
        });
        this.enableBasicAutocompletionInput.addChangeListener(() => {
            user.saveCustomSetting("workspace:enableBasicAutocompletion", this.enableBasicAutocompletionInput.getValue());
        });
        this.enableLiveAutocompletionInput.addChangeListener(() => {
            user.saveCustomSetting("workspace:enableLiveAutocompletion", this.enableLiveAutocompletionInput.getValue());
        });
        this.enableSnippetsInput.addChangeListener(() => {
            user.saveCustomSetting("workspace:enableSnippets", this.enableSnippetsInput.getValue());
        });
        this.aceKeyboardHandlerSelect.set(AceKeyboardHandler.getDefaultKeyboardHandler());
        this.aceKeyboardHandlerSelect.addChangeListener(() => {
            user.saveCustomSetting("workspace:aceKeyboardHandler", this.aceKeyboardHandlerSelect.get().id);
        });
    }

    render() {
        let user = UserStore.getCurrentUser();
        return [
            <Form orientation={Orientation.VERTICAL}
            style={{height:"330px", background: "#fff", display:"block", "overflow-y": "auto", "overflow-x": "hidden", padding: "10px"}} role="menu">
                <FormField label={UI.T("Theme")}>
                    <Select options={AceTheme.all()} ref="aceThemeSelect"
                               selected={AceTheme.getDefaultTheme()}/>
                </FormField>
                <FormField label={UI.T("Keyboard handler")}>
                    <Select options={AceKeyboardHandler.all()} ref="aceKeyboardHandlerSelect"
                               selected={AceKeyboardHandler.getDefaultKeyboardHandler()}/>
                </FormField>
                <FormField label={UI.T("Code font size")}>
                    <NumberInput ref="codeFontSizeInput" min="6" max="36"
                                        value={user.getCodeFontSize()}/>
                </FormField>
                <FormField label={UI.T("Files font size")}>
                    <NumberInput ref="fileFontSizeInput" min="6" max="36"
                                        value={user.getFileFontSize()}/>
                </FormField>
                <FormField label={UI.T("Tab size")}>
                    <NumberInput ref="tabSizeInput" min="2" max="8"
                                        value={user.getTabSize()}/>
                </FormField>
                <FormField label={UI.T("Show line number")} inline={false}>
                    <RawCheckboxInput ref="showLineNumberInput"
                                   checked={user.getShowLineNumber()}/>
                </FormField>
                <FormField label={UI.T("Show print margin")} inline={false}>
                    <RawCheckboxInput ref="showPrintMarginInput"
                                        checked={user.getShowPrintMargin()}/>
                </FormField>
                <FormField label={UI.T("Print margin column")}>
                    <NumberInput ref="printMarginSizeInput" min="60" max="180"
                                        value={user.getPrintMarginSize()}/>
                </FormField>
                <FormField label={UI.T("Enable basic autocompletion")} inline={false}>
                    <RawCheckboxInput ref="enableBasicAutocompletionInput"
                                        checked={user.getBasicAutocompletionStatus()}/>
                </FormField>
                <FormField label={UI.T("Enable live autocompletion")} inline={false}>
                    <RawCheckboxInput ref="enableLiveAutocompletionInput"
                                        checked={user.getLiveAutocompletionStatus()}/>
                </FormField>
                <FormField label={UI.T("Enable snippets")} inline={false}>
                    <RawCheckboxInput ref="enableSnippetsInput"
                                        checked={user.getSnippetsStatus()}/>
                </FormField>
            </Form>
        ];
    }
}

class ProgrammingLanguageSourceTemplate extends UI.Element {
    getUser() {
        return this.options.user;
    }

    getProgrammingLanguage() {
        return this.options.programmingLanguage;
    }

    render() {
        let programmingLanguage = this.getProgrammingLanguage();
        return [
            <CodeEditor ref="codeEditor" aceMode={programmingLanguage.aceMode}
                           value={programmingLanguage.getDefaultSource()}
                           maxLines={32} />,
            <Button size={Size.SMALL} icon="save" style={{marginTop: "10px"}}
                       label={[UI.T(" Save template for"), " " + programmingLanguage.name]}
                       level={Level.INFO} onClick={() => this.saveTemplate()} />
        ]
    }

    saveTemplate() {
        let user = this.getUser();
        let programmingLanguage = this.getProgrammingLanguage();
        let value = this.codeEditor.getValue();

        user.saveCustomSetting("workspace:programmingLanguage:" + programmingLanguage.id + ":defaultSource", value);
    }
}

class AllProgrammingLanguagesTemplateEditor extends UI.Element {
    setOptions(options) {
        super.setOptions(options);
        this.languageTemplatesMap = new Map();

        for (let programmingLanguage of ProgrammingLanguage.all()) {
            this.languageTemplatesMap.set(programmingLanguage,
                <ProgrammingLanguageSourceTemplate user={this.options.user} programmingLanguage={programmingLanguage} />);
        }
    }

    render() {
        return [
            <FormField label={UI.T("Edit your default code for")} style={{maxWidth: "800px"}}>
                <Select ref="programmingLanguageSelect" options={ProgrammingLanguage.all()} style={{maxWidth: "300px"}}/>
            </FormField>,
            <Switcher ref="templateSwitcher">
                {Array.from(this.languageTemplatesMap.values())}
            </Switcher>
        ]
    }

    onMount() {
        let defaultLanguage = ProgrammingLanguage.getDefaultLanguage();

        this.programmingLanguageSelect.addChangeListener(() => {
            let selectedProgrammingLanguage = this.programmingLanguageSelect.get();
            this.templateSwitcher.setActive(this.languageTemplatesMap.get(selectedProgrammingLanguage));
        });

        this.templateSwitcher.setActive(this.languageTemplatesMap.get(defaultLanguage));
    }
}

class UserWorkspaceSettingsPanel extends Panel {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.addClass(GlobalStyle.Container.SMALL);
    }

    savePreferredProgrammingLanguage(programmingLanguage) {
        this.options.user.saveCustomSetting("workspace:preferredProgrammingLanguage", programmingLanguage.id);
    }

    getTitle() {
        return UI.T("Workspace settings");
    }

    render() {
        this.options.user = UserStore.getCurrentUser();

        return [
                <FormField style={{marginTop: "5px", marginBottom: "5px", maxWidth: "800px"}} label={UI.T("Preferred language:")}>
                    <Select ref="preferredProgrammingLanguageSelect" options={ProgrammingLanguage.all()}
                            style={{maxWidth: "300px"}}/>
                </FormField>,
                <hr />,
                <AllProgrammingLanguagesTemplateEditor
                    style={{marginTop: "5px", marginBottom: "5px"}}
                    user={this.options.user} />
        ];
    }

    onMount() {
        let defaultLanguage = ProgrammingLanguage.getDefaultLanguage();
        this.preferredProgrammingLanguageSelect.set(defaultLanguage);
        this.preferredProgrammingLanguageSelect.addChangeListener(() => {
            this.savePreferredProgrammingLanguage(this.preferredProgrammingLanguageSelect.get());
        });
    }
}

export {WorkspaceSettingsPanel, UserWorkspaceSettingsPanel};
