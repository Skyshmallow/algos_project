import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {DelayedDiffWidget} from "../../../workspace/js/DiffWidget.jsx";


export class EvalJobComparator extends UI.Element {
    render() {
        const {submissions} = this.options;

        return <DelayedDiffWidget
            style={{height: 500}}
            leftEditable={false}
            rightEditable={false}
            leftTextValue={submissions[0].sourceText}
            rightTextValue={submissions[1].sourceText}
        />
    }
}
