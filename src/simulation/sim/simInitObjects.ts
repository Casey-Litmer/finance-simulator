import { UUID } from "crypto";
import { Account } from "../accounts";
import { AccountConstructorMap, EventConstructorMap } from "../ConstructorMaps";
import { SaveState, SimParameters } from "src/types";
import { NULL_MARKER_ID } from "src/globals/CONSTANTS";



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
            const withAccounts = event.accountIds.map((id) => accounts[id]); 
            const markerControl = event.markerControl;
            const { markerId, attribute } = markerControl;
            const controlActive = markerId !== NULL_MARKER_ID;
            const eventActive = saveState.events[id].display.active;

            const args = {
                ...event.args,
                // Apply marker controllers
                eventTime: (controlActive && attribute === 'eventDate') ?
                    saveState.markers[markerControl.markerId].time : event.args.eventTime,
                endTime: (controlActive && attribute === 'endDate') ?
                    saveState.markers[markerControl.markerId].time : event.args.endTime,
            };

            return new eventType({
                ...args, 
                accounts: withAccounts, 
                id: id,
                isActive: eventActive
            });
        });

    return {xDomain: saveState.xDomain, accounts: Object.values(accounts), events};
};
