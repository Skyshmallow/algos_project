import {
    GenericObjectStore,
    MakeStore,
    StoreObject
} from "../../../stemjs/src/state/Store.js";
import {
    Ajax
} from "../../../stemjs/src/base/Ajax.js";
import {
    VirtualStoreMixin,
    VirtualStoreObjectMixin
} from "../../../stemjs/src/state/StoreMixins.js";

class PlagiarismMatch extends VirtualStoreObjectMixin(StoreObject) {
    isVirtual() {
        return String(this.id).startsWith("temp");
    }
}

class PlagiarismMatchStoreClass extends VirtualStoreMixin(GenericObjectStore) {
    constructor() {
        super("PlagiarismMatch", PlagiarismMatch);
    }

    createVirtualObject(submission1, submission2) {
        if (submission1.id > submission2.id) {
            [submission1, submission2] = [submission2, submission1];
        }

        const virtualObject = {
            id: `temp-${submission1.id}-${submission2.id}`,
            contestId: submission1.contestId,
            submission1Id: submission1.id,
            submission2Id: submission2.id,
        };

        return this.create(virtualObject, {
            isVirtual: true
        });
    };

    getFromSubmissions(submission1, submission2) {
        if (!submission1 || !submission2) {
            return null;
        }

        if (submission1.id > submission2.id) {
            [submission1, submission2] = [submission2, submission1];
        }

        const existing = this.findBy({
            submission1Id: submission1.id,
            submission2Id: submission2.id,
        });

        if (existing) {
            return existing;
        }

        return this.createVirtualObject(submission1, submission2);
    }
}

export const PlagiarismMatchStore = new PlagiarismMatchStoreClass();

export async function apiChangePlagiarismMatchDecision(plagiarismMatch, decision) {
    const uniqueIdentifiers = plagiarismMatch.isVirtual() ? {
        contestId: plagiarismMatch.contestId,
        submission1Id: plagiarismMatch.submission1Id,
        submission2Id: plagiarismMatch.submission2Id,
    } : {
        matchId: plagiarismMatch.id,
    };

    const response = await Ajax.postJSON("/contest/decide_on_plagiarism_match/", {
        ...uniqueIdentifiers,
        decision,
    }, {
        disableStateImport: true
    });

    PlagiarismMatchStore.applyUpdateObjectId(plagiarismMatch, response.matchId);

    GlobalState.importState(response.state);
}

export async function apiLoadAllPlagiarismMatches(plagiarismBatch) {
    const response = await Ajax.getJSON("/contest/load_all_plagiarism_matches/", {
        batchId: plagiarismBatch.id
    });

    return PlagiarismMatchStore.load(response);
}