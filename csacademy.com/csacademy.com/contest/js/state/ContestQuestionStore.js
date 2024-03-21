import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store";
import {
    StemDate
} from "../../../stemjs/src/time/Date";
import {
    Ajax
} from "../../../stemjs/src/base/Ajax";
import {
    NOOP_FUNCTION
} from "../../../stemjs/src/base/Utils";

import {
    ContestTaskStore
} from "./ContestTaskStore";
import {
    UserReactionCollectionStore
} from "../../../establishment/accounts/js/state/UserReactionStore";
import {
    field
} from "../../../stemjs/src/state/StoreField.js";


export class ContestAnnouncement extends StoreObject {
    @field("Contest") contest;
    @field("ContestTask") task;

    getContest() {
        return this.contest;
    }

    getDate() {
        return new StemDate(this.date);
    }

    getContestTask() {
        let contestTask = ContestTaskStore.get(this.taskId);
        if (!contestTask) {
            const contest = this.getContest();
            return contest ? .getContestTaskById(this.taskId);
        }
        return contestTask;
    }

    getTarget() {
        if (this.taskId) {
            return "Task " + this.getContestTask().longName;
        }
        return "General";
    }

    isTaskBroadcast() {
        return !!this.taskBroadcast;
    }

    getMessage() {
        if (this.isTaskBroadcast()) {
            return 'Task "' + this.getContestTask().longName + '" is now available!';
        }
        return this.message;
    }
}

export const ContestAnnouncementStore = new GenericObjectStore("ContestAnnouncement", ContestAnnouncement, {
    dependencies: ["contest"]
});

export class ContestQuestion extends StoreObject {
    @field("Contest") contest;

    applyEvent(event) {
        super.applyEvent(event);
        if (event.type !== "typingStateChange" &&
            event.type !== "createReactionCollection") {
            this.getContest().dispatch("updateQuestion", this);
        }
    }

    getContest() {
        return this.contest;
    }

    isAskedByCurrentUser() {
        return USER.id === this.userAskedId;
    }

    getContestTask() {
        return ContestTaskStore.get(this.contestTaskId);
    }

    isAnswered() {
        return this.replyTime;
    }

    shouldAppear() {
        return USER.id === this.userAskedId || this.isPublic;
    }

    getReactionCollection(fakeIfMissing = false) {
        let reactionCollection = UserReactionCollectionStore.get(this.reactionCollectionId);
        if (fakeIfMissing && !reactionCollection) {
            return {
                upvotesCount: 0,
                downvotesCount: 0,
                getCurrentUserReactionType() {},
            };
        }
        return reactionCollection;
    }

    getNumLikes() {
        return this.getReactionCollection(true).upvotesCount;
    }

    getNumDislikes() {
        return this.getReactionCollection(true).downvotesCount;
    }

    getVotesBalance() {
        return this.getNumLikes() - this.getNumDislikes();
    }

    getUserVote() {
        return this.getReactionCollection(true).getCurrentUserReactionType();
    }

    react(reaction, onSuccess = NOOP_FUNCTION, onError = NOOP_FUNCTION) {
        Ajax.postJSON("/contest/question_reaction/", {
            contestQuestionId: this.id,
            reaction: reaction,
        }).then(onSuccess, onError);
    }

    like(onSuccess, onError) {
        this.react("like", onSuccess, onError);
    }

    dislike(onSuccess, onError) {
        this.react("dislike", onSuccess, onError);
    }

    resetReaction(onSuccess, onError) {
        this.react("resetReaction", onSuccess, onError);
    }
}

export const ContestQuestionStore = new GenericObjectStore("ContestQuestion", ContestQuestion, {
    dependencies: ["contest"]
});