import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {autoredraw} from "../../../stemjs/src/decorators/AutoRedraw.js";
import {UserHandle} from "../../../csaaccounts/js/UserHandle.jsx";
import {Select} from "../../../stemjs/src/ui/input/Input.jsx";
import {Button} from "../../../stemjs/src/ui/button/Button.jsx";
import {apiChangePlagiarismMatchDecision} from "../state/PlagiarismMatchStore.js";

const PLAGIARISM_DECISION = {
    1: "Not cheating",
    2: "Suspicious",
    3: "Cheating"
};

@autoredraw
export class PlagiarismMatchDecision extends UI.Primitive("span") {
    render() {
        const {match} = this.options;
        const result = [
            PLAGIARISM_DECISION[match.decision] || "Undecided",
        ];

        if (match.lastEditedByUserId) {
            result.push([" (", <UserHandle userId={match.lastEditedByUserId}/>, ")"]);
        }

        return result;
    }
}

@autoredraw
export class PlagiarismMatchEditor extends UI.Element {
    render() {
        const {match, currentIndex} = this.options;

        return [
            currentIndex != null && `Match #${currentIndex + 1} `,
            "Current decision: ", <PlagiarismMatchDecision match={match}/>,
            <Select
                ref="decisionInput"
                options={Object.values(PLAGIARISM_DECISION)}
                initialValue={PLAGIARISM_DECISION[match.decision] || PLAGIARISM_DECISION[1]}
            />,
            <Button
                style={{marginLeft: 16}}
                label={"Change decision"}
                onClick={() => apiChangePlagiarismMatchDecision(match, this.decisionInput.getIndex() + 1)}
            />
        ]
    }
}
