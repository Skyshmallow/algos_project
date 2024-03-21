import {
    Difficulty
} from "../../../csabase/js/state/DifficultyStore.js";
import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store.js";
import {
    ContestTaskStore
} from "../../../contest/js/state/ContestTaskStore.js";
import {
    Ajax
} from "../../../stemjs/src/base/Ajax.js";
import {
    NOOP_FUNCTION
} from "../../../stemjs/src/base/Utils.js";
import {
    ServerTime
} from "../../../stemjs/src/time/Time.js";


export class Interview extends StoreObject {
    constructor(obj) {
        super(obj);
        this.interviewTasks = new Map();
    }

    getStartTime() {
        return this.startTime;
    }

    getDuration() {
        if (this.getEndTime()) {
            return this.getEndTime() - this.getStartTime();
        } else {
            return ServerTime.now().unix() - this.getStartTime();
        }
    }

    getEndTime() {
        return this.endTime;
    }

    getExpectedDuration() {
        return this.duration;
    }

    getExpectedEndTime() {
        return this.getStartTime() + this.getExpectedDuration();
    }

    getDifficulty() {
        return Difficulty.get(this.difficulty);
    }

    hasEnded() {
        return this.getStartTime() + this.getExpectedDuration() < ServerTime.now().unix();
    }

    addInterviewTask(interviewTask, event) {
        if (this.interviewTasks.has(interviewTask.id)) {
            return false;
        }
        this.interviewTasks.set(interviewTask.id, interviewTask);
        this.dispatch("addInterviewTask", interviewTask);
        return true;
    }

    getInterviewTasks() {
        // Because the interview tasks are created in their order, their ids also represent the order
        return Array.from(this.interviewTasks.values()).sort((a, b) => {
            return a.id - b.id
        });
    }

    getAvailableTask() {
        let interviewTasks = this.getInterviewTasks();
        for (let i = interviewTasks.length - 1; i >= 0; i--) {
            let interviewTask = interviewTasks[i];

            // The first task after the last solved/locked
            if (interviewTask.getSolvedTime() || interviewTask.getLockedTime()) {
                return interviewTasks[i + 1];
            }
            // if (interviewTask.getReadTime()) {
            //     return interviewTask;
            // }

            // if (interviewTask.getReadTime() && !this.getSolvedTime()) {
            //     return interviewTask;
            // }
            // if (!interviewTask.getReadTime()) {
            //     return interviewTask;
            // }
        }
        return interviewTasks[0];
    }

    getContestTasks() {
        let contestTasks = [];
        // TODO: Should be sorted by difficulty
        for (let interviewTask of this.getInterviewTasks()) {
            contestTasks.push(interviewTask.getContestTask());
        }
        return contestTasks;
    }

    endInterview(onSuccess = NOOP_FUNCTION, onError = NOOP_FUNCTION) {
        if (this.getEndTime()) {
            onError("Interview already finished");
            return;
        }
        Ajax.postJSON("/interview/end_interview/", {
            interviewId: this.id
        }).then(onSuccess, onError);
    }
}

class InterviewStoreClass extends GenericObjectStore {
    possibleDifficulties = [
        Difficulty.EASY,
        Difficulty.MEDIUM,
        Difficulty.HARD,
    ];
    defaultDifficulty = Difficulty.MEDIUM;

    constructor() {
        super("interview", Interview);
    }
}

export const InterviewStore = new InterviewStoreClass();

export class InterviewTask extends StoreObject {
    getInterview() {
        return InterviewStore.get(this.interviewId);
    }

    getContestTask() {
        return ContestTaskStore.get(this.contestTaskId);
    }

    getNextTask() {
        let interviewTasks = this.getInterview().getInterviewTasks();
        for (let i = 0; i < interviewTasks.length; i += 1) {
            if (interviewTasks[i] === this) {
                // Will return undefined if it's the last task
                return interviewTasks[i + 1];
            }
        }
    }

    getReadTime() {
        return this.readTime;
    }

    getSolvedTime() {
        return this.solvedTime;
    }

    getLockedTime() {
        return this.lockedTime;
    }

    canOpen() {
        // TODO: should also be || this.getLockedTime()
        return this.getSolvedTime() || this.isAvailableTask();
    }

    isAvailableTask() {
        return this.getInterview().getAvailableTask() === this;
    }

    isLastTask() {
        return this.getNextTask() == null;
    }

    markAsRead() {
        if (this.getReadTime()) {
            return;
        }
        Ajax.postJSON("/interview/edit_interview_task/", {
            interviewId: this.interviewId,
            interviewTaskId: this.id,
            markAsRead: true,
        });
    }

    markAsLocked() {
        if (this.getLockedTime()) {
            return;
        }
        Ajax.postJSON("/interview/edit_interview_task/", {
            interviewId: this.interviewId,
            interviewTaskId: this.id,
            markAsLocked: true,
        });
    }
}

class InterviewTaskStoreClass extends GenericObjectStore {
    constructor() {
        super("interviewtask", InterviewTask, {
            dependencies: ["interview", "contesttask"]
        });
        this.addCreateListener((interviewTask, createEvent) => {
            interviewTask.getInterview().addInterviewTask(interviewTask, createEvent);
        });
    }
}

export const InterviewTaskStore = new InterviewTaskStoreClass();