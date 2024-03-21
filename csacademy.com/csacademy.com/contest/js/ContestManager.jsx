import {UI, Table, Link, ActionModalButton, ActionModal, TextInput, Form, FormField, Level} from "../../csabase/js/UI.js";
import {Latex} from "../../establishment/content/js/markup/Latex.jsx";
import {DateTimePicker} from "../../stemjs/src/ui/DateTimePicker.jsx";
import {StemDate} from "../../stemjs/src/time/Date.js";
import {ServerTime} from "../../stemjs/src/time/Time.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {GlobalStyle} from "../../stemjs/src/ui/GlobalStyle.js";

import {ContestRegistererStore} from "./state/ContestRegistererStore.js";

class ContestRegistererTable extends Table {
    getEntries() {
        return ContestRegistererStore.all();
    }

    getDefaultColumns() {
        return [{
            value: (registerer) => <Link value={registerer.getContest().getName()} href={"/contest/" + registerer.getContest().name} />,
            headerName: "Name"
        }, {
            value: (registerer) => registerer.totalUsers,
            headerName: "Participants"
        }, {
            value: (registerer) => registerer.usersLastMonth,
            headerName: "Participants this month"
        }, {
            value: (registerer) => registerer.startDate ? StemDate.format(registerer.startDate, "DD/MM/YYYY HH:mm") : <Latex value="-\infty"/>,
            headerName: "Start date"
        }, {
            value: (registerer) => registerer.endDate ? StemDate.format(registerer.endDate, "DD/MM/YYYY HH:mm") : <Latex value="\infty"/>,
            headerName: "End date"
        }, {
            value: (registerer) => <Link value="Edit contest" href={"/contest/" + registerer.getContest().name + "/edit/"} />
        }, {
            value: (registerer) => <Link value="Invite Link" href={"/contest/invite/" + registerer.getCode() + "/"} />
        }];
    }
}

class NewContestModal extends ActionModal {
    getTitle() {
        return "Custom contest creation";
    }

    getBody() {
        return [
            <strong>! Leave the Start Date and End Date empty for a contest you want open indefinitely</strong>,
            <Form>
                    <FormField label="Contest Name">
                        <TextInput ref="contestNameInput"/>
                    </FormField>
                    <FormField label="Start Date">
                        <DateTimePicker ref="startDatePicker" />
                    </FormField>
                    <FormField label="End Date">
                        <DateTimePicker ref="endDatePicker" />
                    </FormField>
                    <FormField label="Contest Duration (hours:minutes or minutes)">
                        <TextInput ref="durationInput" value="01:00"/>
                    </FormField>
            </Form>
        ]
    }

    getActionLevel() {
        return Level.PRIMARY;
    }

    getActionName() {
        return "Create";
    }

    onMount() {
        super.onMount();

        let defaultDate = ServerTime.now().add({minutes: 1});
        let minutesToMilliseconds = 5 * 60 * 1000;
        let remainder = minutesToMilliseconds - defaultDate % minutesToMilliseconds;
        defaultDate.add(remainder, "milliseconds");
        this.startDatePicker.setDate(defaultDate);
        defaultDate.add({days: 1});
        this.endDatePicker.setDate(defaultDate);
    }

    action() {
        let contestLongName = this.contestNameInput.getValue();
        let startDate = this.startDatePicker.getDate();
        let endDate = this.endDatePicker.getDate();

        let duration = this.durationInput.getValue();
        if (duration) {
             duration = duration.split(":");
             if (duration.length > 1) {
                 duration = 60 * 60 * 1000 * parseFloat(duration[0] || 0) + 60 * 1000 * parseFloat(duration[1] || 0);
             } else {
                 duration = 60 * 1000 * parseFloat(duration[0] || 0);
             }
        }

        if (!duration || !contestLongName) {
            this.messageArea.showMessage("Invalid data given!", "red", 3000);
            return;
        }
        if (startDate) {
            startDate = startDate.getTime();
        }
        if (endDate) {
            endDate = endDate.getTime();
        }
        if (startDate && endDate && startDate >= endDate) {
            this.messageArea.showMessage("Invalid data given!", "red", 3000);
            return;
        }
        let request =  {
            duration: duration,
            contestLongName: contestLongName
        };
        if (startDate) {
            request.startTime = startDate;
        }
        if (endDate) {
            request.endTime = endDate;
        }
        Ajax.postJSON("/contest/create_custom_contest/", request).then(
            () => {
                this.options.contestManager.table.redraw();
                this.hide();
            }, (error) => {
                this.messageArea.showMessage(error.message, "red", 3000);
            }
        );
    }
}

let NewContestButton = ActionModalButton(NewContestModal);

class ContestManager extends UI.Element {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.addClass(GlobalStyle.Container.EXTRA_SMALL);
    }

    render() {
        return [
            <NewContestButton level={Level.SUCCESS} style={{margin: "30px"}} modalOptions={{contestManager: this}}>New Contest</NewContestButton>,
            <ContestRegistererTable ref="table"/>
        ];
    }
}

export {ContestManager};