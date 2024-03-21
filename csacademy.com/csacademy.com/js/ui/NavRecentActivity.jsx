import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {Label} from "../../../stemjs/src/ui/SimpleElements.jsx";
import {Link} from "../../../stemjs/src/ui/primitives/Link.jsx";
import {registerStyle} from "../../../stemjs/src/ui/style/Theme.js";
import {Level} from "../../../stemjs/src/ui/Constants.js";
import {TimePassedSpan} from "../../../stemjs/src/ui/misc/TimePassedSpan.jsx";
import {ConcentricCirclesLoadingScreen} from "../../../stemjs/src/ui/ConcentricCirclesLoadingScreen.jsx";
import {Ajax} from "../../../stemjs/src/base/Ajax.js";
import {BlogEntryStore} from "../../../establishment/blog/js/state/BlogStore.js";
import {EvalTaskStore} from "../../../eval/js/state/EvalTaskStore.js";
import {ForumThreadStore} from "../../../establishment/forum/js/state/ForumStore.js";
import {UserHandle} from "../../../csaaccounts/js/UserHandle.jsx";
import {NavManager} from "../../../stemjs/src/ui/navmanager/NavManager.jsx";
import {DelayedElement} from "../../../stemjs/src/ui/DelayedElement.js";
import {Dispatcher} from "../../../stemjs/src/base/Dispatcher.js";
import {LessonStore} from "../../../lessons/js/state/LessonStore.js";
import {NavRecentActivityStyle} from "./NavRecentActivityStyle";
import {slugify} from "../../../stemjs/src/base/Utils.js";

@registerStyle(NavRecentActivityStyle)
class ActivityEntry extends UI.Element {
    extraNodeAttributes(attr) {
        attr.addClass(this.styleSheet.panel);
    }

    getTitle() {
        return this.options.title;
    }

    getPreview() {
        return this.options.preview;
    }

    getAuthorId() {
        return this.options.authorId;
    }

    getTimeStamp() {
        return this.options.timeStamp;
    }

    getType() {
        return this.options.type;
    }

    render() {
        const author = this.getAuthorId() ? <UserHandle userId={this.getAuthorId()} /> : null;
        return [
            <div className={this.styleSheet.title} ref="title">
                {this.getTitle()}
            </div>,
            this.getPreview(),
            <div className={this.styleSheet.bottomSection}>
                <span className={this.styleSheet.type}>{this.getType()}</span>
                {author}
                <span className={this.styleSheet.bottomRightSection}>
                    <TimePassedSpan timeStamp={this.getTimeStamp()} className={this.styleSheet.timeStamp}/>
                </span>
            </div>,
        ];
    }

    onMount() {
        const navManagerInstance = NavManager.Global;
        this.title.addClickListener(() => {
            if (navManagerInstance.rightSidePanel && navManagerInstance.rightSidePanel.visible) {
                navManagerInstance.toggleRightSidePanel();
            }
        });
    }
}

@registerStyle(NavRecentActivityStyle)
class MiniForumThread extends ActivityEntry {
    getThread() {
        return this.options.thread;
    }

    getTitle() {
        let pinned;
        if (this.getThread().isPinned()) {
            pinned = <span className={"fa fa-thumb-tack " + this.styleSheet.pinnedIcon}
                           aria-hidden="true" style={{paddingTop: "0", lineHeight: "20px", height: "20px"}} />;
        }
        return [
            pinned,
            <Link href={"/forum/" + this.getThread().id + "/" + slugify(this.getThread().title)} value={this.getThread().title}/>
        ];
    }

    getAuthorId() {
        return this.getThread().authorId;
    }

    getTimeStamp() {
        return this.getThread().getLastActive();
    }

    getType() {
        return <Label level={Level.SUCCESS} label="Forum"/>;
    }
}


class MiniBlogEntry extends ActivityEntry {
    getEntry() {
        return this.options.entry;
    }

    getTitle() {
        return <Link href={"/blog/" + this.getEntry().urlName + "/"} value={this.getEntry().getArticle().name} />;
    }

    getAuthorId() {
        return this.getEntry().getArticle().userCreatedId;
    }

    getTimeStamp() {
        return this.getEntry().lastActive;
    }

    getType() {
        return <Label level={Level.PRIMARY} label="Blog"/>;
    }
}


class MiniEvalTask extends ActivityEntry {
    getTask() {
        return this.options.task;
    }

    getTitle() {
        return <Link href={"/contest/" + this.getTask().archiveName + "/task/"
                            + this.getTask().urlName + "/discussion/"}
                     value={this.getTask().toString()} />;
    }

    getTimeStamp() {
        return this.getTask().lastActive;
    }

    getType() {
        return <Label level={Level.WARNING} label="Task"/>;
    }

    onMount() {
        super.onMount();
        this.title.addClickListener(() => {
            window.taskView = true;
        });
    }
}


class MiniLesson extends ActivityEntry {
    getLesson() {
        return this.options.lesson;
    }

    getTitle() {
        return <Link href={"/lesson/" + this.getLesson().urlName + "/"} value={this.getLesson().name} />;
    }

    getTimeStamp() {
        return this.getLesson().lastActive;
    }

    getType() {
        return <Label level={Level.PRIMARY} label="Lesson"/>;
    }
}


class NavRecentActivity extends DelayedElement(UI.Element) {
    getActivityPosts() {
        const recentForumActivity = ForumThreadStore
              .all()
              .filter(thread => {return thread.getLastActive() > 0;})
              .sort((thread1, thread2) => {return - thread1.getLastActive() + thread2.getLastActive();})
              .slice(0, 5)
              .map(thread => {return {uiElement: <MiniForumThread thread={thread} />, time: thread.getLastActive()};});

        const recentBlogActivity = BlogEntryStore
              .all()
              .filter(entry => {return entry.lastActive > 0;})
              .sort((entry1, entry2) => {return - entry1.lastActive + entry2.lastActive;})
              .slice(0, 5)
              .map(entry => {return {uiElement: <MiniBlogEntry entry={entry} />, time: entry.lastActive};});

        const recentEvalTasksActivity = EvalTaskStore
              .all()
              .filter(task => {return task.lastActive > 0;})
              .sort((task1, task2) => {return - task1.lastActive + task2.lastActive;})
              .slice(0, 5)
              .map(task => {return {uiElement: <MiniEvalTask task={task} />, time: task.lastActive};});

        const recentLessonsActivity = LessonStore
              .all()
              .filter(lesson => {return lesson.lastActive > 0;})
              .sort((lesson1, lesson2) => {return - lesson1.lastActive + lesson2.lastActive;})
              .slice(0,5)
              .map(lesson => {return {uiElement: <MiniLesson lesson={lesson} />, time: lesson.lastActive};});

        return recentForumActivity
            .concat(recentBlogActivity)
            .concat(recentEvalTasksActivity)
            .concat(recentLessonsActivity)
            .sort((element1, element2) => {return - element1.time + element2.time;})
            .map(element => element.uiElement);
    }

    beforeRedrawNotLoaded() {
        Dispatcher.Global.addListener("initNavManagerDone", () => {
            if (NavManager.Global.rightSidePanel.visible) {
                this.setLoaded();
            }
            NavManager.Global.addListener("toggledRightSide", (visible) => {
                if (visible) {
                    this.setLoaded();
                }
            });
        });
    }

    renderLoaded() {
        return this.getActivityPosts();
    }

    renderNotLoaded() {
        return <ConcentricCirclesLoadingScreen />;
    }

    setLoaded() {
        if (this._loaded) {
            return;
        }

        Ajax.getJSON("/recent_activity/", {}).then(
            () => super.setLoaded(),
            () => super.setLoaded()
        );
    }
}


export {NavRecentActivity};
