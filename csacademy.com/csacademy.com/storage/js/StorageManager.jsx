import {UI} from "../../stemjs/src/ui/UIBase.js";
import {SortableTable} from "../../stemjs/src/ui/table/SortableTable.jsx";
import {Level} from "../../stemjs/src/ui/Constants.js";
import {Button} from "../../stemjs/src/ui/button/Button.jsx";
import {Panel} from "../../stemjs/src/ui/UIPrimitives.jsx";
import {Link} from "../../stemjs/src/ui/UIPrimitives.jsx";
import {StemDate} from "../../stemjs/src/time/Date.js";

import {PublicStorageFileStore} from "./state/PublicFileStore";
import {UploadFilesModal, DeleteFileModal, RenameFileModal} from "./StorageModals";
import {autoredraw} from "../../stemjs/src/decorators/AutoRedraw.js";
import {formatBytes} from "../../stemjs/src/base/Formatting.js";


export class FileTable extends SortableTable {
    setOptions(options) {
        super.setOptions(options);
        this.resetColumnSortingOrder();
    }

    resetColumnSortingOrder() {
        const {columns} = this.options;
        this.columnSortingOrder = [columns[4], columns[3], columns[0], columns[2], columns[1]];
    }

    addFile(file) {
        this.options.files.push(file);
        this.redraw();
    }

    getDefaultColumns() {
        let cellStyle = {
            textAlign: "left",
            verticalAlign: "middle"
        };
        let headerStyle = {
            textAlign: "left",
            verticalAlign: "middle"
        };
        return [{
            value: file => file.name,
            rawValue: file => file.name,
            headerName: "Filename",
            headerStyle: headerStyle,
            cellStyle: cellStyle
        }, {
            value: file => <Link href={file.getPublicURL()} target="_blank_" value={file.getPublicURL()} />,
            rawValue: file => file.getPublicURL(),
            headerName: "URL",
            headerStyle: headerStyle,
            cellStyle: cellStyle
        }, {
            value: file => formatBytes(file.size),
            rawValue: file => file.size,
            headerName: "Size",
            headerStyle: headerStyle,
            cellStyle: cellStyle
        }, {
            value: file => StemDate.unix(file.dateModified).locale("en").format("DD/MM/YYYY HH:mm:ss"),
            rawValue: file => file.dateModified,
            sortDescending: true,
            headerName: "Date modified",
            headerStyle: headerStyle,
            cellStyle: cellStyle
        }, {
            value: file => StemDate.unix(file.dateCreated).locale("en").format("DD/MM/YYYY HH:mm:ss"),
            rawValue: file => file.dateCreated,
            sortDescending: true,
            headerName: "Date created",
            headerStyle: headerStyle,
            cellStyle: cellStyle
        }, {
            value: file => <Button level={Level.SUCCESS} label="Rename"
                                   onClick={() => RenameFileModal.show({file})}/>,
            headerName: "Rename",
            headerStyle: headerStyle,
            cellStyle: cellStyle
        }, {
            value: file => <Button level={Level.DANGER} label="Delete"
                                   onClick={() => DeleteFileModal.show({file})}/>,
            headerName: "Delete",
            headerStyle: headerStyle,
            cellStyle: cellStyle
        }];
    }

    getEntries() {
        return this.sortEntries(this.options.files);
    }
}

@autoredraw(PublicStorageFileStore)
export class StorageManager extends Panel {
    extraNodeAttributes(attr) {
        attr.setStyle("margin", "20px 10%");
    }

    getDefaultOptions() {
        return {
            title: "File manager"
        };
    }

    render() {
        const files = PublicStorageFileStore.all();

        return [
            <div className="pull-left"><h4><strong>{this.options.title}</strong></h4></div>,
            <div className="pull-right">
                <Button level={Level.PRIMARY} label="Upload files"
                        onClick={() => UploadFilesModal.show()}
                        style={{marginTop: "5px", marginBottom: "5px"}}/>
            </div>,
            (files.length > 0) ? <FileTable files={files}/> : <h3>No files uploaded</h3>,
        ];
    }
}
