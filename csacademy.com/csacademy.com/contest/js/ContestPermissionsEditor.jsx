import {UI, Select, RawCheckboxInput, Table, Button, Level, Size} from "../../csabase/js/UI.js";
import {UserInputField} from "../../establishment/accounts/js/UsersAutocompletion.jsx";
import {UserHandle} from "../../csaaccounts/js/UserHandle.jsx";

import {Contest} from "./state/ContestStore.js";


export const PermissionsPresets = {
    VIEW_ONLY: {
        toString: () => "View only",
        permissions: {
            "view": true,
        }
    },
    ANSWER_QUESTIONS: {
        toString: () => "Answer questions",
        permissions: {
            "view": true,
            "answer-question": true,
        }
    },
    QUESTIONS_AND_ANNOUNCEMENTS: {
        toString: () => "Answer questions & broadcast announcements",
        permissions: {
            "view": true,
            "answer-question": true,
            "broadcast-announcement": true,
        }
    },
    FULL: {
        toString: () => "Full permissions",
        permissions: {
            "view": true,
            "edit-settings": true,
            "edit-tasks": true,
            "answer-question": true,
            "broadcast-announcement": true,
        }
    },
    CUSTOM: {
        toString: () => "Custom"
    }
};


export class ContestPermissionsEditor extends UI.Element {
    getContest() {
        return this.options.contest;
    }

    removePermission(userId, permissionName, redraw=true) {
        return this.getContest().removePermission(userId.userId || userId, permissionName, () => redraw && this.redraw());
    }

    addPermission(userId, permissionName, redraw=true) {
        return this.getContest().addPermission(userId.userId || userId, permissionName, () => redraw && this.redraw());
    }

    togglePermission(userId, permissionName, redraw=true) {
        if (this.getContest().getUserPermission(userId.userId || userId, permissionName)) {
            this.removePermission(userId, permissionName, redraw);
        } else {
            this.addPermission(userId, permissionName, redraw);
        }
    }

    tryMatchPreset(userId) {
        if (this.forceCustomForUsers && this.forceCustomForUsers.has(userId)) {
            return PermissionsPresets.CUSTOM;
        }
        for (const preset of Object.values(PermissionsPresets)) {
            if (preset !== PermissionsPresets.CUSTOM) {
                const permissions = preset.permissions;
                let ok = true;
                for (const permName of Object.values(Contest.ModeratedAction)) {
                    if (this.getContest().getUserPermission(userId, permName) !== !!(permissions[permName])) {
                        ok = false;
                        break;
                    }
                }
                if (ok) {
                    return preset;
                }
            }
        }
        return PermissionsPresets.CUSTOM;
    }

    changeUserToPreset(groupMember, preset) {
        const userId = groupMember.userId;
        if (preset === PermissionsPresets.CUSTOM) {
            this.forceCustomForUsers = this.forceCustomForUsers || new Set();
            this.forceCustomForUsers.add(userId);
            this.redraw();
            return;
        }
        this.forceCustomForUsers && this.forceCustomForUsers.delete(userId);
        let xhrPromises = [];
        for (const permName of Object.values(Contest.ModeratedAction)) {
            const shouldHavePermission = !!(preset.permissions[permName]);
            if (shouldHavePermission) {
                xhrPromises.push(this.addPermission(userId, permName, false));
            } else {
                xhrPromises.push(this.removePermission(userId, permName, false));
            }
        }
        Promise.all(xhrPromises).then(() => this.redraw());
    }

    getTableColumns() {
        let columns = [
            {
                value: member => <UserHandle id={member.userId} />,
                headerName: "User"
            }, {
                value: member => <Select options={[...Object.values(PermissionsPresets)]}
                                         selected={this.tryMatchPreset(member.userId)}
                                         ref={this.refLink("presetSelect" + member.id)}
                                         onChange={
                                             () => this.changeUserToPreset(member, this["presetSelect" + member.id].get())
                                         }/>,
                headerName: "Preset"
            }
        ];
        for (const permKey of Object.keys(Contest.ModeratedAction)) {
            const permName = Contest.ModeratedAction[permKey];
            const verbosePermName = Contest.VerboseModeratedAction[permKey];
            columns.push({
                value: member => <RawCheckboxInput
                                        initialValue={this.getContest().getUserPermission(member.userId, permName)}
                                        disabled={
                                            permName === Contest.ModeratedAction.VIEW ||
                                            this.tryMatchPreset(member.userId) !== PermissionsPresets.CUSTOM
                                        }
                                        onChange={() => this.togglePermission(member.userId, permName)}
                                />,
                headerName: verbosePermName
            })
        }
        columns.push({
            value: member => <Button level={Level.DANGER} size={Size.EXTRA_SMALL} icon="minus"
                                     onClick={
                                         () => this.removePermission(member, Contest.ModeratedAction.VIEW)
                                     } />
        });
        return columns;
    };

    getTableEntries() {
        return this.getContest().getPermissionGroup(Contest.ModeratedAction.VIEW).getMembers();
    }

    render() {
        return [
            <Table ref="usersTable" entries={this.getTableEntries()} columns={this.getTableColumns()} />,
            <h4 style={{marginTop: "20px"}}>Give access to a new user:</h4>,
            <UserInputField ref="userInputField"/>
        ];
    }

    onMount() {
        this.attachListener(this.userInputField, "user", (userId) => {
            this.userInputField.clear();
            this.addPermission(userId, Contest.ModeratedAction.VIEW);
        });
    }
}
