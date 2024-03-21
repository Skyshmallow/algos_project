import {
    StoreObject,
    GenericObjectStore
} from "../../../stemjs/src/state/Store.js";

export class DifficultyObject extends StoreObject {
    toString() {
        return this.name;
    }
}

export const Difficulty = new GenericObjectStore("difficulty", DifficultyObject);

Difficulty.getDefaultDifficulty = function() {
    return Difficulty.get(2);
};

Difficulty.importState([{
        id: -1,
        name: "TUTORIAL",
        color: "#00dd00"
    },
    {
        id: 1,
        name: "EASY",
        color: "green"
    },
    {
        id: 2,
        name: "MEDIUM",
        color: "orange"
    },
    {
        id: 3,
        name: "HARD",
        color: "red"
    },
    {
        id: 4,
        name: "HARDEST",
        color: "#aa0000"
    },
]);

Object.assign(Difficulty, {
    EASY: Difficulty.get(1),
    MEDIUM: Difficulty.get(2),
    HARD: Difficulty.get(3),
    HARDEST: Difficulty.get(4),
    TUTORIAL: Difficulty.get(-1)
});