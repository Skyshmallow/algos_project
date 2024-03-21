import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {Theme} from "../../../stemjs/src/ui/style/Theme.js";


export function SuccessMessage(message) {
    return <p style={{color: Theme.props.COLOR_SUCCESS}}>✅ {message}</p>
}


export function WarningMessage(message) {
    return <p style={{color: Theme.props.COLOR_WARNING}}>⚠️ {message}</p>
}


export function ErrorMessage(message) {
    return <p style={{color: Theme.props.COLOR_DANGER}}>❌ {message}</p>
}


export const IssueSummary = {
    _warnings: [],
    _errors: [],
    warn(message) {
        this._warnings.push(message);
    },
    error(message) {
        this._errors.push(message);
    },
    clear() {
        this._warnings = [];
        this._errors = [];
    },
    allOk() {
        return this._warnings.length === 0 && this._errors.length === 0;
    },
    render() {
        if (this.allOk()) {
            return SuccessMessage("OK");
        }
        return [
            ...this._errors.map(message => ErrorMessage(message)),
            ...this._warnings.map(message => WarningMessage(message)),
        ]
    }
}
