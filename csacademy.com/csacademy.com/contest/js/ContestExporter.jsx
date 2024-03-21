import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {MarkupClassMap} from "../../stemjs/src/markup/MarkupRenderer.js";
import {RawHTML} from "../../stemjs/src/ui/RawHTML.jsx";
import {Language} from "../../establishment/localization/js/state/LanguageStore.js";
import {ArticleRenderer} from "../../establishment/content/js/ArticleRenderer.jsx";
import {EvalTaskExamplesTable} from "../../eval/js/EvalTaskExamplesTable";
import {ServerInputTest} from "../../eval/js/ServerInputTest";
import {EvalTaskTestGroupingTable} from "../../eval/js/EvalTaskTestGroupingTable.jsx";


export class ContestExporter {
    draw() {
        window.currentWidget.addClass("hidden");
        this.element.removeClass("hidden");
    }

    revert() {
        window.currentWidget.removeClass("hidden");
        this.element.destroyNode();
    }

    renderTaskArticle(contestTask) {
        const language = this.options.language || Language.ENGLISH;

        const evalTask = contestTask.getEvalTask();
        let articleClassMap = new MarkupClassMap(MarkupClassMap.GLOBAL, [
            ["TaskExamples", EvalTaskExamplesTable(evalTask)],
            ["TaskTestGrouping", EvalTaskTestGroupingTable(evalTask)],
            ["RawHTML", RawHTML],
            ["ServerInputTest", ServerInputTest]
        ]);

        const article = contestTask.getStatementArticle().getTranslation(language);
        return <ArticleRenderer article={article} classMap={articleClassMap}/>;
    }

    renderTask(contestTask) {
        const evalTask = contestTask.getEvalTask();
        const taskArticle = this.renderTaskArticle(contestTask);

        return [
            <div className="text-center">
                <h1>{UI.T(evalTask.longName)}</h1>
            </div>,
            taskArticle
        ];
    }

    renderTaskWrapped(contestTask) {
        return <div style={{pageBreakAfter: "always"}}>
            {this.renderTask(contestTask)}
        </div>;
    }

    render() {
        let newChildren = [];
        for (let contestTask of this.contest.getContestTasks()) {
            newChildren.push(this.renderTaskWrapped(contestTask));
        }
        this.element.setChildren(newChildren);
    }

    requestAllLatestTasks() {
        let xhrPromises = [];
        for (const contestTask of this.contest.getContestTasks()) {
            xhrPromises.push(Ajax.postJSON("/contest/get_contest_task/", {
                contestTaskId: contestTask.id,
            }));
        }
        return Promise.all(xhrPromises);
    }

    // API
    constructor(contest, options={}) {
        this.contest = contest;
        this.options = options;

        this.element = <div className="hidden"/>;
        this.element.mount(document.body);
        this.requestAllLatestTasks().then(
            () => this.render()
        );
    }

    updateOptions(options) {
        this.options = Object.assign(this.options, options);
        this.render();
    }

    exportToPDF() {
        this.draw();
        setTimeout(() => {
            print();
            this.revert();
        }, 0);
    }
}
