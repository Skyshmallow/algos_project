import {
    StyleSheet,
    styleRule
} from "../../stemjs/src/ui/Style.js";


export class InterviewTaskBubbleStyle extends StyleSheet {
    fontColor = "rgb(55, 55, 55)";
    height = 110;

    @styleRule
    className = {
        boxShadow: "0px 0px 1px " + this.fontColor,
        width: "99%",
        marginLeft: "0.5%",
        marginRight: "0.5%",
        height: this.height + "px",
        fontColor: this.fontColor,
        display: "inline-block",
        float: "left",
        marginTop: "20px",
        whiteSpace: "nowrap",
        ":hover": {
            transition: "0.23s",
            boxShadow: "0px 0px 5px " + this.fontColor,
        }
    };

    @styleRule
    userScore = {
        height: this.height + "px",
        lineHeight: this.height + "px",
        width: "11%",
        color: this.fontColor,
        fontSize: "20px",
        textAlign: "center",
        display: "inline-block",
        float: "left",
    };

    @styleRule
    taskDescription = {
        height: this.height + "px",
        width: "35%",
        display: "inline-block",
        float: "left",
    };

    @styleRule
    taskName = {
        height: this.height / 2 + "px",
        lineHeight: this.height / 2 + "px",
        width: "100%",
        fontSize: "130%",
        paddingLeft: "15%",
    };

    @styleRule
    originalContest = {
        height: this.height / 2 + "px",
        lineHeight: this.height / 2 + "px",
        width: "100%",
        fontSize: "100%",
        paddingLeft: "15%",
    };

    @styleRule
    taskDifficulty = {
        height: this.height + "px",
        width: "9%",
        lineHeight: this.height + "px",
        fontSize: "16px",
        textAlign: "center",
        display: "inline-block",
        float: "left"
    };
}

export class InterviewTagsStyle extends StyleSheet {
    tagsHeight = 40;

    @styleRule
    className = {
        height: "40px",
        width: "100%",
        borderBottom: "2px solid #e4e6e7",
        color: "#aaa",
    };

    @styleRule
    header = {
        "display": "flex",
        "justify-content": "center",
        "align-items": "center",
        "float": "left",
        "width": "18%",
        "height": () => this.tagsHeight + "px",
        "font-size": "13px",
        "text-align": "center",
    }
}

export class InterviewBubbleStyle extends StyleSheet {
    bubbleHeight = 50;

    baseBubble = {
        height: this.bubbleHeight + "px",
        width: "100%",
        color: "#555",
        borderBottom: "2px solid #e4e6e7",
        cursor: "pointer"
    };

    @styleRule
    lightBubble = Object.assign(this.baseBubble, {
        backgroundColor: "#fff",
        ":hover": {
            backgroundColor: "#fafafa"
        }
    });

    @styleRule
    darkBubble = Object.assign(this.baseBubble, {
        backgroundColor: "#f4f6f7",
        ":hover": {
            backgroundColor: "#eff1f2"
        }
    });

    @styleRule
    element = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        float: "left",
        width: "18%",
        height: this.bubbleHeight + "px",
        fontSize: "14px",
        textAlign: "center",
        color: "#767676",
    }
}

export class InterviewAppStyle extends StyleSheet {
    textColor = "#555659"; // default CSAcademy navbar color
    headerHeight = 60;

    @styleRule
    title = {
        display: "inline-block",
        float: "left",
        lineHeight: this.headerHeight + "px",
        height: this.headerHeight + "px",
        paddingLeft: "1%",
        fontSize: "24px",
        color: this.textColor,
    };

    @styleRule
    button = {
        display: "inline-block",
        float: "right",
        marginRight: "1%",
        marginTop: "14px",
    };

    @styleRule
    header = {
        height: this.headerHeight + "px",
        width: "100%",
    };
}