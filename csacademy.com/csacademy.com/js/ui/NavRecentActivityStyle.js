import {
    StyleSheet,
    styleRule
} from "UI";

class NavRecentActivityStyle extends StyleSheet {
    sectionHeight = "20px";
    fontFamily = "lato, open sans";
    defaultFontSize = ".9em";
    pinnedIconFontSize = "1em";
    titleFontSize = "1.2em";
    activityFontSize = ".9em";
    hoverBackgroundColor = "#f8f8f8";

    @styleRule
    panel = {
        width: "100%",
        border: "1px solid #ddd",
        borderTop: "0px",
        borderLeft: "0",
        borderRight: "0",
        backgroundColor: "#fff",
        fontFamily: this.fontFamily,
        fontSize: this.defaultFontSize,
        display: "block",
        ":hover": {
            backgroundColor: this.hoverBackgroundColor,
        }
    };

    @styleRule
    pinnedIcon = {
        textAlign: "center",
        display: "inline-block",
        float: "left",
        height: "60px",
        paddingTop: "28px",
        paddingRight: "8px",
        fontSize: this.pinnedIconFontSize,
    };

    @styleRule
    title = {
        padding: "12px",
        paddingBottom: "0",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        fontSize: this.titleFontSize,
    };

    @styleRule
    type = {
        display: "block",
    };

    @styleRule
    bottomSection = {
        ">*": {
            display: "inline-block !important",
        },
        ">:first-child": {
            marginRight: "4px",
        },
        position: "relative",
        marginTop: "8px",
        marginBottom: "8px",
        padding: "0px 14px",
    };

    @styleRule
    timeStamp = {
        fontSize: this.activityFontSize,
        height: this.sectionHeight,
        color: "#aaa !important",
        textStyle: "italic",
        marginRight: "6px",
    };

    @styleRule
    bottomRightSection = {
        float: "right",
    };
}

export {
    NavRecentActivityStyle
};