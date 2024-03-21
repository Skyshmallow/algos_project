import {UI, Link, ActionModal, Form, FormField, Select, TextInput, TemporaryMessageArea, Button, ButtonGroup,
        Level, SortableTable, Panel} from "../../csabase/js/UI.js";
import {ArticleStore} from "../../establishment/content/js/state/ArticleStore.js";
import {Language} from "../../establishment/localization/js/state/LanguageStore.js";
import {Formatter} from "../../csabase/js/util.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {GlobalStyle} from "../../stemjs/src/ui/GlobalStyle.js";

import {EvalTaskStore} from "./state/EvalTaskStore.js";
import {autoredraw} from "../../stemjs/src/decorators/AutoRedraw.js";

class TaskType {
    constructor(id, name) {
        this.id = id;
        this.toString = () => name;
    }
}

const taskTypes = [
    new TaskType(0, "Batch"),
    new TaskType(1, "Interactive")
];

function translateArticle(article, language, ownerId, modal) {
    let request = {
        name: "Translation for " + article.name + " in " + language.name,
        baseArticleId: article.id,
        dependency: article.dependency,
        languageId: language.id,
        isPublic: article.isPublic,
        markup: article.markup,
        userCreatedId: ownerId
    };
    Ajax.postJSON("/create_article/", request).then(
        (data) => modal.hide(),
        (error) => modal.messageArea.showMessage(error.message, "red")
    );
}

class TranslateModal extends ActionModal {
    getActionName() {
        return "Add translation";
    }

    getBody() {
        return [<UI.TextElement ref="text" value={"Translate statement and solution"}/>,
            <Form style={{marginTop: "10px"}}>
                <FormField ref="languageFormField" label="Language">
                    <Select ref="languageSelect" options={Language.all()}/>
                </FormField>
                <FormField ref="ownerFormField" label="Assign to user">
                    <TextInput ref="ownerFormInput" value={USER.id}/>
                </FormField>
            </Form>
        ];
    }

    getFooter() {
        return [<TemporaryMessageArea ref="messageArea"/>,
            <ButtonGroup>
                <Button label="Close" onClick={() => this.hide()}/>
                <Button level={Level.PRIMARY} label="Add translation"
                           onClick={() => this.addTranslation()}/>
            </ButtonGroup>
        ];
    }

    setTask(evalTask) {
        this.evalTask = evalTask;
        this.text.setValue("Translate statement and solution for " + this.evalTask.longName + ":");
    }

    addTranslation() {
        let language = this.languageSelect.get();
        let ownerId = this.ownerFormInput.getValue();
        let statementId = this.evalTask.statementArticleId;
        let solutionId = this.evalTask.solutionArticleId;
        translateArticle(ArticleStore.get(statementId), language, ownerId, this);
        if (solutionId)
            translateArticle(ArticleStore.get(solutionId), language, ownerId, this);
    }

    hide() {
        this.messageArea.clear();
        super.hide();
    }
}

class CreateEvalTaskModal extends ActionModal {
    getActionName() {
        return "Create task";
    }

    getBody() {
        return <Form style={{marginTop: "10px"}}>
            <FormField ref="urlNameFormField" label="URL name">
                <TextInput ref="urlNameInput"  value=""/>
            </FormField>
            <FormField ref="longNameFormField" label="Long name">
                <TextInput ref="longNameInput"  value=""/>
            </FormField>
            <FormField ref="typeFormField" label="Type">
                <Select ref="typeSelect" options={taskTypes}/>
            </FormField>
            <FormField ref="timeLimitFormField" label="Time limit (ms)">
                <TextInput ref="timeLimitInput"  value="1000"/>
            </FormField>
            <FormField ref="memoryLimitFormField" label="Memory limit (MB)">
                <TextInput ref="memoryLimitInput"  value="256"/>
            </FormField>
        </Form>;
    }

    getFooter() {
        return [<TemporaryMessageArea ref="messageArea"/>,
            <Button level={Level.PRIMARY} label="Create task" onClick={() => this.createTask()}/>];
    }

    createTask() {
        let urlName = this.urlNameInput.getValue();
        let longName = this.longNameInput.getValue();
        let type = this.typeSelect.get().id;
        let timeLimit = this.timeLimitInput.getValue();
        let memoryLimit = this.memoryLimitInput.getValue() * 1024;
        let request = {
            urlName: urlName,
            longName: longName,
            type: type,
            timeLimit: timeLimit,
            memoryLimit: memoryLimit
        };
        Ajax.postJSON("/eval/create_eval_task/", request).then(
            () => window.location.pathname = "/task/" + urlName + "/edit/",
            (error) => this.messageArea.showMessage(error.message, "red")
        );
    }

    hide() {
        this.messageArea.clear();
        super.hide();
    }
}

@autoredraw(EvalTaskStore)
class EvalTaskTable extends SortableTable {
    setOptions(options) {
        super.setOptions(options);
        this.columnSortingOrder = [this.options.columns[0]];
    }

    getDefaultColumns() {
        const cellStyle = {
            textAlign: "left",
            verticalAlign: "middle"
        };
        const headerStyle = {
            textAlign: "left",
            verticalAlign: "middle"
        };

        return [{
            value: evalTask => evalTask.id,
            headerName: "ID",
            headerStyle: headerStyle,
            cellStyle: cellStyle,
            sortDescending: true
        }, {
            value: evalTask => <Link href={"/task/" + evalTask.urlName + "/edit/"} value={evalTask.longName} />,
            rawValue: evalTask => evalTask.urlName,
            headerName: "Task",
            headerStyle: headerStyle,
            cellStyle: cellStyle
        }, {
            value: evalTask => taskTypes[evalTask.type].toString(),
            headerName: "Type",
            headerStyle: headerStyle,
            cellStyle: cellStyle
        }, {
            value: evalTask => Formatter.cpuTime(evalTask.timeLimit / 1000),
            rawValue: evalTask => evalTask.timeLimit,
            headerName: "Time limit",
            headerStyle: headerStyle,
            cellStyle: cellStyle
        }, {
            value: evalTask => Formatter.memory(evalTask.memoryLimit * 1024),
            rawValue: evalTask => evalTask.memoryLimit,
            headerName: "Memory limit",
            headerStyle: headerStyle,
            cellStyle: cellStyle
        }, {
            value: evalTask => <Button level={Level.PRIMARY} label="Translate" onClick={() => {
                this.parent.translateModal.show();
                this.parent.translateModal.setTask(evalTask);
            }}/>,
            headerName: "Translate",
            headerStyle: headerStyle,
            cellStyle: cellStyle
        }];
    }

    getEntries() {
        let evalTasks = EvalTaskStore.all().filter((evalTask) => {
            return evalTask.canBeEditedByUser();
        });
        return this.sortEntries(evalTasks);
    }
}

class EvalTaskManager extends Panel {
    getDefaultOptions() {
        return {
            title: "Task manager",
        };
    }

    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.addClass(GlobalStyle.Container.SMALL);
    }

    render() {
        return [
            <div className="pull-left">
                <h4><strong>
                    {this.options.title}
                </strong></h4>
            </div>,
            <div className="pull-right">
                <Button level={Level.PRIMARY} label="Create eval task"
                           onClick={() => this.createEvalTaskModal.show()}
                           style={{marginTop: "5px", marginBottom: "5px"}}/>
            </div>,
            <EvalTaskTable ref="table"/>,
        ];
    }

    onMount() {
        super.onMount();

        this.getEvalTasks();

        this.translateModal = <TranslateModal parent={this}/>;

        this.createEvalTaskModal = <CreateEvalTaskModal parent={this}/>;
    }

    getEvalTasks() {
        Ajax.getJSON("/eval/get_available_tasks/", {}).then(
            () => this.table.redraw()
        );
    }
}

export {EvalTaskManager, CreateEvalTaskModal}
