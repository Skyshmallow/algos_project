import {UI, Panel, Button, ButtonGroup, Select, Switcher, Level} from "../../../csabase/js/UI.js";
import {CodeEditor, StaticCodeHighlighter} from "../../../stemjs/src/ui/CodeEditor.jsx";
import {ProgrammingLanguage} from "../../../csabase/js/state/ProgrammingLanguageStore.js";
import {updateAceRanges, decorateCollapsed, decorateUncollapsed} from "../../../workspace/js/EnforcedTemplateUtils.jsx";
import {Ajax} from "../../../stemjs/src/base/Ajax.js";

class TemplateCellEditor extends UI.Element {
    extraNodeAttributes(attr) {
        attr.setStyle({
            boxShadow: "0px 0px 4px #555",
            padding: "10px 2px",
            marginBottom: "5px",
            marginTop: "5px",
            marginLeft: "3px",
            borderRadius: "4px",
        });
    }

    render() {
        let types = [{
            toString: () => "collapsed"
        }, {
            toString: () => "collapsible"
        }, {
            toString: () => "uncollapsible"
        }, {
            toString: () => "editable"
        }];
        let selected = (this.options.initialValue || {type: "editable"}).type;
        for (let type of types) {
            if (type.toString() === selected) {
                selected = type;
                break;
            }
        }
        return [
            <Select ref="typeSelect" options={types} style={{"margin-bottom": "10px", "padding": "5px", "background-color": "white"}} selected={selected}/>,
                <Button ref="removeButton" level={Level.DANGER} icon="minus" style={{"display": "inline-block", "margin-left": "20px"}}/>,
            <CodeEditor ref="codeEditor" maxLines={10} value={(this.options.initialValue || {lines: []}).lines.join("\n")}
                           fontSize="15" aceMode={this.options.aceMode}/>
        ];
    }

    onMount() {
        super.onMount();
        this.removeButton.addClickListener(() => {
            this.parent.dispatch("removeTemplateElement", this);
            this.options.editor.dispatch("change");
        });
        this.typeSelect.addChangeListener(() => {
            this.options.editor.dispatch("change");
        });
        this.codeEditor.addAceChangeListener(() => {
            setTimeout(() => {
                this.options.editor.dispatch("change");
            });
        });
    }

    getValue() {
        return {
            type: this.typeSelect.get().toString(),
            lines: this.codeEditor.getValue().replace(/\r/, "").split("\n")
        };
    }
}

class AddTemplateCellButton extends Button {
    getDefaultOptions() {
        return Object.assign({}, super.getDefaultOptions(), {
            level: Level.SUCCESS,
            icon: "plus",
        });
    }

    onMount() {
        super.onMount();
        this.addClickListener(() => {
            let editor = this.parent;
            let index = editor.addButtons.indexOf(this);
            let language = this.options.editor.options.language;
            let templateEditor = <TemplateCellEditor initialValue={""} aceMode={language.aceMode}
                                                 editor={this.options.editor}/>;
            let addButton = <AddTemplateCellButton editor={this.options.editor} />;
            templateEditor.mount(editor, this.node);
            addButton.mount(editor, templateEditor.node);
            editor.options.children.splice(2 * index, 0, addButton, templateEditor);
            editor.addButtons.splice(index, 0, addButton);
            editor.templateEditors.splice(index, 0, templateEditor);
        })
    }
}

class LanguageTemplateEditor extends UI.Element {
    setOptions(options) {
        super.setOptions(options);
        this.templates = this.options.evalTask.enforcedTemplates[this.options.language.id] || [];
    }

    render() {
        this.options.children = [];
        this.templateEditors = [];
        this.addButtons = [];
        let addButton;
        for (let i = 0; i < this.templates.length; i += 1) {
            let templateEditor = <TemplateCellEditor initialValue={this.templates[i]} aceMode={this.options.language.aceMode}
                                                 editor={this.options.editor}/>;
            addButton = <AddTemplateCellButton editor={this.options.editor} />;
            this.addButtons.push(addButton);
            this.templateEditors.push(templateEditor);

            this.options.children.push(addButton);
            this.options.children.push(templateEditor);
        }
        addButton = <AddTemplateCellButton editor={this.options.editor} />;
        this.addButtons.push(addButton);
        this.options.children.push(addButton);
        return this.options.children;
    }

    onMount() {
        super.onMount();
        this.addListener("removeTemplateElement", (template) => {
            let index = this.templateEditors.indexOf(template);
            let button = this.addButtons[index];
            let templateEditor = this.templateEditors[index];
            this.addButtons.splice(index, 1);
            this.templateEditors.splice(index, 1);
            this.eraseChild(button);
            this.eraseChild(templateEditor);
        });
    }

    getParsedArray() {
        let template = [];
        for (let templateEditor of this.templateEditors) {
            template.push(templateEditor.getValue());
        }
        return template;
    }
}

class LanguageTab extends UI.Element {
    render() {
        return [
                <LanguageTemplateEditor style={{"width": "50%", "padding-right": "10px", "float": "left", height: "100%", overflow: "auto"}}
                                    ref="languageTemplateEditor" editor={this}
                                    evalTask={this.options.evalTask} language={this.options.language} />,
            <div style={{"display": "inline-block", "width": "50%", "float": "right", height: "100%", overflow: "hidden"}}>
                <StaticCodeHighlighter ref="codeRenderer" fontSize="15" aceMode={this.options.language.aceMode} style={{height: "100%"}} />
            </div>,
            <div style={{"clear": "both"}}></div>
        ]
    }

    getParsedArray() {
        return this.languageTemplateEditor.getParsedArray();
    }

    checkTemplate(evalTask, language) {
        let template = evalTask.enforcedTemplates[language.id] || [];
        if (template.length === 0) {
            return "Empty template!";
        }
        for (let i = 0; i < template.length; i += 1) {
            if (i > 0 && template[i].type === "editable" && template[i - 1].type === "editable") {
                return "There should not be two editable areas in a row!";
            }
            if (template[i].lines.length === 1 && template[i].type !== "editable") {
                return "There should be at least one \\n character in every uneditable area.";
            }
        }
        if (template[0].type === "editable") {
            return "The first block should not be editable";
        }
        if (template[template.length - 1].type === "editable") {
            return "The last block should not be editable";
        }
        return null;
    }

    updateCodeRenderer(evalTask) {
        let session = this.codeRenderer.ace.getSession();
        this.folds = this.folds || [];
        this.foldLines = this.foldLines || [];
        this.markers = this.markers || [];

        if (session.folds) {
            for (let fold of session.folds) {
                session.removeFold(fold);
            }
        }

        for (let marker of this.markers) {
            this.codeRenderer.removeMarker(marker);
        }

        this.folds = [];
        this.markers = [];
        let error = this.checkTemplate(evalTask, this.options.language);
        if (error) {
            this.codeRenderer.setValue(error);
        } else {
            let code = evalTask.getTemplate(this.options.language);
            this.codeRenderer.setValue(code);
            let template = evalTask.enforcedTemplates[this.options.language.id] || [];
            this.ranges = updateAceRanges(template, code, this.markers, this.folds, session, true);
        }
    }

    updateFoldingMethod() {
        let session = this.codeRenderer.ace.getSession();
        session.on("changeFold", (edit) => {
            if (!edit.data || this.codeRenderer.getValue() === "") {
                return;
            }
            if (edit.action === "remove") {
                for (let i = 0; i < this.folds.length; i += 1) {
                    if (edit.data === this.folds[i]) {
                        this.folds[i] = {isFolded: false};
                        decorateUncollapsed(session, this.ranges[i].start.row);
                    }
                }
            }
        });
        this.codeRenderer.ace.on("gutterclick", (event) => {
            let row = event.getDocumentPosition().row;
            for (let i = 0; i < this.ranges.length; i += 1) {
                if (this.ranges[i].start.row === row) {
                    if (this.folds[i] && this.folds[i].isFolded) {
                        session.removeFold(this.folds[i]);
                        this.folds[i] = {isFolded: false};
                        decorateUncollapsed(session, this.ranges[i]);
                    } else if (this.folds[i] && !this.folds[i].isFolded) {
                        const Range = CodeEditor.AceRange;
                        this.folds[i] = session.addFold("...", new Range(this.ranges[i].start.row, this.ranges[i].start.column, this.ranges[i].end.row - 1, 10000));
                        this.folds[i].isFolded = true;
                        decorateCollapsed(session, this.ranges[i]);
                    }
                }
            }
        });
    }

    onMount() {
        if (!window.ace) {
            CodeEditor.requireAce(() => {
                this.onMount();
            });
            return;
        }
        let evalTask = this.options.evalTask;
        evalTask.enforcedTemplates = evalTask.enforcedTemplates || {};
        evalTask.enforcedTemplates[this.options.language.id] = this.languageTemplateEditor.getParsedArray();
        this.updateCodeRenderer(evalTask);
        this.updateFoldingMethod();
        this.addListener("change", () => {
            let evalTask = this.options.evalTask;
            evalTask.enforcedTemplates = evalTask.enforcedTemplates || {};
            evalTask.enforcedTemplates[this.options.language.id] = this.languageTemplateEditor.getParsedArray();
            this.updateCodeRenderer(evalTask);
        });
    }
}

class TemplatesPanel extends Panel {
    getTitle() {
        return "Templates";
    }

    extraNodeAttributes(attr) {
        attr.setStyle({
            display: "flex",
            flexDirection: "column",
        })
    }

    render() {
        if (this.options.evalTask.hasEnforcedTemplates()) {
            this.languageTabs = [];
            for (let language of ProgrammingLanguage.all()) {
                this.languageTabs.push(<LanguageTab style={{"width": "100%", height: "100%"}} language={language} evalTask={this.options.evalTask} />);
            }
            return [
                <ButtonGroup>
                    <Select ref="languageSelect" options={ProgrammingLanguage.all()} style={{"margin": "20px", "padding": "5px", "background-color": "white"}}/>
                    <Button ref="saveButton" style={{display: "inline-block"}} level={Level.PRIMARY}>Save</Button>
                </ButtonGroup>,
                <Switcher ref="languageSwitcher" style={{flex: "1", height: "100%", display: "flex"}}>
                    {this.languageTabs}
                </Switcher>
            ];
        }
        return [
            <h2>The task doesn't have any enforced templates, click bellow to create them</h2>,
            <Button ref={this.refLink("createButton")} label="Turn task to enforced-template task" />
        ]
    }

    save() {
        let json = {};
        for (let languageTab of this.languageTabs) {
            let value = languageTab.getParsedArray();
            if (value.length) {
                json[languageTab.options.language.id] = value;
            }
        }
        this.options.evalTask.enforcedTemplates = json;
        let request = {
            enforcedTemplatesChanged: true,
            enforcedTemplates: JSON.stringify(json),
        };
        Ajax.postJSON("/task/" + this.options.evalTask.urlName + "/edit/", request).then(
            () => {
                this.saveButton.setLevel(Level.SUCCESS);
                setTimeout(() => {
                    this.saveButton.setLevel(Level.PRIMARY);
                }, 1500);
            }
        );
    }

    getChildTab(languageId) {
        for (let languageTab of this.languageTabs) {
            if (languageTab.options.language.id === languageId) {
                return languageTab;
            }
        }
        return null;
    }

    onMount() {
        super.onMount();
        if (this.createButton) {
            this.createButton.addClickListener(() => {
                this.options.evalTask.enforcedTemplates = {};
                this.redraw();
                this.saveButton.addClickListener(() => {
                    this.save()
                });
                this.languageSelect.addChangeListener(() => {
                    this.languageSwitcher.setActive(this.getChildTab(this.languageSelect.get().id));
                });
            });
        }
        if (this.saveButton) {
            this.saveButton.addClickListener(() => {
                this.save();
            });
            this.languageSelect.addChangeListener(() => {
                this.languageSwitcher.setActive(this.getChildTab(this.languageSelect.get().id));
            });
        }
    }
}

export {TemplatesPanel};
