import {UI} from "../../stemjs/src/ui/UIBase.js";
import {registerStyle} from "../../stemjs/src/ui/style/Theme.js";
import {CardPanel} from "../../stemjs/src/ui/CardPanel.jsx";
import {RowList} from "../../stemjs/src/ui/RowList.jsx"
import {Button} from "../../stemjs/src/ui/button/Button.jsx";
import {RawHTML} from "../../stemjs/src/ui/RawHTML.jsx";
import {Level} from "../../stemjs/src/ui/Constants.js";
import {ArticleRenderer} from "../../establishment/content/js/ArticleRenderer.jsx";
import {MarkupClassMap} from "../../stemjs/src/markup/MarkupRenderer.js";
import {StemDate} from "../../stemjs/src/time/Date.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {LoginModal} from "../../establishment/accounts/js/LoginModal.jsx";

import {VirtualParticipationButton} from "./ContestList.jsx";
import {ContestSummaryStyle} from "./ContestWidgetStyle.js";
import {Link} from "../../stemjs/src/ui/primitives/Link.jsx";


@registerStyle(ContestSummaryStyle)
export class ContestSummary extends UI.Element {
    getInfoLines() {
        const {contest} = this.options;
        const stats = contest.getStatistics() || {};
        return [
            {label: UI.T("Users Registered"), value: contest.getNumUsers() || "N/A"},
            {label: UI.T("Users Online"), value: stats.numUsersOnline || "N/A"},
            {label: UI.T("Submissions"), value: stats.numSubmissions || "N/A"},
            {label: UI.T("Example Runs"), value: stats.numExampleRuns || "N/A"},
            {label: UI.T("Compiles"), value: stats.numCompiles || "N/A"},
            {label: UI.T("Custom Runs"), value: stats.numCustomRuns || "N/A"},
        ].filter(infoLine => infoLine.value !== "0" && infoLine.value !== "N/A");
    }

    getInfo(showRegisterButton) {
        const {contest} = this.options;

        const infoLines = this.getInfoLines();

        return [
            <div className={this.styleSheet.label}>
                {UI.T("Start time")}: {contest.getFormattedStartTime()}
            </div>,
            <div className={this.styleSheet.label}>
                {UI.T("Duration")}: {contest.getFormattedDuration()}
            </div>,

            showRegisterButton && this.getRegisterButton(),

            (infoLines.length > 0) && <div className={this.styleSheet.statisticsPanelContainer}>
                <CardPanel title="Contest statistics"
                           bodyStyle={this.styleSheet.cardPanelBodyStyle}>
                    <RowList rows={infoLines}
                             rowParser={(infoLine) => {
                                 return (
                                     <div className={this.styleSheet.cardPanelRow}>
                                         <span>{infoLine.label}</span>
                                         <span>{infoLine.value}</span>
                                     </div>
                                 );
                             }}
                    />
                </CardPanel>
            </div>
        ];
    }

    getRegisterButton() {
        const {contest, baseContest} = this.options;
        if (!contest.hasFinished()) {
            let userRegistered = contest.getUser(USER.id);
            return <Button level={Level.INFO}
                           label={userRegistered ? UI.T("Registered") : UI.T("Register")}
                           onClick={() => this.registerUser()} style={{marginRight: "5px", marginTop: "10px"}}
                           disabled={userRegistered}/>;
        }
        if (!contest.isVirtual() && baseContest) {
            //TODO: actually check if there's a virtual contest
            return <VirtualParticipationButton modalOptions={{contest: baseContest}}
                                               style={{marginRight: "5px", marginTop: "10px"}}/>;
        }
    }

    getDescription() {
        const {contest} = this.options;
        if (contest.systemGenerated) {
            contest.description = "On CS Academy, a contest takes place every hour.\n" +
                                  "This contest is scheduled on the " +
                                  StemDate.format(contest.getStartTime(), "Do of MMMM Y, at HH:mm") +
                                  " your local time";
        }
        const descriptionArticle = contest.getDescriptionArticle();
        if (descriptionArticle) {
            const articleClassMap = new MarkupClassMap(ArticleRenderer.markupClassMap, [
                ["RawHTML", RawHTML]
            ]);
            return <ArticleRenderer style={{marginTop: "1.5em"}} article={descriptionArticle}
                                    classMap={articleClassMap}/>;
        }
        return <RawHTML style={{marginTop: "1.5em"}} __innerHTML={contest.description} />;
    }

    render() {
        const {contest} = this.options;
        return [
            <div className={this.styleSheet.title}>
                {UI.T(contest.getName())}
                {USER.isSuperUser && <Link href={"/contest/" + contest.name + "/edit/"} value={UI.T("Edit")} style={{padding: 6}} />}
            </div>,
            <div>
                {this.getInfo(true)}
            </div>,
            this.getDescription()
        ];
    }

    onMount() {
        const {contest} = this.options;

        const contestSummaryChanges = ["startTime", "endTime", "description", "longName", "name",
            "numRegistered", "numUsersOnline", "numSubmissions", "numExampleRuns", "numCompiles", "numCustomRuns"];
        this.attachChangeListener(contest, (event) => {
            for (const summaryField of contestSummaryChanges) {
                if (event.data.hasOwnProperty(summaryField) || event.hasOwnProperty(summaryField)) {
                    this.redraw();
                    break;
                }
            }
        });
    }

    registerUser() {
        if (!USER.isAuthenticated) {
            LoginModal.show();
            return;
        }

        const request = {
            contestId: this.options.contest.id,
        };

        Ajax.postJSON("/contest/register/", request);
    }
}