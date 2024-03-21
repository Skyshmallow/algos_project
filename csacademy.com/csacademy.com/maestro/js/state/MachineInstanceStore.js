import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store.js";
import {
    GlobalState
} from "../../../stemjs/src/state/State.js";


export class MachineInstance extends StoreObject {
    logMessage(event) {
        this.dispatch("logMessage", event);
    }

    applyEvent(event) {
        if (event.type === "logMessage") {
            // TODO save messages in store object
            return;
        }

        if (event.type === "serviceStatusUpdate") {
            this.serviceUpdate(event.serviceStatus);
            return;
        }

        super.applyEvent(event);
    }

    serviceStop(status) {
        this.updateServiceStatus(status);
        this.services[status.service].current.meta.status = MachineInstance.statusType.OFFLINE;
        this.setServiceOfflineTimeout(status.service, 1000);
    }

    serviceUpdate(status) {
        const {
            lifecycle
        } = status;
        if (lifecycle === "stop") {
            this.serviceStop(status);
            return;
        }
        this.updateServiceStatus(status);
        this.services[status.service].current.meta.status = lifecycle === "start" ? MachineInstance.statusType.NEW : MachineInstance.statusType.ONLINE;
        this.setServiceWarningTimeout(status.service, 1.5);
        this.setServiceDangerTimeout(status.service, 3.5);
        this.clearServiceOfflineTimeout(status.service);
    }

    updateServiceStatus(status) {
        // TODO: save in a rolling window to enable graph data
        if (!this.hasOwnProperty("services")) {
            this.services = {};
        }
        if (!this.services.hasOwnProperty(status.service)) {
            this.services[status.service] = {};
        }
        if (!this.services[status.service].hasOwnProperty("current")) {
            this.services[status.service].current = {};
        }
        if (!this.services[status.service].current.hasOwnProperty("meta")) {
            this.services[status.service].current.meta = {};
        }

        this.services[status.service].current.data = status;
    }

    clearServiceWarningTimeout(serviceName) {
        if (this.services[serviceName].current.meta.warningTimeout) {
            clearTimeout(this.services[serviceName].current.meta.warningTimeout);
            this.services[serviceName].current.meta.warningTimeout = null;
        }
    }

    clearServiceDangerTimeout(serviceName) {
        if (this.services[serviceName].current.meta.dangerTimeout) {
            clearTimeout(this.services[serviceName].current.meta.dangerTimeout);
            this.services[serviceName].current.meta.dangerTimeout = null;
        }
    }

    clearServiceOfflineTimeout(serviceName) {
        if (this.services[serviceName].current.meta.offlineTimeout) {
            clearTimeout(this.services[serviceName].current.meta.offlineTimeout);
            this.services[serviceName].current.meta.offlineTimeout = null;
        }
    }

    serviceWarning(serviceName) {
        this.services[serviceName].current.meta.status = MachineInstance.statusType.WARNING;
    }

    serviceDanger(serviceName) {
        this.services[serviceName].current.meta.status = MachineInstance.statusType.DANGER;
    }

    serviceOffline(serviceName) {
        delete this.services[serviceName];
    }

    setServiceWarningTimeout(serviceName, factor) {
        this.services[serviceName].current.meta.warningThreshold = this.services[serviceName].current.data.updateInterval * factor;
        this.clearServiceWarningTimeout(serviceName);
        this.services[serviceName].current.meta.warningTimeout = setTimeout(() => {
            this.serviceWarning(serviceName);
            this.services[serviceName].current.meta.warningTimeout = null;
        }, this.services[serviceName].current.meta.warningThreshold);
    }

    setServiceDangerTimeout(serviceName, factor) {
        this.services[serviceName].current.meta.dangerThreshold = this.services[serviceName].current.data.updateInterval * factor;
        this.clearServiceDangerTimeout(serviceName);
        this.services[serviceName].current.meta.dangerTimeout = setTimeout(() => {
            this.serviceDanger(serviceName);
            this.services[serviceName].current.meta.dangerTimeout = null;
        }, this.services[serviceName].current.meta.dangerThreshold);
    }

    setServiceOfflineTimeout(serviceName, timeout) {
        this.clearServiceWarningTimeout(serviceName);
        this.clearServiceDangerTimeout(serviceName);

        this.services[serviceName].current.meta.offlineThreshold = timeout;
        this.clearServiceOfflineTimeout(serviceName);
        this.services[serviceName].current.meta.offlineTimeout = setTimeout(() => {
            this.serviceOffline(serviceName);
        }, this.services[serviceName].current.meta.offlineThreshold);
    }
}

MachineInstance.statusType = {
    NEW: 1,
    ONLINE: 2,
    OFFLINE: 3,
    WARNING: 4,
    DANGER: 5
};

class MachineInstanceStoreClass extends GenericObjectStore {
    applyEvent(event) {
        if (event.type == "logMessage") {
            this.dispatch("logMessage", event);
        }
        super.applyEvent(event);
    }

    registerStreams() {
        GlobalState.registerStream("machine_status");
        GlobalState.registerStream("service_status");
        GlobalState.registerStream("machine_log");
        GlobalState.registerStream("meta-uranus-linode-a");
    }
}

export const MachineInstanceStore = new MachineInstanceStoreClass("MachineInstance", MachineInstance);