import {
    CardPanelStyle
} from "../../stemjs/src/ui/CardPanel.jsx";
import {
    styleRule
} from "../../stemjs/src/decorators/Style.js";


export class ContestQuestionListStyle extends CardPanelStyle {
    @styleRule
    contestQuestionList = {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0 auto",
        justifyContent: "center",
    };

    @styleRule
    cardPanelContainer = {
        flex: "1",
        maxWidth: "100%",
        padding: this.themeProps.CONTEST_QUESTION_CARD_PANEL_PADDING,
        width: this.themeProps.CONTEST_QUESTION_CARD_PANEL_WIDTH,
    };

    cardPanelBodyStyle = {
        padding: this.themeProps.CONTEST_QUESTION_CARD_PANEL_BODY_PADDING + "px",
        lineHeight: this.themeProps.CONTEST_QUESTION_CARD_PANEL_LINE_HEIGHT + "px",
    };

    @styleRule
    extraElementStyle = {
        display: "flex",
        flex: "1",
        padding: this.themeProps.CONTEST_QUESTION_CARD_PANEL_PADDING,
        minWidth: this.themeProps.CONTEST_QUESTION_CARD_PANEL_MIN_WIDTH,
    };

    @styleRule
    questionsContainer = {
        width: "100%",
        margin: "0 auto",

        display: "flex",
        justifyContent: "center",

        overflow: "hidden",
    };

    @styleRule
    questionsColumnContainer = {
        width: "50%",
        overflow: "auto",
    };

    @styleRule
    filterContainer = {
        overflowY: "auto",
        width: "25%",
        height: "100%",
        float: "left"
    };

    @styleRule
    filterSwitcherContainer = {
        width: "75%",
        height: "100%",
        float: "right"
    };

    filterOptionBase = {
        height: "40px",
        paddingLeft: "5px",
        border: "1px solid black",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        fontSize: "1.2em",
        cursor: "pointer"
    };

    @styleRule
    filterOption = Object.assign({
        backgroundColor: this.themeProps.COLOR_BACKGROUND,
        ":hover": {
            backgroundColor: this.themeProps.COLOR_BACKGROUND_ALTERNATIVE
        }
    }, this.filterOptionBase);

    @styleRule
    filterOptionFocused = Object.assign({
        ":hover": {
            backgroundColor: this.themeProps.COLOR_BACKGROUND_ALTERNATIVE
        },
        backgroundColor: this.themeProps.COLOR_BACKGROUND_ALTERNATIVE
    }, this.filterOptionBase);

    @styleRule
    filterSwitcher = {
        height: "100%",
        overflow: "auto"
    };
}