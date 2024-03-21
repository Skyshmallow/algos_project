import {UI, Panel, CardPanel, StyleSheet, styleRule, registerStyle} from "../../csabase/js/UI.js";
import {StateDependentElement} from "../../stemjs/src/ui/StateDependentElement.jsx";
import {GlobalStyle} from "../../stemjs/src/ui/GlobalStyle.js";

import {EvalJobStore} from "./state/EvalJobStore.js";
import {SourceCardPanel, CompilationCardPanel} from "./CustomRunWidget.jsx";
import {EvalJobResultsTable} from "./EvalJobResultsTable.jsx";
import {EvalJobUIHandler} from "./EvalJobSummaryPanel.js";


class SubmissionResultsTable extends CardPanel {
    getTitle() {
        return UI.T("Results");
    }

    render() {
        return <EvalJobResultsTable evalJob={this.options.evalJob}/>
    }
}


class SubmissionSummaryCardPanel extends CardPanel {
    getTitle() {
        return UI.T("Summary");
    }

    render() {
        const evalJobUIHandler = new EvalJobUIHandler(this.options.evalJob);
        return <div style={{padding: 10}}>
            {evalJobUIHandler.getSummary()}
        </div>;
    }
}


class SubmissionWidgetStyle extends StyleSheet {
    @styleRule
    container = {
        marginBottom: "20px",
        width: "1200px",
        marginLeft: 15,
        marginRight: 15,
        maxWidth: "calc(100% - 30px)",
    };

    @styleRule
    section = {
        margin: "25px 0",
    };

    @styleRule
    flexSection = {
        display: "flex",
        flexDirection: "column",
        // flexWrap: "wrap",
    };

    @styleRule
    cardPanels = {
        marginBottom: 25,
        flex: 1,
    };
}


@registerStyle(SubmissionWidgetStyle)
class SubmissionPanel extends Panel {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.addClass(GlobalStyle.Container.SMALL);
    }

    render() {
        // TODO: Change the name passed to the Source Card Panel
        const {styleSheet} = this;
        const {evalJob} = this.options;

        return [
            <div className={styleSheet.section}>
                <SourceCardPanel job={evalJob}
                                 name={evalJob.id}
                                 forkable={false} />
            </div>,
            <div className={styleSheet.flexSection}>
                <SubmissionSummaryCardPanel evalJob={evalJob}
                                            className={styleSheet.cardPanels} />
                <CompilationCardPanel customRun={evalJob}
                                      className={styleSheet.cardPanels} />
            </div>,
            <SubmissionResultsTable evalJob={evalJob}
                                    bodyStyle={{padding: "0% 2%"}} />
        ];
    }
}


export class SubmissionWidget extends UI.Element {
    extraNodeAttributes(attr) {
        attr.setStyle({
            display: "flex",
            justifyContent: "center",
        });
    }

    renderNotLoaded() {
        let renderLoading = StateDependentElement.renderLoading;
        if (typeof renderLoading === "function") {
            renderLoading = renderLoading();
        }
        return renderLoading;
    }

    renderError() {
        let renderError = StateDependentElement.renderError;
        if (typeof renderError === "function") {
            renderError = renderError({message: "Could not find submission with id " + this.options.args[0]});
        }
        return renderError;
    }

    render() {
        const evalJobId = parseInt(this.options.args[0]);
        if (this.options.notPublic) {
            return this.renderError();
        }
        const evalJob = EvalJobStore.get(evalJobId);
        if (evalJob) {
            return <SubmissionPanel evalJob={evalJob}/>;
        }
        EvalJobStore.fetchWithContest(evalJobId,
            () =>  this.redraw(),
            () => this.updateOptions({notPublic: true})
        );
        return this.renderNotLoaded();
    }
}
