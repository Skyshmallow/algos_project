import {
    MakeStore,
    StoreObject
} from "../../../stemjs/src/state/Store";

class TermDefinitionObject extends StoreObject {}

const TermDefinition = MakeStore("TermDefinition", TermDefinitionObject);

TermDefinition.getDefinition = function(term) {
    return this.find(definition => definition.term === term);
};

export {
    TermDefinition,
    TermDefinitionObject
};