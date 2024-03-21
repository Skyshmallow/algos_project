import {UI, TextArea, Button, Link, CardPanel, Router, StyleElement, StyleInstance, Level, Size} from "./UI.js";
import {PopupSpan} from "../../establishment/content/js/PopupSpan.jsx";
import {BlogEntryStore} from "../../establishment/blog/js/state/BlogStore.js";
import {BlogEntryPreview} from "../../establishment/blog/js/BlogPanel.jsx";
import {UserHandle} from "../../csaaccounts/js/UserHandle.jsx";
import {ContestStore} from "../../contest/js/state/ContestStore.js";
import {ContestUserStore} from "../../contest/js/state/ContestUserStore.js";
import {MinRanking} from "../../csacontent/js/GlobalRatings.jsx";
import "Translation";
import {LoginModal} from "../../establishment/accounts/js/LoginModal.jsx";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {INTERVIEWS_ARCHIVE_ID, ALGORITHMS_ARCHIVE_ID} from "./state/CSASettings.js";
import {QuestionnaireButton} from "../../establishment/content/js/QuestionnairePanel.jsx";
import {Device} from "../../stemjs/src/base/Device.js";
import {ContestTimeCounter} from "../../contest/js/ContestTimeCounter.jsx";


class FrontPagePanel extends UI.Element {
    extraNodeAttributes(attr) {
        attr.setStyle({
            margin: "0 auto",
            width: "90%",
            maxWidth: "1000px",
        });
    }

    render() {
        let panelStyle = (width) => { return {
            width: width + "%",
            display: "inline-block",
            verticalAlign:"top",
            textAlign: "none",
            whiteSpace: "initial",
            padding: "0px 10px",
            marginBottom: "-70px",
        }; };

        const miniBlogPanel = [
            <div ref="leftPanelChild"
                 style={{
                     height: "50px",
                     lineHeight: "50px",
                     fontSize: "1.8em",
                     marginBottom: "-30px",
                     paddingLeft: "16px",
                 }}>
                {UI.T("Latest Blog Entries")}
            </div>,
            <MiniBlog ref="miniBlog"/>
        ];

        const styleElements = (
            <StyleElement>
                <StyleInstance selector="#frontPage h1" attributes={{"font-size": "1.65em", "margin-top": "9px", "margin-bottom": "5px"}}/>
                <StyleInstance selector="#frontPage h2" attributes={{"font-size": "1.15em", "margin-top": "7px", "margin-bottom": "5px"}}/>
                <StyleInstance selector="#frontPage h3" attributes={{"font-size": "0.88em", "margin-top": "7px", "margin-bottom": "5px"}}/>
                <StyleInstance selector="#frontPage h4" attributes={{"font-size": "0.71em", "margin-top": "7px", "margin-bottom": "5px"}}/>
                <StyleInstance selector="#frontPage h5" attributes={{"font-size": "0.60em", "margin-top": "7px", "margin-bottom": "5px"}}/>
                <StyleInstance selector=".panel-body" attributes={{"padding": "5px"}}/>
            </StyleElement>
        );

        if (!Device.isMobileDevice()) {
            return [
                <div ref="leftPanel" style={panelStyle(76)}>
                    {miniBlogPanel}
                </div>,
                <div ref="rightPanel" style={Object.assign({}, panelStyle(23), {marginTop: "63.5px",})}>
                    <AnswerQuestionnaire style={{marginBottom: "40px"}}/>
                    <div style={{marginBottom: "40px"}}>
                        <UpcomingContestsPanel style={{"margin-bottom": "40px", marginTop: "30px"}}/>
                        <HourlyContestsArea />
                    </div>
                    <LeaderboardPanel ref="leaderboard" style={{marginBottom: "40px"}} bodyStyle={{padding: 0,}}/>
                    <SuggestionPanel ref="suggestionPanel" style={{marginBottom: "40px"}}/>
                </div>,
                styleElements,
            ];
        } else {
            return [
                <div ref="leftPanel" style={panelStyle(76)}>
                    <AnswerQuestionnaire style={{marginBottom: "40px"}}/>
                    <div style={{marginBottom: "40px"}}>
                        <UpcomingContestsPanel style={{"margin-bottom": "40px", marginTop: "30px"}}/>
                    </div>
                </div>,
                <div ref="rightPanel" style={Object.assign({}, panelStyle(23), {marginTop: "63.5px",})}>
                    {miniBlogPanel}
                </div>,
                <div style={Object.assign({}, panelStyle(100), {marginTop: "63.5px"})}>
                    <LeaderboardPanel ref="leaderboard" bodyStyle={{padding: 0,}}/>
                    <HourlyContestsArea style={{marginTop: "40px"}}/>
                    <SuggestionPanel ref="suggestionPanel" style={{marginTop: "40px", marginBottom: "40px"}}/>
                </div>,
                styleElements,
            ];
        }
    }

    recalculateDimensions() {
        let parentSize = this.getWidth();
        if (parentSize <= 900) {
            this.setStyle("white-space", "initial");
            this.rightPanel.setWidth("100%");
            this.leftPanel.setWidth("100%");
            return;
        }
        this.leftPanel.setWidth("76%");
        this.rightPanel.setWidth("23%");
        this.setStyle("white-space", "nowrap");
    }

    onMount() {
        setTimeout(() => {
            this.recalculateDimensions();
        }, 0);
        window.addEventListener("resize", () => {
            this.recalculateDimensions();
        });
        this.addListener("show", () => {
            this.recalculateDimensions();
        });
    }
}

class MiniBlog extends UI.Element {
    render() {
        let entries = [];

        let blogEntries = BlogEntryStore.all().sort((a, b) => {
            return b.getArticle().dateCreated - a.getArticle().dateCreated;
        });

        for (let entry of blogEntries) {
            entries.push(<BlogEntryPreview key={entry.id} entryId={entry.id} urlPrefix="/blog/" style={{marginBottom: "-20px !important",}} />);
        }

        return entries;
    }
}

class SuggestionPanel extends CardPanel {
    getTitle() {
        return UI.T("Feedback");
    }

    render() {
        this.options.children = [<div style={{textAlign: "center", fontSize: "1.1em", height: "30px", lineHeight: "30px",}} ref="titleHeader">{UI.T("Tell us what you think!")}</div>,
            <div ref="writingSection" className="text-center">
                <TextArea ref="textInput" style={{overflow:"auto", resize:"none", width:"100%", maxWidth: "90%", height: "30px", borderRadius: "0px",}}/>
                <Button ref="sendFeedbackButton" style={{"margin": "2px", backgroundColor: "#fff", border: "0", color: "#337ab7", padding: "0", marginTop: "2px",}} icon="book" level={Level.PRIMARY}
                           size={Size.MEDIUM} onClick={() => this.sendFeedback()} label={UI.T("Send feedback")} />
            </div>
        ];
        return this.options.children;
    }

    afterFeedbackSent() {
        this.titleHeader.hide();
        this.textInput.hide();
        this.sendFeedbackButton.setLabel(UI.T("Thanks for your feedback!"));
        this.sendFeedbackButton.setLevel(Level.SUCCESS);
        this.sendFeedbackButton.setIcon("check-square");
        this.sendFeedbackButton.disable();
        this.options.sentFeedback = true;
    }

    sendFeedback() {
        if (!USER.isAuthenticated) {
            LoginModal.show();
            return;
        }
        let message = (this.textInput.getValue() || "").trim();
        if (message.length === 0 || this.options.sentFeedback) {
            return;
        }

        let request = {
            message: message,
            clientMessage: "{}"
        };

        Ajax.postJSON("/send_feedback/", request).then(
            () => this.afterFeedbackSent()
        );
    }
}

class LeaderboardPanel extends CardPanel {
    getTitle() {
        return UI.T("Leaderboard");
    }

    render() {
        return [
            <MinRanking style={{fontSize: "0.9em", padding: "0 !important", borderTop: "0", borderBottom: "1px solid #ddd",}}/>,
            <div style={{textAlign: "center", height: "32px", lineHeight: "32px", padding: "0 !important",}}>
                <Link href={"/ratings/"} value={UI.T("See full leaderboard")} />
            </div>];
    }
}

class HourlyContestWidget extends UI.Element {
    getContests() {
        let hourlyContests = ContestStore.all().filter(contest => (contest.systemGenerated && !contest.hasFinished() &&
                                                                    contest.originArchiveId === this.options.originArchiveId))
                                                .sort((a, b) => {
                                                    return a.getStartTime() - b.getStartTime();
                                                });
        if (hourlyContests.length === 0) {
            return null;
        }
        return hourlyContests;
    }

    goToContest(contest) {
        if (contest.isRunning() || contest.getUser(USER.id)) {
            Router.changeURL(["contest", contest.name]);
            return;
        }
        if (!USER.isAuthenticated) {
            LoginModal.show();
            return;
        }

        let request = {
            contestId: contest.id,
        };

        Ajax.postJSON("/contest/register/", request).then(
            () => this.redraw()
        );
    }

    render() {
        let nextContests = this.getContests();
        let children = [<div style={{"width": "100%", "font-size": ".9em", textTransform: "uppercase", height: "28px", fontWeight: "bold"}}>
                            {this.options.name}
                        </div>];
        let containerStyle = {
            flex: "1",
            padding: "4px",
            minHeight: "120px",
            verticalAlign: "middle",
            position: "relative",
        };

        let emStyle = {
            position: "absolute",
            width: "100%",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
        };

        if (!nextContests) {
            children.push(<div style={containerStyle}><em style={emStyle}>{UI.T("No contest scheduled")}</em></div>);
        } else {
            if (nextContests.length === 1 && !nextContests[0].isRunning()) {
                children.push(<div style={containerStyle}><em style={emStyle}>{UI.T("No contest running")}</em></div>);
            }
            for (let nextContest of nextContests) {
                let label = UI.T("Register"), title = UI.T("Next contest");
                let usersRegistered, usersRegisteredSpan;
                if (nextContest.isRunning()) {
                    title = UI.T("Current contest");
                } else {
                    usersRegistered = ContestUserStore.all().filter((contestUser) => (contestUser.contestId === nextContest.id));
                    if (usersRegistered.length > 0) {
                        usersRegisteredSpan = <div style={{"display": "block", "position": "relative"}}>
                                                <PopupSpan style={{position: "relative", overflow: "hidden", "cursor": "pointer", "color": "blue"}}
                                                            popupContent={
                                                                () => usersRegistered.map(
                                                                        user => <div style={{"width": "100%", "height": "25px", "line-height": "25px"}}>
                                                                                    <UserHandle userId={user.userId} />
                                                                                </div>
                                                                      )
                                                            }>
                                                        {UI.T("Users registered")}: {usersRegistered.length}
                                                </PopupSpan>
                                            </div>
                    }
                }
                if (nextContest.isRunning() || nextContest.getUser(USER.id)) {
                    label = UI.T("Go to contest");
                }

                children.push(<div style={containerStyle}>
                              <h5 style={{textTransform: "uppercase", fontWeight: "bold", fontSize: "90%"}}>
                        {title}
                    </h5>
                    <div>
                        <ContestTimeCounter contest={nextContest} />
                    </div>
                    <div>
                        <Button onClick={() => {this.goToContest(nextContest);}} level={Level.PRIMARY} size={Size.SMALL}>
                            {label}
                        </Button>
                    </div>
                    {usersRegisteredSpan}
                </div>);
            }
        }
        return <div style={{width: "100%", display: "flex", flexDirection: "column", textAlign: "center"}}>
            {children}
        </div>;
    }

    onMount() {
        super.onMount();
        ContestStore.addCreateListener(() => {
            this.redraw();
        });
        ContestUserStore.addCreateListener((contestUser) => {
            let contest = contestUser.getContest();
            if (contest && contest.systemGenerated && !contest.hasFinished() && contest.originArchiveId === this.options.originArchiveId) {
                this.redraw();
            }
        });
        ContestStore.addDeleteListener(() => {
            this.redraw();
        });
    }
}

class UpcomingContestsPanel extends CardPanel {
    getTitle() {
        return UI.T("Upcoming Contests");
    }

    render() {
        const contests = ContestStore.all().filter(contest => (!contest.systemGenerated && !contest.hasFinished() && !contest.isInfinite()));
        let list = [];
        if (contests.length) {
            let startedContests = contests.filter(contest => contest.hasStarted());
            let futureContests = contests.filter(contest => !contest.hasStarted());
            startedContests = startedContests.sort((contest1, contest2) => {return - contest2.getEndTime() + contest1.getEndTime();});
            futureContests = futureContests.sort((contest1, contest2) => {return - contest2.getStartTime() + contest1.getStartTime();});
            list = startedContests
                .concat(futureContests)
                .map(contest => <div style={{border: "2px  #ddd", borderRadius: "8px", textAlign: "center", margin: "1px"}}>
                     <div style={{
                         fontSize: "1.3em",
                     }}>
                     <Link href={"/contest/" + contest.name} value={contest.longName}/>
                     </div>
                     <div style={{
                         fontSize: "1em",
                         paddingTop: "8px",
                     }}>
                     {contest.getFormattedStartTime()}
                     </div>
                     <div style={{
                         fontSize: "1em",
                         paddingTop: "8px",
                         fontWeight: "bold",
                         fontStyle: "italic",
                     }}>
                         <ContestTimeCounter contest={contest} />
                     </div>
                     </div>
                    );
        } else {
            list.push(<div style={{textAlign: "center"}}>{UI.T("No upcoming contests.")}</div>);
        }
        list.push(<div style={{textAlign: "center", paddingTop: "8px",}}><Link href={"/contests/"} value={UI.T("See full contests list")} /></div>);
        return <div style={{padding: "8px"}}>{list}</div>;
    }
}

class AnswerQuestionnaire extends UI.Element {
    render() {
        return [
            <CardPanel title={UI.T("Contest Preferences Survey")}>
                <div style={{
                    padding: "8px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                }}>
                    <div style={{paddingBottom: "8px"}}>
                        Please take a couple of minutes to answer a few questions regarding the CS Academy contests.
                    </div>
                    <QuestionnaireButton questionnaireId={2}
                                         label="Take the Survey" />
                </div>
            </CardPanel>
        ];
    }
}

class HourlyContestsArea extends UI.Element {
    render() {
        let panelStyle = {
            flex: "1",
            paddingTop: "8px",
            paddingBottom: "8px",
        };

        return [
            <CardPanel title={UI.T("Hourly Contests")} style={{display: "flex", flexDirection: "column"}} bodyStyle={{display: "flex", flex: "1"}}>
                <HourlyContestWidget originArchiveId={ALGORITHMS_ARCHIVE_ID} name={UI.T("Algorithms")} style={panelStyle}/>
                <HourlyContestWidget originArchiveId={INTERVIEWS_ARCHIVE_ID} name={UI.T("Interviews")} style={panelStyle}/>
            </CardPanel>
        ];
    }
}

class UpcomingContestsArea extends UI.Element {
    render() {
        return [
            <UpcomingContestsPanel style={{"margin-bottom": "40px", marginTop: "30px"}}/>,
            <HourlyContestsArea />,
        ];
    }
}

export {FrontPagePanel};
