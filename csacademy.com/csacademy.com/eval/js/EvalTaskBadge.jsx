import {UI} from "../../stemjs/src/ui/UIBase.js";
import {FAIcon} from "../../stemjs/src/ui/FontAwesome.jsx";


const EvalTaskBadge = (tooltip, children, icon, color="#eeeeaa") => class Badge extends UI.Primitive("span") {
    getDefaultOptions() {
        return {
            HTMLtitle: tooltip,
            style: {
                cursor: "help",
                backgroundColor: color,
                padding: "6px",
                borderRadius: "4px",
                fontSize: "1.3em",
                marginBottom: "5px",
                marginLeft: "6px"
            },
        };
    }

    render() {
        return [<FAIcon icon={icon} />, children];
    }
};

export const InteractiveBadge = EvalTaskBadge("This task is interactive", "Interactive", "exchange");
export const EnforcedTemplateBadge = EvalTaskBadge("This task uses enforced templates", "Template", "code");
export const OutputOnlyBadge = EvalTaskBadge("This task is output-only", "Output", "file-text-o");
export const ApproximationBadge = EvalTaskBadge("This is an approximation task", "Aprox", "");
