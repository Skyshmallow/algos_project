import {
    MakeStore,
    StoreObject
} from "../../../stemjs/src/state/Store.js";

class PlagiarismReportBatch extends StoreObject {}

export const PlagiarismReportBatchStore = MakeStore("PlagiarismReportBatch", PlagiarismReportBatch);