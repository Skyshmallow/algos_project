import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Button} from "../../stemjs/src/ui/button/Button.jsx";
import {RawCheckboxInput} from "../../stemjs/src/ui/input/Input.jsx";
import {Link} from "../../stemjs/src/ui/primitives/Link.jsx";
import {StyleSheet} from "../../stemjs/src/ui/Style.js";
import {styleRule} from "../../stemjs/src/ui/Style.js";
import {registerStyle} from "../../stemjs/src/ui/style/Theme.js";
import {TextInput} from "../../stemjs/src/ui/input/Input.jsx";
import {Level, Size} from "../../stemjs/src/ui/Constants.js";
import {Table} from "../../stemjs/src/ui/table/Table.jsx";
import {ActionModal} from "../../stemjs/src/ui/modal/Modal.jsx";
import {Device} from "../../stemjs/src/base/Device.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {Duration} from "../../stemjs/src/time/Duration.js";
import {UserStore} from "../../csaaccounts/js/state/UserStore.js";
import {TagStore} from "../../establishment/content/js/state/TagStore.js";

import {ContestTaskBubble} from "./ContestTaskBubble";
import {ContestTaskListHeader} from "./ContestTaskListHeader.jsx";
import {tasksTagsDispatcher} from "./ContestTaskBubble";
import {autoredraw} from "../../stemjs/src/decorators/AutoRedraw";


class ContestTaskList extends UI.Element {
    constructor(...args) {
        super(...args);
        this.bubbles = [];
    }

    getTasks() {
        return this.getContest().getContestTasks();
    }

    getContest() {
        return this.options.contest;
    }

    getContestTaskBubble(task, revealedTagIds = []) {
        return <ContestTaskBubble key={task.id} isArchive={this.options.isArchive} contestTask={task}
                                  showTags={this.options.showTags} revealedTagIds={revealedTagIds}/>;
    }

    setShowTags(showTags) {
        this.options.showTags = showTags;
        this.refreshBubbles();
    }

    setText(text) {
        this.text = text;
        this.refreshBubbles();
    }

    getHeader() {
        return <ContestTaskListHeader ref="header" isArchive={this.options.isArchive} contest={this.getContest()}/>;
    }

    render() {
        return [
            this.getHeader(),
            <div ref="taskList">
                {this.bubbles}
            </div>
        ];
    }

    refreshBubbles() {
        let tasks = this.getTasks();
        if (this.options.sortingCriterion) {
            tasks.sort((a, b) => this.options.sortingCriterion(a, b));
        }
        const [tagIds, textTokens] = tokenize(this.text || "");
        if (this.text) {
            tasks = tasks.filter(task => (contains(task.tagIds, tagIds) && containsTokens(task, textTokens)));
        }
        const bubbles = tasks.map(task => this.getContestTaskBubble(task, tagIds));
        this.bubbles = bubbles;
        this.taskList.setChildren(bubbles);
    }

    setSortingCriterion(func) {
        this.options.sortingCriterion = func;
        this.refreshBubbles();
    }

    onMount() {
        this.refreshBubbles();
        if (this.header) {
            this.header.addListener("setOrderCriterion", (func) => {
                this.setSortingCriterion(func);
            });
        }
        if (!this.options.isArchive) {
            let contest = this.getContest();
            if (contest) {
                this.attachListener(this.options.contest, "addTask", () => {
                    this.refreshBubbles();
                });
            }
        }
    }
}


// Function that splits the text of the search bar in two arrays:
// - the tags (starting with #), returns an array of the ids
// - the text tokens, returns an array of strings
function tokenize(text) {
    let tokens = text.split(/[ \n]/);
    let textTokens = [];
    let tagIds = [];
    for (let token of tokens) {
        if (token.indexOf("#") === 0) {
            let tagName = token.replace("#", "").split("-").join(" ");
            let tag = TagStore.getTagByNameInsensitive(tagName, false);
            if (tag) {
                tagIds.push(tag.id);
            }
        } else if (token !== "") {
            textTokens.push(token);
        }
    }
    return [tagIds, textTokens];
}


// Check whether a set of tags passes the required tags.
// For this, we must consider the given tags as well as
// their way to their respective roots.
function contains(entryTagIds, requiredTagIds) {
    if (!requiredTagIds || requiredTagIds.length === 0) {
        return true;
    }
    if (!entryTagIds) {
        return false;
    }

    let vis = new Set();
    for (let tag of entryTagIds) {
        let currentTag = TagStore.get(tag);
        while (currentTag) {
            vis.add(currentTag.id);
            currentTag = TagStore.get(currentTag.parentId);
        }
    }
    for (let tagId of requiredTagIds) {
        if (!vis.has(tagId)) {
            return false;
        }
    }
    return true;
}


// Check whether the name or tags of a given task contain a given string token
// as a substring
function containsTokens(task, tokens) {
    for (let token of tokens) {
        if (task.longName.toLocaleLowerCase().indexOf(token.toLocaleLowerCase()) === -1) {
            let value = false;
            if (task.tagIds) {
                for (let tagId of task.tagIds) {
                    value = value ||
                        (TagStore.get(tagId).name.toLocaleLowerCase().indexOf(token.toLocaleLowerCase()) !== -1);
                }
            }
            if (!value) {
                return false;
            }
        }
    }
    return true;
}


class TagCheckboxStyle extends StyleSheet {
    @styleRule
    className = {
        display: "inline-block",
        float: "left",
        height: "25px",
        lineHeight: "25px",
        width: "100%",
        paddingLeft: "0%",
        cursor: "pointer",
        ":hover": {
            backgroundColor: "#eee"
        }
    };

    @styleRule
    checked = {
        color: "black",
        fontWeight: "bold"
    };

    @styleRule
    unchecked = {
        color: "rgb(55, 55, 55)",
        fontWeight: "initial"
    };
}


@registerStyle(TagCheckboxStyle)
class TagCheckbox extends UI.Element {
    getDefaultOptions() {
        return {
            checked: false
        };
    }

    extraNodeAttributes(attr) {
        attr.addClass(this.styleSheet.className);
        if (this.options.checked) {
            attr.addClass(this.styleSheet.checked);
        } else {
            attr.addClass(this.styleSheet.unchecked);
        }
    }

    render() {
        return this.options.tag.name;
    }

    onMount() {
        this.addClickListener(() => {
            this.updateOptions({checked: !this.options.checked});
            this.options.tagFilters.dispatch("tagClicked", this.options.tag);
        });
    }
}


class TagFilters extends UI.Element {
    getContestTasks() {
        return this.options.contest.getContestTasks();
    }

    getAppearingTags() {
        const appearingTags = new Set();
        for (let task of this.getContestTasks()) {
            if (task.tagIds) {
                for (let tagId of task.tagIds) {
                    let tag = TagStore.get(tagId);
                    while (tag) {
                        appearingTags.add(tag);
                        tag = TagStore.get(tag.parentId);
                    }
                }
            }
        }
        return appearingTags;
    }

    render() {
        let tags = Array.from(this.getAppearingTags());
        tags.sort((a, b) => {
            let categoriesA = a.toString().split("-");
            let categoriesB = b.toString().split("-");
            for (let i = 0; i < Math.min(categoriesA.length, categoriesB.length); i += 1) {
                if (categoriesA[i] !== categoriesB[i]) {
                    return categoriesA[i] < categoriesB[i] ? -1 : 1;
                }
            }
            if (categoriesA.length < categoriesB.length) {
                return -1;
            }
            if (categoriesA.length > categoriesB.length) {
                return 1;
            }
            return 0;
        });
        let result = [];
        for (let tag of tags) {
            result.push(
                <div style={{paddingLeft: (18 * (tag.getDepth())) + "px", height: "25px"}}>
                    <TagCheckbox tag={tag} ref={this.refLink("tagCheckbox" + tag.id)} tagFilters={this} />
                </div>
            );
        }
        return result;
    }

    onMount() {
        this.addListener("textInput", (text) => {
            let tagIds = tokenize(text)[0];
            for (let tag of this.getAppearingTags()) {
                if (tagIds.indexOf(tag.id) !== -1) {
                    this["tagCheckbox" + tag.id].updateOptions({checked: true});
                } else {
                    this["tagCheckbox" + tag.id].updateOptions({checked: false});
                }
            }
        });
        this.addListener("tagClicked", (tag) => {
            const filterArea = this.options.filterArea;
            filterArea.changeSearchBarText(tag, filterArea.searchBar.getValue());
            filterArea.dispatch("changeText", filterArea.searchBar.getValue());
        })
    }
}


class FilterArea extends UI.Element {
    render() {
        return [
            <TextInput ref="searchBar" placeholder="Search here (use # for tags)"
                      className={this.options.searchBarCss}/>,
            <TagFilters ref="tags" className={this.options.tagFiltersCss} filterArea={this}
                    contest={this.options.contest}/>
        ];
    }

    changeSearchBarText(tag, text) {
        let tokens = text.split(" ");
        let normalText = text.toLocaleLowerCase();
        let normalTagName = "#" + tag.name.toLocaleLowerCase().split(" ").join("-");
        let normalTokens = normalText.split(" ");
        if (this.tags["tagCheckbox" + tag.id].options.checked && normalTokens.indexOf(normalTagName) === -1) {
            tokens.push("#" + tag.name.split(" ").join("-"));
        } else {
            for (let i = 0; i < normalTokens.length; i += 1) {
                if (normalTagName === normalTokens[i]) {
                    normalTokens.splice(i, 1);
                    tokens.splice(i, 1);
                }
            }
        }
        text = tokens.join(" ");
        this.searchBar.setValue(text);
    }

    setText(text) {
        this.searchBar.setValue(text);
        this.tags.dispatch("textInput", text);
    }

    onMount() {
        this.searchBar.addNodeListener("input", () => {
            let text = this.searchBar.getValue();
            this.tags.dispatch("textInput", text);
            this.dispatch("changeText", text);
        });
    }
}


class ContestTaskListWithFiltersStyle extends StyleSheet {
    constructor() {
        super({updateOnResize: true});
        this.filterAreaCollapsed = Device.isMobileDevice();

        this.addBeforeUpdateListener(() => this.updateVariables());
    }

    updateVariables() {
        this.screenWidth = Math.min(256, window.innerWidth * 2 / 10);
        this.screenHeight = window.innerHeight - 60;
        // TODO: Not even Ramanujan could understand that resizeWidth formula
        // TODO: consider making it a one-liner like this.filterAreaCollapsed ? A : B;
        if (this.filterAreaCollapsed) {
            this.resizeWidth = Math.min(((window.innerWidth * 9 / 10 - 30) > Math.max(0, window.innerWidth * 6 / 10) ? (window.innerWidth * 9 / 10 - 30) : Math.max(0, window.innerWidth * 6 / 10)), (1280 * 9 / 10 - 30));
        } else {
            this.resizeWidth = Math.min(window.innerWidth - Math.min(256, screen.width * 2 / 10) * 5 / 4, Math.min((window.innerWidth * 7 / 10 > 768 ? window.innerWidth * 7 / 10 : 768), Math.min(screen.width * 7 / 10, 1280 * 7 / 10)));
        }
        this.screenWidthBack = Math.min(256, screen.width * 2 / 10);
    }

    toggleCollapsed() {
        this.filterAreaCollapsed = !this.filterAreaCollapsed;
        this.update();
    }

    @styleRule
    searchBar = {
        marginTop: "20px",
        marginBottom: "20px",
        border: "0px",
        fontSize: "85%",
        height: "25px",
        width: "85%",
        boxShadow: "0px 0px 1px rgb(55, 55, 55)",
        paddingLeft: "5%",
        lineHeight: "25px",
        outline: "none",
        ":focus": {
            textDecoration: "none",
            backgroundColor: "#f6f6f6",
        }
    };

    @styleRule
    tagFilters = {
        fontSize: "95%",
        whiteSpace: "nowrap",
        overflowY: "auto",
        overflowX: "auto",
        maxHeight: () => this.screenHeight - 65, /* 65 from the input area */
    };

    @styleRule
    collapseFiltersButton = {
        display: "inline-block",
        float: "left",
        width: "35px",
        position: "absolute",
        overflowY: "hidden",
        textAlign: "center",
        fontSize: "14px",
        marginTop: "22.5px",
        marginLeft: () => this.screenWidth / 4 - 25,
        zIndex: "3",
    };

    @styleRule
    filterArea = {
        display: () => this.filterAreaCollapsed ? "none" : "inline-block",
        float: "left",
        width: () => this.screenWidth,
        position: "absolute",
        paddingLeft: () => 1 / 10 * this.screenWidth + "px",
        maxHeight: () => this.screenHeight + "px",
        marginLeft: () => 20 + this.screenWidth / 4 - 20 + "px",
    };

    @styleRule
    contestTaskList = {
        display: "inline-block",
        float: "left",
        position: "absolute",
        marginLeft: () => this.filterAreaCollapsed ? (30 + this.screenWidthBack / 4) * Math.max(0.4, window.innerWidth / screen.width) + "px" :
                                                        this.screenWidth + this.screenWidth / 4 + "px",
        width: () => this.resizeWidth,
        maxHeight: () => this.screenHeight + "px",
        minHeight: () => this.screenHeight + "px",
        overflowY: "auto",
        overflowX: "auto",
        whiteSpace: "nowrap",
        paddingRight: "20px",
    };

    @styleRule
    className = {
        margin: "auto",
        width: Math.min(1280, screen.width * 10 / 10) + "px",
        overflow: "hidden",
    };
}


@registerStyle(ContestTaskListWithFiltersStyle)
class ContestTaskListWithFilters extends UI.Element {
    getDefaultOptions() {
        return {
            showTags: USER.isAuthenticated ? UserStore.getCurrentUser().getShowTagsInArchive(this.options.contest.id) : false,
        };
    }

    extraNodeAttributes(attr) {
        attr.addClass(this.styleSheet.className);
    }

    render() {
        return [
            <Button ref="collapseFiltersButton" className={this.styleSheet.collapseFiltersButton}
                       icon={this.getCollapseFiltersButtonIcon()}
                       level={Level.INFO} size={Size.SMALL}
                       onClick={() => this.toggleFiltersCollapsed()}/>,
            <FilterArea ref="filterArea" className={this.styleSheet.filterArea}
                        tagFiltersCss={this.styleSheet.tagFilters} searchBarCss={this.styleSheet.searchBar}
                        contest={this.options.contest} />,
            <div ref="contestTaskList" className={this.styleSheet.contestTaskList}>
                <div>
                    <div style={{"display": "inline-block", "padding-right": "10px"}}>{UI.T("Show tags")}</div>
                    <div style={{"display": "inline-block"}}>
                        <RawCheckboxInput ref={this.refLink("showTagsCheckbox")} initialValue={this.options.showTags}
                                          style={{"display": "inline-block"}} />
                    </div>
                </div>
                <ContestTaskList ref="table" contest={this.options.contest} isArchive showTags={this.options.showTags}
                                 sortingCriterion={this.options.defaultSortingCriterion}/>
            </div>
        ];
    }

    getCollapseFiltersButtonIcon() {
        return "chevron-" + (this.styleSheet.filterAreaCollapsed ? "right" : "left");
    }

    toggleFiltersCollapsed() {
        this.styleSheet.toggleCollapsed();
        this.collapseFiltersButton.setIcon(this.getCollapseFiltersButtonIcon());
    }

    onMount() {
        this.filterArea.addListener("changeText", (text) => this.table.setText(text));
        this.showTagsCheckbox.addChangeListener(() => {
            this.options.showTags = this.showTagsCheckbox.getValue();
            this.table.setShowTags(this.options.showTags);
            if (USER.isAuthenticated) {
                UserStore.getCurrentUser().saveCustomSetting("archive:showTags-"+this.options.contest.id, this.options.showTags);
            }
        });
        if (USER.isAuthenticated) {
            const getShowTags = () => {
                let newValue = UserStore.getCurrentUser().getShowTagsInArchive(this.options.contest.id);
                if (newValue !== this.options.showTags) {
                    this.options.showTags = newValue;
                    this.showTagsCheckbox.setValue(newValue);
                    this.table.setShowTags(this.options.showTags);
                }
            };
            getShowTags();
            this.attachChangeListener(UserStore.getCurrentUser(), getShowTags);
        }
        this.addListener("setActive", (active) => {
            if (active) {
                this.contestTaskList.node.scrollTop = this._scrollState || 0;
            } else {
                this._scrollState = this.contestTaskList.node.scrollTop;
            }
        });
        tasksTagsDispatcher.addListener((tag) => {
            const tabText = "#" + tag.name.split(" ").join("-");
            this.filterArea.setText(tabText);
            this.table.setText(tabText);
        })
    }
}


class BroadcastTaskNowModal extends ActionModal {
    getTitle() {
        return "Broadcast task";
    }

    getBody() {
        return "Are you sure you want to broadcast this task now?";
    }

    getActionLevel() {
        return Level.PRIMARY;
    }

    getActionName() {
        return "Do it!";
    }

    action() {
        const {contestTask} = this.options;
        Ajax.postJSON("/contest/change_task_delay/", {
            contestId: contestTask.contestId,
            contestTaskId: contestTask.id
        });
        this.hide();
    }
}


class TaskBroadcastDelayEditor extends UI.Element {
    editMode = false;

    updateEditMode(editMode) {
        this.editMode = editMode;
        this.redraw();
    }

    render() {
        let message;
        if (this.editMode) {
            message = [
                <Button level={Level.PRIMARY} size={Size.EXTRA_SMALL} style={{marginLeft: "3px"}}
                        icon="floppy-o" onClick={() => this.save()} />,
                <TextInput value={this.getTextInputValue()} ref="broadcastDelayInput"
                           style={{width: "95px", marginLeft: "5px"}} />
            ];
        } else {
            message = [
                <Button level={Level.PRIMARY} size={Size.EXTRA_SMALL} style={{marginLeft: "3px"}}
                        icon="pencil" onClick={() => this.updateEditMode(true)} />,
                <span style={{paddingLeft: "5px"}}>{this.getTextValue()}</span>
            ];
        }
        return [
            <Button level={Level.PRIMARY} size={Size.EXTRA_SMALL}
                    onClick={() => this.showBroadcastNowModal()}>Now!</Button>,
            message
        ];
    }

    save() {
        const {contestTask} = this.options;
        const formattedDuration = this.broadcastDelayInput.getValue();
        const durationTokens = formattedDuration.split(":");
        let seconds;
        if (durationTokens.length === 1) {
            seconds = parseInt(durationTokens);
        } else if (durationTokens.length === 2) {
            seconds = parseInt(durationTokens[0]) * 60 + parseInt(durationTokens[1]);
        } else if (durationTokens.length === 3) {
            seconds = parseInt(durationTokens[0]) * 3600 + parseInt(durationTokens[1]) * 60 + parseInt(durationTokens[2]);
        } else {
            alert("Invalid duration format");
            return;
        }
        Ajax.postJSON("/contest/change_task_delay/", {
            contestId: contestTask.contestId,
            contestTaskId: contestTask.id,
            delay: seconds
        });
        this.updateEditMode(false);
    }

    getTextValue(delay) {
        delay = delay || this.options.contestTask.broadcastDelay;
        if (!delay) {
            return <em>On contest start</em>;
        }
        const duration = new Duration({seconds: delay});
        return duration.format("h:mm:ss");
    }

    getTextInputValue() {
        const duration = new Duration({seconds: this.options.contestTask.broadcastDelay || 0});
        return duration.format("h:mm:ss");
    }

    showBroadcastNowModal() {
        BroadcastTaskNowModal.show({contestTask: this.options.contestTask});
    }
}


@autoredraw
class AdminContestTasksTable extends Table {
    getContest() {
        return this.options.contest;
    }

    deleteTask(task) {
        let data = {
            contestId: this.getContest().id,
            contestTaskId: task.id,
        };
        Ajax.postJSON("/contest/delete_task/", data);
    };

    getEntries() {
        return this.getContest().getContestTasks();
    }

    moveTaskUp(task) {
        const contestTasks = this.getContest().getContestTasks();
        let updates = {};
        for (let i = 0; i < contestTasks.length; i += 1) {
            updates[contestTasks[i].id] = i + 1;
            if (contestTasks[i] === task) {
                updates[contestTasks[i].id] -= 1;
                updates[contestTasks[i - 1].id] += 1;
            }
        }
        let request = {
            updates: JSON.stringify(updates),
            contestId: this.options.contest.id
        };
        Ajax.postJSON("/contest/update_order/", request).then(() => this.redraw());
    }

    getDefaultColumns() {
        return [
            {
                headerName: UI.T("Order"),
                value: (task, rowIndex) => rowIndex > 0 && <Button
                    level={Level.PRIMARY}
                    icon="arrow-up"
                    onClick={() => this.moveTaskUp(task)}
                />,
                rawValue: task => task.contestIndex,
            }, {
                headerName: UI.T("Task"),
                value: (task) => <Link href={"/contest/" + this.getContest().name + "/task/" + task.name + "/"}
                                       value={task.longName}/>,
                rawValue: task => task.longName,
            }, {
                headerName: UI.T("URL Name"),
                value: task => task.name,
            }, {
                headerName: UI.T("Score type"),
                value: task => task.scoreTypeName,
            }, {
                headerName: UI.T("Delay"),
                value: task => <TaskBroadcastDelayEditor contestTask={task} />,
            }, {
                headerName: UI.T("Delete"),
                value: (task) => <Button level="danger" onClick={() => this.deleteTask(task)}>
                                    {UI.T("Delete")}
                                 </Button>,
            }
        ];
    }
}

export {AdminContestTasksTable, ContestTaskListWithFilters, ContestTaskList};
