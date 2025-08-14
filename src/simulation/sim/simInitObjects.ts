import { UUID } from "crypto";
import { Account } from "../accounts";
import { AccountConstructorMap, EventConstructorMap } from "../ConstructorMaps";
import { SaveState, SimParameters } from "../types";



/*Converts JSON to valid simulation parameters involving dynamic objects.*/
export const simInitObjects = (saveState: SaveState): SimParameters => {
    //  Record<UUID, AccountsJSON> => Record<UUID, Account>
    const accounts = {} as Record<UUID, Account>;
    Object.entries(saveState.accounts).forEach(([_id, account]) => {
        const id = _id as UUID;
        const accountType = AccountConstructorMap[account.accountType];
        const args = account.args;

        accounts[id] = new accountType({...args, id: id});
    }); /*The accounts objects already contain the ids but it is kept coupled here temporarily
         for constructing the events. */

    //  Record<UUID, EventJSON> => AccountEvent[]
    const events = Object.entries(saveState.events)
    .flatMap(([_id, event]) => {
        const id = _id as UUID;
        const eventType = EventConstructorMap[event.eventType];
        const args = event.args;
        const withAccounts = event.accountIds.map((id) => accounts[id]); 

        return new eventType({
            ...args, 
            accounts: withAccounts, 
            id: id,
            isActive: saveState.events[id].display.active
        });
    });

    return {xDomain: saveState.xDomain, accounts: Object.values(accounts), events};
};
