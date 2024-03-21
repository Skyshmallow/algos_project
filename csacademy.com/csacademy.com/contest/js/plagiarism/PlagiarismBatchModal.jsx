import {Modal} from "../../../stemjs/src/ui/modal/Modal.jsx";
import {apiLoadAllPlagiarismMatches} from "../state/PlagiarismMatchStore.js";
import {EvalJobStore} from "../../../eval/js/state/EvalJobStore.js";
import {Button} from "../../../stemjs/src/ui/button/Button.jsx";
import {Table} from "../../../stemjs/src/ui/table/Table.jsx";
import {EvalJobComparator} from "./EvalJobComparator.jsx";
import {RawCheckboxInput} from "../../../stemjs/src/ui/input/Input.jsx";
import {autoredraw} from "../../../stemjs/src/decorators/AutoRedraw.js";
import {
    SubmissionToContestUser,
    ContestUserWithDecision,
    RenderContestUserSummaries
} from "./ContestUserWithDecision.jsx";
import {PlagiarismMatchDecision, PlagiarismMatchEditor} from "./PlagiarismMatchEditor.jsx";


@autoredraw
export class PlagiarismMatchModal extends Modal {
    skipJudged = true;
    skipDisqualified = true; // TODO implement

    render() {
        const {currentIndex, entries} = this.options;
        const match = entries[currentIndex];
        const submission1 = EvalJobStore.get(match.submission1Id);
        const submission2 = EvalJobStore.get(match.submission2Id);

        const allDisqualified = (match) => {
            for (const subId of [match.submission1Id, match.submission2Id]) {
                const sub = EvalJobStore.get(subId);
                const contestUser = SubmissionToContestUser(sub);
                if (!contestUser.isDisqualified()) {
                    return false;
                }
            }
            return true;
        }

        const shouldSkip = (match) => {
            if (this.skipDisqualified && allDisqualified(match)) {
                return true;
            }

            return this.skipJudged && (match.decision === 1 || match.decision === 3);
        }

        let prevIndex = currentIndex - 1;
        while (prevIndex >= 0 && shouldSkip(entries[prevIndex])) {
            prevIndex -= 1;
        }

        let nextIndex = currentIndex + 1;
        while (nextIndex < entries.length && shouldSkip(entries[nextIndex])) {
            nextIndex += 1;
        }

        const contestUsers = [submission1, submission2].map(SubmissionToContestUser);

        return [
            <PlagiarismMatchEditor currentIndex={currentIndex} match={match} />,
            <div>
                <Button
                    label="← Previous"
                    disabled={prevIndex < 0}
                    onClick={() => this.updateOptions({currentIndex: prevIndex})}
                />

                <Button
                    label="Next →"
                    disabled={nextIndex >= entries.length}
                    onClick={() => this.updateOptions({currentIndex: nextIndex})}
                />

                <RawCheckboxInput
                    onChange={() => {
                        this.skipJudged = this.checkboxSkipInput.getValue();
                        this.redraw();
                    }}
                    value={this.skipJudged}
                    ref={"checkboxSkipInput"}
                /> Skip judged matches (Cheating or Not cheating)

                <RawCheckboxInput
                    onChange={() => {
                        this.skipDisqualified = this.checkboxSkipDisqualifiedInput.getValue();
                        this.redraw();
                    }}
                    value={this.skipDisqualified}
                    ref={"checkboxSkipDisqualifiedInput"}
                /> Skip if both disqualified
            </div>,

            RenderContestUserSummaries(contestUsers),

            <EvalJobComparator submissions={[submission1, submission2]} />
        ];
    }
}


export class PlagiarismBatchModal extends Modal {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.setStyle({height: "90%"});
    }

    async loadMatches() {
        const {batch} = this.options;
        this.matches = await apiLoadAllPlagiarismMatches(batch);
        this.redraw();
    }

    renderSubmissionDescription(evalJobId) {
        const evalJob = EvalJobStore.get(evalJobId);
        return ContestUserWithDecision.fromSubmission(evalJob);
    }

    render() {
        const {batch} = this.options;

        if (!this.matches) {
            this.loadMatches().then();
            return <h1>Loading...</h1>;
        }

        for (let index = 0; index < this.matches.length; index++) {
            const prevIndex = (index > 0) ? index - 1 : this.matches.length - 1;
            const nextIndex = (index + 1 < this.matches.length) ? index + 1 : 0;
            this.matches[index].prevEntry = this.matches[prevIndex];
            this.matches[index].nextEntry = this.matches[nextIndex];
        }

        const columns = [
            ["First submission", match => this.renderSubmissionDescription(match.submission1Id)],
            ["Second submission", match => this.renderSubmissionDescription(match.submission2Id)],
            ["Decision", match => <PlagiarismMatchDecision match={match}/>],
            ["Actions", (match, rowIndex) => <div>
                <Button label="Judge" onClick={() => PlagiarismMatchModal.show({
                    currentIndex: rowIndex,
                    entries: this.matches,
                })}/>
            </div>],
        ]

        return <Table entries={this.matches} columns={columns} />;
    }
}
