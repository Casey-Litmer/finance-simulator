import { UUID } from "crypto";
import { NULL_GROUP_ID } from "src/globals";
import { SaveState } from "src/types";


export const migrations = {
    "0.1.0": migrate_0_1_0_to_0_1_1,
    //migrate_0_1_1_to_0_1_2,
    //migrate_0_1_2_to_0_1_3,
    //migrate_0_1_3_to_0_1_4,
};

//=================================================================================

// 0.1.0 -> 0.1.1
// - Add event groups, assign all events to null group
function migrate_0_1_0_to_0_1_1(data: SaveState): SaveState {
    for (const id in data.events) {
        data.events[id as UUID].eventGroupId = NULL_GROUP_ID;
    };
    data.groups = {};
    return data;
};