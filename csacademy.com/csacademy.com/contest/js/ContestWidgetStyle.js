import {
    StyleSheet
} from "../../stemjs/src/ui/Style.js";
import {
    styleRule
} from "../../stemjs/src/ui/Style.js";

export class ContestSummaryStyle extends StyleSheet {
    @styleRule
    label = {
        fontSize: "18px",
    };

    @styleRule
    statisticsPanelContainer = {
        width: "300px",
        maxWidth: "100%",
        marginTop: "30px",
    };

    cardPanelBodyStyle = {
        padding: "0px",
    };

    @styleRule
    cardPanelRow = {
        display: "flex",
        justifyContent: "space-between",
        flex: "1",
    };

    @styleRule
    title = {
        marginBottom: "30px",
        paddingTop: "15px",
        fontSize: "26px",
    };
}

export class ContestPanelStyle extends StyleSheet {
    @styleRule
    questionContainer = {
        width: "920px",
        maxWidth: "100%",
        margin: "0 auto",
        paddingLeft: "10px",
        paddingRight: "10px",
    };

    @styleRule
    askQuestionButton = {
        marginTop: "20px",
        marginLeft: this.themeProps.CONTEST_QUESTION_CARD_PANEL_BODY_PADDING
    };
}