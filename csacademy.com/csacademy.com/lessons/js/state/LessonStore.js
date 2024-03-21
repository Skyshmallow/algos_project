import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store.js";
import {
    ArticleStore
} from "../../../establishment/content/js/state/ArticleStore.js";


export class Lesson extends StoreObject {
    getArticle() {
        let baseArticle = ArticleStore.get(this.articleId);
        return baseArticle.getTranslation();
    }
}

export const LessonStore = new GenericObjectStore("lesson", Lesson, {
    dependencies: ["article", "lessonSection"]
});

export class LessonSection extends StoreObject {
    getLessons() {
        return LessonStore.all().filter(lesson => lesson.sectionId === this.id);
    }
}

export const LessonSectionStore = new GenericObjectStore("lessonSection", LessonSection);