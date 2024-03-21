import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Panel} from "../../stemjs/src/ui/UIPrimitives.jsx";
import {TabArea} from "../../stemjs/src/ui/tabs/TabArea.jsx";
import {ActionModal} from "../../stemjs/src/ui/modal/Modal.jsx";
import {Level} from "../../stemjs/src/ui/Constants.js";
import {Router} from "../../stemjs/src/ui/Router.jsx";
import {unwrapArray} from "../../stemjs/src/base/Utils.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {RecursiveArticleRenderer} from "../../establishment/content/js/ArticleRenderer.jsx";
import {AsyncCommentThread} from "../../establishment/chat/js/CommentWidget.jsx";
import {EvalTaskStore} from "../../eval/js/state/EvalTaskStore.js";

export class EvalTasksSolutionsWidget extends UI.Element {
    setOptions(options={}) {
        options = Object.assign({
            lazyRender: true,
        }, options);
        super.setOptions(options);
    }
    
    getEvalTaskIds() {
        return this.options.evalTaskIds || [];
    }

    isLoaded() {
        for (let evalTaskId of this.getEvalTaskIds()) {
            if (!EvalTaskStore.get(evalTaskId)) {
                return false;
            }
        }
        return true;
    }

    getOverviewPanel() {
        if (!this.options.overviewArticleId) {
            return this.options.overview;
        }
        let articleComments;
        if (this.options.overviewDiscussionId) {
            articleComments = <AsyncCommentThread chatId={this.options.overviewDiscussionId} />;
        }
        return <Panel title={UI.T("Overview")}>
                <RecursiveArticleRenderer articleId={this.options.overviewArticleId}/>
                {articleComments}
            </Panel>;
    }

    getTaskPanels() {
        let panels = [];
        for (let evalTaskId of this.getEvalTaskIds()) {
            let evalTask = EvalTaskStore.get(evalTaskId);
            let articleId = evalTask.solutionArticleId;

            if (articleId) {
                let articleComments;
                if (evalTask.discussionId) {
                    articleComments = <AsyncCommentThread chatId={evalTask.discussionId} />;
                }
                panels.push(
                    <Panel title={evalTask.toString()}>
                        <RecursiveArticleRenderer articleId={articleId}/>
                        {articleComments}
                    </Panel>
                );
            }
        }
        return panels;
    }

    fetchEvalTasks() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;

        let request = {
            evalTaskIds: this.getEvalTaskIds()
        };
        Ajax.getJSON("/contest/contest_analysis/", request).then(
            () => this.redraw()
        );
    }

    render() {
        if (this.isLoaded()) {
            return <TabArea lazyRender={this.options.lazyRender} variableHeightPanels={true}>
                {unwrapArray([this.getOverviewPanel(), this.getTaskPanels()])}
            </TabArea>
        } else {
            this.fetchEvalTasks();
            return <Panel title="Loading">
                <span className="fa fa-spin fa-spinner fa-3x"/>
            </Panel>;
        }
    }
}

export class ContestAnalysis extends UI.Element {
    render() {
        const evalTaskIds = this.options.contest.getContestTasks().map(
            contestTask => contestTask.evalTaskId
        );
        return <EvalTasksSolutionsWidget evalTaskIds={evalTaskIds}
                                         overviewArticleId={this.options.contest.analysisArticleId}
                                         overviewDiscussionId={this.options.contest.analysisDiscussionId}
        />;
    }
}

export class AnalysisModal extends ActionModal {
    getBody() {
        return [
            <p>{UI.T("The contest analysis has been published.")}</p>
        ];
    }

    action() {
        Router.changeURL(this.options.contestPanel.getURLPrefix("analysis"));
        this.hide();
    }

    getActionName() {
        return UI.T("Go to analysis");
    }

    getCloseName() {
        return UI.T("Cancel");
    }

    getActionLevel() {
        return Level.PRIMARY;
    }
}