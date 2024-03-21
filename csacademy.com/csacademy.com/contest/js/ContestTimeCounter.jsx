import {UI} from "../../stemjs/src/ui/UIBase.js";
import {ServerTime} from "../../stemjs/src/time/Time.js";
import {Duration} from "../../stemjs/src/time/Duration.js";
import {StemDate} from "../../stemjs/src/time/Time.js";
import {Formatter} from "../../csabase/js/util.js";


export class ContestTimeCounter extends UI.Primitive("span") {
    updateTimer() {
        const contest = this.options.contest;
        let currentServerTime = ServerTime.now();
        let value;
        if (contest.getStartTime() && !contest.hasStarted()) {
            let contestStartTime = new StemDate(contest.getStartTime());
            let timeDifference = currentServerTime.diffDuration(contestStartTime);
            let diffFormat = timeDifference.format("h:mm:ss");
            if (timeDifference >= 24 * Duration.HOUR) {
                diffFormat = Formatter.duration(timeDifference, {
                    days: true,
                    hours: true,
                    lastSeparator: " and ",
                })
            }
            value = ("Starts in " + diffFormat);
        } else if (contest.getEndTime() && !contest.hasFinished()) {
            let contestEndTime = new StemDate(contest.getEndTime());
            let timeDifference = currentServerTime.diffDuration(contestEndTime);
            let diffFormat = timeDifference.format("h:mm:ss");
            if (timeDifference >= 24 * Duration.HOUR) {
                diffFormat = Formatter.duration(timeDifference, {
                    days: true,
                    hours: true,
                    lastSeparator: " and ",
                })
            }
            value = ("Ends in " + diffFormat);
        } else {
            value = ("Server time: " + currentServerTime.utc().format("HH:mm:ss"));
        }
        this.setChildren([value]);
        this.dispatchChange();
    }

    onMount() {
        this.updateTimer();
        this.intervalId = setInterval(() => this.updateTimer(), 1000);
    }

    onUnmount() {
        clearInterval(this.intervalId);
    }
}
