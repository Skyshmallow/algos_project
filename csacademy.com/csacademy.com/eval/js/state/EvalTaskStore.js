import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store";
import {
    AjaxFetchMixin
} from "../../../stemjs/src/state/StoreMixins";
import {
    ProgrammingLanguage
} from "../../../csabase/js/state/ProgrammingLanguageStore";
import {
    ArticleStore
} from "../../../establishment/content/js/state/ArticleStore";

import {
    field
} from "../../../stemjs/src/state/StoreField.js";


export class EvalTask extends StoreObject {
    @field("Contest") defaultContest;

    toString() {
        return this.longName;
    }

    canBeEditedByUser(user = USER) {
        return user.isSuperUser || this.ownerId === user.id;
    }

    getEditUrl() {
        return `/task/${this.urlName}/edit/`;
    }

    getStatementArticle() {
        return ArticleStore.get(this.statementArticleId);
    }

    getTimeLimit(languageId = 1) {
        const programmingLanguage = ProgrammingLanguage.get(languageId);
        let extraTime = programmingLanguage.extraTime || 0;
        let timeRatio = programmingLanguage.timeRatio || 1.0;
        const ownLimits = this.programmingLanguageLimits[languageId];
        if (ownLimits) {
            extraTime = ownLimits.extraTime || extraTime;
            timeRatio = ownLimits.timeRatio || timeRatio;
        }
        return this.timeLimit * timeRatio + extraTime;
    }

    getMemoryLimit(languageId = 1) {
        const programmingLanguage = ProgrammingLanguage.get(languageId);
        let extraMemory = programmingLanguage.extraMemory || 0;
        const ownLimits = this.programmingLanguageLimits[languageId];
        if (ownLimits) {
            extraMemory = ownLimits.extraMemory || extraMemory;
        }
        return this.memoryLimit + extraMemory;
    }

    getSolutionArticle() {
        return ArticleStore.get(this.solutionArticleId);
    }

    getHiddenSolutionArticle() {
        return ArticleStore.get(this.hiddenSolutionArticleId);
    }

    getWorkspace(userId = USER.id) {
        const EvalTaskUserSummaryStore = this.getStore("EvalTaskUserSummary");
        const evalTaskUserSummary = EvalTaskUserSummaryStore.findBy({
            evalTaskId: this.id,
            userId
        });
        return evalTaskUserSummary ? .getWorkspace();
    }

    getType() {
        return this.type;
    }

    isInteractive() {
        return this.getType() === 1;
    }

    getTemplate(language) {
        if (this.enforcedTemplates && this.enforcedTemplates[language.id]) {
            let template = "";
            for (let block of this.enforcedTemplates[language.id]) {
                template += block.lines.join("\n") + "\n";
            }
            return template;
        }
        return null;
    }

    getAvailableLanguages() {
        if (!this.hasEnforcedTemplates()) {
            return ProgrammingLanguage.all();
        }
        let languages = [];
        for (let language of ProgrammingLanguage.all()) {
            if (this.enforcedTemplates[language.id] && this.enforcedTemplates[language.id].length > 0) {
                languages.push(language);
            }
        }
        return languages;
    }

    hasEnforcedTemplates() {
        return !!this.enforcedTemplates;
    }
}

class EvalTaskStoreClass extends AjaxFetchMixin(GenericObjectStore) {
    constructor() {
        super("evaltask", EvalTask, {
            dependencies: ["article"],
            maxFetchObjectCount: 32,
            fetchURL: "/eval/fetch_eval_task/",
        });
    }

    applyEvent(event) {
        if (this.get(event.objectId)) {
            super.applyEvent(event);
        }
    }
}

export const EvalTaskStore = new EvalTaskStoreClass();