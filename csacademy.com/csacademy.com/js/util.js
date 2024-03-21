import {
    Duration
} from "../../stemjs/src/time/Duration.js";

export function isWhiteSpace(character) {
    return ((character + "").trim() === "");
}

// TODO: why is there a callback second argument??
export function consoleTokenizer(input, callback) {
    var currentToken = "";
    var doubleQuotesOpen = false;
    var tokens = [];
    var i = 0;

    while (i < input.length) {
        if (input[i] === "\\") {
            // A backslash can only be followed by another backslash or double quotes
            if (input[i + 1] === "\\" || input[i + 1] === "\"") {
                currentToken += input[i + 1];
                i += 2;
            } else {
                throw "A backslash must be followed by another backslash or double quotes";
            }
        } else if (input[i] === "\"") {
            // Double quotes that are placed at the end of the token must be at the end of the string or followed by
            // a white character, meaning the current token is ended and needs to be inserted in the array
            if (doubleQuotesOpen === true && (i + 1 === input.length || isWhiteSpace(input[i + 1]))) {
                doubleQuotesOpen = false;
                tokens.push(currentToken);
                currentToken = "";
                i += 2;
            } else if (doubleQuotesOpen === false && currentToken === "") {
                // Double quotes can also mean the beginning of a token with special characters
                doubleQuotesOpen = true;
                i += 1;
            } else {
                throw "Double quotes must be preceded by backslash if they are inside a word";
            }
        } else if (!doubleQuotesOpen && isWhiteSpace(input[i])) {
            // A whitespace outside of double quotes closure means the end of a token, so it is inserted in the
            // array and reinitialized with empty string
            if (currentToken !== "") {
                tokens.push(currentToken);
                currentToken = "";
            }
            i += 1;
        } else {
            // If there is no special case we append the current letter to the end of the token
            currentToken += input[i];
            i += 1;
        }
    }

    // Insert the current token if it isn't empty
    if (currentToken !== "") {
        tokens.push(currentToken);
    }

    // Double quotes open are a syntax error
    if (doubleQuotesOpen === true) {
        throw "Double quotes can't be left open";
    }

    return tokens;
}

export const Formatter = {
    cpuTime: function(value) {
        if (value == null) {
            return "-";
        }
        return Math.round(value * 1000.0) + " ms";
    },
    memory: function(value, shortForm = false) {
        if (value == null) {
            return "-";
        }
        if (value < 2048) {
            return value + (shortForm ? "" : " ") + "B";
        }
        var memUsage = value / 1024;
        var suffix = "KB";

        if (memUsage >= 1024 * 1024) {
            memUsage /= 1024 * 1024;
            suffix = "GB";
        } else if (memUsage >= 10 * 1024) {
            memUsage /= 1024;
            suffix = "MB";
        }

        memUsage = Math.round(memUsage * 10) / 10;
        return memUsage.toString() + (shortForm ? "" : " ") + suffix;
    },
    duration: (value, options) => {
        // value in milliseconds
        value = new Duration(value);

        let result = [];
        if (options.days && value.toDays()) {
            let d = value.toDays() + " day";
            if (value.toDays() >= 2) {
                d += "s";
            }
            result.push(d);
        }

        if (options.hours && value.getHours()) {
            let h = value.getHours() + " hour";
            if (value.getHours() >= 2) {
                h += "s";
            }
            result.push(h);
        }

        if (options.minutes && value.getMinutes()) {
            let m = value.getMinutes() + " minute";
            if (value.getMinutes() >= 2) {
                m += "s";
            }
            result.push(m);
        }

        if (options.seconds && value.getSeconds()) {
            let s = value.getSeconds() + " second";
            if (value.getSeconds() >= 2) {
                s += "s";
            }
            result.push(s);
        }
        if (result.length === 0) {
            return "";
        }
        if (result.length === 1) {
            return result[0];
        }
        if (options.lastSeparator) {
            let firstPart = result.slice(0, -1).join(options.separator || " ");
            return firstPart + options.lastSeparator + result[result.length - 1];
        }
        return result.join(options.separator || " ");
    },
    truncate: (value, precision = 0) => {
        var power = Math.pow(10, precision);
        if (typeof value === "string") {
            value = parseFloat(value);
        }
        return Math.round(value * power) / power;
    }
};

export function getTextWidth(text, options) {
    options = options || {};
    // Re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = (options.fontSize || 12) + "px " + (options.font || "Segoe UI");
    var metrics = context.measureText(text);
    return metrics.width;
}

export function parseIntegers(str) {
    let int = [];
    let currentInt = 0;
    let started = false;
    let sign = 1;
    for (let i = 0; i < str.length; i += 1) {
        if ("0123456789".indexOf(str[i]) !== -1) {
            started = true;
            currentInt = currentInt * 10 + str.charCodeAt(i) - 48;
        } else if ("-".indexOf(str[i]) !== -1 && !started) {
            sign = -1;
        } else {
            if (started) {
                int.push(sign * currentInt);
            }
            currentInt = 0;
            sign = 1;
            if ("-".indexOf(str[i]) !== -1) {
                sign = -1;
            }
            started = false;
        }
    }
    if (started) {
        int.push(sign * currentInt);
    }
    return int;
}

// This is how you calculate viewport height. See: https://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
//var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
//var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)