import { Account } from "../accounts";
import { AccountConstructorMap, EventConstructorMap } from "../ConstructorMaps";
import { SaveState, SimParameters } from "../types";



/*Converts JSON to valid simulation parameters involving dynamic objects.*/
export const simInitObjects = (saveState: SaveState): SimParameters => {
    //  Record<number, AccountsJSON> => Record<number, Account>
    const accounts = {} as Record<number, Account>;
    Object.entries(saveState.accounts).forEach(([key, account]) => {
        const accountType = AccountConstructorMap[account.accountType];
        const args = account.args;

        accounts[Number(key)] = new accountType({...args, id: Number(key)});
    }); /*The accounts objects already contain the ids but it is kept coupled here temporarily
         for constructing the events. */

    //  Record<number, EventJSON> => AccountEvent[]
    const events = Object.entries(saveState.events)
    .flatMap(([key, event]) => {
        const eventType = EventConstructorMap[event.eventType];
        const args = event.args;
        const withAccounts = event.accountIds.map((id) => accounts[id]); 

        return new eventType({
            ...args, 
            accounts: withAccounts, 
            id: Number(key),
            isActive: saveState.events[Number(key)].display.active
        });
    });

    return {...saveState, accounts: Object.values(accounts), events};
};
