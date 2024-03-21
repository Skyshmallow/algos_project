import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store.js";
import {
    VirtualStoreObjectMixin,
    VirtualStoreMixin
} from "../../../stemjs/src/state/StoreMixins.js";
import {
    Ajax
} from "../../../stemjs/src/base/Ajax.js";
import {
    LocalStorageMap,
    SessionStorageMap
} from "../../../stemjs/src/base/StorageMap.js";
import {
    StemDate
} from "../../../stemjs/src/time/Date.js";
import {
    ServerTime
} from "../../../stemjs/src/time/Time.js";


class WorkspaceFile extends VirtualStoreObjectMixin(StoreObject) {
    getWorkspace() {
        return WorkspaceStore.get(this.workspaceId);
    }

    getName() {
        return this.name;
    }

    toString() {
        return this.getName();
    }

    isSaved() {
        return !this.isUnsaved;
    }

    getBrowserStorageMaps() {
        return this.getWorkspace().getBrowserStorageMaps();
    }

    saveBrowserVersion() {
        let savedLocally = false;
        for (let storage of this.getBrowserStorageMaps()) {
            savedLocally = savedLocally || storage.set(this.getName(), {
                // TODO: this should include the current server version
                serverTime: ServerTime.now().toUnix(),
                localTime: StemDate.now().toUnix(),
                value: this.content
            });
        }
        return savedLocally;
    }

    getBrowserVersion() {
        for (let storage of this.getBrowserStorageMaps()) {
            let version = storage.get(this.getName());
            if (version) {
                return version;
            }
        }
        return null;
    }

    deleteBrowserVersion() {
        for (let storage of this.getBrowserStorageMaps()) {
            storage.delete(this.getName());
        }
    }

    isSavedInBrowser() {
        let browserVersion = this.getBrowserVersion();
        return browserVersion && (browserVersion.value == this.getValue());
    }

    setValue(newValue) {
        this.isUnsaved = true;
        this.content = newValue;
        this.saveBrowserVersion();
        this.dispatch("unsaved", {});
    };

    getValue() {
        return this.content;
    };

    applyEvent(event) {
        if (event.sessionId == this.getWorkspace().sessionId) {
            this.updateFromCurrentSession(event);
        } else {
            this.updateFromDifferentSession(event);
        }
    };

    updateFromCurrentSession(event) {
        //This gets called when the server confirms our events, don't need to do anything
    };

    updateFromDifferentSession(event) {
        console.log("Update from another session: ", event);
        super.applyEvent(event);
        this.dispatch("updateExternal", event);
    };

    updateId(newId) {
        if (this.id == newId) {
            return;
        }
        let oldId = this.id;
        super.updateId(newId);
        let workspace = this.getWorkspace();
        workspace.files.delete(oldId);
        workspace.files.set(this.id, this);
    }

    save() {
        //TODO: should this method be implemented here?
        if (!this.isUnsaved) {
            return;
        }

        if (!USER.isAuthenticated) {
            //TODO: save to local storage instead
            return;
        }

        let request = this.getWorkspace().getBaseRequest();

        request.fileName = this.getName();
        request.fileContent = this.getValue();

        if (this.hasTemporaryId()) {
            request.virtualId = this.id;
        } else {
            request.fileId = this.id;
        }

        this.isSaving = true;
        this.dispatch("saving", {});

        const timeSaveSent = StemDate.now();

        Ajax.postJSON("/workspace/save_workspace_file/", request).then(
            (data) => {
                this.isUnsaved = false;
                this.dispatch("saved", Object.assign({
                    timeSaveSent: timeSaveSent,
                }, data));

                if (timeSaveSent >= this.getBrowserVersion().localTime) {
                    this.deleteBrowserVersion();
                }
                if (this.id != data.id) {
                    this.updateId(data.id);
                }
                this.serverLastSaved = data.serverLastSaved;
                this.isSaving = false;
            },
            (error) => {
                //TODO: in case we have modification between the time we sent this req and now, take this into account
                this.isSaving = false;
            }
        );
    };
}

class WorkspaceObject extends StoreObject {
    constructor(obj) {
        super(obj);
        this.files = new Map();
        setInterval(() => {
            this.saveAllFiles();
        }, 20000 + 12000 * Math.random());
    };

    getStorageName() {
        return "WorkspaceStoredFiles-" + this.id;
    }

    getSessionStorageMap() {
        return new SessionStorageMap(this.getStorageName());
    }

    getLocalStorageMap() {
        return new LocalStorageMap(this.getStorageName());
    }

    getBrowserStorageMaps() {
        return [this.getSessionStorageMap(), this.getLocalStorageMap()];
    }

    getBaseRequest() {
        return {
            workspaceId: this.getNormalizedId(),
            sessionId: this.sessionId,
        };
    };

    getNormalizedId() {
        let workspaceId = this.id + "";
        if (workspaceId.startsWith("temp-")) {
            // Remove "temp-"
            workspaceId = workspaceId.substr(5);
        }
        return parseInt(workspaceId);
    }

    getLastUpdate() {
        let lastUpdate = parseFloat(this.lastModified);
        for (let file of this.files.values()) {
            lastUpdate = Math.max(lastUpdate, parseFloat(file.serverLastSaved));
        }
        return lastUpdate;
    }

    addFile(workspaceFile, createEvent) {
        this.files.set(workspaceFile.id, workspaceFile);
        this.dispatch("newFile", workspaceFile);
    }

    removeFile(workspaceFile, deleteEvent) {
        if (this.files.has(workspaceFile.id)) {
            this.files.delete(workspaceFile.id);
            this.dispatch("deletedFile", workspaceFile);
        }
    }

    getOrCreateFile(fileName, defaultContent) {
        let workspaceFile = this.getFileByName(fileName);
        if (workspaceFile) {
            return workspaceFile;
        }
        return this.createFile(fileName, defaultContent || "");
    };

    getFiles() {
        return Array.from(this.files.values());
    }

    // TODO: if you ever just need a getFileForLanguage, just implement it here
    getOrCreateFileForLanguage(programmingLanguage, defaultCode) {
        // TODO: this needs to be fixed to support languages with the same extension (py2 vs py3)
        let fileName = "Main" + programmingLanguage.id + "." + programmingLanguage.extension;
        return this.getOrCreateFile(fileName, defaultCode || programmingLanguage.getDefaultSource());
    };

    saveAllFiles() {
        for (let workspaceFile of this.files.values()) {
            workspaceFile.save();
        }
    };

    streamName() {
        return "workspace-" + this.userId + "-" + this.getNormalizedId();
    };

    getFileByName(fileName) {
        for (let workspaceFile of this.files.values()) {
            if (workspaceFile.name === fileName) {
                return workspaceFile;
            }
        }
        return null;
    };

    renameFile(fileName, newFileName) {
        throw Exception("Implement me!");
    };

    createFile(fileName, fileContent) {
        if (this.getFileByName(fileName)) {
            console.error("Trying to create a file that exists already!");
            return;
        }
        // create a virtual file
        return WorkspaceFileStore.createVirtualFile(fileName, fileContent, this);
    };
}

class WorkspaceStoreClass extends GenericObjectStore {
    constructor() {
        super("workspace", WorkspaceObject);
    }

    getUserWorkspaces(userId = USER.id) {
        return this.filterBy({
            userId,
            systemCreated: false
        });
    }

    createVirtualWorkspace() {
        //let virtualId = WorkspaceStore.generateVirtualId() + "-" + Math.random();
        let virtualId = Math.random().toString().substr(2);
        let virtualWorkspace = {
            id: "temp-" + virtualId,
            userId: 0,
            files: [],
        };
        return this.create(virtualWorkspace, {
            isVirtual: true
        });
    }
}

var WorkspaceStore = new WorkspaceStoreClass();

class WorkspaceFileStoreClass extends VirtualStoreMixin(GenericObjectStore) {
    constructor() {
        super("workspacefile", WorkspaceFile, {
            dependencies: ["workspace"]
        });
    }

    createVirtualFile(fileName, fileContent, workspace) {
        //let virtualId = WorkspaceFileStore.generateVirtualId() + "-" + Math.random();
        const virtualId = Math.random().toString().substr(2);
        const virtualWorkspaceFile = {
            id: "temp-" + virtualId,
            name: fileName,
            content: fileContent,
            workspaceId: workspace.id,
            systemCreated: false,
            lastModified: StemDate.now() / 1000,
        };
        return this.create(virtualWorkspaceFile, {
            isVirtual: true
        });
    };

    getVirtualObject(event) {
        return this.objects.get("temp-" + event.virtualId) ||
            WorkspaceStore.get(event.data.workspaceId).getFileByName(event.data.name);
    };
}

var WorkspaceFileStore = new WorkspaceFileStoreClass();

WorkspaceFileStore.addCreateListener((workspaceFile, createEvent) => {
    workspaceFile.getWorkspace().addFile(workspaceFile, createEvent);
});
WorkspaceFileStore.addDeleteListener((workspaceFile, deleteEvent) => {
    workspaceFile.getWorkspace().removeFile(workspaceFile, deleteEvent);
});

export {
    WorkspaceStore,
    WorkspaceFileStore
};