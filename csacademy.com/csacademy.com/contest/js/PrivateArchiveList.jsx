import {UI, Link, ActionModal, Form, FormField, TextInput, TemporaryMessageArea, ButtonGroup, Button, Table, Panel, Select, Level} from "../../csabase/js/UI.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {GlobalStyle} from "../../stemjs/src/ui/GlobalStyle.js";
import {PrivateArchiveStore} from  "./state/PrivateArchiveStore.js";

class CreatePrivateArchiveModal extends ActionModal {
    getActionName() {
        return "Create private archive";
    }

    getBody() {
        return <Form style={{marginTop: "10px"}}>
            <FormField ref="urlNameFormField" label="URL name">
                <TextInput ref="urlNameInput"  value=""/>
            </FormField>
            <FormField ref="longNameFormField" label="Long name">
                <TextInput ref="longNameInput"  value=""/>
            </FormField>
        </Form>;
    }

    getFooter() {
        return [<TemporaryMessageArea ref="messageArea"/>,
            <ButtonGroup>
                <Button label="Close" onClick={() => this.hide()}/>
                <Button level={Level.PRIMARY} label="New archive" onClick={() => this.createPrivateArchive()}/>
            </ButtonGroup>
        ];
    }

    createPrivateArchive() {
        let privateArchiveName = this.urlNameInput.getValue();
        let privateArchivelongName = this.longNameInput.getValue();

        let request = {
            privateArchiveName: privateArchiveName,
            privateArchiveLongName: privateArchivelongName
        };

        Ajax.postJSON("/contest/create_private_archive/", request).then(
            (data) => {
                this.hide();
                this.options.privateArchiveList.redraw();
            },
            (error) => this.messageArea.showMessage(error.message, "red")
        );
    }

    hide() {
        this.messageArea.clear();
        super.hide();
    }
}

class DeletePrivateArchiveModal extends ActionModal {
    getPrivateArchives() {
        let privateArchives = this.options.privateArchiveList.getPrivateArchives();
        privateArchives.sort((a, b) => { return b.id - a.id; });
        return privateArchives;
    }

    getActionName() {
        return "Delete private archive";
    }

    getBody() {
        return <Form style={{marginTop: "10px"}}>
            <FormField ref="typeFormField" label="Archive">
                <Select ref="privateArchiveSelect" options={this.getPrivateArchives()}/>
            </FormField>
        </Form>;
    }

    getFooter() {
        return [<TemporaryMessageArea ref="messageArea"/>,
            <Button level={Level.DANGER} label="Delete archive" onClick={() => this.deletePrivateArchive()}/>];

    }

    deletePrivateArchive() {
        let privateArchive = this.privateArchiveSelect.get();

        let request = {
            privateArchiveId: privateArchive.id
        };

        Ajax.postJSON("/contest/delete_private_archive/", request).then(
            () => {
                PrivateArchiveStore.applyDeleteEvent({
                    type: "delete",
                    objectId: privateArchive.id
                });
                this.hide();
                this.options.privateArchiveList.redraw();
            },
            (error) => this.messageArea.showMessage(error.message, "red")
        );
    }

    hide() {
        this.messageArea.clear();
        super.hide();
    }
}

class PrivateArchiveTable extends Table {
    getDefaultColumns() {
        return [{
            value: privateArchive => <Link href={"/private-archive/" + privateArchive.name} value={privateArchive.getName()} />,
            headerName: "Archive",
            headerStyle: {verticalAlign: "middle"},
            cellStyle: {verticalAlign: "middle"},
        }];
    }
}

export class PrivateArchiveList extends Panel {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.addClass(GlobalStyle.Container.SMALL);
    }

    getPrivateArchives() {
        return PrivateArchiveStore.all();
    }

    render() {
        this.createPrivateArchiveModal = <CreatePrivateArchiveModal privateArchiveList={this}/>;
        this.deletePrivateArchiveModal = <DeletePrivateArchiveModal privateArchiveList={this}/>;
        return [
            <div className="pull-right">
                <Button level={Level.PRIMARY} label="New archive"
                           onClick={() => this.createPrivateArchiveModal.show()}
                           style={{margin: "5px"}}/>
                <Button level={Level.DANGER} label="Delete archive"
                           onClick={() => this.deletePrivateArchiveModal.show()}
                           style={{margin: "5px"}}/>
            </div>,
            <h3>All private archives:</h3>,
            <PrivateArchiveTable entries={this.getPrivateArchives()}/>
        ];
    }
}
