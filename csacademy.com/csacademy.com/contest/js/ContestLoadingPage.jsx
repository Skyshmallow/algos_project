import {UI} from "../../stemjs/src/ui/UIBase.js";
import {StateDependentElement} from "../../stemjs/src/ui/StateDependentElement.jsx";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {ServerTime} from "../../stemjs/src/time/Time.js";

class ContestLoadingPage extends UI.Element {
    render() {
        const textStyle = {textAlign: "center", marginTop: "10px", fontSize: "2em"};
        if (this.options.error) {
            return <div style={textStyle}>
                {this.options.error.message}
                <br />
                Try refreshing the page.
            </div>
        }
        return [
            StateDependentElement.renderLoading(),
            <div style={textStyle}>
                Contest is loading. Please do not refresh the page.
            </div>
        ];
    }

    onMount() {
        const contest = this.options.contest;

        if (contest.isVirtual()) {
            return;
        }

        if (contest.hasAnyTask()) {
            contest.dispatch("loadedManually");
            return;
        }

        const delay = (Math.max(contest.getStartTime() - ServerTime.now().unix(), 0) + 5 + Math.random() * 10) * 1000;
        this.timerId = setTimeout(() => {
            if (!contest.hasAnyTask()) {
                Ajax.getJSON("/contest/" + contest.name + "/", {}).then(
                    () => contest.dispatch("loadedManually"),
                    (error) => this.updateOptions({error})
                );
            }
            delete this.timerId;
        }, delay);
    }

    onUnmount() {
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
    }
}


export {ContestLoadingPage};