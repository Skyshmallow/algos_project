import {UI} from "../../stemjs/src/ui/UIBase.js";
import {registerStyle} from "../../stemjs/src/ui/style/Theme.js";
import {ServerTime} from "../../stemjs/src/time/Time.js";
import {StemDate} from "../../stemjs/src/time/Date.js";
import {StyleSheet} from "../../stemjs/src/ui/Style.js";
import {styleRule, styleRuleInherit} from "../../stemjs/src/decorators/Style.js";
import {enhance} from "../../stemjs/src/ui/Color.js";

const IEEE_PRIMARY_COLOR = "#185e9c";

class CountdownStyle extends StyleSheet {
    timeSectionHeight = 180;
    timeSectionDigitsContainerHeight = 120;
    primaryColor = IEEE_PRIMARY_COLOR;

    @styleRule
    countdown = {
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        flexDirection: "row",
    };

    // renderTimeSection style
    @styleRule
    timeSection = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    };

    @styleRule
    timeSectionDigitsContainer = {
        display: "flex",
    };

    @styleRule
    digitContainer = {
        height: this.timeSectionDigitsContainerHeight,
        width: 75,
        margin: 5,
        borderRadius: "10px",
        boxShadow: "0px 0px 5px " + this.primaryColor,
        background: `linear-gradient(to bottom,` +
            `${this.primaryColor} 0%, ` +
            `${this.primaryColor} 49.5%,` +
            `${enhance(this.primaryColor, 1)} 49.5%,` +
            `${enhance(this.primaryColor, 1)} 50.5%,` +
            `${enhance(this.primaryColor, 0.15)} 50.5%,` +
            `${enhance(this.primaryColor, 0.15)} 100%` +
        `)`,
        color: enhance(this.primaryColor, 1),
        fontSize: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    @styleRule
    digitContainerSeparator = {
        width: 20,
        height: this.timeSectionHeight - this.timeSectionDigitsContainerHeight,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textShadow: "0px 0px 5px " + this.primaryColor,
        fontSize: 40,
        paddingBottom: 60,
        color: this.primaryColor,
    };

    @styleRule
    timeSectionDescription = {
        height: this.timeSectionHeight - this.timeSectionDigitsContainerHeight,
        marginLeft: 10,
        marginRight: 10,
        fontSize: 22,
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
        color: this.primaryColor,
    };
}

// Countdown - gets the StemDate of the end of the event (options.endTime)
// TODO: This is 1x4 = 4 sections. (days, hours, minutes, seconds)
// TODO: Add 2x3 = 6 sections (+ years, months)
// TODO: This is easy to reuse, even after IEE contest. :)
@registerStyle(CountdownStyle)
export class Countdown extends UI.Element {
    getDefaultOptions() {
        return {
            hasDays: true,
            hasHours: true,
            hasMinutes: true,
            hasSeconds: true,
        };
    }

    extraNodeAttributes(attr) {
        attr.addClass(this.styleSheet.countdown);
    }

    getTimeLeft() {
        const currentServerTime = ServerTime.now();
        let {endTime} = this.options;
        endTime = endTime || currentServerTime;

        return endTime.diffDuration(currentServerTime);
    }

    renderTimeSection(digits, description, hasSeparator) {
        if (digits === "") {
            return null;
        }

        const styleSheet = this.styleSheet;
        let separator;
        if (hasSeparator) {
            separator = <div className={styleSheet.digitContainerSeparator}>
                {":"}
            </div>
        }

        return [
            <div className={styleSheet.timeSection}>
                <div className={styleSheet.timeSectionDigitsContainer}>
                    {
                        digits.split("").map((digit) => {
                            return <div className={styleSheet.digitContainer}>
                                {digit}
                            </div>;
                        })
                    }
                </div>
                <div className={styleSheet.timeSectionDescription}>
                    {description}
                </div>
            </div>,
            separator
        ];
    }

    formatTimeUnit(value, shouldHideNull=false) {
        if (value === 0 && shouldHideNull) {
            return "";
        }

        if (value < 10) {
            return "0" + String(value);
        }
        return String(value);
    }

    hasEnded() {
        return this.getTimeLeft().valueOf() === 0;
    }

    render() {
        if (this.hasEnded()) {
            return null;
        }

        const timeLeft = this.getTimeLeft();

        return [
            this.options.hasDays ?
                this.renderTimeSection(
                    this.formatTimeUnit(timeLeft.toDays(), true), "Days",
                    this.options.hasHours || this.options.hasMinutes || this.options.hasSeconds
                ) : "",
            this.options.hasHours ?
                this.renderTimeSection(
                    this.formatTimeUnit(timeLeft.getHours()), "Hours",
                    this.options.hasMinutes || this.options.hasSeconds
                ) : "",
            this.options.hasMinutes ?
                this.renderTimeSection(
                    this.formatTimeUnit(timeLeft.getMinutes()), "Minutes",
                    this.options.hasSeconds
                ) : "",
            this.options.hasSeconds ?
                this.renderTimeSection(this.formatTimeUnit(timeLeft.getSeconds()), "Seconds") : "",
        ];
    }

    onMount() {
        this.intervalId = setInterval(() => {
            this.redraw();
            if (this.hasEnded()) {
                this.onUnmount();
            }
        }, 1000);
    }

    onUnmount() {
        clearInterval(this.intervalId);
    }
}

class ContestCountdownStyle extends StyleSheet {
    primaryColor = IEEE_PRIMARY_COLOR;

    @styleRule
    countdownDescription = {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: this.primaryColor,
        fontSize: 25,
        padding: "15px 0",
    };
}

@registerStyle(ContestCountdownStyle)
export class ContestCountdown extends UI.Element {
    checkEndTimeChange(value) {
        if (value == null || !this.endTime || !this.endTime.isSame(value)) {
            this.endTime = value;
            this.redraw();
        }
    }

    updateEndTime() {
        const {contest} = this.options;

        if (contest.getStartTime() && !contest.hasStarted()) {
            this.checkEndTimeChange(new StemDate(contest.getStartTime()));
        } else if (contest.getEndTime() && !contest.hasFinished()) {
            this.checkEndTimeChange(new StemDate(contest.getEndTime()));
        } else {
            this.checkEndTimeChange(null);
        }

        this.redraw();
    }

    getCountdownTopDescription() {
        const {contest} = this.options;
        let description;

        if (!contest.hasStarted()) {
            description = "The contest starts in";
        } else if (contest.hasStarted() && !contest.hasFinished()) {
            description = "The contest ends in";
        } else {
            description = "The contest has ended, congratulations everyone!";
        }

        return <div className={this.styleSheet.countdownDescription}>
            {description}
        </div>;
    }

    getCountdownBottomDescription() {
        const {contest} = this.options;

        if (!contest.hasStarted()) {
            return [
                <div className={this.styleSheet.countdownDescription}>
                    {contest.getFormattedStartTime()}
                </div>,
                <div className={this.styleSheet.countdownDescription}>
                    The first task will open automatically when the contest starts.
                </div>,
            ];
        }
        return null;
    }

    render() {
        return [
            this.getCountdownTopDescription(),
            <Countdown endTime={this.endTime} />,
            this.getCountdownBottomDescription(),
        ];
    }

    onMount() {
        this.updateEndTime();
        this.intervalId = setInterval(() => this.updateEndTime(), 1000);
    }

    onUnmount() {
        clearInterval(this.intervalId);
    }
}

// TODO: The Countdown.jsx file should end here.

class IEEEXtremeCountdownStyle extends CountdownStyle {
    getResizePercent() {
        if (window.innerWidth > 850) {
            return 0.8;
        }
        if (window.innerWidth > 600) {
            return 0.75;
        }
        if (window.innerWidth > 500) {
            return 0.6;
        }
        return 0.45;
    }

    @styleRuleInherit
    digitContainer = {
        height: this.getResizePercent() * this.timeSectionDigitsContainerHeight,
        width: this.getResizePercent() * 75,
        fontSize: this.getResizePercent() * 60,
    };

    @styleRuleInherit
    digitContainerSeparator = {
        width: this.getResizePercent() * 20,
        height: this.getResizePercent() * (this.timeSectionHeight - this.timeSectionDigitsContainerHeight),
        fontSize: this.getResizePercent() * 40,
        paddingBottom: this.getResizePercent() * 60,
    };

    @styleRuleInherit
    timeSectionDescription = {
        height: this.getResizePercent() * (this.timeSectionHeight - this.timeSectionDigitsContainerHeight),
        fontSize: this.getResizePercent() * 22,
    };
}

@registerStyle(IEEEXtremeCountdownStyle)
class IEEEXtremeCountdown extends Countdown {}

class IEEEXtremeContestCountdownStyle extends ContestCountdownStyle {
    getResizePercent() {
        if (window.innerWidth > 850) {
            return 0.8;
        }
        if (window.innerWidth > 600) {
            return 0.75;
        }
        return 0.6;
    }

    @styleRuleInherit
    countdownDescription = {
        fontSize: this.getResizePercent() * 25,
        padding: this.getResizePercent() * 5 + "px 0",
    };
}

@registerStyle(IEEEXtremeContestCountdownStyle)
export class IEEEXtremeContestCountdown extends ContestCountdown {
    render() {
        return [
            this.getCountdownTopDescription(),
            <IEEEXtremeCountdown endTime={this.endTime} />,
            this.getCountdownBottomDescription(),
        ];
    }
}