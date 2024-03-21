export class StorageLimits {
    static userFileMaxCount() {
        if (!USER.isAuthenticated) {
            return 0;
        }
        if (USER.isSuperUser) {
            return -1;
        }
        return 512;
    }

    static userUploadMaxCount() {
        if (!USER.isAuthenticated) {
            return 0;
        }
        if (USER.isSuperUser) {
            return -1;
        }
        return 16;
    }

    static userFileMaxSize() {
        if (!USER.isAuthenticated) {
            return 0;
        }
        if (USER.isSuperUser) {
            return -1;
        }
        return 128 * 1024 * 1024;
    }

    static userTotalMaxSize() {
        if (!USER.isAuthenticated) {
            return 0;
        }
        if (USER.isSuperUser) {
            return 1024 * 1024 * 1024;
        }
        return 256 * 1024 * 1024;
    }

    static validateFileMaxCount(storageMeta, fileCount) {
        let maxFileCount = StorageLimits.userFileMaxCount();
        if (maxFileCount == -1) {
            return true;
        }
        return storageMeta.getFileCount() + fileCount <= maxFileCount;
    }

    static validateUploadMaxCount(fileCount) {
        let uploadMaxCount = StorageLimits.userUploadMaxCount();
        if (uploadMaxCount == -1) {
            return true;
        }
        return fileCount <= uploadMaxCount;
    }

    static validateFileMaxSize(fileSize) {
        let fileMaxSize = StorageLimits.userFileMaxSize();
        if (fileMaxSize == -1) {
            return true;
        }
        return fileSize <= fileMaxSize;
    }

    static validateTotalMaxSize(storageMeta, totalSize) {
        let totalMaxSize = StorageLimits.userTotalMaxSize();
        if (totalMaxSize == -1) {
            return true;
        }
        return storageMeta.getUsedSpace() + totalSize <= totalMaxSize;
    }
}