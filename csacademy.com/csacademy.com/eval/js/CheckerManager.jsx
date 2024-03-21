import {UI, Button, ButtonGroup, Level, Size, CollapsiblePanel, Switcher, TextInput,
        ActionModal, ActionModalButton, TemporaryMessageArea} from "../../csabase/js/UI.js";
import {Dispatcher} from "../../stemjs/src/base/Dispatcher.js";
import {WorkspaceIDE, PluginTypes} from "../../workspace/js/ide/WorkspaceIDE.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";

import {TaskCheckerStore} from "./state/TaskCheckerStore.js";
import {autoredraw} from "../../stemjs/src/decorators/AutoRedraw.js";


class WorkspaceNameSpan extends UI.Element {
    onMount() {
        this.button.addClickListener(() => {
            this.options.ref.parent.dispatch("changeWorkspace", this.options.workspace);
        });
        this.remove.addClickListener(() => {
            this.options.ref.parent.dispatch("removeWorkspace", this.options.workspace);
        });
    }

    highlight() {
        this.options.highlighted = true;
        this.button.setLevel(Level.SUCCESS);
    }

    unhighlight() {
        this.options.highlighted = false;
        this.button.setLevel(Level.INFO);
    }

    render() {
        const {workspace} = this.options;

        return [
            <Button ref="remove" icon="minus" style={{
                                        "display": "inline-block",
                                        "margin-right": "5px"
                                    }} level={Level.DANGER} />,
            <Button level={this.options.highlighted ? Level.SUCCESS : Level.INFO} size={Size.EXTRA_SMALL}
                 ref="button" style={{"font-size": "1.4em", "display": "inline-block"}}>
                Workspace {workspace.name || "Anonymous"} ID {workspace.id} UserID {workspace.userId}
            </Button>
        ]
    }
}

class Checker extends CollapsiblePanel {
    getTitle() {
        return this.options.checker.name || "No name checker";
    }

    render() {
        let children = [];
        for (let workspace of this.options.checker.getWorkspaces()) {
            children.push(
                <WorkspaceNameSpan ref={"workspace-" + workspace.id} style={{"margin": "20px"}} workspace={workspace} />
            );
        }
        return [
            <div style={{"width": "40%", "display": "inline-block"}} ref="workspaceListArea">
                {children}
                <div style={{"margin-top": "10px"}} ref="addWorkspaceArea">
                    <Button
                        ref="addWorkspaceButton"
                        level={Level.PRIMARY}
                        icon="plus"
                        style={{"margin-left": "20px"}}
                    />
                    <TextInput placeholder="id" ref="newWorkspaceId" style={{"padding-left": "5px", "margin-left": "5px"}}/>
                </div>
            </div>,
            <div ref="workspaceArea" style={{"width": "55%", "margin-left": "5%", "height": "400px", "display": "inline-block", "float": "right"}}>
                <Switcher ref="workspaceSwitcher" style={{"height": "100%"}}>
                    <div ref="emptyWorkspaceChild" />
                </Switcher>
            </div>
        ];
    }

    async linkWorkspace(id) {
        await Ajax.postJSON("/eval/checker/edit", {
            "addWorkspace": true,
            "checkerId": this.options.checker.id,
            "workspaceId": id
        });

        this.redraw();
    }

    async unlinkWorkspace(id) {
        await Ajax.postJSON("/eval/checker/edit", {
            "removeWorkspace": true,
            "checkerId": this.options.checker.id,
            "workspaceId": id
        });

        this.redraw();
        this.workspaceSwitcher.setActive(this.emptyWorkspaceChild);
    }

    onMount() {
        this.workspaceIDEMap = new Map();
        this.addWorkspaceButton.addClickListener(() => {
            let id = parseInt(this.newWorkspaceId.getValue());
            if (!isNaN(id) && id) {
                this.linkWorkspace(id);
            }
        });
        this.addListener("changeWorkspace", (workspace) => {
            if (!this.workspaceIDEMap.has(workspace)) {
                this.workspaceIDEMap.set(
                    workspace,
                    <WorkspaceIDE workspace={workspace} plugins={PluginTypes.CHECKER} key={Math.random()} />
                );
                this.workspaceSwitcher.appendChild(this.workspaceIDEMap.get(workspace));
            }
            this.workspaceSwitcher.setActive(this.workspaceIDEMap.get(workspace));
            for (let workspace2 of this.options.checker.getWorkspaces()) {
                if (workspace2 === workspace) {
                    this["workspace-" + workspace2.id].highlight();
                } else {
                    this["workspace-" + workspace2.id].unhighlight();
                }
            }
        });
        this.addListener("removeWorkspace", (workspace) => {
            this.unlinkWorkspace(workspace.id);
        })
    }
}

class AddCheckerModal extends ActionModal {
    getActionName() {
        return "New Checker";
    }

    getBody() {
        return [
            <div style={{"display": "inline-block", "margin-right": "10px"}}>Checker Name:</div>,
            <TextInput placeholder="name" ref="nameInputArea" style={{"padding-left": "5px"}}/>
        ]
    }

    getFooter() {
        return [
            <TemporaryMessageArea ref="messageArea"/>,
            <ButtonGroup>
                <Button label={this.getCloseName()} onClick={() => this.hide()} style={{"margin-right": "10px"}}/>,
                {this.getActionButton()}
            </ButtonGroup>
        ];
    }

    action() {
        Ajax.postJSON("/eval/checker/create", {
            "checkerName": this.nameInputArea.getValue()
        }).then(
            () => {
                this.hide();
                Dispatcher.Global.dispatch("newChecker");
            }
        );
    }
}
let AddCheckerButton = ActionModalButton(AddCheckerModal);

class CachebustModal extends ActionModal {
    getActionName() {
        return "Bust Eval Cache";
    }

    getBody() {
        return "Are you sure? This action may take a long time";
    }
    
    action() {
        Ajax.postJSON("/eval/checker/cache_bust/", {});
    }
}
let CachebustButton = ActionModalButton(CachebustModal);


@autoredraw(TaskCheckerStore)
export class CheckerManager extends UI.Element {
    render() {
        const checkers = TaskCheckerStore.all();
        checkers.sort((a, b) => {return b.id - a.id;});

        return [
            <AddCheckerButton ref={this.refLink("addChecker")} level={Level.SUCCESS}
                    style={{"margin-left": "30px"}}>
                New Checker
            </AddCheckerButton>,
            <CachebustButton ref={this.refLink("cachebustButton")} level={Level.DANGER}
                    style={{"display": "inline-block", "margin-left": "20px"}}>
                Bust Eval Cache
            </CachebustButton>,
            checkers.map(checker => <Checker
                checker={checker}
                ref={"checker" + checker.id}
                style={{"margin": "30px"}}
            />),
        ]
    }
}
