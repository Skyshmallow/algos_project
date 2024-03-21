import {UI, SectionDivider, ActionModal, FormField, RawCheckboxInput, Button, Label,
        Panel, CollapsiblePanel, CollapsibleTableRow, CollapsibleTable, Select, Level, Orientation} from "../../csabase/js/UI.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";

import {MachineInstanceStore, MachineInstance} from "./state/MachineInstanceStore.js";
import {CodeEditor} from "../../stemjs/src/ui/CodeEditor.jsx";
import {capitalize} from "../../stemjs/src/base/Utils.js";
import {autoredraw} from "../../stemjs/src/decorators/AutoRedraw.js";


let dontAsk = false;

class ConfirmActionModal extends ActionModal {
    getDefaultOptions() {
        return Object.assign(super.getDefaultOptions(), {
            closeName: "No",
            level: Level.DANGER,
            actionName: "Yes"
        });
    }

    getActionName() {
        return "Confirm action";
    }

    getBody() {
        return <SectionDivider ref="divider" orientation={Orientation.VERTICAL}
                               style={{height: "100%", width: "100%", overflow: "hidden"}}>
            <div>
                <UI.TextElement ref="text" value="Are you sure you want to complete this action?"/>
                <br/>
                <UI.TextElement ref="customText" value={this.options.text || ""}/>
            </div>
            <div>
                <FormField labelWidth="92%" contentWidth="3%" contentFirst={true} label="I am not high and I am not drunk, please don't bother me for the next 2 minutes!">
                    <RawCheckboxInput ref="rememberDecisionCheckbox"  style={{display: "inline-block", marginTop: "11px"}} />
                </FormField>
            </div>
        </SectionDivider>;
    }

    action() {
        if (this.rememberDecisionCheckbox.getValue()) {
            dontAsk = true;
            setTimeout(() => {
                dontAsk = false;
            }, 2 * 60 * 1000);
        }
        this.options.callbackAction();
        this.hide();
    }

    static start(text, callback) {
        if (dontAsk) {
            callback();
            return;
        }

        this.show({
            callbackAction: callback,
            text: text
        });
    }
}

class ConfirmDestroyModal extends ActionModal {
    getDefaultOptions() {
        return Object.assign(super.getDefaultOptions(), {
            closeName: "No",
            level: Level.DANGER,
            actionName: "Confirm destroy"
        });
    }

    action() {
        this.options.callbackAction();
        this.hide();
    }

    getBody() {
        return <div>
            <UI.TextElement value="Are you sure you want to complete this action?" />
            <br/>
            <UI.TextElement value={this.options.text || ""}/>
        </div>;
    }

    static start(text, callback) {
        if (dontAsk) {
            text += ". I know you are sober, but this is a serious action and you have to be fully aware!";
        }
        this.show({
            callbackAction: callback,
            text: text
        });
    }
}

@autoredraw
class MachineInstanceCollapsibleRow extends CollapsibleTableRow {
    setOptions(options) {
        super.setOptions(options);

        if (options.entry) {
            this.machine = options.entry;
        }
    }

    onMount() {
        super.onMount();

        const simpleActions = [
            {name: "Boot", commandName: "boot"},
            {name: "Shutdown", commandName: "shutdown"},
            {name: "Reboot", commandName: "reboot"},
            {name: "Clone", commandName: "clone"},
            {name: "Update", commandName: "update"},
        ];

        for (const action of simpleActions) {
            this["machine" + action.name + "Button"].addClickListener(() => this.sendCommand(action.commandName));
        }
        this.machineDestroyButton.addClickListener(() => {
            ConfirmDestroyModal.start(
                `Destroy machine with id ${this.machine.id} (${this.machine.label})`,
                () => this.sendCommand("destroy")
            );
        });

        if (this.machine.scripts && this.machine.scripts.length > 0) {
            this.runCustomScriptButton.addClickListener(() => {
                ConfirmActionModal.start(
                    `Run script "${this.customScriptSelect.get()}" on machine ${this.machine.id}`,
                    () => this.sendCommand("script", this.customScriptSelect.get())
                );
            });
        }

        this.machine.addEventListener("logMessage", (event) => {
            this.machineLogsHighlighter.append(event.message);
        });
    }

    redraw() {
        if (!super.redraw()) {
            return false;
        }

        if (this.scriptChoice) {
            this.setScriptChoice(this.scriptChoice);
        }
        return true;
    }

    renderCollapsible() {
        const publicIPAddress = this.machine.publicIPAddress || "N/A";
        const privateIPAddress = this.machine.privateIPAddress || "N/A";
        return [
                <div ref="machineInfo">
                    <p>RAM: { this.machine.ramSize } MB</p>
                    <p>Disk: { this.machine.diskSize } MB</p>
                    <p>Public IP address: { publicIPAddress }</p>
                    <p>Private IP address: { privateIPAddress }</p>
                    <p>Date created: { this.machine.dateCreated }</p>
                </div>,
                <CodeEditor ref="machineLogsHighlighter" maxLines={30} value={this.machine.logs} />
            ];
    }

    sendCommand(command, scriptName) {
        MachineInstanceCollapsibleRow.sendCommand([this.machine.id], command, scriptName)
    }

    static sendCommand(ids, command, scriptName) {
        let request = {
            action: command,
            ids: ids,
        };

        if (command === "script") {
            request.scriptName = scriptName;
        }

        Ajax.postJSON("/manage/control_machine/", request);
    }
}

class MachineGroupTable extends CollapsibleTable {
    onMount() {
        super.onMount();
    }

    getRowClass() {
        return MachineInstanceCollapsibleRow;
    }

    static renderMachineServices(machine) {
        let services = [];
        if (machine.hasOwnProperty("services")) {
            services = Object.keys(machine.services);
        }

        if (services.length === 0) {
            return <Label level={Level.DANGER}>No service running</Label>;
        }

        let excludeFromTooltip = new Set(["service", "machineId", "timestamp", "clientTimestamp"]);

        let serviceSpans = [];
        for (let serviceName of services) {
            let service = machine.services[serviceName].current;

            let serviceStatusTooltip = "";

            for (let serviceField of Object.keys(service.data)) {
                if (excludeFromTooltip.has(serviceField)) continue;
                serviceStatusTooltip += serviceField + ": " + service.data[serviceField] + "\n";
            }
            serviceStatusTooltip += "timestamp: " + (new Date(service.data.timestamp));

            let titleSuffix = "";
            let serviceStatus = null;
            if (service.meta.status == MachineInstance.statusType.DANGER) {
                serviceStatus = Level.DANGER;
            } else if (service.meta.status == MachineInstance.statusType.WARNING) {
                serviceStatus = Level.WARNING;
            } else if (service.meta.status == MachineInstance.statusType.NEW) {
                serviceStatus = Level.PRIMARY;
                titleSuffix = " (New)";
            } else if (service.meta.status == MachineInstance.statusType.OFFLINE) {
                serviceStatus = Level.WARNING;
            } else {
                serviceStatus = Level.SUCCESS;
            }

            serviceSpans.push(
                <Label key={serviceName} level={serviceStatus} title={serviceStatusTooltip}>{serviceName + titleSuffix}</Label>
            );
        }

        return serviceSpans;
    }

    renderMachineActions(machine) {
        let scriptsButton = <a className="btn btn-info disabled">No scripts</a>;

        let disableActions = false;
        if (machine.inCloning) {
            disableActions = true;
        }

        let disableDestroy = false;
        if (disableActions || machine.isProtected) {
            disableDestroy = true;
        }

        if (machine.hasOwnProperty("scripts") && machine.scripts.length > 0) {
            let scriptsDropdown = machine.scripts.map((scriptName, index) => {
                return <li key={index}><a ref={"scriptChoice" + "-" + scriptName}>{scriptName}</a></li>;
            });
            scriptsButton = <div className="btn-group">
                <Button ref="runCustomScriptButton" level={Level.INFO} label="Run" disabled={disableActions} parent={this}/>
                <Select ref="customScriptSelect" options={machine.scripts} style={{width:"auto", height: "30px"}} disabled={disableActions} parent={this}/>
            </div>;
        }

        return [
            <div className="btn-toolbar">
                <div className="btn-group btn-group-sm" role="group">
                    <Button ref="machineBootButton" level={Level.INFO} label="Boot" disabled={disableActions} parent={this}/>
                    <Button ref="machineShutdownButton" level={Level.INFO} label="Shutdown" disabled={disableActions} parent={this}/>
                    <Button ref="machineRebootButton" level={Level.INFO} label="Reboot" disabled={disableActions} parent={this}/>
                    <Button ref="machineCloneButton" level={Level.INFO} label="Clone" disabled={disableActions} parent={this}/>
                    <Button ref="machineUpdateButton" level={Level.INFO} label="Update" disabled={disableActions} parent={this}/>
                </div>
                {scriptsButton}
                <Button ref="machineDestroyButton" className="pull-right" level={Level.DANGER} label="Destroy" disabled={disableDestroy} parent={this}/>
            </div>,
        ];
    }

    static renderMachineStatus(machine) {
        if (machine.inCloning) {
            return [<p>Cloning ...</p>]
        } else {
            return [<p>{capitalize(machine.status)}</p>];
        }
    }

    getEntries() {
        return this.options.machines || [];
    }

    getDefaultColumns() {
        return [
            {
                value: machine => machine.id,
                headerName: "Id",
            }, {
                value: machine => machine.label,
                headerName: "Label",
            }, {
                value: MachineGroupTable.renderMachineStatus,
                headerName: "Status",
            }, {
                value: MachineGroupTable.renderMachineServices,
                headerName: "Running services",
            }, {
                value: this.renderMachineActions,
                headerName: "Actions",
            }
        ];
    }
}

export class MachineInstanceWidget extends Panel {
    constructor(options) {
        super(options);

        MachineInstanceStore.addCreateListener((data) => {
            this.redraw();
        }, false);

        MachineInstanceStore.addDeleteListener((obj, event) => {
            this.redraw();
        });

        MachineInstanceStore.registerStreams();

        this.machineGroups = new Map();
    }

    getNodeAttributes() {
        let attr = super.getNodeAttributes();

        attr.addClass("panel-group");
        attr.setAttribute("role", "tablist");
        //TODO: see if this should
        attr.setAttribute("aria-multiselectable", "true");

        return attr;
    }

    onMount() {
        super.onMount();
        for (let [machineGroupName, machineGroup] of this.machineGroups) {
            this["groupUpdateAll-" + machineGroupName].addClickListener((event) => {
                event.preventDefault();
                event.stopPropagation();

                ConfirmActionModal.start("\"Update\" all machines from group \"" + machineGroupName + "\".",
                    () => {
                        let ids = [];
                        for (let machine of machineGroup) {
                            ids.push(machine.id);
                        }
                        MachineInstanceCollapsibleRow.sendCommand(ids, "update");
                    });
            });
        }
    }

    render() {
        let machines = MachineInstanceStore.all(true);
        let otherMachines = [];

        this.machineGroups = new Map();
        for (let machine of machines) {
            if (!machine.machineGroup) {
                otherMachines.push(machine);
                continue;
            }

            if (!this.machineGroups.has(machine.machineGroup)) {
                this.machineGroups.set(machine.machineGroup, []);
            }
            this.machineGroups.get(machine.machineGroup).push(machine);
        }

        let renderedMachineGroups = [];
        for (let [machineGroupName, machineGroup] of this.machineGroups) {
            renderedMachineGroups.push(this.renderMachineGroup(machineGroupName, machineGroup));
        }

        if (otherMachines.length > 0) {
            renderedMachineGroups.push(this.renderMachineGroup("Other", otherMachines))
        }

        return [renderedMachineGroups];
    }

    renderMachineGroup(machineGroupName, machineGroup) {
        let style = {
            float: "right",
            marginTop: "-7px"
        };
        let title = [machineGroupName,
                    <Button ref={"groupUpdateAll-" + machineGroupName} style={style} level={Level.INFO} label="Update All" parent={this}/>
        ];
        return (
            <CollapsiblePanel key={machineGroupName} title={title} collapsed={false}>
                <MachineGroupTable machines={machineGroup} parent={this}/>
            </CollapsiblePanel>
        );
    }
}
