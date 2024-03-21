import {
    UI
} from "UI";
import {
    StemDate
} from "time/Date";

class LocalizedTime extends UI.Element {
    getDefaultOptions() {
        return {
            format: "HH:mm",
            value: 0,
        };
    }

    render() {
        return new StemDate(this.options.value).format(this.options.format);
    }
}

export {
    LocalizedTime
};