import {
    StoreObject
} from "../../../stemjs/src/state/Store";
import {
    ProgrammingLanguage
} from "../../../csabase/js/state/ProgrammingLanguageStore";
import {
    isString
} from "../../../stemjs/src/base/Utils";

// Codes for an individual run
export const RunStatusCodes = {
    OK: 1,
    RESTRICTED_FUNCTION: 2,
    TIME_LIMIT_EXCEEDED: 3,
    WALL_TIME_LIMIT_EXCEEDED: 4,
    MEMORY_LIMIT_EXCEEDED: 5,
    OUTPUT_LIMIT_EXCEEDED: 6,
    NON_ZERO_EXIT_STATUS: 7,
    RUNTIME_ERROR: 8,
    ABNORMAL_TERMINATION: 9,
    INTERNAL_ERROR: 10,
};

export const LinuxSignals = {
    1: "SIGHUP",
    2: "SIGINT",
    3: "SIGQUIT",
    4: "SIGILL",
    5: "SIGTRAP",
    6: "SIGABRT",
    7: "SIGBUS",
    8: {
        shortName: "SIGFPE",
        longName: "Arithmetic exception",
        description: "Can occur at a division by zero or some overflows"
    },
    9: "SIGKILL",
    10: "SIGUSR1",
    11: {
        shortName: "SIGSEGV",
        longName: "Segmentation fault",
        description: "Invalid memory reference, such as accessing outside the bounds of an array."
    },
    12: "SIGUSR2",
    13: "SIGPIPE",
    14: "SIGALRM",
    15: "SIGTERM",
    16: "SIGSTKFLT",
    17: "SIGCHLD",
    18: "SIGCONT",
    19: "SIGSTOP",
    20: "SIGTSTP",
    21: "SIGTTIN",
    22: "SIGTTOU",
    23: "SIGURG",
    24: "SIGXCPU",
    25: "SIGXFSZ",
    26: "SIGVTALRM",
    27: "SIGPROF",
    28: "SIGWINCH",
    29: "SIGIO",
    30: "SIGPWR",
    31: "SIGSYS"
}

export function getSignalDescriptor(signalCode) {
    let signalDescriptor = LinuxSignals[signalCode];
    if (!signalDescriptor) {
        signalDescriptor = "Signal " + signalCode;
    }
    if (isString(signalDescriptor)) {
        signalDescriptor = {
            shortName: signalDescriptor,
        }
    }
    return signalDescriptor;
}

export class BaseUserSubmission extends StoreObject {
    getProgrammingLanguage() {
        return ProgrammingLanguage.get(this.programmingLanguageId);
    }

    getSize() {
        return this.sourceText.length;
    }

    getSourceText() {
        return this.sourceText;
    }

    isCompiling() {
        return this.compileStarted && this.compileOK == null;
    }

    hasCompileError() {
        return this.compileOK === false;
    }

    getDuration() {
        return this.duration;
    }

    getCompilationStatusMessage() {
        if (!this.compileStarted) {
            return "";
        }
        if (this.isCompiling()) {
            return "Compilation running...";
        }
        const duration = this.getDuration();
        if (this.hasCompileError()) {
            const durationMessage = duration ? " (" + duration + " seconds)." : ".";
            return "Compilation failed" + durationMessage;
        } else {
            const durationMessage = duration ? " in " + duration + " seconds." : ".";
            return "Compilation done" + durationMessage;
        }
    }
}