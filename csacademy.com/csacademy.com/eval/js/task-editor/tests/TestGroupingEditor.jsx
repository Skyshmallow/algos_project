import {UI} from "../../../../stemjs/src/ui/UIBase.js";
import {BaseInputElement} from "../../../../stemjs/src/ui/input/BaseInputElement.js";
import {Button} from "../../../../stemjs/src/ui/button/Button.jsx";
import {StyleSheet} from "../../../../stemjs/src/ui/Style.js";
import {styleRule} from "../../../../stemjs/src/ui/Style.js";
import {registerStyle} from "../../../../stemjs/src/ui/style/Theme.js";
import {areSetsEqual, toArray, unwrapArray} from "../../../../stemjs/src/base/Utils.js";
import {Input, NumberInput} from "../../../../stemjs/src/ui/input/Input.jsx";
import {Table} from "../../../../stemjs/src/ui/table/Table.jsx";
import {autoredraw} from "../../../../stemjs/src/decorators/AutoRedraw.js";
import {Ajax} from "../../../../stemjs/src/base/Ajax.js";
import {CollapsiblePanel} from "../../../../stemjs/src/ui/collapsible/CollapsiblePanel.jsx";

export function parseTestRanges(testRanges, allTestIds, groupIndex, parsedGroups) {
    testRanges = testRanges.toLowerCase().replaceAll(" ", "");

    const groupIds = new Set();
    const explicitTestIds = new Set();

    const forceParseInt = (str) => {
        const value = parseInt(str, 10);
        if (isNaN(value) || String(value) !== str) {
            throw `Failed to parse as integer "${str}"`;
        }
        return value;
    }

    if (testRanges === "*") {
        return {
            testIds: allTestIds,
            explicitTestIds,
            groupIds,
            includeAll: true,
        }
    }
    const parts = testRanges.split(/[;,]+/).filter(value => value.length > 0);
    for (const part of parts) {
        if (part.startsWith("g")) {
            const includedGroupIndex = forceParseInt(part.substring(1));
            if (includedGroupIndex <= 0 || includedGroupIndex >= groupIndex) {
                throw `Must only include previous groups (${part})`;
            }
            groupIds.add(includedGroupIndex);
            continue;
        }

        if (!part.includes("-")) {
            const testId = forceParseInt(part);
            if (!allTestIds.has(testId)) {
                throw `Invalid test id (${part})`;
            }
            explicitTestIds.add(testId);
            continue;
        }

        const values = part.split("-");
        if (values.length !== 2) {
            throw `Range must have exactly two parts (${part})`;
        }
        const [firstIndex, lastIndex] = values.map(forceParseInt);
        for (let testId = firstIndex; testId <= lastIndex; testId++) {
            if (!allTestIds.has(testId)) {
                throw `Invalid test id "${testId}" from range "${part}"`;
            }
            explicitTestIds.add(testId);
        }
    }

    const testIds = new Set(Array.from(explicitTestIds));

    for (const includedGroupIndex of groupIds) {
        const includeTestIds = parsedGroups[includedGroupIndex - 1]?.testIds;
        if (testIds) {
            // Maybe prev parse failed, skip in that case
            for (const testId of includeTestIds) {
                testIds.add(testId);
            }
        }
    }

    for (const previousGroup of parsedGroups) {
        if (areSetsEqual(previousGroup.testIds, testIds)) {
            throw `Covers same tests as ${previousGroup.index}`;
        }
    }

    return {
        testIds,
        explicitTestIds,
        groupIds,
    }
}


class TestGroupingEditorStyle extends StyleSheet {
    @styleRule
    container = {
        maxWidth: 400,
        margin: "auto",
        paddingBottom: 40,
    }
}

@autoredraw
@registerStyle(TestGroupingEditorStyle)
export class TestGroupingEditor extends BaseInputElement {
    getDefaultOptions(options) {
        const {evalTask} = options;
        return {
            ...super.getDefaultOptions(options),
            initialValue: evalTask.testGrouping,
        }
    }

    addTestGroup() {
        const newValue = Array.from(toArray(this.value));
        newValue.push({
            testRanges: "*",
            pointsWorth: 0,
            comment: "",
        });
        this.setValue(newValue);
    }

    deleteTestGroup(index) {
        const newValue = Array.from(this.value);
        newValue.splice(index, 1);
        this.setValue(newValue);
    }

    // Returns errors and warnings
    validate() {
        const {evalTask} = this.options;
        const testGroups = toArray(this.value);
        let totalPoints = 0;
        const warnings = [], errors = [];

        const allTests = [...evalTask.exampleTests, ...evalTask.systemTests];
        const allTestIds = new Set(allTests.map(test => test.index));

        if (testGroups.length === 0) {
            return {warnings, errors};
        }

        const previouslyParsedGroups = [];
        const allTestIdsInGroups = new Set();

        testGroups.forEach((testGroup, index) => {
            index = index + 1;
            totalPoints += testGroup.pointsWorth;
            try {
                const result = parseTestRanges(testGroup.testRanges, allTestIds, index, previouslyParsedGroups);
                result.index = index;
                previouslyParsedGroups.push(result);
                testGroup.testIndexes = Array.from(result.testIds);
                testGroup.testIndexes.sort((a, b) => a - b);
                for (const testId of testGroup.testIndexes) {
                    allTestIdsInGroups.add(testId);
                }
            } catch (error) {
                errors.push(`Group ${index}: ${error}`);
            }
        });

        const systemTestsNotInGroups = unwrapArray(evalTask.systemTests.map(test => !allTestIdsInGroups.has(test.index) && test.index));

        warnings.unshift(...unwrapArray([
            (totalPoints != 100) && `Total points: ${totalPoints}${totalPoints < 100 ? ", (" + (100 - totalPoints) + " undistributed)" : ""}`,
            systemTestsNotInGroups.length > 0 && `Non-example test(s) not included in grouping: ${systemTestsNotInGroups}`,
        ]));

        return {errors, warnings};
    }

    async save() {
        const value = toArray(this.value);
        const request = {
            testGrouping: JSON.stringify(value.length > 0 ? value : null),
        }
        await Ajax.postJSON("/task/" + this.options.evalTask.urlName + "/edit/", request);
    }

    render() {
        const testGroups = toArray(this.value);

        const columns = [
            ["#", (testGroups, index) => index + 1],
            ["Tests", testGroup => <Input
                initialValue={testGroup.testRanges}
                onChange={(value) => {
                    testGroup.testRanges = value;
                    this.redraw();
                }}/>],
            ["Points Worth", testGroup => <NumberInput
                min={1}
                initialValue={testGroup.pointsWorth}
                onChange={(value) => {
                    testGroup.pointsWorth = value;
                    this.redraw();
                }}/>],
            ["Comment", testGroup => <Input
                initialValue={testGroup.comment}
                onChange={(value) => {
                    testGroup.comment = value;
                }}
            />],
            ["", (testGroup, index) => <div>
                <Button
                    label="Delete"
                    onClick={() => this.deleteTestGroup(index)}
                />
            </div>]
        ];

        const {errors, warnings} = this.validate();

        return [
            (testGroups.length > 0) ? <Table entries={testGroups} columns={columns}/> : <div>
                Test grouping is disabled
            </div>,

            errors.map(error => <p style={{color: "red"}}>X {error}</p>),
            warnings.map(warning => <p style={{color: "darkorange"}}>⚠ {warning}</p>),

            <div>
                <Button label="Add test group" onClick={() => this.addTestGroup()}/>
                <Button label="Save" disabled={errors.length > 0} onClick={() => this.save()}/>
            </div>
        ]
    }
}


@autoredraw
export class TestGroupingPanel extends CollapsiblePanel {
    getTitle() {
        const {evalTask} = this.options;
        const testGrouping = toArray(evalTask.testGrouping);
        const status = testGrouping.length > 0 ? `${testGrouping.length} groups` : "disabled";
        return `Test Grouping (${status})`;
    }

    render() {
        return <TestGroupingEditor evalTask={this.options.evalTask} />;
    }
}
