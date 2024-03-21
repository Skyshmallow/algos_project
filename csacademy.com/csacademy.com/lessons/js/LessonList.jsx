import {UI, Link, CardPanel, registerStyle, RowList, Size} from "../../csabase/js/UI.js";

import {LessonSectionPanelStyle} from "./LessonStyle.js";
import {LessonSectionStore} from "./state/LessonStore.js";


@registerStyle(LessonSectionPanelStyle)
class LessonSectionPanel extends UI.Element {
    extraNodeAttributes(attr) {
        attr.addClass(this.styleSheet.lessonSectionPanel);
    }

    getLessons() {
        return this.options.lessonSection.getLessons();
    }

    getLessonURL(urlName) {
        return "/lesson/" + urlName;
    }

    render() {
        let {title} = this.options;

        let lessons = this.getLessons();
        if (!USER.isSuperUser) {
            lessons = lessons.filter(lesson => lesson.visible);
        }

        // If there are no available lessons, don't show just the label to the regular users.
        if (lessons.length === 0 && !USER.isSuperUser) {
            return null;
        }

        return (
            <CardPanel title={title}
                       headingCentered={false}
                       size={Size.LARGE}>
                <RowList rows={lessons}
                         alternateColors={false}
                         size={Size.LARGE}
                         rowParser={(lesson, index) => {
                             return (
                                 <Link href={this.getLessonURL(lesson.urlName)}
                                       value={lesson.name} />
                             );
                         }} />
            </CardPanel>
        );
    }
}

export class LessonList extends UI.Element {
    render() {
        let allLessonSections = LessonSectionStore.all();
        return allLessonSections.map(lessonSection =>
            <LessonSectionPanel title={lessonSection.name} lessonSection={lessonSection} />
        );
    }
}
