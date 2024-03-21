import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store.js";
import {
    StorageMeta
} from "../StorageMeta.js";

class PublicStorageFile extends StoreObject {
    getStorageServer() {
        return StorageServerStore.get(this.storageServerId);
    }

    getPublicURL() {
        let storageServer = this.getStorageServer();
        return storageServer.domain + storageServer.urlBasePath + this.serverPath;
    }
}

class PublicStorageFileStoreClass extends GenericObjectStore {
    getStorageMeta() {
        let usedSpace = 0;
        let files = this.all();
        for (let file of files) {
            usedSpace += file.size;
        }
        return new StorageMeta(usedSpace, files.length);
    }

    getAllIds() {
        let files = this.all();
        let ids = [];
        for (let file of files) {
            ids.push(file.id);
        }
        return ids;
    }
}

export const PublicStorageFileStore = new PublicStorageFileStoreClass("PublicStorageFile", PublicStorageFile);

class StorageServer extends StoreObject {}

export const StorageServerStore = new GenericObjectStore("StorageServer", StorageServer);