import {
    MarkupClassMap
} from "../../stemjs/src/markup/MarkupRenderer.js";
import {
    Definition
} from "../../csabase/js/ui/PopupDefinition.jsx";
import {
    Emoji
} from "../../csabase/js/ui/EmojiUI.jsx";
import {
    SubmissionSummaryMarkup
} from "../../eval/js/SubmissionSummary.jsx";
import {
    UserHandle
} from "../../csaaccounts/js/UserHandle.jsx";
import {
    Latex
} from "../../establishment/content/js/markup/Latex.jsx";
import {
    ProgrammingLanguageTable
} from "../../eval/js/ProgrammingLanguageTable.jsx";
import {
    EvalTasksSolutionsWidget
} from "../../contest/js/ContestAnalysis.jsx";
import {
    DemoMarkupEditor
} from "../../establishment/content/js/DemoMarkupEditor.jsx";
import {
    MarkupTable
} from "../../establishment/content/js/markup/MarkupTable.jsx";
import {
    QuestionnaireButton
} from "../../establishment/content/js/QuestionnairePanel.jsx";
import {
    YoutubeIframe
} from "../../establishment/content/js/external-api/YoutubeIframe.jsx";
import {
    LocalizedTime
} from "./LocalizedTime.js";

import {
    CSAGeometryWidgetSVG
} from "./CSAGeometryWidget.jsx";
import {
    GraphSVG
} from "./CSAGraph.jsx";
import {
    PieChartSVG
} from "../../establishment/content/js/charts/PieChart.jsx";
import {
    SVGGrid,
    SVGHandDrawnCircle,
    SVGPartiallyFilledCircle,
    SVGVisualMatrix
} from "../../csacontent/js/SVGSpecialObjects.jsx";


MarkupClassMap.addClass("LocalizedTime", LocalizedTime);
MarkupClassMap.addClass("Definition", Definition);
MarkupClassMap.addClass("Graph", GraphSVG);
MarkupClassMap.addClass("User", UserHandle);
MarkupClassMap.addClass("Submission", SubmissionSummaryMarkup);
MarkupClassMap.addClass("Emoji", Emoji);
MarkupClassMap.addClass("Latex", Latex);
MarkupClassMap.addClass("Geometry", CSAGeometryWidgetSVG);
MarkupClassMap.addClass("Table", MarkupTable);

// TODO: this should be added only in about page ( & Analysis article )
MarkupClassMap.addClass("PLTable", ProgrammingLanguageTable);
MarkupClassMap.addClass("DemoMarkupEditor", DemoMarkupEditor);
MarkupClassMap.addClass("EvalTasksSolutionsWidget", EvalTasksSolutionsWidget);
MarkupClassMap.addClass("QuestionnaireButton", QuestionnaireButton);
MarkupClassMap.addClass("YoutubeVideo", YoutubeIframe);
MarkupClassMap.addClass("PieChart", PieChartSVG);

MarkupClassMap.addClass("HandDrawnCircle", SVGHandDrawnCircle);
MarkupClassMap.addClass("PartiallyFilledCircle", SVGPartiallyFilledCircle);
MarkupClassMap.addClass("VisualMatrix", SVGVisualMatrix);
MarkupClassMap.addClass("Grid", SVGGrid);