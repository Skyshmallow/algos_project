import {UI, CardPanel, Modal, FormField, Select, Button, TextArea, Level} from "../../csabase/js/UI.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";

import {ContestAnnouncementStore} from "./state/ContestQuestionStore.js";
import {MarkupRenderer} from "../../stemjs/src/markup/MarkupRenderer.js";


export class ContestAnnouncementList extends UI.Element {
    getContest() {
        return this.options.contest;
    }

    renderAnnouncement(announcement) {
        let formattedDate = announcement.getDate().format("HH:mm:ss");

        let title = <div>
                        {formattedDate} <strong>{announcement.getTarget()}</strong>
                    </div>;
        return <div style={{padding: "10px", width: "450px", maxWidth: "100%"}}>
            <CardPanel key={announcement.id} title={title} id={"announcement" + announcement.id}
                       bodyStyle={{padding: "15px"}} >
                <MarkupRenderer value={announcement.getMessage()} />
        </CardPanel>
        </div>;
    }

    render() {
        return this.getContest().getAnnouncements().map(this.renderAnnouncement, this);
    }

    onMount() {
        this.attachCreateListener(ContestAnnouncementStore, (announcement) => {
            if (announcement.getContest() === this.getContest()) {
                this.redraw();
            }
        });
    }
}

export class AnnouncementBroadcastModal extends Modal {
    render() {
        const tasks = [{
            general: true,
            toString: () => "General",
        }].concat(this.options.contest.getContestTasks());

        return [
            <h4 className="text-center">New announcement</h4>,
            <FormField label="Task name">
                <Select ref="contestTaskSelect" options={tasks}/>
            </FormField>,
            <FormField label="Message">
                <TextArea ref="messageInput" />
            </FormField>,
            <FormField label=" ">
                <Button level={Level.PRIMARY} label={UI.T("Broadcast announcement")}
                        onClick={() => this.broadcastAnnouncement()}/>
            </FormField>
        ];
    }

    broadcastAnnouncement() {
        const contestTask = this.contestTaskSelect.get();

        let request = {
            contestId: this.options.contest.id,
            message: this.messageInput.getValue(),
        };
        if (!contestTask.general) {
            request.contestTaskId = contestTask.id;
        }

        Ajax.postJSON("/contest/broadcast_announcement/", request).then(
            () => this.hide()
        );
    }

}
