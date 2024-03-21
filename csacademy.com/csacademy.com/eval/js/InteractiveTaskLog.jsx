import {UI, StyleSheet, styleRule, registerStyle} from "../../csabase/js/UI.js";

class InteractiveExampleBubbleStyle extends StyleSheet {
    @styleRule
    taskLog = {
        width: "100%",
    };

    @styleRule
    inputMessage = {
        float: "left",
        maxWidth: "45%",
        marginRight: "50%",
        minWidth: "20%",
    };

    @styleRule
    outputMessage = {
        float: "right",
        maxWidth: "45%",
        marginLeft: "50%",
        minWidth: "20%",
    }
}

@registerStyle(InteractiveExampleBubbleStyle)
class InteractiveTaskLog extends UI.Element {
    extraNodeAttributes(attr) {
        attr.setAttribute("extra", this.options.extra);
        attr.setAttribute("align", this.options.align);
        attr.addClass(this.styleSheet.taskLog);
    }

    render() {
        return this.options.extra.map(message =>
            <pre className={(message.type == 1) ? this.styleSheet.inputMessage : this.styleSheet.outputMessage}>
                {message.message.trim()}
            </pre>);
    }
}

export {InteractiveTaskLog};
