export class StorageMeta {
    constructor(usedSpace, fileCount) {
        this.usedSpace = usedSpace;
        this.fileCount = fileCount;
    }

    getUsedSpace() {
        return this.usedSpace;
    }

    getFileCount() {
        return this.fileCount;
    }
}