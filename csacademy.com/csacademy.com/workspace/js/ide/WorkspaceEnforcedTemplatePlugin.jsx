import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {Button} from "../../../stemjs/src/ui/button/Button.jsx";
import {ContestTaskStore} from "../../../contest/js/state/ContestTaskStore.js";
import {Dispatcher} from "../../../stemjs/src/base/Dispatcher.js";

import {WorkspacePlugin} from "./WorkspacePlugin.js";
import {getRanges, updateAceRanges, removeDecorations, decorateCollapsed, decorateUncollapsed} from "../EnforcedTemplateUtils.jsx";


class WorkspaceEnforcedTemplatePlugin extends WorkspacePlugin {
    static priorityIndex = 400;

    constructor(workspaceIDE) {
        super(workspaceIDE);

        let code = this.workspaceIDE.codeEditor.getValue();
        while (code.indexOf("\r") !== -1) {
            code = code.replace("\r", "");
        }
        this.workspaceIDE.codeEditor.setValue(code);

        let contestTask = ContestTaskStore.get(this.workspaceIDE.options.contestTaskId);
        let evalTask = contestTask.getEvalTask();
        if (!evalTask.hasEnforcedTemplates()) {
            return;
        }
        this.markers = [];
        this.ranges = [];
        this.workspace = workspaceIDE.workspace;
        this.programmingLanguageSelect = this.workspaceIDE.programmingLanguageSelect;
        let tryUpdateTemplate = () => {
            let matchedTemplate = this.updateTemplate(this.programmingLanguageSelect.get());
            if (matchedTemplate) {
                this.updateAceMethods();
            } else {
                this.undoUpdateAceMethods();
            }
            this.updateGutter();
        };
        this.programmingLanguageSelect.addChangeListener(() => {
            tryUpdateTemplate();
        });
        Dispatcher.Global.addListener("finishedLoadEvalJobSource", () => {
            tryUpdateTemplate();
        });
        this.workspaceIDE.addListener("finishedFileUpload", () => {
            tryUpdateTemplate();
        });

        const UndoManager = window.ace.require("ace/undomanager").UndoManager;
        const oldUndo = UndoManager.prototype.undo;
        UndoManager.prototype.undo = function() {
            let returnValue = oldUndo.call(this, ...arguments);
            if (returnValue) {
                tryUpdateTemplate();
            }
            return returnValue;
        };
        const oldRedo = UndoManager.prototype.redo;
        UndoManager.prototype.redo = function() {
            let returnValue = oldRedo.call(this, ...arguments);
            if (returnValue) {
                tryUpdateTemplate();
            }
            return returnValue;
        };

        tryUpdateTemplate();

        let ace = this.workspaceIDE.codeEditor.ace;
        this.lastCursorPosition = this.currentCursorPosition = ace.selection.getCursor();
        this.lineCount = 0;
        ace.on("change", () => {
            this.updateGutter();
        });
        ace.selection.on("changeCursor", () => {
            this.lastCursorPosition = this.currentCursorPosition;
            this.currentCursorPosition = ace.selection.getCursor();
        });

        this.workspaceIDE.resetTemplateButton = <Button className={this.workspaceIDE.styleSheet.menuButton}
                                                           label={"Load template"} icon="refresh"
                                                           style={{display: "inline-block"}}
                                                           onClick={() => this.resetTemplate()}/>;
        this.workspaceIDE.resetTemplateButton.mount(this.workspaceIDE.optionButtonsTopRight, this.workspaceIDE.settingsButton.node);
    };

    undoUpdateAceMethods() {
        if (!this.updatedAceMethods) {
            return;
        }

        let editor = this.workspaceIDE.codeEditor;
        let ace = editor.ace;
        let session = this.session;

        editor.removeNodeListener("keypress", this.keyPressCallback);
        ace.$tryReplace = ace.old$tryReplace;
        session.insert = session.oldInsert;
        session.remove = session.oldRemove;
        session.moveTest = session.oldMoveText;
        session.off("changeFold", this.changeFoldCallback);
        ace.off("gutterclick", this.gutterClickCallback);
        let Mode = window.ace.require("ace/mode/text").Mode;
        Mode.prototype.toggleCommentLines = Mode.prototype.oldToggleCommentLines;
        this.updatedAceMethods = false;
    }

    updateAceMethods() {
        if (this.updatedAceMethods) {
            return;
        }

        let editor = this.workspaceIDE.codeEditor;
        let ace = editor.ace;
        let session = this.session;

        // HUGE HACK TO DEAL WITH ACE BULLSHIT
        // Pressing "enter" right before a space will delete the space even if it's
        // inside an un-editable area...
        this.keyPressCallback = (event) => {
            let cursor = ace.getCursorPosition();
            for (let range of this.ranges) {
                if (insideRange(range, cursor)) {
                    event.preventDefault();
                    event.stopPropagation();
                    return;
                }
            }
        };
        editor.addNodeListener("keypress", this.keyPressCallback);

        let beforeRange = (range, position) => {
            let start = range.start;
            return position.row < start.row || (position.row == start.row && position.column <= start.column);
        };
        let afterRange = (range, position) => {
            let end = range.end;
            return position.row > end.row || (position.row == end.row && position.column >= end.column);
        };

        let insideRange = (range, position) => {
            return !beforeRange(range, position) && !afterRange(range, position);
        };
        let intersects = (range1, range2) => {
            return  insideRange(range1, range2.start) ||
                    insideRange(range1, range2.end) ||
                    insideRange(range2, range1.start) ||
                    insideRange(range2, range1.end);
        };
        let allRange = (start, range, end) => {
            return start.row === range.start.row && start.column === range.start.column &&
                    end.row === range.end.row && end.column === range.end.column;
        };


        //not lambdas. Need a reference
        let self = this;
        ace.old$tryReplace = ace.$tryReplace;
        ace.$tryReplace = function(replaceRange) {
            for (let range of self.ranges) {
                if (intersects(range, replaceRange)) {
                    return null;
                }
            }
            return ace.old$tryReplace(...arguments);
        };
        session.oldInsert = session.insert;
        session.insert = function(position, text) {
            let afterAll = true, beforeAll = true;
            for (let range of self.ranges) {
                if (insideRange(range, position) || (position.column === 0 && position.row === range.start.row)) {
                    return;
                }
                if (beforeRange(range, position)) {
                    afterAll = false;
                }
                if (afterRange(range, position)) {
                    beforeAll = false;
                }
            }
            if (!afterAll && !beforeAll) {
                return session.oldInsert(...arguments);
            }
        };
        session.oldRemove = session.remove;
        session.remove = function(removeRange) {
            for (let range of self.ranges) {
                if (intersects(range, removeRange) || removeRange.end.row === range.start.row) {
                    return false;
                }
            }
            for (let i = 0; i < self.ranges.length - 1; i += 1) {
                if (allRange(self.ranges[i].end, removeRange, self.ranges[i + 1].start)) {
                    return false;
                }
            }
            return session.oldRemove(...arguments);
        };
        session.oldMoveText = session.moveText;
        session.moveText = function(fromRange, toPosition, copy) {
            for (let range of self.ranges) {
                if (intersects(range, fromRange) || insideRange(range, toPosition)) {
                    return fromRange;
                }
            }
            return session.oldMoveText(...arguments);
        };
        this.changeFoldCallback =  (edit) => {
            if (!edit.data || editor.getValue() === "") {
                return;
            }
            if (edit.action === "remove") {
                for (let i = 0; i < this.folds.length; i += 1) {
                    if (edit.data === this.folds[i]) {
                        this.folds[i] = {isFolded: false};
                        decorateUncollapsed(session, this.ranges[i]);
                        this.updateGutter();
                        break;
                    }
                }
            }
        };
        session.on("changeFold", this.changeFoldCallback);
        this.gutterClickCallback = (event) => {
            let row = event.getDocumentPosition().row;
            for (let i = 0; i < this.ranges.length; i += 1) {
                if (this.ranges[i].start.row === row && this.folds[i]) {
                    ace.selection.clearSelection();
                    ace.selection.moveCursorTo(this.lastCursorPosition.row, this.lastCursorPosition.column);
                    if (this.folds[i].isFolded) {
                        session.removeFold(this.folds[i]);
                    } else if (!this.folds[i].isFolded) {
                        const Range = window.ace.require("ace/range").Range;
                        this.folds[i] = session.addFold("...", new Range(this.ranges[i].start.row, this.ranges[i].start.column, this.ranges[i].end.row - 1, 10000));
                        this.folds[i].isFolded = true;
                        decorateCollapsed(session, this.ranges[i]);
                    }
                }
            }
        };
        ace.on("gutterclick", this.gutterClickCallback);


        let Mode = window.ace.require("ace/mode/text").Mode;
        Mode.prototype.oldToggleCommentLines = Mode.prototype.toggleCommentLines;
        Mode.prototype.toggleCommentLines = function(state, session, startRow, endRow) {
            let language = self.programmingLanguageSelect.get();
            let contestTask = ContestTaskStore.get(self.workspaceIDE.options.contestTaskId);
            let evalTask = contestTask.getEvalTask();
            let template = evalTask.enforcedTemplates[language.id] || [];
            let ranges = getRanges(template, self.workspaceIDE.codeEditor.getValue());
            for (let range of ranges) {
                if (range.start.row <= startRow && startRow < range.end.row) {
                    return;
                }
                if (range.start.row <= endRow && endRow < range.end.row) {
                    return;
                }
            }
            this.oldToggleCommentLines(state, session, startRow, endRow);
        };

        this.updatedAceMethods = true;
    }

    updateGutter() {
        if (!this.workspaceIDE.codeEditor.getValue()) {
            return;
        }
        this.lineCount = Math.max(this.lineCount, this.session.doc.getLength());
        for (let i = 0; i <= this.lineCount; i += 1) {
            removeDecorations(this.session, i);
        }
        for (let i = 0; i < (this.ranges || []).length; i += 1) {
            if (this.folds[i] && this.folds[i].isFolded) {
                decorateCollapsed(this.session, this.ranges[i]);
            } else if (this.folds[i]) {
                decorateUncollapsed(this.session, this.ranges[i]);
            }
        }
    }

    updateTemplate(language) {
        let editor = this.workspaceIDE.codeEditor;
        let ace = editor.ace, session;
        this.session = session = ace.getSession();
        let code = editor.getValue();

        let contestTask = ContestTaskStore.get(this.workspaceIDE.options.contestTaskId);
        let evalTask = contestTask.getEvalTask();
        let template = evalTask.enforcedTemplates[language.id] || [];
        for (let markerId of this.markers) {
            session.removeMarker(markerId)
        }
        this.markers = [];
        for (let fold of (this.folds || [])) {
            if (fold && fold.isFolded) {
                session.removeFold(fold);
            }
        }
        this.folds = [];
        if (!evalTask.getTemplate(language)) {
            return;
        }
        this.ranges = updateAceRanges(template, code, this.markers, this.folds, session, true);
        if (this.ranges) {
            this.updateGutter();
        }

        return !!this.ranges;
    }

    resetTemplate() {
        let language = this.programmingLanguageSelect.get();
        let contestTask = ContestTaskStore.get(this.workspaceIDE.options.contestTaskId);
        let evalTask = contestTask.getEvalTask();
        if (evalTask.hasEnforcedTemplates() && evalTask.getTemplate(language)) {
            this.workspaceIDE.codeEditor.setValue(evalTask.getTemplate(language), 1);
            let match = this.updateTemplate(language);
            if (match) {
                this.updateAceMethods();
            } else {
                this.undoUpdateAceMethods();
            }
        } else {
            this.workspaceIDE.codeEditor.setValue(language.getDefaultTemplateComment() + language.getDefaultSource());
        }
    }
}

export {WorkspaceEnforcedTemplatePlugin};
