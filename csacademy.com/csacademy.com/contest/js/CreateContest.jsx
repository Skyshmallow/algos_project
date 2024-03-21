import {UI} from "../../stemjs/src/ui/UIBase.js";
import {ActionModal, ActionModalButton} from "../../stemjs/src/ui/modal/Modal.jsx";
import {FormField, FormGroup} from "../../stemjs/src/ui/form/Form.jsx";
import {TextInput} from "../../stemjs/src/ui/input/Input.jsx";
import {NumberInput} from "../../stemjs/src/ui/input/Input.jsx";
import {RawCheckboxInput} from "../../stemjs/src/ui/input/Input.jsx";
import {Select} from "../../stemjs/src/ui/input/Input.jsx";
import {ServerTime} from "../../stemjs/src/time/Time.js";
import {DateTimePicker} from "../../stemjs/src/ui/DateTimePicker.jsx";
import {Ajax} from "../../stemjs/src/base/Ajax.js";

import {ContestScoringStore} from "./state/ContestScoringStore.js";


export function getDefaultContestStartDate() {
    let defaultDate = ServerTime.now().add({minutes: 1});
    let minutesToMilliseconds = 5 * 60 * 1000;
    let remainder = minutesToMilliseconds - defaultDate % minutesToMilliseconds;
    defaultDate.add(remainder, "milliseconds");
    return defaultDate;
}


class CreateContestModal extends ActionModal {
    getTitle() {
        return "New contest";
    }

    getActionName() {
        return "Create contest";
    }

    getDefaultValues() {
        return {
            contestName: "",
            contestLongName: "",
            startDate: getDefaultContestStartDate(),
        };
    }

    getBody() {
        const defaultValue = this.getDefaultValues();

        return [
            // TODO When editing the contest name, if the current value of the url name is the normalized version of the long name, then edit the input
            <FormField label="Contest name">
                <TextInput placeholder="Contest long name" ref="contestLongNameInput" value={defaultValue.contestLongName}/>
            </FormField>,
            <FormField label="Contest URL name">
                <TextInput placeholder="Contest name" ref="contestNameInput" value={defaultValue.contestName}/>
            </FormField>,
            <FormField label={<UI.TextElement ref={this.refLink("timeTracker")} value=""/>}>
                <DateTimePicker ref="startDatePicker" date={defaultValue.startDate}/>
            </FormField>,
            <FormGroup style={{borderBottom: "1px solid #ddd",}}>
                <h4>Duration:</h4>
                <FormField label="Days">
                  <NumberInput ref="daysInput" min="0" value={defaultValue.durationDays}/>
                </FormField>
                <FormField label="Hours">
                  <NumberInput ref="hoursInput" min="0" value={defaultValue.durationHours}/>
                </FormField>
                <FormField label="Minutes">
                  <NumberInput ref="minutesInput" min="0" value={defaultValue.durationMinutes}/>
                </FormField>
            </FormGroup>,
            <FormField label="Scoring">
                <Select ref="scoringSelect" options={ContestScoringStore.all()}
                                            selected={ContestScoringStore.get(defaultValue.scoringId)}/>
            </FormField>,
            <FormField label="Visible">
                <RawCheckboxInput ref="visibleCheckbox" initialValue={defaultValue.visible}/>
            </FormField>,
            <FormField label="Live scoreboard">
                <RawCheckboxInput ref="liveResultsCheckbox" initialValue={defaultValue.liveResults}/>
            </FormField>,
            <FormField label="Rated">
                <RawCheckboxInput ref="ratedCheckbox" initialValue={defaultValue.rated}/>
            </FormField>,
            <FormField label="Public sources">
                <RawCheckboxInput ref="publicSourcesCheckbox" initialValue={defaultValue.publicSources}/>
            </FormField>,
        ];
    }

    onMount() {
        super.onMount();

        this.intervalId = setInterval(() => {
            let serverTime = ServerTime.now().format("HH:mm:ss");
            this.timeTracker.setValue(`Start/end date (Server time: ${serverTime})`);
        }, 1000);
    }

    onUnmount() {
        clearInterval(this.intervalId);
    }

    getRequest() {
        let request = {
            contestName: this.contestNameInput.getValue(),
            contestLongName: this.contestLongNameInput.getValue(),
            isVisible: this.visibleCheckbox.getValue(),
            rated: this.ratedCheckbox.getValue(),
            publicSources: this.publicSourcesCheckbox.getValue(),
            liveResults: this.liveResultsCheckbox.getValue(),
            scoringId: this.scoringSelect.get().id,
        };

        const startDate = this.startDatePicker.getDate();
        if (startDate) {
            if (!startDate.isValid()) {
                return "datetime invalid";
            }

            const days = Math.max(this.daysInput.getValue(), 0) || 0;
            const hours = Math.max(this.hoursInput.getValue(), 0) || 0;
            const minutes = Math.max(this.minutesInput.getValue(), 0) || 0;
            const endDate = startDate.clone().add({days: days, hours: hours, minutes: minutes});

            request.startDate = startDate.unix();
            request.endDate = endDate.unix();
        }
        if (!request.contestLongName) {
            return "Please provide the contest long name";
        }

        return request;
    }

    getAjaxUrl() {
        return "/contest/add/";
    }

    action() {
        let request = this.getRequest();
        if (typeof request === "string") {
            // an error occured
            alert(request);
            return;
        }

        Ajax.postJSON(this.getAjaxUrl(), request).then(
            (data) => window.location.replace("/contest/" + data.contestName + "/edit/"),
            (error) => this.messageArea.showMessage(error.message, "red")
        );
    }
}

let CreateContestButton = ActionModalButton(CreateContestModal);

export {CreateContestModal, CreateContestButton};
