import {UI} from "../../stemjs/src/ui/UIBase.js";
import {SVG} from "../../stemjs/src/ui/svg/SVGBase.js";
import {SectionDivider} from "../../stemjs/src/ui/section-divider/SectionDivider.jsx";
import {Panel} from "../../stemjs/src/ui/UIPrimitives.jsx";
import {StyleElement} from "../../stemjs/src/ui/StyleElement.jsx";
import {StyleInstance} from "../../stemjs/src/ui/StyleElement.jsx";
import {Orientation} from "../../stemjs/src/ui/Constants.js";
import {CodeEditor} from "../../stemjs/src/ui/CodeEditor.jsx";
import {DelayedElement} from "../../stemjs/src/ui/DelayedElement.js";
import {ensure} from "../../stemjs/src/base/Require.js";

const C = {
    DIFF_EQUAL: 0,
    DIFF_DELETE: -1,
    DIFF_INSERT: 1,
    DIFF_CHANGE: 2,
    DIFF_COMPLEX: -2
};

const Options = {
    gutterBackground: "white",
    aceTheme: {aceName: "dawn"},
    yellowBlockColor: "#FFFECC",
    yellowCurveColor: "#FFFECC",
    yellowStrokeColor: "#F8F48B",
    blueBlockColor: "#C1EBFF",
    blueCurveColor: "#C1EBFF",
    blueStrokeColor: "#6CBADE",
    redBlockColor: "#FFC1C2",
    redCurveColor: "#FFC1C2",
    redStrokeColor: "#F08D8D",
    greenBlockColor: "#C7EFCC",
    greenCurveColor: "#C7EFCC",
    greenStrokeColor: "#6FC278",
    strokeWidth: "1px",
    arrowsColor: "black"
};
const ColorStyle = {
    "-1": "red-diff ",
    "1": "green-diff ",
    "2": "blue-diff ",
    "-2": "yellow-diff "
};

class DiffGutter extends SVG.SVGRoot {
}

export class DiffWidget extends UI.Element {
    render() {
        return [
            <SectionDivider className="diffing-tool" ref="sectionDivider" orientation={Orientation.HORIZONTAL} style={{height: "100%"}}>
                <div style={{width: "50%", height: "100%"}}>
                    <CodeEditor ref="leftCodeEditor" value={this.options.leftTextValue} readOnly={!this.options.leftEditable}
                                   style={{height:"100%"}} />
                </div>
                <Panel fixed ref="diffGutterPanel" style={{display:"inline-block", height:"100%", width:"100px", overflow: "hidden"}}>
                    <DiffGutter ref="diffGutter" style={{backgroundColor: Options.gutterBackground, height:"100%", width:"100%"}}/>
                </Panel>
                <div style={{width: "50%", height: "100%"}}>
                    <CodeEditor ref="rightCodeEditor" value={this.options.rightTextValue} readOnly={!this.options.rightEditable}
                                   style={{height:"100%"}}/>
                </div>
            </SectionDivider>,
            <StyleElement>
                <StyleInstance selector=".yellow-diff" ref="yellowDiffStyle" attributes={{"background-color": Options.yellowBlockColor, "fill": Options.yellowCurveColor, stroke: Options.yellowStrokeColor, "border-color": Options.yellowStrokeColor + " !important", "stroke-width": Options.strokeWidth}} />
                <StyleInstance selector=".blue-diff" ref="blueDiffStyle" attributes={{"background-color": Options.blueBlockColor, "fill": Options.blueCurveColor, stroke: Options.blueStrokeColor, "border-color": Options.blueStrokeColor + " !important", "stroke-width": Options.strokeWidth}} />
                <StyleInstance selector=".red-diff" ref="redDiffStyle" attributes={{"background-color": Options.redBlockColor, "fill": Options.redCurveColor, stroke: Options.redStrokeColor, "border-color": Options.redStrokeColor + " !important", "stroke-width": Options.strokeWidth}} />
                <StyleInstance selector=".green-diff" ref="greenDiffStyle" attributes={{"background-color": Options.greenBlockColor, "fill": Options.greenCurveColor, stroke: Options.greenStrokeColor, "border-color": Options.greenStrokeColor + " !important", "stroke-width": Options.strokeWidth}} />
                <StyleInstance selector=".acediff-diff.lines" attributes={{"position":"absolute", "z-index":"3"}} />
                <StyleInstance selector=".acediff-diff.targetOnly" attributes={{"height": "0px !important", "z-index": "4", "left": "4px !important", "border-top": "1px solid", "border-bottom": "1px solid", "position": "absolute"}} />
                <StyleInstance selector=".acediff-diff.targetOnly.top" attributes={{"top": "-2px", "border-top": "0px"}} />
                <StyleInstance selector=".acediff-diff.targetOnly.bottom" attributes={{"border-bottom": "0px"}} />
                <StyleInstance selector=".cursor-bar-yellow-diff" attributes={{"width": "0px", "background-color": "transparent", "border-left": "2px solid " + Options.yellowStrokeColor}} />
                <StyleInstance selector=".cursor-bar-red-diff" attributes={{"width": "0px", "background-color": "transparent", "border-left": "2px solid " + Options.redStrokeColor}} />
                <StyleInstance selector=".cursor-bar-green-diff" attributes={{"width": "0px", "background-color": "transparent", "border-left": "2px solid " + Options.greenStrokeColor}} />
                <StyleInstance selector=".cursor-bar-blue-diff" attributes={{"width": "0px", "background-color": "transparent", "border-left": "2px solid " + Options.blueStrokeColor}} />
                <StyleInstance selector=".diffing-tool .ace-dawn .ace_marker-layer .ace_active-line" attributes={{"background": "rgba(36, 87, 121, 0.15) !important", "z-index": "7", "margin-left": "4px", "opacity": "30%"}} />
            </StyleElement>
        ];
    }

    getDefaultOptions() {
        return {
            leftTextValue: "Welcome to our Diffing Tool!\n\nYou can edit both of these panels and the diff is updated live.\n\nThis block is identical in both sides.\nTherefore it is not highlighted.\n\nThis block has been deleted.\nDeleted blocks appear with color red.\n\nYellow is mostly used for partial identical content.\n\nThe blue color is used for many changes\ninside a block, so the entire block is\nconsidered changed.\n",
            rightTextValue: "Welcome to our Diffing Tool!\n\nYou can edit both of these panels and the diff is updated live.\n\nThis new block has been inserted.\nInserted blocks appear with color green.\n\nThis block is identical in both sides.\nTherefore it is not highlighted.\n\n\nYellow is used for partial identical text content.\n\nAzure denotes what is written in the left side \n(this block is to exemplify only)\n\nYou can click on the arrows in the central gutter to move changes from one part to the other.\n",
            leftEditable: true,
            rightEditable: true
        };
    }

    setLeftEditable(leftEditable) {
        this.updateOptions({leftEditable});
    }

    setRightEditable(rightEditable) {
        this.updateOptions({rightEditable});
    }

    setLeftText(leftTextValue) {
        this.updateOptions({leftTextValue});
    }

    setRightText(rightTextValue) {
        this.updateOptions({rightTextValue});
    }

    onMount() {
        this.leftCodeEditor.setAceTheme(Options.aceTheme);
        this.rightCodeEditor.setAceTheme(Options.aceTheme);
        this.rightCodeEditor.setShowGutter(false);
        this.leftCodeEditor.markers = [];
        this.rightCodeEditor.markers = [];

        this.diffGutterPanel.addNodeListener("mousewheel", (event) => {
            event.preventDefault();
            event.stopPropagation();

            this.leftCodeEditor.setScrollTop(this.leftCodeEditor.getScrollTop() + event.deltaY);
            this.rightCodeEditor.setScrollTop(this.rightCodeEditor.getScrollTop() + event.deltaY);
        });

        let initialDiffMade = false;

        this.leftCodeEditor.whenLoaded(() => {
            this.rightCodeEditor.whenLoaded(() => {
                setTimeout(() => {
                    this.makeDiffs();
                    initialDiffMade = true;
                });
            });
        });

         let changeBehaviour = () => {
            if (initialDiffMade) {
                this.makeDiffs();
            }
        };

        this.leftCodeEditor.addAceSessionEventListener("changeScrollTop", changeBehaviour);
        this.rightCodeEditor.addAceSessionEventListener("changeScrollTop", changeBehaviour);

        this.leftCodeEditor.addAceSessionChangeListener(changeBehaviour);
        this.rightCodeEditor.addAceSessionChangeListener(changeBehaviour);

        window.addEventListener("resize", changeBehaviour);
    }

    makeDiffs() {
        this.computeDiffs();
        this.createLogicalDiffs();
        this.deleteVisualDiffs();
        this.drawVisualDiffs();
    }

    computeDiffs() {
        let dmp = new diff_match_patch();
        let leftText = this.leftCodeEditor.getValue();
        let rightText = this.rightCodeEditor.getValue();
        let diff = dmp.diff_main(leftText, rightText);
        dmp.diff_cleanupSemantic(diff);
        this.diffs = diff;
    }

    createLogicalDiffs() {
        this.diffBlocks = [];
        this.diffCurves = [];

        let myDiffs = [];

        let lastType = 0;
        this.diffs.forEach((chunk) => {
            if (chunk[1] === "") {
                return;
            }
            if (chunk[0] === C.DIFF_EQUAL) {
                myDiffs.push({
                    type: C.DIFF_EQUAL,
                    leftText: chunk[1],
                    rightText: chunk[1]
                });
            } else if (chunk[0] === C.DIFF_INSERT) {
                if (lastType === C.DIFF_DELETE) {
                    myDiffs.last().type = C.DIFF_CHANGE;
                    myDiffs.last().rightText += chunk[1];
                } else {
                    myDiffs.push({
                        type: C.DIFF_INSERT,
                        leftText: "",
                        rightText: chunk[1]
                    });
                }
            } else if (chunk[0] === C.DIFF_DELETE) {
                if (lastType === C.DIFF_INSERT) {
                    myDiffs.last().type = C.DIFF_CHANGE;
                    myDiffs.last().leftText += chunk[1];
                } else {
                    myDiffs.push({
                        type: C.DIFF_DELETE,
                        leftText: chunk[1],
                        rightText: ""
                    });
                }
            }
            lastType = chunk[0];
        });

        let change = {
            leftStartRow: 0,
            leftEndRow: 0,
            rightStartRow: 0,
            rightEndRow: 0
        };

        let offset = {
            leftRow: 0,
            rightRow: 0,
            leftColumn: 0,
            rightColumn: 0
        };

        let changeBegun = false;
        let type = 0;
        let changeCount = 0;

        myDiffs.forEach((chunk) => {
            let leftText = chunk.leftText;
            let rightText = chunk.rightText;
            let leftRowsCount = leftText.split("\n").length - 1;
            let rightRowsCount = rightText.split("\n").length - 1;
            let leftColumnCount = leftText.split("\n")[leftRowsCount].length;
            let rightColumnCount = rightText.split("\n")[rightRowsCount].length;
            let oldLeftStartRow = offset.leftRow;
            let oldRightStartRow = offset.rightRow;
            let currentLeftRow;
            let currentLeftColumn;
            let currentRightRow;
            let currentRightColumn;
            let bothBlocks = true;

            if (!leftRowsCount && !leftColumnCount && !rightRowsCount && !rightColumnCount) {
                return;
            }

            type = chunk.type;

            currentLeftRow = offset.leftRow + leftRowsCount + (leftColumnCount > 0);
            currentLeftColumn = (leftRowsCount > 0 ? leftColumnCount : offset.leftColumn + leftColumnCount) + (leftColumnCount !== 0);
            currentRightRow = offset.rightRow + rightRowsCount + (rightColumnCount > 0);
            currentRightColumn = (rightRowsCount > 0 ? rightColumnCount : offset.rightColumn + rightColumnCount) + (rightColumnCount !== 0);

            if (offset.leftColumn || offset.rightColumn) {
                bothBlocks = false;
            }

            if (type !== C.DIFF_EQUAL) {
                this.diffBlocks.push([type, offset.leftRow, offset.leftColumn, currentLeftRow, currentLeftColumn, offset.rightRow, offset.rightColumn, currentRightRow, currentRightColumn]);
            }

            offset.leftRow += leftRowsCount;
            offset.leftColumn = currentLeftColumn - (leftColumnCount !== 0);
            offset.rightRow += rightRowsCount;
            offset.rightColumn = currentRightColumn - (rightColumnCount !== 0);

            if (offset.leftColumn || offset.rightColumn) {
                bothBlocks = false;
            }
            if (bothBlocks && type !== C.DIFF_EQUAL) {
                this.diffCurves.push([type, oldLeftStartRow, offset.leftRow + (offset.leftColumn !== 0), oldRightStartRow, offset.rightRow + (offset.rightColumn !== 0)]);
            }
            if (changeBegun && (((offset.leftRow > change.leftEndRow || offset.rightRow > change.rightEndRow) && type === C.DIFF_EQUAL) || bothBlocks)) {
                this.diffCurves.push([C.DIFF_COMPLEX, change.leftStartRow, change.leftEndRow, change.rightStartRow, change.rightEndRow]);
                this.diffBlocks.push([C.DIFF_COMPLEX, change.leftStartRow, 0, change.leftEndRow, 0, change.rightStartRow, 0, change.rightEndRow, 0]);
                changeCount = 0;
                changeBegun = false;
            } else if (!changeBegun && type !== C.DIFF_EQUAL && !bothBlocks) {
                changeBegun = true;
                changeCount = 1;
                change.leftStartRow = oldLeftStartRow;
                change.rightStartRow = oldRightStartRow;
                change.leftEndRow = offset.leftRow + (offset.leftColumn !== 0);
                change.rightEndRow = offset.rightRow + (offset.rightColumn !== 0);
            } else if (changeBegun) {
                changeCount += 1;
                change.leftEndRow = offset.leftRow + (offset.leftColumn !== 0);
                change.rightEndRow = offset.rightRow + (offset.rightColumn !== 0);
            }
        });

        if (changeBegun) {
            if (changeCount !== 1 || !type) {
                type = C.DIFF_COMPLEX;
            }
            this.diffCurves.push([type, change.leftStartRow, change.leftEndRow, change.rightStartRow, change.rightEndRow]);
            this.diffBlocks.push([C.DIFF_COMPLEX, change.leftStartRow, 0, change.leftEndRow, 0, change.rightStartRow, 0, change.rightEndRow, 0]);
        }
    }

    drawVisualDiffs() {
        this.drawCurves();
        this.drawBlocks();
    }

    deleteVisualDiffs() {
        this.deleteCurves();
        this.deleteBlocks();
    }

    drawCurves() {
        this.diffCurves.forEach((chunk) => {
            this.drawDiffCurve(chunk[0], chunk[1], chunk[2], chunk[3], chunk[4]);
        });
        for (let i = 0; i < this.diffCurves.length; i += 1) {
            this.diffGutter.children[i].setAttribute("class", ColorStyle[this.diffCurves[i][0]]);
        }
        this.diffCurves.forEach((chunk) => {
            this.drawArrows(chunk[0], chunk[1], chunk[2], chunk[3], chunk[4]);
        });
    }

    deleteCurves() {
        this.diffGutter.updateOptions({children: []});
    }

    drawBlocks() {
        // In order for the yellow blocks to be at the base, we need to reverse the order we draw the blocks.
        this.diffBlocks.reverse();
        this.diffBlocks.forEach((chunk) => {
            this.drawDiffBlock(this.leftCodeEditor, chunk[0], chunk[1], chunk[2], chunk[3], chunk[4]);
            this.drawDiffBlock(this.rightCodeEditor, chunk[0], chunk[5], chunk[6], chunk[7], chunk[8]);
        });
    }

    deleteBlocks() {
        this.leftCodeEditor.markers.forEach((marker) => {
            this.leftCodeEditor.removeMarker(marker);
        });
        this.rightCodeEditor.markers.forEach((marker) => {
            this.rightCodeEditor.removeMarker(marker);
        });
    }

    drawArrows(type, leftStartRow, leftEndRow, rightStartRow, rightEndRow, leftArrow, rightArrow) {
        let leftScrollTop  = this.leftCodeEditor.getScrollTop();
        let rightScrollTop = this.rightCodeEditor.getScrollTop();
        let leftRowHeight = this.leftCodeEditor.getRendererLineHeight();
        let rightRowHeight = this.rightCodeEditor.getRendererLineHeight();

        let p1_x = 3;
        let p1_y = (leftStartRow * leftRowHeight - leftScrollTop + leftEndRow * leftRowHeight - leftScrollTop + 2) / 2;
        let p2_x = this.diffGutter.getWidth() - 3;
        let p2_y = (rightStartRow * rightRowHeight - rightScrollTop + rightEndRow * rightRowHeight - rightScrollTop + 2) / 2;
        let h = 5;
        let w = 5;
        let dLeft = 'M ' + p1_x + ' ' + (p1_y - h) + ' l ' + w + ' ' + h + ' l ' + -w + ' ' + h + 'm 6 0 l ' + w + ' ' + -h + ' l ' + -w + ' ' + -h;
        let rLeft = 'M ' + p1_x + ' ' + (p1_y - h) + ' l ' + (2 * w + 6) +  ' 0 l 0 ' + (2 * h) + ' l ' + (-2 * w - 6) + ' 0 z';
        let dRight = 'M ' + p2_x + ' ' + (p2_y - h) + ' l ' + -w + ' ' + h + ' l ' + w + ' ' + h + 'm -6 0 l ' + -w + ' ' + -h + ' l ' + w + ' ' + -h;
        let rRight = 'M ' + p2_x + ' ' + (p2_y - h) + ' l ' + (-2 * w - 6) + ' 0 l 0 ' + (2 * h) + ' l ' + (2 * w + 6) + ' 0 z';

        if (this.options.rightEditable) {
            if (typeof leftArrow !== "undefined") {
                leftArrow.options.children[0].setAttribute("d", rLeft);
                leftArrow.options.children[1].setAttribute("d", dLeft);
            }
            this.diffGutter.appendChild(<SVG.Group style={{backgroundColor: "red", cursor: "hand", pointerEvents: "all"}}>
                    <SVG.Path d={rLeft} style={{stroke:"transparent", fill:"transparent"}}/>
                    <SVG.Path d={dLeft} style={{stroke: Options.arrowsColor, fill:"none", strokeWidth: "1.5px"}}/>
                </SVG.Group>);
            this.diffGutter.children.last().addClickListener(() => {
                let text = this.leftCodeEditor.getTextRange(leftStartRow, 0, leftEndRow, 0);
                this.rightCodeEditor.setTextRange(rightStartRow, 0, rightEndRow, 0, text);
            });
        }

        if (this.options.leftEditable) {
            if (typeof rightArrow !== "undefined") {
                rightArrow.options.children[0].setAttribute("d", rRight);
                rightArrow.options.children[1].setAttribute("d", dRight);
            }
            this.diffGutter.appendChild(<SVG.Group style={{backgroundColor: "red", cursor: "hand", pointerEvents: "all"}}>
                    <SVG.Path d={rRight} style={{stroke:"transparent", fill:"transparent"}}/>
                    <SVG.Path d={dRight} style={{stroke: Options.arrowsColor, fill:"none", strokeWidth: "1.5px"}}/>
                </SVG.Group>);
            this.diffGutter.children.last().addClickListener(() => {
                let text = this.rightCodeEditor.getTextRange(rightStartRow, 0, rightEndRow, 0);
                this.leftCodeEditor.setTextRange(leftStartRow, 0, leftEndRow, 0, text);
            });
        }
    }

    drawDiffCurve(type, leftStartRow, leftEndRow, rightStartRow, rightEndRow, element) {
        let leftScrollTop  = this.leftCodeEditor.getScrollTop();
        let rightScrollTop = this.rightCodeEditor.getScrollTop();
        let leftRowHeight = this.leftCodeEditor.getRendererLineHeight();
        let rightRowHeight = this.rightCodeEditor.getRendererLineHeight();

        let p1_x = -1;
        let p1_y = leftStartRow * leftRowHeight - leftScrollTop + 0.5;
        let p2_x = this.diffGutter.getWidth() + 1;
        let p2_y = rightStartRow * rightRowHeight - rightScrollTop + 0.5;
        let p3_x = -1;
        let p3_y = leftEndRow * leftRowHeight - leftScrollTop + 1.5;
        let p4_x = this.diffGutter.getWidth() + 1;
        let p4_y = rightEndRow * rightRowHeight - rightScrollTop + 1.5;
        let curve1 = this.computeCurve(p1_x, p1_y, p2_x, p2_y);
        let curve2 = this.computeCurve(p4_x, p4_y, p3_x, p3_y);

        let verticalLine1 = 'L' + p2_x + ',' + p2_y + ' ' + p4_x + ',' + p4_y;
        let verticalLine2 = 'L' + p3_x + ',' + p3_y + ' ' + p1_x + ',' + p1_y;
        let d = curve1 + ' ' + verticalLine1 + ' ' + curve2 + ' ' + verticalLine2;

        if (typeof element !== "undefined") {
            element.setAttr("d", d);
            return;
        }

        let el = <SVG.Path d={d}/>;

        this.diffGutter.appendChild(el);
    }

    drawDiffBlock(editor, type, startRow, startColumn, endRow, endColumn) {
        if (endRow < startRow) {
            endRow = startRow;
        }
        let classNames = "acediff-diff " + ColorStyle[type];

        if (endColumn && endRow === startRow && endColumn === startColumn) {
            endRow = startRow + 1;
            endColumn = startColumn + 2;
            classNames += " cursor-bar-" + ColorStyle[type];
        }

        if (!startColumn && !endColumn) {
            editor.markers.push(editor.addMarker(startRow, 0, startRow - 1, 1, "acediff-diff " +  ColorStyle[type] + "targetOnly top", "fullLine"));
            editor.markers.push(editor.addMarker(endRow, 0, endRow - 1, 1, "acediff-diff " +  ColorStyle[type] + "targetOnly bottom", "fullLine"));
        }

        classNames += (endRow > startRow) ? "lines" : "targetOnly";
        let option = "";
        endRow -= 1;
        endColumn -= 1;

        if (type === -2 || (endRow < startRow && endColumn === -1)) {
            option += "fullLine";
        }

        if (endRow < startRow && endColumn === -1) {
            editor.markers.push(editor.addMarker(startRow, startColumn, endRow, endColumn, classNames, option));
        } else if (endColumn === -1) {
            editor.markers.push(editor.addMarker(startRow, startColumn, endRow + 1, endColumn + 1, classNames, option + " text"));
        } else {
            editor.markers.push(editor.addMarker(startRow, startColumn, endRow, endColumn, classNames, option));
        }
    }

    computeCurve(startX, startY, endX, endY) {
        let w = endX - startX;
        let halfWidth = startX + (w / 2);

        return 'M ' + startX + ' ' + startY + ' C ' + halfWidth + ',' + startY + ' ' + halfWidth + ',' + endY + ' ' + endX + ',' + endY;
    }
}

export class DelayedDiffWidget extends DelayedElement(DiffWidget) {
    async beforeRedrawNotLoaded() {
        await ensure("/static/ext/diff_match_patch.js");
        this.setLoaded();
    }
}


export class DiffWidgetApp extends DelayedDiffWidget {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.setStyle({
            paddingTop: "20px",
            marginLeft: "5%",
            width: "90%",
            height: "100%",
        });
    }
}
