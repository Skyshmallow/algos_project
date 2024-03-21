import {
    UI,
    Modal,
    Panel,
    Button,
    TemporaryMessageArea,
    TextInput,
    RawCheckboxInput,
    FormField,
    registerStyle,
    Router,
    Level
} from "../../csabase/js/UI.js";
import {ArticleRenderer} from "../../establishment/content/js/ArticleRenderer.jsx";
import {ArticleEditor} from "../../establishment/content/js/ArticleEditor.jsx";
import {MarkupClassMap} from "../../stemjs/src/markup/MarkupRenderer.js";
import {AsyncCommentThread} from "../../establishment/chat/js/CommentWidget.jsx";
import {ContestTaskButton} from "../../contest/js/ContestTaskPanel.jsx";
import {Ajax} from "../../stemjs/src/base/Ajax.js";

import {LessonStore} from "./state/LessonStore.js";
import {LessonPanelStyle} from "./LessonStyle.js";


class LessonEditModal extends Modal {
    getModalWindowStyle() {
        return Object.assign({}, super.getModalWindowStyle(), {
            margin: "0 auto",
            maxHeight: "100%",
            overflow: "initial",
            display: "flex",
            flexDirection: "column",
            top: "1vh",
            height: "98vh",
        });
    }

    render() {
        let lesson = this.options.lesson;
        let article = lesson.getArticle();

        let discussionButton = null;
        if (!lesson.discussionId) {
            discussionButton = <Button level={Level.WARNING} label="Create discussion"
                                          onClick={() => this.createDiscussion()} style={{marginLeft: "5px"}}/>;
        }

        return [
            <h1>Edit Lesson</h1>,
            <div>
                <FormField label="Title">
                    <TextInput ref="titleInput" value={article.name} />
                </FormField>
                <FormField label="URL Name">
                    <TextInput ref="urlInput" value={lesson.urlName} />
                </FormField>
                <FormField label="Visible">
                    <RawCheckboxInput ref="visibleCheckbox" value={lesson.visible} />
                </FormField>
                <Button level={Level.PRIMARY} label="Change settings" onClick={() => this.changeSettings()} />
                {discussionButton}
                <TemporaryMessageArea ref="messageArea"/>
            </div>,
            <ArticleEditor ref="contentEditor" articleId={article.id} style={{flex: "1"}} />
        ];
    }

    changeSettings() {
        let title = this.titleInput.getValue();
        let urlName = this.urlInput.getValue();
        let lesson = this.options.lesson;

        let request = {
            isVisible: this.visibleCheckbox.getValue(),
        };

        if (title) {
            request.title = title;
        }

        if (urlName) {
            request.urlName = urlName;
        }

        Ajax.postJSON("/lesson/" + lesson.urlName + "/edit/", request);
    }

    createDiscussion() {
        let request = {};

        Ajax.postJSON("/lesson/" + this.options.lesson.urlName + "/create_discussion/", request).then(
            (data) => this.hide()
        );
    }
}

@registerStyle(LessonPanelStyle)
export class LessonPanel extends Panel {
    static LessonClassMap = new MarkupClassMap(MarkupClassMap.GLOBAL, [["ContestTaskButton", ContestTaskButton]]);

    extraNodeAttributes(attr) {
        attr.addClass(this.styleSheet.className);
    }

    render() {
        let lesson = LessonStore.all().find(lesson => lesson.urlName === Router.parseURL()[1]);
        let article = lesson.getArticle();
        let articleComments;
        if (lesson.discussionId) {
            articleComments = <AsyncCommentThread chatId={lesson.discussionId} className={this.styleSheet.comments}/>;
        }

        let lessonEditButton;
        if (USER.isSuperUser) {
            lessonEditButton = <Button label="Edit" onClick={() => {
                LessonEditModal.show({
                    lesson: lesson,
                    fillScreen: true
                });
            }}/>
        }

        return [
            lessonEditButton,
            <ArticleRenderer article={article} classMap={LessonPanel.LessonClassMap}
                             liveLanguage className={this.styleSheet.articleRenderer} />,
            <div className={this.styleSheet.commentsContainer}>
                {articleComments}
            </div>,
        ]
    }

    onMount() {
        let previousBackgroundColor = document.body.style["backgroundColor"];
        document.body.style["backgroundColor"] = "#f3f4f6";

        this.addListener("urlEnter", () => {
            previousBackgroundColor = document.body.style["backgroundColor"];
            document.body.style["backgroundColor"] = "#f3f4f6";
        });
        this.addListener("urlExit", () => {
            document.body.style["backgroundColor"] = previousBackgroundColor;
        });
    }
}
