import {UI, Link, ActionModal, registerStyle, TimePassedSpan,
        Form, FormField, Select, ActionModalButton, Level, Table, Router} from "../../csabase/js/UI.js";
import {ContestStore} from "../../contest/js/state/ContestStore.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";

import {InterviewStore} from "./state/InterviewStore.js";
import {InterviewTagsStyle, InterviewBubbleStyle, InterviewAppStyle} from "./InterviewStyle.js";
import {autoredraw} from "../../stemjs/src/decorators/AutoRedraw.js";


class CreateInterviewModal extends ActionModal {
    getTitle() {
        return "Interview settings";
    }

    getBody() {

        let durations = [];
        for (let duration of [30, 45, 60, 90, 120]) {
            durations.push({duration: duration, toString: () => duration + " minutes"});
        }
        // Default is 45 minutes
        let defaultDuration = durations[2];

        return [<div>
            <Form style={{marginTop: "10px"}}>
                <FormField ref="durationFormField" label="Duration">
                    <Select ref="durationSelect" options={durations} selected={defaultDuration}/>
                </FormField>
                <FormField ref="difficultyFormField" label="Difficulty">
                    <Select ref="difficultySelect"  options={InterviewStore.possibleDifficulties}
                                                    selected={InterviewStore.defaultDifficulty} />
                </FormField>
            </Form>
        </div>];
    }

    getActionName() {
        return "Create";
    }

    getActionLevel() {
        return Level.SUCCESS;
    }

    action() {
        let request = {
            durationInMinutes: this.durationSelect.get().duration,
            difficulty: this.difficultySelect.get().id,
        };

        Ajax.postJSON("/interview/create_interview/", request).then(
            (data) => window.location.replace("/interview/" + data.interviewId),
            (error) => this.messageArea.showMessage("Error: " + error.message)
        );

    }
}
const CreateInterviewButton = ActionModalButton(CreateInterviewModal);

class InterviewList extends UI.Element {
    extraNodeAttributes(attr) {
        attr.setStyle("height", "50px");
        attr.setStyle("width", "100%");
    }

    render() {
        let interviews = InterviewStore.all().sort((a, b) => {return b.getStartTime() - a.getStartTime()});
        let color = 0;
        let interviewBubbles = [];
        for (let interview of interviews) {
            interviewBubbles.push(<InterviewBubble interview={interview} color={color % 2}/>);
            color = !color;
        }
        if (interviews.length === 0) {
            return [
                <em style={{"font-size": "1.2em", "padding-left": "1%"}}>You have not simulated any interviews.</em>
            ]
        }
        return [
            <InterviewTags/>,
            ...interviewBubbles
        ];
    }

    onMount() {
        super.onMount();
        InterviewStore.addCreateListener(() => {
            this.redraw();
        });
    }
}

@registerStyle(InterviewTagsStyle)
class InterviewTags extends UI.Element {
    extraNodeAttributes(attr) {
        attr.addClass(this.styleSheet.className);
    }

    getTitle() {
        return <div className={this.styleSheet.header}>
            Start Date
        </div>;
    }

    getAuthor() {
        return <div className={this.styleSheet.header}>
            Intended duration
        </div>;
    }

    getReplies() {
        return <div className={this.styleSheet.header}>
            Actual duration
        </div>;
    }

    getViews() {
        return <div className={this.styleSheet.header}>
            Difficulty
        </div>;
    }

    getActivity() {
        return <div className={this.styleSheet.header}>
            Review
        </div>;
    }

    render() {
        return [
            this.getTitle(),
            this.getAuthor(),
            this.getReplies(),
            this.getViews(),
            this.getActivity(),
        ];
    }
}


@autoredraw
@registerStyle(InterviewBubbleStyle)
class InterviewBubble extends UI.Element {
    extraNodeAttributes(attr) {
        attr.addClass(this.options.color ? this.styleSheet.lightBubble : this.styleSheet.darkBubble);
    }

    getInterview() {
        return this.options.interview;
    }

    getStartDate() {
        return [
            <div className={this.styleSheet.element}>
                <TimePassedSpan timeStamp={this.getInterview().getStartTime()} style={{color: "#797979"}}/>
            </div>
        ];
    }

    getFormattedMinutesDuration(seconds) {
        let durationInMinutes = seconds / 60;
        durationInMinutes = Math.floor(durationInMinutes);
        if (durationInMinutes < 1) {
            return "< 1 minute";
        }
        let label = durationInMinutes + " minute";
        if (durationInMinutes != 1) {
            label += "s";
        }
        return label;
    }

    getIntendedDuration() {
        return [
            <div className={this.styleSheet.element}>
                <span style={{color: "#AAA"}}>
                    {this.getFormattedMinutesDuration(this.getInterview().getExpectedDuration())}
                </span>
            </div>
        ];
    }

    getActualDuration() {
        return [
            <div className={this.styleSheet.element}>
                <span style={{color: "#AAA"}}>
                    {this.getFormattedMinutesDuration(this.getInterview().getDuration())}
                </span>
            </div>
        ];
    }

    getDifficulty() {
        return [
            <div className={this.styleSheet.element}>
                {UI.T(this.getInterview().getDifficulty().toString())}
            </div>
        ];
    }

    getReview() {
        return [
            <div className={this.styleSheet.element}>
                N/A
            </div>
        ]
    }

    render() {
        return [
            this.getStartDate(),
            this.getIntendedDuration(),
            this.getActualDuration(),
            this.getDifficulty(),
            this.getReview(),
        ];
    }

    onMount() {
        super.onMount();
        this.addClickListener(() => {
            Router.changeURL(["interview", this.getInterview().id]);
        });
    }
}

class InterviewContestList extends UI.Element {
    getTableColumns() {
        let numberStyle = {
            textAlign: "right",
            width: "1%",
            verticalAlign: "middle",
        };

        return [{
            value: contest => <Link href={"/contest/" + contest.name} value={contest.getName()}/>,
            headerName: "Name",
            headerStyle: {verticalAlign: "middle", width: "70%"},
            cellStyle: {verticalAlign: "middle"},
        }, {
            value: contest => contest.getUser(USER.id).totalScore,
            headerName: "Your score",
            headerStyle: {verticalAlign: "middle", textAlign: "right", width: "30%"},
            cellStyle: numberStyle
        }];
    }

    getContests() {
        return ContestStore.all().filter(contest => contest.systemGenerated &&
                                                    contest.originArchiveId === this.options.interviewArchiveId &&
                                                    contest.hasFinished() &&
                                                    contest.getUser(USER.id))
                                 .sort((a, b) => b.getStartTime() - a.getStartTime());
    }

    render() {
        const contests =this.getContests();
        if (!contests.length) {
            return <em style={{"font-size": "1.2em", "padding-left": "1%"}}>
                        You have not participated in any hourly interview contests.
                    </em>;
        }
        return <Table columns={this.getTableColumns()} entries={contests} />;
    }
}

@registerStyle(InterviewAppStyle)
export class InterviewApp extends UI.Element {
    extraNodeAttributes(attr) {
        attr.setStyle("margin-left", "8%");
        attr.setStyle("width", "84%");
    }

    getTitle() {
        return [
            <div className={this.styleSheet.title}>
                My interviews
            </div>
        ];
    }

    getButton() {
        return [
            <CreateInterviewButton label="New interview" level={Level.SUCCESS} className={this.styleSheet.button}/>,
        ];
    }

    getInterviewList() {
        return [
            <InterviewList />,
        ];
    }

    getContestList() {
        return <InterviewContestList interviewArchiveId={this.options.interviewArchiveId} />;
    }

    render() {
        return [
            <div style={{"float": "left", "width": "49%"}}>
                <div className={this.styleSheet.header}>
                    {this.getTitle()}
                    {this.getButton()}
                </div>
                {this.getInterviewList()}
            </div>,
            <div style={{"float": "right", "width": "49%"}}>
                <div className={this.styleSheet.header}>
                    <div className={this.styleSheet.title}>
                        Hourly interviews contests
                    </div>
                </div>
                {this.getContestList()}
            </div>
        ];
    }
}
