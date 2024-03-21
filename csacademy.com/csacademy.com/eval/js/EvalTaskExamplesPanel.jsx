import {autoredraw} from "../../stemjs/src/decorators/AutoRedraw.js";
import {EvalJobResultsTable} from "./EvalJobResultsTable.jsx";
import {Panel} from "../../stemjs/src/ui/UIPrimitives.jsx";

@autoredraw
export class EvalTaskExamplesPanel extends Panel {
    setEvalJob(evalJob) {
        this.updateOptions({evalJob});
    }

    render() {
        const {evalJob} = this.options;
        return <EvalJobResultsTable evalJob={evalJob} examplesOnly={true} />
    }

    redraw(event) {
        super.redraw();
        const {evalJob} = this.options;

        if (event && evalJob?.exampleTests.length > 0 && evalJob.tests.length === 0) {
            this.dispatch("show");
        }
    }
}
