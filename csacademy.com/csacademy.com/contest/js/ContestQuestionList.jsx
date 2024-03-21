import {UI} from "../../stemjs/src/ui/UIBase.js";
import {CardPanel} from "../../stemjs/src/ui/CardPanel.jsx";
import {FormField} from "../../stemjs/src/ui/form/Form.jsx";
import {TextArea} from "../../stemjs/src/ui/input/Input.jsx";
import {ButtonGroup} from "../../stemjs/src/ui/button/ButtonGroup.jsx";
import {Button, RawCheckboxInput, Select, ActionModal, ActionModalButton, registerStyle, Level, Size, Switcher, Theme, Badge} from "../../csabase/js/UI.js";

import {CallThrottler} from "../../stemjs/src/base/Utils.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {StemDate} from "../../stemjs/src/time/Date.js";
import {UserHandle} from "../../csaaccounts/js/UserHandle.jsx";
import {CommentVotingWidgetWithThumbs} from "../../establishment/chat/js/VotingWidget.jsx";

import {ContestTaskStore} from "./state/ContestTaskStore";
import {ContestQuestionStore} from "./state/ContestQuestionStore";
import {ContestQuestionListStyle} from "./ContestQuestionListStyle";
import {MarkupRenderer} from "../../stemjs/src/markup/MarkupRenderer";


const FilterOptions = {
    ALL: "All",
    GENERAL: "General"
};

function getQuestionsForFilter(filter, contest) {
    const questions = contest.getQuestions();
    if (filter === FilterOptions.ALL) {
        return questions;
    }
    if (filter === FilterOptions.GENERAL) {
        return questions.filter(question => !question.contestTaskId);
    }
    const contestTask = contest.getContestTasks().find(contestTask => contestTask.longName === filter);
    return questions.filter(question => question.contestTaskId === contestTask.id);
}


@registerStyle(ContestQuestionListStyle)
class ContestQuestionList extends UI.Element {
    getDefaultOptions() {
        return Object.assign({
            displayListTitle: true,
        }, super.getDefaultOptions());
    }

    getContest() {
        return this.options.contest;
    }

    getQuestions() {
        return this.getContest().getQuestions();
    }

    extraNodeAttributes(attr) {
        attr.addClass(this.styleSheet.contestQuestionList);
    }

    renderQuestion(question) {
        if (!question.shouldAppear()) {
            return null;
        }
        let askedTime = StemDate.format(question.timeAsked, "HH:mm:ss");
        let answeredTime;

        let answeredStatus;
        if (question.replyTime) {
            answeredTime = StemDate.format(question.replyTime, "HH:mm:ss");
            answeredStatus = <i>
                {` (Answered at ${answeredTime})`}
            </i>;
        }

        let questionType;
        if (question.isPublic) {
            questionType = "Public Answer";
        }

        let level = Level.PRIMARY;

        let answerElement;
        if (question.isAnswered()) {
            level = Level.SUCCESS;
            answerElement = <div>
                <strong>Answer: </strong>
                <MarkupRenderer value={question.reply} />
            </div>;
        }

        if (question.isInvalid) {
            level = Level.DANGER;
            answerElement = <div>
                <strong>Invalid question</strong>
            </div>;
        }

        let target = question.contestTaskId ? ContestTaskStore.get(question.contestTaskId).longName : FilterOptions.GENERAL;

        let votingWidget = (question.isPublic && question.isAnswered()) && <CommentVotingWidgetWithThumbs height={40} message={question}/>;

        let title = (
            <div>
                <div>
                    {askedTime}
                    {answeredStatus}
                    {": "}
                    <strong>{target}</strong>
                </div>
                <div>
                    <strong>{questionType}</strong>
                </div>
            </div>
        );

        return (
            <div className={this.styleSheet.cardPanelContainer} key={question.id}>
                <CardPanel title={title}
                           level={level}
                           bodyStyle={this.styleSheet.cardPanelBodyStyle}
                           id={"question" + question.id}>
                    <p>
                        <UserHandle userId={question.userAskedId}/>
                        {": " + question.question }
                    </p>
                    { answerElement }
                    { votingWidget || null }
                </CardPanel>
            </div>
        );
    }

    render() {
        // Sort questions by latest activity
        const userQuestions = this.getQuestions().filter(question => question.isAskedByCurrentUser()).sort((x, y) => {
            return Math.max(y.timeAsked, y.replyTime || 0) -
                   Math.max(x.timeAsked, x.replyTime || 0);
        });
        const publicQuestions = this.getQuestions().filter(question => !question.isAskedByCurrentUser()).sort((x, y) => {
            return Math.max(y.timeAsked, y.replyTime || 0) -
                   Math.max(x.timeAsked, x.replyTime || 0);
        });
        const recentQuestions = publicQuestions.slice(0,2);
        const sortedPublicQuestionsByBalance = publicQuestions.length > 2 ? publicQuestions.slice(recentQuestions.length, publicQuestions.length).sort((x, y) => {
            return y.getVotesBalance() - x.getVotesBalance();
        }) : [];

        const yourQuestionsTitle = this.options.displayListTitle && userQuestions.length ? <h4 style={{textAlign: "center", borderBottom: "2px solid black"}}>Own questions</h4> : null;
        const publicQuestionsTitle = this.options.displayListTitle && publicQuestions.length ? <h4 style={{textAlign: "center", borderBottom: "2px solid black"}}>Public questions</h4> : null;
        return [
            yourQuestionsTitle,
            userQuestions.map(this.renderQuestion, this),
            publicQuestionsTitle,
            recentQuestions.concat(sortedPublicQuestionsByBalance).map(this.renderQuestion, this),
        ];
    }

    attachQuestionListeners() {
        const questionCallback = (question) => {
            if (question.contestId === this.getContest().id) {
                this.redraw();
            }
        };
        this.attachCreateListener(ContestQuestionStore, questionCallback);
        this.attachListener(this.getContest(), "updateQuestion", questionCallback);
    }

    onMount() {
        this.attachQuestionListeners();
    }
}


class ContestTaskQuestionList extends ContestQuestionList {
    getQuestions() {
        return this.getContest().getQuestions().filter((question) => {
            return question.contestTaskId === this.options.contestTaskId;
        });
    }
}


class AdminContestQuestionCard extends CardPanel {
    // getDefaultOptions() {
    //     return Object.assign({}, super.getDefaultOptions(), {
    //         bodyStyle: {
    //             padding: "3px",
    //         }
    //     });
    // }

    // extraNodeAttributes(attr) {
    //     super.extraNodeAttributes(attr);
    //     attr.addClass(this.styleSheet.cardPanelContainer);
    // }

    getLevel() {
        if (this.options.question) {
            if (this.options.question.isInvalid) {
                return Level.DANGER;
            }
            if (this.options.question.isAnswered()) {
                return Level.SUCCESS;
            }
        }
        return Level.PRIMARY;
    }

    getTitle() {
        const question = this.options.question;
        const askedTime = StemDate.format(question.timeAsked, "HH:mm:ss");

        let answeredStatus, answeredTime;
        if (question.replyTime) {
            answeredTime = StemDate.format(question.replyTime, "HH:mm:ss");
            answeredStatus = <i>
                (Answered at {answeredTime} by <UserHandle id={question.replyUserId}/>)
            </i>;
        }

        let target = question.contestTaskId ? ContestTaskStore.get(question.contestTaskId).longName : FilterOptions.GENERAL;

        return <div>
            {askedTime}
            {answeredStatus}
            {": "}
            <strong>{target}</strong>
        </div>;
    }

    logReply(redraw=false) {
        const xhrPromise = Ajax.postJSON("/contest/question_typing_state_change/", {
            questionId: this.options.question.id,
            contestId: this.options.question.contestId,
            reply: this.answerField.getValue(),
            sessionId: this.sessionId
        });
        if (redraw) {
            xhrPromise.then(() => this.redraw());
        }
    }

    render() {
        const question = this.options.question;
        let someoneTypingArea, isReadonly = false, backgroundColor = Theme.props.COLOR_BACKGROUND;
        if (question.replyUserId && question.replyUserId !== USER.id && !question.isAnswered() && !question.isInvalid) {
            isReadonly = true;
            backgroundColor = Theme.props.COLOR_BACKGROUND_ALTERNATIVE;
            someoneTypingArea = <Badge level={Level.WARNING} key="someoneTypingArea" style={{marginBottom: "10px"}}>
                <em><UserHandle userId={question.replyUserId}/> is typing a response!</em>
                <Button level={Level.PRIMARY} size={Size.EXTRA_SMALL}
                        onClick={() => this.logReply(true)} style={{marginLeft: "3px"}}>
                    Take over
                </Button>
            </Badge>;
        }

        const answerElement = (
            <div>
                <FormField inline={false} style={{margin: "initial", padding: "0"}}>
                    <strong style={{display: "block"}}>Answer: </strong>
                    {someoneTypingArea}
                    <TextArea ref="answerField" rows="5" readOnly={isReadonly} value={question.reply || ""}
                              style={{height: "100px", maxWidth: "100%", backgroundColor: backgroundColor}} />
                </FormField>
                <ButtonGroup size={Size.SMALL}>
                    <Button ref="answerQuestionButton" level={Level.PRIMARY} disabled={isReadonly}>
                        {question.isAnswered() ? "Change answer" : "Answer"}
                    </Button>
                    <Button ref="invalidQuestionButton" level={Level.DANGER} disabled={isReadonly}>
                        Invalid question
                    </Button>
                </ButtonGroup>
                <div style={{paddingTop: "10px"}}>
                    <strong>
                        Public answer<RawCheckboxInput ref="publicAnswerCheckbox" initialValue={question.isPublic}/>
                    </strong>
                </div>
            </div>
        );

        return [
            <UserHandle userId={question.userAskedId}/>,
            <strong>{": "}</strong>,
            question.question,
            answerElement
        ];
    }

    onMount() {
        super.onMount();

        this.sessionId = Math.random().toString().substr(2);
        this.attachEventListener(this.options.question, "typingStateChange", (event) => {
            if (event.sessionId !== this.sessionId) {
                this.redraw();
            }
        });

        const logReplyThrottler = new CallThrottler({throttle: 500});
        const logReplyThrottled = logReplyThrottler.wrap(() => this.logReply());
        this.answerField.addNodeListener("input", logReplyThrottled);

        this.answerQuestionButton.addClickListener(() => {
            if (!confirm("Are you sure you want to answer this question?")) {
                return;
            }
            this.answerQuestion();
        });
        this.invalidQuestionButton.addClickListener(() => {
            if (!confirm("Are you sure you want to invalidate this question? This cannot be undone!")) {
                return;
            }
            this.answerQuestion(true);
        });
    }

    answerQuestion(invalidQuestion) {
        let answer = this.answerField.getValue();
        let isPublicAnswer = this.publicAnswerCheckbox.getValue();

        let request = {
            contestId: this.options.contest.id,
            questionId: this.options.question.id,
        };

        if (invalidQuestion) {
            request.isInvalid = true;
        } else {
            if (!answer) return;
            if (isPublicAnswer) {
                request.isPublic = true;
            }
            request.reply = answer;
        }

        Ajax.postJSON("/contest/answer_question/", request);
    };
}


class AdminContestQuestionList extends ContestQuestionList {
    getDefaultOptions() {
        return Object.assign({}, super.getDefaultOptions(), {
            displayListTitle: false,
        });
    }

    renderQuestion(question) {
        return <div className={this.styleSheet.cardPanelContainer} key={question.id}>
            <AdminContestQuestionCard
                question={question}
                contest={this.getContest()}
                bodyStyle={{padding: "15px"}} />
        </div>;
    }

    getQuestions() {
        return getQuestionsForFilter(this.options.filter || FilterOptions.ALL, this.getContest());
    }
}


class AnsweredContestQuestionList extends AdminContestQuestionList {
    getQuestions() {
        let questions = super.getQuestions();

        questions = questions.filter(a => (a.isAnswered() || a.isInvalid))
                             .sort((a, b) => {return b.replyTime - a.replyTime;});
        if (questions.length > 20) {
            questions = questions.slice(0, 20);
        }
        return questions;
    }
}


class UnansweredContestQuestionList extends AdminContestQuestionList {
    getQuestions() {
        let questions = super.getQuestions();

        return questions.filter(a => !(a.isAnswered() || a.isInvalid)).sort((a, b) => a.id - b.id);
    }
}


@registerStyle(ContestQuestionListStyle)
class FilterOption extends UI.Element {
    extraNodeAttributes(attr) {
        attr.addClass(this.styleSheet.filterOption);
    }

    focus() {
        this.removeClass(this.styleSheet.filterOption);
        this.addClass(this.styleSheet.filterOptionFocused);
    }

    unfocus() {
        this.removeClass(this.styleSheet.filterOptionFocused);
        this.addClass(this.styleSheet.filterOption);
    }

    getNumQuestions() {
        return getQuestionsForFilter(this.options.filter, this.options.contest).filter(a => !(a.isAnswered() || a.isInvalid)).length;
    }

    render() {
        const numQuestions = this.getNumQuestions();
        let badge = null;
        if (numQuestions) {
            badge = <span style={{paddingRight: "5px"}}><Badge level={Level.DANGER}>{numQuestions}</Badge></span>
        }
        return [
            <div>
                {[badge, this.options.filter]}
            </div>
        ];
    }

    onMount() {
        this.attachCreateListener(ContestQuestionStore, (contestQuestion) => {
            if (this.options.contest.id === contestQuestion.contestId) {
                this.redraw();
            }
        });
        this.attachListener(this.options.contest, "updateQuestion", () => this.redraw());
    }
}


@registerStyle(ContestQuestionListStyle)
class AdminContestQuestionPanel extends UI.Element {
    getContestTasks() {
        return this.options.contest.getContestTasks();
    }

    getFilterOptions() {
        let options = [FilterOptions.ALL, FilterOptions.GENERAL];
        for (let contestTask of this.getContestTasks()) {
            options.push(contestTask.longName);
        }
        return options;
    }

    renderQuestionListForFilter(filter) {
        return  <div className={this.styleSheet.questionsContainer} ref={"switcherChild" + filter}>
                    <div className={this.styleSheet.questionsColumnContainer}>
                        <UnansweredContestQuestionList
                            filter={filter}
                            ref="unansweredQuestionList"
                            contest={this.options.contest} />
                    </div>
                    <div className={this.styleSheet.questionsColumnContainer}>
                        <AnsweredContestQuestionList
                            filter={filter}
                            ref="answeredQuestionList"
                            contest={this.options.contest} />
                    </div>
                </div>
    }

    changeFilter(filterOption) {
        for (const filter of this.getFilterOptions()) {
            this["filter" + filter].unfocus();
        }
        this.filterSwitcher.setActive(this["switcherChild" + filterOption]);
        this["filter" + filterOption].focus();
    }

    render() {
        return [
            <div className={this.styleSheet.filterContainer}>{
                this.getFilterOptions().map(
                    filterOption => <FilterOption onClick={() => this.changeFilter(filterOption)}
                                                  filter={filterOption} contest={this.options.contest}
                                                  ref={"filter" + filterOption} />
                )
            }</div>,
            <div className={this.styleSheet.filterSwitcherContainer}>
                <Switcher className={this.styleSheet.filterSwitcher} ref="filterSwitcher">{
                    this.getFilterOptions().map(
                        filterOption => this.renderQuestionListForFilter(filterOption)
                    )
                }</Switcher>
            </div>,
            <div style={{clear: "both"}}/>
        ];
    }

    onMount() {
        this.changeFilter(FilterOptions.ALL);
    }
}

class AskQuestionModal extends ActionModal {
    getTitle() {
        return "Ask question";
    }

    getActionName() {
        return "Ask question";
    }

    getBody() {
        let taskOptions = this.options.contest.getContestTasks();
        taskOptions.push({
            general: true,
            toString: () => FilterOptions.GENERAL,
        });
        return [
            <FormField label="Task name">
                <Select ref="contestTaskSelect" className="form-control" options={taskOptions}/>
            </FormField>,
            <TextArea rows="2" ref="questionTextField" placeholder="Type question..."
                         style={{resize: "vertical", width: "100%"}}/>
        ];
    }

    action() {
        let question = this.questionTextField.getValue();
        let contestTask = this.contestTaskSelect.get();

        let request = {
            contestId: this.options.contest.id,
            question: question,
        };

        if (!contestTask.general) {
            request.contestTaskId = contestTask.id;
        }

        Ajax.postJSON("/contest/ask_question/", request);
        this.hide();
    }
}

class AskTaskQuestionModal extends AskQuestionModal {
    getBody() {
        return [
            <TextArea rows="2" ref="questionTextField" placeholder="Type question..."
                      style={{resize: "vertical", width: "100%"}}/>
        ];
    }

    action() {
        let question = this.questionTextField.getValue();
        let {contest, contestTask} = this.options;

        let request = {
            contestId: contest.id,
            question: question,
        };

        request.contestTaskId = contestTask.id;

        Ajax.postJSON("/contest/ask_question/", request);
        this.hide();
    }
}

const AskQuestionButton = ActionModalButton(AskQuestionModal);
const AskTaskQuestionButton = ActionModalButton(AskTaskQuestionModal);

export {ContestQuestionList, ContestTaskQuestionList, AskQuestionButton, AskTaskQuestionButton, AdminContestQuestionPanel};
