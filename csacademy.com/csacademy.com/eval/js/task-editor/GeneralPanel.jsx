import {UI, Button, ButtonGroup, Select, Panel, TextInput, Form, FormField, Level, Size} from "../../../csabase/js/UI.js";
import {TagStore} from "../../../establishment/content/js/state/TagStore.js";
import {Ajax} from "../../../stemjs/src/base/Ajax.js";
import {AjaxButton} from "../../../stemjs/src/ui/button/AjaxButton.jsx";
import {Contest, ContestStore} from "../../../contest/js/state/ContestStore.js";
import {Difficulty} from "../../../csabase/js/state/DifficultyStore.js";
import {TaskCheckerStore} from "../state/TaskCheckerStore.js";
import {EvalTaskStatisticsStore} from "../state/EvalTaskStatisticsStore.js";


class FlashableButton extends Button {
    flash(level, timeout=2000) {
        let originalLevel = this.getLevel();
        this.setLevel(level);
        setTimeout(() => {
            this.setLevel(originalLevel);
        }, timeout);
    }
}

class OriginalContestEditor extends UI.Element {
    setOptions(options) {
        super.setOptions(options);
        ///Creating the contest list and adding a dummy contest, for no contest
        let c = new Contest();
        c.id = 0;
        c.longName = "-----";

        this.contests = [c, ...ContestStore.all()];
        this.selected = ContestStore.get(this.options.evalTask.originalContestId) || c;
    }

    render() {
        return [
            <h3>Original Contest</h3>,
            <div>
                <Select ref="originalContestSelect" options={this.contests}
                               selected={this.selected}/>
                <FlashableButton ref="saveButton" level={Level.PRIMARY} size={Size.SMALL}
                        style={{marginLeft: "10px"}} icon="floppy-o"/>
            </div>
        ];
    }

    saveOriginalContest(id) {
        let request = {
            originalContestChanged: true,
            originalContestId: id,
        };

        Ajax.postJSON("/task/" + this.options.evalTask.urlName + "/edit/", request).then(
            () => this.saveButton.flash(Level.SUCCESS)
        );
    }

    onMount() {
        this.saveButton.addClickListener(() => {
            let newContest = this.contests[this.originalContestSelect.getIndex()];
            if (this.originalContestSelect.getIndex() === 0) {
                this.saveOriginalContest(null);
            } else {
                this.saveOriginalContest(newContest.id);
            }
        });
    }
}

// TODO refactor store usage
let tagOptions = TagStore.all().sort(function(a, b) {
    if (a.toString() < b.toString()) {
        return -1;
    }
    if (a.toString() > b.toString()) {
        return 1;
    }
    return 0;
});

class TagEditor extends UI.Element {
    addTag() {
        this.value.push(tagOptions[0].id);
        this.redraw();
    }

    removeTag(index) {
        this.value.splice(index, 1);
        this.redraw();
    }

    setOptions(options) {
        super.setOptions(options);
        this.value = this.options.evalTask.tagIds || [];
    }

    renderTagOptions() {
        return this.value.map((tagId, index) => (<div style={{marginTop: 10}}>
                <Select
                    style={{height: 30}}
                    options={tagOptions}
                    initialValue={TagStore.get(tagId)}
                    onChange={(tag) => {
                        console.log(tag);
                        this.value[index] = tag.id;
                    }}
                />
                <Button
                    onClick={() => this.removeTag(index)}
                    style={{marginLeft: 6}}
                    level={Level.DANGER}
                    icon="minus"
                    size={Size.SMALL}
                />
            </div>));
    }

    render() {
        return [
            <h3 style={{marginRight: 10, marginBottom: 3}}>Tags</h3>,
            this.renderTagOptions(),
            <ButtonGroup style={{marginTop: 10}}>
                <Button onClick={() => this.addTag()} level={Level.SUCCESS} icon="plus" size={Size.SMALL} />
                <FlashableButton ref="saveButton" onClick={() => this.saveTags()} level={Level.PRIMARY} icon="floppy-o" size={Size.SMALL} />
            </ButtonGroup>
        ];
    }

    async saveTags() {
        const request = {
            tagsChanged: true,
            tagIds: this.value,
        };
        await Ajax.postJSON("/task/" + this.options.evalTask.urlName + "/edit/", request);
        this.saveButton.flash(Level.SUCCESS);
    }
}

class CheckerEditor extends UI.Element {
    render() {
        return [
            <h3>Task checker</h3>,
            <div>
                <Select ref="checkerSelect" options={TaskCheckerStore.allIncludingDefault()}
                        selected={TaskCheckerStore.get(this.options.evalTask.checkerId)} />
                <FlashableButton ref="saveButton" level={Level.PRIMARY} size={Size.SMALL}
                        style={{marginLeft: "10px"}} icon="floppy-o"/>
            </div>,
            <div>
                <FlashableButton ref="cachebustButton" level={Level.PRIMARY} style={{marginTop: "10px"}}>
                    Clear eval cache
                </FlashableButton>
            </div>
        ];
    }

    saveChecker() {
        let request = {
            checkerChanged: true,
            checkerId: this.checkerSelect.get().id
        };
        Ajax.postJSON("/task/" + this.options.evalTask.urlName + "/edit/", request).then(
            () => this.saveButton.flash(Level.SUCCESS)
        );
    }

    cachebust() {
        Ajax.postJSON("/eval/checker/cache_bust/", {
            evalTaskId: this.options.evalTask.id
        }).then(
            () => this.cachebustButton.flash(Level.SUCCESS)
        );
    }

    onMount() {
        this.saveButton.addClickListener(() => {
            this.saveChecker();
        });
        this.cachebustButton.addClickListener(() => {
            this.cachebust();
        });
    }
}

class DifficultyEditor extends UI.Element {
    render() {
        return [
            <h3>Difficulty</h3>,
            <div>
                <Select ref="difficultySelect" options={Difficulty.all()}
                               selected={Difficulty.get(EvalTaskStatisticsStore.getByEvalTaskId(this.options.evalTask.id).evalTaskDifficulty)}/>
                <FlashableButton ref="saveButton" level={Level.PRIMARY} size={Size.SMALL}
                        style={{marginLeft: "10px"}} icon="floppy-o"/>
            </div>
        ];
    }

    saveDifficulty() {
        let request = {
            evalTaskId: this.options.evalTask.id,
            difficulty: this.difficultySelect.get().id
        };
        Ajax.postJSON("/eval/change_task_difficulty/", request).then(
            () => this.saveButton.flash(Level.SUCCESS)
        );
    }

    onMount() {
        this.saveButton.addClickListener(() => {
            this.saveDifficulty();
        });
    }
}

class BroadcastButton extends UI.Element {
    render() {
        return [
            <h3>Task Update</h3>,
            <AjaxButton ref="broadcastButton" level={Level.PRIMARY} onClick={() => {this.broadcast()}}
                    statusOptions={["Update task for users", {icon: "spinner fa-spin", label:" broadcasting ..."}, "Success", "Failed"]}/>,
        ];
    }

    broadcast() {
        this.broadcastButton.postJSON("/task/" + this.options.evalTask.urlName + "/edit/", {
            broadcast: true
        });
    }
}

class TaskNameEditor extends UI.Element {
    render() {
        return [
            <h3>Task name</h3>,
            <Form style={{maxWidth: "300px", margin: 0}}>
                <FormField ref="urlNameFormField" label="URL Name" style={{margin: 0}}>
                    <TextInput ref="urlNameFormInput" style={{paddingLeft: "4px"}}
                               value={this.options.evalTask.urlName} />
                </FormField>
                <FormField ref="longNameFormField" label="Long Name" style={{margin: 0}}>
                    <TextInput ref="longNameFormInput" style={{paddingLeft: "4px"}}
                               value={this.options.evalTask.longName} />
                </FormField>
                <FlashableButton ref="saveButton" level={Level.PRIMARY} icon="save"/>
            </Form>
        ];
    }

    onMount() {
        this.saveButton.addClickListener(() => {
            let request = {
                nameChanged: true,
                urlName: this.urlNameFormInput.getValue(),
                longName: this.longNameFormInput.getValue()
            };
            Ajax.postJSON("/task/" + this.options.evalTask.urlName + "/edit/", request).then(
                () => location.reload()
            );
        });
    }
}

class GeneralPanel extends Panel {
    getTitle() {
        return "General";
    }

    render() {
        return [
            <TaskNameEditor evalTask={this.options.evalTask} />,
            <CheckerEditor evalTask={this.options.evalTask} />,
            <BroadcastButton evalTask={this.options.evalTask} style={{marginTop: "20px"}}/>,
            <OriginalContestEditor evalTask={this.options.evalTask} />,
            <TagEditor evalTask={this.options.evalTask} style={{marginTop: "10px"}} />,
            <DifficultyEditor evalTask={this.options.evalTask} />,
        ];
    }
}

export {GeneralPanel};