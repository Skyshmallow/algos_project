import {UI} from "../../stemjs/src/ui/UIBase.js";
import {SVG} from "../../stemjs/src/ui/svg/SVGBase.js";
import {Transition, Modifier, TransitionList} from "../../stemjs/src/ui/Transition.js";
import {uniqueId} from "../../stemjs/src/base/Utils.js";


export class VisualListElement extends SVG.Group {
    getDefaultOptions() {
        return {
            cellWidth: 40,
            cellHeight: 25,
            lineLength: 25,
            fill: "white",
            color: "black",
            strokeWidth: 1.5,
            textStrokeWidth: 1,
            fontSize: 15
        };
    }

    getLineCoords() {
        // Name shorteners
        let orientation = this.options.orientation;
        let x = this.options.coords.x;
        let y = this.options.coords.y;
        let cellWidth = this.options.cellWidth;
        let cellHeight = this.options.cellHeight;
        let lineLength = this.options.lineLength;

        return {
            x1: function() {
                if (orientation === "right") {
                    return x + cellWidth;
                }
                else if (orientation === "left") {
                    return x;
                }
                else { // orientation === "up" || orientation === "down"
                    return x + cellWidth / 2;
                }
            }(),
            y1: function() {
                if (orientation === "down") {
                    return y + cellHeight;
                }
                else if (orientation === "up") {
                    return y;
                }
                else { // orientation === "left" || orientation === "right"
                    return y + cellHeight / 2;
                }
            }(),
            x2: function() {
                if (orientation === "right") {
                    return x + cellWidth + lineLength;
                }
                else if (orientation === "left") {
                    return x - lineLength;
                }
                else { // orientation === "up" || orientation === "down"
                    return x + cellWidth / 2;
                }
            }(),
            y2: function() {
                if (orientation === "down") {
                    return y + cellHeight + lineLength;
                }
                else if (orientation === "up") {
                    return y - lineLength;
                }
                else { // orientation === "left" || orientation === "right"
                    return y + cellHeight / 2;
                }
            }()
        };
    };

    getCoords() {
        return this.options.coords;
    }

    setCoords(coords) {
        this.options.coords = coords;
        this.rect.setX(coords.x);
        this.rect.setY(coords.y);
        this.label.setPosition(coords.x + this.options.cellWidth / 2, coords.y + this.options.cellHeight / 2);
        if (this.options.hasLine) {
            let lineCoords = this.getLineCoords();
            this.line.setLine(lineCoords.x1, lineCoords.y1, lineCoords.x2, lineCoords.y2);
        }
        let clipPathRect = this.getClipPathRect();
        this.clipPathRect.setX(clipPathRect.x);
        this.clipPathRect.setY(clipPathRect.y);
        this.clipPathRect.setHeight(clipPathRect.height);
        this.clipPathRect.setWidth(clipPathRect.width);
    }

    getLabel() {
        return this.options.label;
    }

    setLabel(label) {
        this.options.label = label;
        this.label.setText(this.options.label);
    }

    hideLineTransition(duration, dependsOn=[], startTime=0) {
        let createLineModifier = new Modifier({
            func: () => {
                this.toggleLine(true);
                this.line.setAttribute("opacity", 1);
            },
            reverseFunc: () => {
                this.toggleLine(false);
            }
        });
        let changeOpacityTransition = new Transition({
            func: (t, context) => {
                if (this.line){
                    this.line.setAttribute("opacity", context.opacity * (1 - t));
                }
            },
            context: {opacity: 1},
            duration: duration,
            dependsOn: [createLineModifier]
        });
        let removeLineModifier = new Modifier({
            func: () => {
                this.toggleLine(false);
            },
            reverseFunc: () => {
                this.toggleLine(true);
                this.line.setAttribute("opacity", 1);
            },
            startTime: duration,
            dependsOn: [createLineModifier, changeOpacityTransition]
        });
        let list = new TransitionList();
        list.dependsOn = dependsOn;
        list.push(createLineModifier, false);
        list.push(changeOpacityTransition, false);
        list.push(removeLineModifier, false);
        list.setStartTime(startTime);
        return list;
    }

    showLineTransition(duration, dependsOn=[], startTime=0) {
        let ensureHasLineModifier = new Modifier({
            func: (context) => {
                context.addedLine = !this.line;
                this.toggleLine(true);
            },
            reverseFunc: (context) => {
                if (context.addedLine) {
                    this.toggleLine(false);
                }
            },
            context: {}
        });
        let changeOpacityTransition = new Transition({
            func: (t, context) => {
                if (this.line) {
                    this.line.setAttribute("opacity", context.opacity + (1 - context.opacity) * t);
                }
            },
            context: {opacity: 0},
            duration: duration,
            dependsOn: [ensureHasLineModifier]
        });
        let list = new TransitionList();
        list.dependsOn = dependsOn;
        list.push(ensureHasLineModifier, false);
        list.push(changeOpacityTransition, false);
        list.setStartTime(startTime);
        return list;
    }

    showTransition(duration, dependsOn=[], startTime=0) {
        return new Transition({
            func: (t, context) => {
                this.setAttribute("opacity", context.opacity + (1 - context.opacity) * t);
            },
            context: {opacity: 0},
            duration: duration,
            startTime: startTime,
            dependsOn: dependsOn
        });
    }

    hideTransition(duration, dependsOn=[], startTime=0) {
        return new Transition({
            func: (t, context) => {
                this.setAttribute("opacity", context.opacity * (1 - t));
            },
            context: {opacity: 1},
            duration: duration,
            startTime: startTime,
            dependsOn: dependsOn
        });
    }

    toggleLine(boolFlag) {
        if (boolFlag === this.options.hasLine) {
            return;
        }
        this.options.hasLine = boolFlag;
        if (this.options.hasLine) {
            let lineCoords = this.getLineCoords();
            this.appendChild(
                <SVG.Line
                    ref={this.refLink("line")} x1={lineCoords.x1} y1={lineCoords.y1} x2={lineCoords.x2}
                    y2={lineCoords.y2} stroke={this.options.color} strokeWidth={this.options.strokeWidth}
                />
            );
        } else {
            this.eraseChild(this.line);
            delete this.line;
        }
    }

    render() {
        this.options.children = [];

        this.options.children.push(
            <SVG.Group ref="cellGroup" clipPath={"url(#visualListElementClipPath" + uniqueId(this) + ")"}>
                <SVG.Rect
                    ref={this.refLink("rect")} x={this.options.coords.x} y={this.options.coords.y}
                    width={this.options.cellWidth} height={this.options.cellHeight} fill={this.options.fill}
                    stroke={this.options.color} strokeWidth={this.options.strokeWidth}
                />
                <SVG.Text
                    ref={this.refLink("label")} x={this.options.coords.x + this.options.cellWidth / 2}
                    y={this.options.coords.y + this.options.cellHeight / 2} text={this.options.label}
                    fill={this.options.color} stroke={this.options.color} strokeWidth={this.options.textStrokeWidth}
                    fontSize={this.options.fontSize} textAnchor="middle" dy="0.35em"
                />

                <SVG.Defs ref={this.refLink("defs")}>
                    <SVG.ClipPath id={"visualListElementClipPath" + uniqueId(this)}>
                        <SVG.Rect ref={this.refLink("clipPathRect")} {...this.getClipPathRect()}/>
                    </SVG.ClipPath>
                </SVG.Defs>
            </SVG.Group>
        );

        if (this.options.hasLine) {
            let lineCoords = this.getLineCoords();
            this.options.children.push(
                <SVG.Line
                    ref={this.refLink("line")} x1={lineCoords.x1} y1={lineCoords.y1} x2={lineCoords.x2}
                    y2={lineCoords.y2} stroke={this.options.color} strokeWidth={this.options.strokeWidth}
                />
            );
        }

        return this.options.children;
    }

    getClipPathRect() {
        // Name shorteners
        let strokeWidth = this.options.strokeWidth;
        let cellWidth = this.options.cellWidth;
        let cellHeight = this.options.cellHeight;
        let x = this.options.coords.x;
        let y = this.options.coords.y;

        return {
            x: x - strokeWidth / 2,
            y: y - strokeWidth / 2,
            width: cellWidth + strokeWidth,
            height: cellHeight + strokeWidth
        };
    };

    getColor() {
        return this.options.color;
    }

    setColor(color) {
        this.options.color = color;
        this.rect.setAttribute("stroke", color);
        this.label.setColor(color);
    }

    setFill(color) {
        this.rect.setAttribute("fill", color);
    }

    moveTransition(coords, duration, dependsOn=[], startTime=0) {
        return new Transition({
            func: (t, context) => {
                this.setCoords({
                    x: coords.x * t + context.coords.x * (1 - t),
                    y: coords.y * t + context.coords.y * (1 - t)
                });
            },
            context: {
                coords: this.options.coords
            },
            duration: duration,
            startTime: startTime,
            dependsOn: dependsOn
        });
    }

    slideNewValueTransition(newValue, direction, duration, dependsOn=[], startTime=0, inMovie=true) {
        let transitionList = new TransitionList();
        transitionList.dependsOn = dependsOn;
        // Name shorteners
        let cellWidth = this.options.cellWidth;
        let cellHeight = this.options.cellHeight;
        let x = this.options.coords.x;
        let y = this.options.coords.y;

        let dummyStartX;
        let dummyStartY;
        let labelFinalX;
        let labelFinalY;

        if (direction === "up") {
            dummyStartX = x + cellWidth / 2;
            dummyStartY = y + cellHeight * 3 / 2;
            labelFinalX = x + cellWidth / 2;
            labelFinalY = y - cellHeight * 3 / 2;
        } else if (direction === "down") {
            dummyStartX = x + cellWidth / 2;
            dummyStartY = y - cellHeight / 2;
            labelFinalX = x + cellWidth / 2;
            labelFinalY = y + cellHeight *  3 / 2;
        } else if (direction === "left") {
            dummyStartX = x + cellWidth * 3 / 2;
            dummyStartY = y + cellHeight / 2;
            labelFinalX = x - cellWidth / 2;
            labelFinalY = y + cellHeight / 2;
        } else if (direction === "right") {
            dummyStartX = x - cellWidth / 2;
            dummyStartY = y + cellHeight / 2;
            labelFinalX = config.x + config.VisualListCell_width * 3 / 2;
            labelFinalY = config.y + config.VisualListCell_height / 2;
        }

        let dummy = <SVG.Text x={dummyStartX} y={dummyStartY} text={newValue}
                    fill={this.options.color} stroke={this.options.color} strokeWidth={this.options.textStrokeWidth}
                    fontSize={this.options.fontSize} textAnchor="middle" dy="0.35em"/>;

        // Add the dummy in DOM at start coords
        let appendChildModifier = new Modifier({
            func: () => {
                this.cellGroup.appendChild(dummy);
                dummy.setPosition(dummyStartX, dummyStartY);
            },
            reverseFunc: () => {
                this.cellGroup.eraseChild(dummy, !inMovie);
            }
        });
        transitionList.push(appendChildModifier, false);

        let moveStartTime = transitionList.getLength();
        // Move the dummy
        let t1 = dummy.moveTransition({x: this.label.getX(), y: this.label.getY()}, duration, [appendChildModifier], moveStartTime);
        transitionList.add(t1, false);
        // Move the label
        let t2 = this.label.moveTransition({x: labelFinalX, y: labelFinalY}, duration, [appendChildModifier], moveStartTime);
        transitionList.add(t2, false);

        // Replace dummy with real label
        let labelX = this.label.getX();
        let labelY = this.label.getY();
        let labelText = this.label.getText();
        transitionList.push(new Modifier({
            func: () => {
                this.setLabel(newValue);
                this.label.setPosition(labelX, labelY);
                this.cellGroup.eraseChild(dummy, !inMovie);
            },
            reverseFunc: () => {
                this.setLabel(labelText);
                this.cellGroup.appendChild(dummy);
            },
            dependsOn: [t1, t2]
        }), false);

        transitionList.setStartTime(startTime);
        return transitionList;
    }
}

export class VisualList extends SVG.Group {
    getDefaultOptions() {
        return {
            orientation: "right",
            batchSpacing: 12,
            box: {
                x: 0,
                y: 0,
                width: 400,
                height: 400
            },
            elementOptions: VisualListElement.prototype.getDefaultOptions()
        };
    }

    render() {
        let elements = [];
        if (this.options.labels) {
            let batchCapacity = this.getBatchCapacity();
            for (let i = 0; i < this.options.labels.length; i += 1) {
                elements.push(<VisualListElement
                    coords={this.getCellCoords(i)}
                    label={this.options.labels[i]}
                    orientation={this.options.orientation}
                    hasLine={(i % batchCapacity !== batchCapacity - 1) && (i !== this.options.labels.length - 1)}
                    {...this.options.elementOptions}
                />);
            }
        }

        this.options.children = [];
        // Add a clipPath
        this.options.children.push(
            <SVG.Defs ref="defs">
                <SVG.ClipPath id={"visualListClipPath" + uniqueId(this)}>
                    <SVG.Rect ref={this.refLink("clipPathRect")} {...this.getClipPathRect()}/>
                </SVG.ClipPath>
            </SVG.Defs>
        );
        this.options.clipPath="url(#visualListClipPath" + uniqueId(this) + ")";
        // Add the list elements
        this.options.children.push(<SVG.Group ref={"elementsGroup"}>{elements}</SVG.Group>);

        return this.options.children;
    }

    getCell(cellLabel) {
        for (let i = 0; i < this.elements.length; i += 1) {
            let element = this.elements[i];
            if (element.getLabel() === cellLabel) {
                return element;
            }
        }
    }

    setBox(box) {
        this.options.box = box;

        let clipPathBox = this.getClipPathRect();
        this.clipPathRect.setX(clipPathBox.x);
        this.clipPathRect.setY(clipPathBox.y);
        this.clipPathRect.setWidth(clipPathBox.width);
        this.clipPathRect.setHeight(clipPathBox.height);

        if (this.options.labels) {
            let batchCapacity = this.getBatchCapacity();
            for (let i = 0; i < this.elements.length; i += 1) {
                let element = this.elements[i];
                element.setCoords(this.getCellCoords(i));
                element.toggleLine((i % batchCapacity !== batchCapacity - 1) && (i !== this.elements.length - 1));
            }
        }
    }

    setLabels(labels) {
        let newElements = [];
        let batchCapacity = this.getBatchCapacity();
        for (let i = 0; i < labels.length; i += 1) {
            newElements.push(<VisualListElement
                coords={this.getCellCoords(i)}
                label={labels[i]}
                orientation={this.options.orientation}
                hasLine={(i % batchCapacity !== batchCapacity - 1) && (i !== labels.length - 1)}
                {...this.options.elementOptions}
            />);
        }
        while (this.elementsGroup.options.children.length > 0) {
            this.elementsGroup.eraseChildAtIndex(0, true);
        }
        this.elementsGroup.options.children = newElements;
        this.elementsGroup.redraw();
    }

    get elements() {
        return this.elementsGroup.children;
    }

    getBatchCapacity() {
        let batchLength;
        let cellLength;

        if (this.options.orientation === "left" || this.options.orientation === "right") {
            batchLength = this.options.box.width;
            cellLength = this.options.elementOptions.cellWidth;
        } else {
            batchLength = this.options.box.height;
            cellLength = this.options.elementOptions.cellHeight;
        }

        if (batchLength < cellLength) {
            console.log("ERROR: Tried to create a visual list with batchLength < cellLength");
        }

        return Math.floor((batchLength - cellLength) / (cellLength + this.options.elementOptions.lineLength)) + 1;
    };

    getCellCoords(cellIndex) {
        let batchCapacity = this.getBatchCapacity();

        // Name shorteners
        let x = this.options.box.x;
        let y = this.options.box.y;
        let orientation = this.options.orientation;
        let batchSpacing = this.options.batchSpacing;

        let cellWidth = this.options.elementOptions.cellWidth;
        let cellHeight = this.options.elementOptions.cellHeight;
        let lineLength = this.options.elementOptions.lineLength;

        if (orientation === "right") {
            return {
                x: x + (cellWidth + lineLength) * (cellIndex % batchCapacity),
                y: y + (cellHeight + batchSpacing) * Math.floor(cellIndex / batchCapacity)
            };
        }
        else if (orientation === "left") {
            return {
                x: x - (cellWidth + lineLength) * (cellIndex % batchCapacity) - cellWidth,
                y: y + (cellHeight + batchSpacing) * Math.floor(cellIndex / batchCapacity)
            };
        }
        else if (orientation === "down") {
            return {
                x: x + (cellWidth + batchSpacing) * Math.floor(cellIndex / batchCapacity),
                y: y + (cellHeight + lineLength) * (cellIndex % batchCapacity)
            };
        }
        else if (orientation === "up") {
            return {
                x: x + (cellWidth + batchSpacing) * Math.floor(cellIndex / batchCapacity),
                y: y - (cellHeight + lineLength) * (cellIndex % batchCapacity) - cellHeight
            };
        } else {
            console.log("ERROR: Wrong visual list orientation.");
        }
    }

    getClipPathRect() {
        let batchCapacity = this.getBatchCapacity();

        // Name shorteners
        let x = this.options.box.x;
        let y = this.options.box.y;
        let width = this.options.box.width;
        let height = this.options.box.height;
        let orientation = this.options.orientation;

        let strokeWidth = this.options.elementOptions.strokeWidth;
        let cellWidth = this.options.elementOptions.cellWidth;
        let cellHeight = this.options.elementOptions.cellHeight;
        let lineLength = this.options.elementOptions.lineLength;

        // TODO: replace string with Direction/Orientation
        if (orientation === "right") {
            return {
                x: x - strokeWidth / 2,
                y: y - strokeWidth / 2,
                width: (batchCapacity - 1) * (cellWidth + lineLength) + cellWidth + strokeWidth,
                height: height + strokeWidth
            };
        } else if (orientation === "left") { // TODO(@wefgef): Fix strokeWidth stuff
            return {
                x: x - ((batchCapacity - 1) * (cellWidth + lineLength) + cellWidth) - strokeWidth,
                y: y - strokeWidth,
                width: (batchCapacity - 1) * (cellWidth + lineLength) + cellWidth + 2 * strokeWidth,
                height: height + 2 * strokeWidth
            };
        } else if (orientation === "down") {
            return {
                x: x - strokeWidth,
                y: y - strokeWidth,
                width: width + 2 * strokeWidth,
                height: (batchCapacity - 1) * (cellHeight + lineLength) + cellHeight + 2 * strokeWidth
            };
        } else if (orientation === "up") {
            return {
                x: x - strokeWidth,
                y: y - ((batchCapacity - 1) * (cellHeight + lineLength) + cellHeight) - strokeWidth,
                width: width + 2 * strokeWidth,
                height: (batchCapacity - 1) * (cellHeight + lineLength) + cellHeight + 2 * strokeWidth
            };
        } else {
            console.log("VisualList.config.VisualList_orientation is not valid: " + orientation);
        }
    }

    getNextDummyCoords(batchIndex) {
        let batchCapacity = this.getBatchCapacity();

        // Name shorteners
        let x = this.options.box.x;
        let y = this.options.box.y;
        let orientation = this.options.orientation;
        let batchSpacing = this.options.batchSpacing;

        let cellWidth = this.options.elementOptions.cellWidth;
        let cellHeight = this.options.elementOptions.cellHeight;
        var lineLength = this.options.elementOptions.lineLength;

        if (orientation == "up") {
            return {
                x: x + (cellWidth + batchSpacing) * batchIndex,
                y: y - cellHeight - lineLength
            };
        } else if (orientation == "down") {
            return {
                x: x + (cellWidth + batchSpacing) * batchIndex,
                y: y + (cellHeight + lineLength) * batchCapacity
            };
        } else if (orientation == "left") {
            return {
                x: x - cellWidth - lineLength,
                y: y + (cellHeight + batchSpacing) * batchIndex
            };
        } else if (orientation == "right") {
            return {
                x: x + (cellWidth + lineLength) * batchCapacity,
                y: y + (cellHeight + batchSpacing) * batchIndex
            };
        } else {
            console.log("ERROR: Wrong visual list orientation.");
        }
    }

    getPrevDummyCoords(batchIndex) {
        let batchCapacity = this.getBatchCapacity();

        // Name shorteners
        let x = this.options.box.x;
        let y = this.options.box.y;
        let orientation = this.options.orientation;
        let batchSpacing = this.options.batchSpacing;

        let cellWidth = this.options.elementOptions.cellWidth;
        let cellHeight = this.options.elementOptions.cellHeight;
        var lineLength = this.options.elementOptions.lineLength;

        if (orientation == "up") {
            return {
                x: x + (cellWidth + batchSpacing) * batchIndex,
                y: y + (cellHeight + lineLength) * batchCapacity
            };
        } else if (orientation == "down") {
            return {
                x: x + (cellWidth + batchSpacing) * batchIndex,
                y: y - cellHeight - lineLength
            };
        } else if (orientation == "left") {
            return {
                x: x + (cellWidth + lineLength) * batchCapacity,
                y: y + (cellHeight + batchSpacing) * batchIndex
            };
        } else if (orientation == "right") {
            return {
                x: x - cellWidth - lineLength,
                y: y + (cellHeight + batchSpacing) * batchIndex
            };
        } else {
            console.log("ERROR: Wrong visual list orientation.");
        }
    }

    insertTransition(cellIndex, label, maxDuration, dependsOn=[], startTime=0, inMovie=true) {
        let transitionList = new TransitionList();
        transitionList.dependsOn=dependsOn;
        let batchCapacity = this.getBatchCapacity();
        let elements = this.elements;

        // Data validation
        cellIndex = Math.max(cellIndex, 0);
        cellIndex = Math.min(cellIndex, elements.length);

        // Step1: Delete before line. Should satisfy:
        // a. The cell not added at the end of list
        // b. The cell is not first on its row
        // c. Lines have positive length
        let dep = [];
        if (cellIndex !== elements.length && cellIndex % batchCapacity !== 0 && this.options.elementOptions.lineLength) {
            let step1Duration = 0.25 * maxDuration;
            let t = elements[cellIndex - 1].hideLineTransition(step1Duration);
            transitionList.push(t, false);
            dep = [t];
        }

        // Step2: Create the gap. Should satisfy: the cell not added at the end of list
        if (cellIndex !== elements.length) {
            let step2Duration = 0.25 * maxDuration;
            // Create the dummies
            let dummies = [];
            for (let i = cellIndex + 1; i <= elements.length; i += 1) {
                if (i % batchCapacity === 0) {
                    dummies.push(<VisualListElement
                        coords={this.getPrevDummyCoords(i / batchCapacity)}
                        label={elements[i - 1].getLabel()}
                        orientation={this.options.orientation}
                        hasLine={i !== elements.length}
                    />);
                }
            }
            let setDummyCoordsModifier = new Modifier({
                func: () => {
                    let dummyIndex = 0;
                    for (let i = cellIndex + 1; i <= elements.length; i += 1) {
                        if (i % batchCapacity === 0) {
                            let dummy = dummies[dummyIndex];
                            dummyIndex += 1;
                            this.appendChild(dummy);
                            dummy.setCoords(this.getPrevDummyCoords(i / batchCapacity));
                        }
                    }
                },
                reverseFunc: () => {
                    for (let i = 0; i < dummies.length; i += 1) {
                        let dummy = dummies[i];
                        this.eraseChild(dummy, !inMovie);
                    }
                },
                dependsOn: dep
            });
            transitionList.push(setDummyCoordsModifier, false);

            // Move the cells to create the gap
            let moveTransition = new TransitionList();
            moveTransition.dependsOn = [setDummyCoordsModifier];
            for (let i = cellIndex; i < elements.length; i += 1) {
                if (i % batchCapacity === batchCapacity - 1) {
                    moveTransition.add(
                        elements[i].moveTransition(this.getNextDummyCoords((i + 1) / batchCapacity - 1), step2Duration), false);
                } else {
                    moveTransition.add(
                        elements[i].moveTransition(this.getCellCoords(i + 1), step2Duration), false);
                }
            }
            let dummyIndex = 0;
            for (let i = cellIndex + 1; i <= elements.length; i += 1) {
                if (i % batchCapacity === 0) {
                    let dummy = dummies[dummyIndex];
                    moveTransition.add(dummy.moveTransition(this.getCellCoords(i), step2Duration), false);
                    dummyIndex += 1;
                }
            }
            transitionList.push(moveTransition, false);

            // Replace the dummies with the real elements
            let replaceModifier = new Modifier({
                func: () => {
                    let dummyIndex = 0;
                    for (let i = cellIndex + 1; i <= elements.length; i += 1) {
                        if (i % batchCapacity === 0) {
                            let element = elements[i - 1];
                            let dummy = dummies[dummyIndex];
                            element.setCoords(this.getCellCoords(i));
                            if (i !== elements.length && batchCapacity > 1) {
                                element.toggleLine(true);
                            }
                            this.eraseChild(dummy, !inMovie);
                            dummyIndex += 1;
                        }
                    }
                },
                reverseFunc: () => {
                    let dummyIndex = 0;
                    for (let i = cellIndex + 1; i <= elements.length; i += 1) {
                        if (i % batchCapacity === 0) {
                            let element = elements[i - 1];
                            let dummy = dummies[dummyIndex];
                            if (dummy) {
                                element.toggleLine(false);
                                this.appendChild(dummy);
                            }
                            dummyIndex += 1;
                        }
                    }
                },
                dependsOn: [moveTransition]
            });
            transitionList.push(replaceModifier, false);
            dep = [replaceModifier];
        }

        // Step3: Create new element
        let step3Duration = 0.25 * maxDuration;
        let newElement = <VisualListElement
            coords={this.getCellCoords(cellIndex)}
            label={label}
            orientation={this.options.orientation}
            hasLine={false}
            {...this.options.elementOptions}
        />;
        let createChildModifier = new Modifier({
            func: () => {
                this.elementsGroup.insertChild(newElement, cellIndex);
                newElement.setAttribute("opacity", 0);
            },
            reverseFunc: () => {
                newElement.setAttribute("opacity", 1);
                this.elementsGroup.eraseChild(newElement, !inMovie);
            },
            dependsOn: dep
        });
        transitionList.push(createChildModifier, false);
        let transition = newElement.showTransition(step3Duration, [createChildModifier]);
        transitionList.push(transition, false);

        // Step 4: Add missing lines. Should satisfy: lines have positive length
        if (this.options.elementOptions.lineLength) {
            let step4Duration = 0.25 * maxDuration;
            let startTime = transitionList.getLength();
            // Show new element line if not last in its row or last in the list
            if (cellIndex % batchCapacity !== batchCapacity - 1 && cellIndex !== elements.length) {
                transitionList.add(newElement.showLineTransition(step4Duration, [transition], startTime), false);
            }
            // Show previous element line if new element is not first in its row
            if (cellIndex % batchCapacity !== 0) {
                transitionList.add(elements[cellIndex - 1].showLineTransition(step4Duration, [transition], startTime), false);
            }
        }

        transitionList.setStartTime(startTime);
        return transitionList;
    }

    deleteTransition(cellIndex, maxDuration, dependsOn=[], startTime=0, inMovie=true) {
        let transitionList = new TransitionList();
        transitionList.dependsOn = dependsOn;
        let batchCapacity = this.getBatchCapacity();
        let elements = this.elements;

        if (cellIndex < 0 || cellIndex >= elements.length) {
            return;
        }
        let dep = [];
        // Step1: Remove adjacent lines.
        if (this.options.elementOptions.lineLength) {
            let step1Duration = 0.25 * maxDuration;
            let removeStartTime = transitionList.getLength();
            // Remove previous line
            if (cellIndex % batchCapacity !== 0) {
                let hideLineTransition = elements[cellIndex - 1].hideLineTransition(step1Duration, [], removeStartTime);
                transitionList.add(hideLineTransition, false);
                let toggleLineModifier = new Modifier({
                    func: () => {
                        elements[cellIndex - 1].toggleLine(false);
                    },
                    reverseFunc: () => {
                        elements[cellIndex - 1].toggleLine(true);
                    },
                    dependsOn: [hideLineTransition],
                    startTime: removeStartTime + step1Duration + 1
                });
                transitionList.add(toggleLineModifier, false);
                dep = [toggleLineModifier];
            }
            // Remove element line
            if (cellIndex % batchCapacity !== batchCapacity - 1 && cellIndex !== elements.length - 1) {
                let hideLineTransition2 = elements[cellIndex].hideLineTransition(step1Duration, dep, removeStartTime);
                transitionList.add(hideLineTransition2, false);
                let toggleLineModifier2 = new Modifier({
                    func: () => {
                        elements[cellIndex].toggleLine(false);
                    },
                    reverseFunc: () => {
                        elements[cellIndex].toggleLine(true);
                    },
                    dependsOn: [hideLineTransition2],
                    startTime: removeStartTime + step1Duration + 1
                });
                transitionList.add(toggleLineModifier2, false);
                dep = [toggleLineModifier2];
            }
        }

        // Step2: Remove the element
        let step2Duration = 0.25 * maxDuration;
        let element = elements[cellIndex];
        let elementHideTransition = element.hideTransition(step2Duration, dep);
        transitionList.push(elementHideTransition);
        let removeElementModifier = new Modifier({
            func: () => {
                this.elementsGroup.eraseChild(element, !inMovie);
            },
            reverseFunc: () => {
                this.elementsGroup.insertChild(element, cellIndex);
            },
            dependsOn: [elementHideTransition]
        });
        transitionList.push(removeElementModifier, false);

        // Step3: Close gap. Should satisfy: element not last
        if (cellIndex !== elements.length - 1) {
            let step3Duration = 0.25 * maxDuration;
            let dummies = [];
            for (let i = cellIndex; i + 1 < elements.length; i += 1) {
                // If last in its batch
                if (i % batchCapacity === batchCapacity - 1) {
                    let dummy = <VisualListElement
                        coords={this.getNextDummyCoords((i + 1) / batchCapacity - 1)}
                        label={elements[i + 1].getLabel()}
                        orientation={this.options.orientation}
                        hasLine={false}
                        {...this.options.elementOptions}
                    />;
                    dummies.push(dummy);
                }
            }

            // Set initial dummy coords
            let setDummyCoordsModifier = new Modifier({
                func: () => {
                    let dummyIndex = 0;
                    for (let i = cellIndex; i < elements.length; i += 1) {
                        if (i % batchCapacity === batchCapacity - 1) {
                            let dummy = dummies[dummyIndex];
                            if (!dummy) {
                                return;
                            }
                            this.appendChild(dummy);
                            dummy.setCoords(this.getNextDummyCoords((i + 1) / batchCapacity - 1));
                            dummyIndex += 1;
                        }
                    }
                },
                reverseFunc: () => {
                    for (let i = 0; i < dummies.length; i += 1) {
                        let dummy = dummies[i];
                        if (!dummy) {
                            return;
                        }
                        this.eraseChild(dummy, !inMovie);
                    }
                },
                dependsOn: [removeElementModifier]
            });
            transitionList.push(setDummyCoordsModifier, false);

            // Add missing lines
            let addMissingLinesModifier = new Modifier({
                func: () => {
                    for (let i = cellIndex; i + 1 < elements.length; i += 1) {
                        if ((i + 1) % batchCapacity === batchCapacity - 1) {
                            let element = elements[i];
                            element.toggleLine(true);
                        }
                    }
                },
                reverseFunc: () => {
                    for (let i = cellIndex + 1; i + 1 < elements.length; i += 1) {
                        if ((i + 1) % batchCapacity === batchCapacity - 1) {
                            let element = elements[i];
                            element.toggleLine(false);
                        }
                    }
                },
                dependsOn: [removeElementModifier, setDummyCoordsModifier]
            });
            transitionList.push(addMissingLinesModifier, false);

            // Move the cells to create the gap
            let moveTransition = new TransitionList();
            moveTransition.dependsOn = [removeElementModifier, setDummyCoordsModifier, addMissingLinesModifier];
            for (let i = cellIndex + 1; i < elements.length; i += 1) {
                if (i % batchCapacity == 0) {
                    moveTransition.add(
                        elements[i].moveTransition(this.getPrevDummyCoords(i / batchCapacity), step3Duration), false);
                } else {
                    moveTransition.add(
                        elements[i].moveTransition(elements[i - 1].getCoords(), step3Duration), false);
                }
            }
            let dummyIndex = 0;
            for (let i = cellIndex; i + 1 < elements.length; i += 1) {
                if (i % batchCapacity === batchCapacity - 1) {
                    let dummy = dummies[dummyIndex];
                    moveTransition.add(dummy.moveTransition(elements[i].getCoords(), step3Duration), false);
                    dummyIndex += 1;
                }
            }
            transitionList.push(moveTransition, false);

            // Replace the dummies with the real elements
            let replaceModifier = new Modifier({
                func: () => {
                    let dummyIndex = 0;
                    for (let i = cellIndex; i < elements.length; i += 1) {
                        if (i % batchCapacity === batchCapacity - 1) {
                            let element = elements[i];
                            let dummy = dummies[dummyIndex];

                            element.setCoords(dummy.getCoords());
                            this.eraseChild(dummy, !inMovie);
                            dummyIndex += 1;
                        }
                    }
                },
                reverseFunc: () => {
                    for (let i = 0; i < dummies.length; i += 1) {
                        let dummy = dummies[i];
                        this.appendChild(dummy);
                    }
                },
                dependsOn: [moveTransition]
            });
            transitionList.push(replaceModifier, false);
            dep = [replaceModifier];
        }

        // Step4: Add missing line. Should satisfy:
        // a. The cell is deleted from the end of the list
        // b. The cell is first in its batch
        if (cellIndex !== elements.length - 1 && cellIndex % batchCapacity !== 0) {
            let step4Duration = 0.25 * maxDuration;
            transitionList.push(elements[cellIndex - 1].showLineTransition(step4Duration, dep), false);
        }

        transitionList.setStartTime(startTime);
        return transitionList;
    }

    changeValueTransition(cellIndex, newLabel, direction, duration, dependsOn=[], startTime=0, inMovie=true) {
        return this.elements[cellIndex].slideNewValueTransition(newLabel, direction, duration, dependsOn, startTime, inMovie);
    }
}
