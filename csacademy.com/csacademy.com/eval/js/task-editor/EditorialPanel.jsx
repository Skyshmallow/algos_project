import {UI, Panel, Button, ButtonGroup, Level} from "../../../csabase/js/UI.js";
import {ArticleEditor} from "../../../establishment/content/js/ArticleEditor.jsx";
import {Ajax} from "../../../stemjs/src/base/Ajax.js";


class EditorialPanel extends Panel {
    getTitle() {
        return "Editorial";
    }

    extraNodeAttributes(attr) {
        attr.setStyle({
            display: "flex",
            height: "100%",
            flexDirection: "column",
        });
    }

    render() {
        let evalTask = this.options.evalTask;
        if (evalTask.getHiddenSolutionArticle()) {
            let button;
            if (!evalTask.solutionArticleId) {
                button = <Button label="Publish solution article" level={Level.WARNING}
                                 onClick={() => {this.publishSolutionArticle()}}/>;
            } else {
                button = <Button label="Unpublish solution article" level={Level.WARNING}
                                 onClick={() => {this.unpublishSolutionArticle()}}/>;
            }
            return [
                    <ButtonGroup>
                        {button}
                        <Button style={{marginLeft: "20px"}} label="Delete hidden solution article"
                             onClick={() => {this.deleteHiddenSolutionArticle()}}
                                level={Level.DANGER} />
                    </ButtonGroup>,
                    <ArticleEditor ref="solutionEditor" articleId={evalTask.hiddenSolutionArticleId} style={{flex: "1"}}/>
                ]
        } else {
            return [
                <h2>The task doesn't have a solution article, click bellow to create one</h2>,
                <Button label="Create hidden solution article" onClick={() => {this.createHiddenSolutionArticle()}} />
            ];
        }
    }

    unpublishSolutionArticle() {
        Ajax.postJSON("/task/" + this.options.evalTask.urlName + "/edit/", {
            unpublishSolutionArticle: true,
        }).then(
            () => {
                delete this.options.evalTask.solutionArticleId;
                this.redraw();
            }
        );
    }

    publishSolutionArticle() {
        Ajax.postJSON("/task/" + this.options.evalTask.urlName + "/edit/", {
            publishSolutionArticle: true,
        }).then(
            () => this.redraw()
        );
    }

    createHiddenSolutionArticle() {
        Ajax.postJSON("/task/" + this.options.evalTask.urlName + "/edit/", {
            createHiddenSolutionArticle: true,
        }).then(
            (data) => {
                this.options.evalTask.hiddenSolutionArticleId = parseInt(data.hiddenSolutionArticleId);
                this.redraw();
            }
        );
    }

    deleteHiddenSolutionArticle() {
        alert("Can't handle this now");
    }
}

export {EditorialPanel};
