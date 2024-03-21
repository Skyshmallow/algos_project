import {
    StyleSheet
} from "../../stemjs/src/ui/Style.js";
import {
    styleRule
} from "../../stemjs/src/decorators/Style.js";


export class LessonSectionPanelStyle extends StyleSheet {
    @styleRule
    lessonSectionPanel = {
        width: "800px",
        maxWidth: "80%",
        margin: "0 auto",
        marginBottom: "30px",
    };
}

export class LessonPanelStyle extends StyleSheet {
    @styleRule
    articleRenderer = {
        fontSize: "17px",
        textAlign: "justify",
        " h1": {
            textAlign: "center",
            marginTop: "25px",
            marginBottom: "25px",
        },
        " h2": {
            textAlign: "center",
            marginTop: "25px",
            marginBottom: "25px",
        },
        " h3": {
            textAlign: "center",
            marginTop: "25px",
            marginBottom: "25px",
        },
        " h4": {
            textAlign: "center",
            marginTop: "25px",
            marginBottom: "25px",
        },
        " h5": {
            textAlign: "center",
            marginTop: "25px",
            marginBottom: "25px",
        },
        " h6": {
            textAlign: "center",
            marginTop: "25px",
            marginBottom: "25px",
        },
    };

    @styleRule
    className = {
        backgroundColor: "#fff",
        boxShadow: "rgb(160, 160, 160) 0px 3px 15px",
        width: "900px",
        padding: "2% 5%",
        maxWidth: "100%",
        margin: "0 auto",
    };

    @styleRule
    comments = {
        maxWidth: "100%"
    };

    @styleRule
    commentsContainer = {
        marginBottom: "20px",
        paddingBottom: "20px",
        paddingTop: "10px"
    };
}