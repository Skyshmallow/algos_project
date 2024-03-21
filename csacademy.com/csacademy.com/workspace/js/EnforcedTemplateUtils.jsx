import {StyleSheet} from "../../stemjs/src/ui/Style.js";
import {styleRule} from "../../stemjs/src/ui/Style.js";


export class EnforcedTemplateStyle extends StyleSheet {
    @styleRule
    readOnly = {
        "background-color": "#630707",
        "opacity": "0.2",
        "position": "absolute",
        "z-index": "10",
        "border-radius": "0",
    };

    @styleRule
    firstLine = {
        ":before": {
            "margin-right": "7px",
            "font": "normal normal normal 14px/1 FontAwesome",
            "font-size": "1.1em"
        },
        "margin-left": "-7px",
        "font": "inherit"
    };

    static getCollapsedClassName() {
        return [this.getInstance().firstLine, "fa", "fa-caret-right"];
    }
    static getUncollapsedClassName() {
        return [this.getInstance().firstLine, "fa", "fa-caret-down"];
    }
}

export function removeDecorations(session, row) {
    for (let className of EnforcedTemplateStyle.getCollapsedClassName()) {
        session.removeGutterDecoration(row, className);
    }
    for (let className of EnforcedTemplateStyle.getUncollapsedClassName()) {
        session.removeGutterDecoration(row, className);
    }
}
export function decorateUncollapsed(session, range) {
    for (let className of EnforcedTemplateStyle.getCollapsedClassName()) {
        session.removeGutterDecoration(range.start.row, className);
    }
    for (let className of EnforcedTemplateStyle.getUncollapsedClassName()) {
        session.addGutterDecoration(range.start.row, className);
    }
}
export function decorateCollapsed(session, range) {
    for (let className of EnforcedTemplateStyle.getUncollapsedClassName()) {
        session.removeGutterDecoration(range.start.row, className);
    }
    for (let className of EnforcedTemplateStyle.getCollapsedClassName()) {
        session.addGutterDecoration(range.start.row, className);
    }

}

export function getRanges(template, code) {
    let blocks = [];
    for (let i = 0; i < template.length; i += 1) {
        if (template[i].type === "editable") {
            blocks.push(null);
        } else {
            blocks.push(template[i].lines.join("\n") + "\n");
        }
    }
    let dp = new Map();
    let getDp = (codeIndex, blockIndex) => {
        if (blockIndex === -1) {
            return codeIndex === -1;
        }
        let key = codeIndex + " " + blockIndex;
        if (dp.has(key)) {
            return dp.get(key) !== -2;
        }
        if (blocks[blockIndex]) {
            while (blocks[blockIndex].indexOf("\r") !== -1) {
                blocks[blockIndex] = blocks[blockIndex].replace("\r", "");
            }
            if (codeIndex + 1 < blocks[blockIndex].length ||
                    code.substring(codeIndex - blocks[blockIndex].length + 1, codeIndex + 1) !== blocks[blockIndex] ||
                        !getDp(codeIndex - blocks[blockIndex].length, blockIndex - 1)) {
                dp.set(key, -2);
            } else {
                dp.set(key, codeIndex - blocks[blockIndex].length);
            }
        } else {
            for (let i = 0; i <= codeIndex; i += 1) {
                if (getDp(codeIndex - i, blockIndex - 1)) {
                    dp.set(key, codeIndex - i);
                }
            }
            if (!dp.has(key)) {
                dp.set(key, -2);
            }
        }
        return dp.get(key) !== -2;
    };
    let match = getDp(code.length - 1, blocks.length - 1);
    if (!match) {
        console.error("Failed to identify template.");
        return null;
    }
    let segments = [];
    let codeIndex = code.length - 1;
    for (let blockIndex = blocks.length - 1; blockIndex >= 0; blockIndex -= 1) {
        let previousCodeIndex = dp.get(codeIndex + " " + blockIndex);
        segments.push([previousCodeIndex + 1, codeIndex]);
        codeIndex = previousCodeIndex;
    }
    segments.reverse();
    let ranges = [];
    for (let i = 0; i < segments.length; i += 1) {
        if (template[i].type === "editable") {
            continue;
        }
        let segment = segments[i];
        let getLastLineCharacters = (text) => {
            let lastLineCharacters = 0;
            while (lastLineCharacters + 1 < text.length && text[text.length - 1 - lastLineCharacters] != '\n') {
                lastLineCharacters += 1;
            }
            return lastLineCharacters;
        };

        let firstLine = (code.substring(0, segment[0]).match(/\n/g) || []).length;
        let firstCol = getLastLineCharacters(code.substring(0, segment[0]));
        if (firstCol) {
            firstCol += 1;
        }
        let lastLine = (code.substring(0, segment[1] + 1).match(/\n/g) || []).length;
        let lastCol = getLastLineCharacters(code.substring(0, segment[1] + 1));
        if (lastCol) {
            lastCol += 1;
        }
        const Range = window.ace.require("ace/range").Range;
        ranges.push(new Range(firstLine, firstCol, lastLine, lastCol));
    }
    return ranges;
}

export function updateAceRanges(template, code, markers, folds, session, anchors) {
    let ranges = getRanges(template, code);
    if (!ranges) {
        return null;
    }
    let next = 0;
    for (let block of template) {
        if (block.type === "editable") {
            continue;
        }
        let range = ranges[next ++];
        markers.push(session.addMarker(range, EnforcedTemplateStyle.getInstance().readOnly));
        if (anchors) {
            range.start = session.doc.createAnchor(range.start);
            range.end = session.doc.createAnchor(range.end);
            range.end.$insertRight = true;
        }
        if (block.type === "collapsed") {
            const Range = window.ace.require("ace/range").Range;
            folds.push(session.addFold("...", new Range(range.start.row, range.start.column, range.end.row - 1, 10000)));
            folds[folds.length - 1].isFolded = true;
            decorateCollapsed(session, range);
        } else if (block.type === "collapsible") {
            folds.push({isFolded: false});
            decorateUncollapsed(session, range);
        } else if (block.type === "uncollapsible") {
            folds.push(null);
        }
    }
    return ranges;
}