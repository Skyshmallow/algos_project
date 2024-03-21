import {
    StateDependentElement
} from "../../stemjs/src/ui/StateDependentElement.jsx";

// Page apps
import {
    FrontPagePanel
} from "./IndexAuthenticated.jsx";
import {
    CSAAboutPage
} from "./CSALogo.jsx";
import {
    ProblemSetting
} from "../../csacontent/js/ProblemSetting.jsx";
import {
    Donate
} from "./Donate.jsx";

import {
    LessonList
} from "../../lessons/js/LessonList.jsx";
import {
    LessonPanel
} from "../../lessons/js/LessonPanel.jsx";

import {
    GlobalRatings
} from "../../csacontent/js/GlobalRatings.jsx";

import {
    BlogRoute
} from "../../establishment/blog/js/BlogPanel.jsx";
import {
    ForumRoute
} from "../../establishment/forum/js/ForumPanel.jsx";

import {
    SubmissionSummaryGlobalFilter
} from "../../eval/js/SubmissionSummary.jsx";
import {
    EvalTaskManager
} from "../../eval/js/EvalTaskManager.jsx";
import {
    EvalTaskEditor
} from "../../eval/js/task-editor/EvalTaskEditor.jsx";
import {
    CheckerManager
} from "../../eval/js/CheckerManager.jsx";

import {
    ArticleManager
} from "../../establishment/content/js/ArticleManager.jsx";
import {
    ArticleEditor
} from "../../establishment/content/js/ArticleEditor.jsx";

import {
    GraphEditor
} from "../../csacontent/js/CSAGraphEditor.jsx";
import {
    CSAGeometryWidget
} from "../../csacontent/js/CSAGeometryWidget.jsx";
import {
    DiffWidgetApp
} from "../../workspace/js/DiffWidget.jsx";

import {
    ContestList
} from "../../contest/js/ContestList.jsx";
import {
    ContestManager
} from "../../contest/js/ContestManager.jsx";
import {
    ContestInvitePage
} from "../../contest/js/ContestInvitePage.jsx";
import {
    ContestEditPanel
} from "../../contest/js/ContestEditPanel.jsx";
import {
    DelayedArchiveOrContestPanel
} from "../../contest/js/DelayedArchiveOrContestPanel.jsx";

import {
    PrivateArchiveList
} from "../../contest/js/PrivateArchiveList.jsx";
import {
    PrivateArchivePanelWrapper
} from "../../contest/js/PrivateArchiveWidget.jsx";

import {
    InterviewApp
} from "../../interview/js/InterviewApp.jsx";
import {
    InterviewPanelWrapper
} from "../../interview/js/InterviewWidget.jsx";

import {
    AccountSettingsPanel
} from "../../csaaccounts/js/CSAUserSettingsPanel.jsx";
import {
    UserWorkspaceSettingsPanel
} from "../../workspace/js/WorkspaceSettingsPanel.jsx";
import {
    EmailConfirmed
} from "../../establishment/accounts/js/EmailConfirmed.jsx";
import {
    EmailUnsubscribe
} from "../../establishment/accounts/js/EmailUnsubscribe.jsx";
import {
    PasswordReset
} from "../../establishment/accounts/js/PasswordReset.jsx";

import {
    UserProfilePanel
} from "../../csaaccounts/js/UserProfilePanel.jsx";
import {
    MessagesPanel
} from "../../establishment/chat/js/PrivateMessages.jsx";

import {
    WorkspaceManagerWrapper
} from "../../workspace/js/WorkspaceManager.jsx";

import {
    EmailManager
} from "../../establishment/emailing/js/EmailManager.jsx";
import {
    StorageManager
} from "../../storage/js/StorageManager";
import {
    AdminPanel
} from "../../maestro/js/AdminPanel.jsx";
import {
    Icarus
} from "../../maestro/js/Icarus.jsx";
import {
    UserStats
} from "../../maestro/js/UserStats.jsx";
import {
    StatisticCharts
} from "../../maestro/js/StatisticCharts.jsx";
import {
    CommandManager
} from "../../establishment/baseconfig/js/CommandManager.jsx";
import {
    TranslationManager
} from "../../establishment/localization/js/TranslationManager.jsx";
import {
    DocumentationRoute
} from "../../establishment/documentation/js/DocumentationRoute.js";
import {
    AnalyticsPanel
} from "../../analytics/js/AnalyticsPanel.jsx";
import {
    CustomRunWidget
} from "../../eval/js/CustomRunWidget.jsx";
import {
    SubmissionWidget
} from "../../eval/js/SubmissionWidget.jsx";
import {
    PasswordResetFromKey
} from "../../establishment/accounts/js/PasswordResetFromKey.jsx";
import {
    AccountActivation
} from "../../csaaccounts/js/AccountActivation.jsx";

import {
    DelayedQuestionnaireAnswersPanel
} from "../../establishment/content/js/QuestionnaireAnswersPanel.jsx";

import {
    IEEEXtremeContestPage
} from "../../ieeextreme/js/IEEEXtremeContestPage.jsx";
import {
    IEEEXtremePracticeContestPanelWrapper
} from "../../ieeextreme/js/IEEEXtremePracticeContestWidget";

import {
    IEEEXtremePasswordResetPage
} from "../../ieeextreme/js/IEEEXtremePasswordReset.jsx";

import {
    PageNotFoundRoute
} from "./GenericErrorView.jsx";

import {
    Route,
    TerminalRoute
} from "../../stemjs/src/ui/Router.jsx";
import {
    RichEditorTest
} from "./RichEditorTest.js";


class IEEEXtremeContestRoute extends TerminalRoute {
    constructor(options = {}) {
        super("ieeextreme", IEEEXtremeContestPage, options);
    }

    matches(urlParts) {
        const contestName = urlParts[0];

        if (!contestName ? .startsWith("ieeextreme")) {
            return null;
        }

        return {
            args: contestName,
            urlParts: urlParts.slice(1),
        }
    }
}

// TODO Are we missing the page title for these??
export const ROUTES = new Route(null, StateDependentElement(FrontPagePanel), [
    new TerminalRoute("about", CSAAboutPage, [], "About CS Academy"),
    new TerminalRoute("rich-editor-test", RichEditorTest, [], "Rich Editor Test"),
    new Route("problem-setting", ProblemSetting),

    new Route("lessons", StateDependentElement(LessonList), [], "Lessons"),
    new Route(["lesson", "%s"], StateDependentElement(LessonPanel)),

    new Route("ratings", StateDependentElement(GlobalRatings), [], "Ratings Leaderboard"),
    new Route("real_ratings", StateDependentElement(GlobalRatings)),
    new Route("reputations", StateDependentElement(GlobalRatings)),

    new Route(["code", "%s"], StateDependentElement(CustomRunWidget), [], "CS Academy - Code"),

    new Route(["submission", "%s"], SubmissionWidget, [], "CS Academy - Submission"),

    new BlogRoute(),
    new ForumRoute(),

    new Route(["eval", "global"], StateDependentElement(SubmissionSummaryGlobalFilter)),
    new Route(["eval", "manager"], EvalTaskManager),
    new Route(["eval", "checkers"], StateDependentElement(CheckerManager)),

    new TerminalRoute(["task", "%s", "edit"], StateDependentElement(EvalTaskEditor)),

    new Route(["article", "manager"], ArticleManager),
    new Route(["article", "%s", "edit"], StateDependentElement(ArticleEditor)),

    new Route("app", null, [
        new Route("graph_editor", GraphEditor, [], "Graph Editor"),
        new Route("diffing_tool", DiffWidgetApp),
        new Route("geometry_widget", CSAGeometryWidget, [], "Geometry Widget"),
    ]),

    new Route("contests", StateDependentElement(ContestList), [], "Contests"),
    new Route("contest", null, [
        new Route("manager", StateDependentElement(ContestManager)),
        new Route(["invite", "%s"], StateDependentElement(ContestInvitePage)),
        new Route(["%s", "edit"], StateDependentElement(ContestEditPanel)),
        new TerminalRoute("%s", DelayedArchiveOrContestPanel),
    ]),

    new Route("private-archives", StateDependentElement(PrivateArchiveList)),
    new Route("private-archive", null, [
        new TerminalRoute("%s", StateDependentElement(PrivateArchivePanelWrapper)),
    ]),

    new Route("interview", StateDependentElement(InterviewApp), [
        new TerminalRoute("%s", StateDependentElement(InterviewPanelWrapper)),
    ]),

    new Route("accounts", null, [
        new TerminalRoute("settings", StateDependentElement(AccountSettingsPanel)),
        new Route("workspace_settings", StateDependentElement(UserWorkspaceSettingsPanel)),
        new Route(["email_address_verify", "%s"], StateDependentElement(EmailConfirmed)),
        new Route(["email_unsubscribe", "%s"], StateDependentElement(EmailUnsubscribe)),
        new Route("password_reset", PasswordReset, [
            new Route("%s", StateDependentElement(PasswordResetFromKey))
        ]),
        new Route(["activate", "%s"], AccountActivation)
    ]),

    new Route(["user", "%s"], StateDependentElement(UserProfilePanel)),
    new Route(["userid", "%s"], StateDependentElement(UserProfilePanel)),
    new TerminalRoute("messages", MessagesPanel),

    new TerminalRoute("workspace", WorkspaceManagerWrapper),

    new TerminalRoute(["email", "manager"], StateDependentElement(EmailManager)),

    new Route(["baseconfig", "command", "manager"], StateDependentElement(CommandManager)),

    new Route("manage", StateDependentElement(AdminPanel), [
        new TerminalRoute("icarus", StateDependentElement(Icarus)),
        new Route("users", StateDependentElement(UserStats)),
        new Route("charts", StatisticCharts, [], "Statistics"),
        new TerminalRoute("translation", StateDependentElement(TranslationManager)),
    ]),
    new TerminalRoute(["storage", "manager"], StateDependentElement(StorageManager)),

    new DocumentationRoute(),

    new TerminalRoute("ieeextreme-practice", IEEEXtremePracticeContestPanelWrapper),
    new IEEEXtremeContestRoute(),

    new Route(["ieee_password_reset", "%s"], IEEEXtremePasswordResetPage),

    new Route(["questionnaire", "%s", "answers"], DelayedQuestionnaireAnswersPanel),

    new Route("analytics", AnalyticsPanel),

    new Route("donate", Donate),

    new PageNotFoundRoute(),
]);