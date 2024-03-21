import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {Panel} from "../../../stemjs/src/ui/UIPrimitives.jsx";
import {ArticleEditor} from "../../../establishment/content/js/ArticleEditor.jsx";

export class StatementPanel extends Panel {
    getTitle() {
        return "Statement";
    }

    render() {
        return <ArticleEditor articleId={this.options.evalTask.statementArticleId}/>;
    }
}