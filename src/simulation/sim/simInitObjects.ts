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
            const { startMarkerId, endMarkerId } = markerControl;
            const eventActive = saveState.events[id].display.active;

            // Apply active breakpoint marker controllers
            const breakpoints = Object.values(saveState.breakpoints)
                .filter(breakpoint => breakpoint.eventId === id && breakpoint.display.active)
                .map(breakpoint => {
                    if (breakpoint.markerControlId !== NULL_MARKER_ID) {
                        return { 
                            time: saveState.markers[breakpoint.markerControlId].time, 
                            value: breakpoint.value,
                        };
                    };
                    return { time: breakpoint.time, value: breakpoint.value };
                });

            // Build args
            const args = {
                ...event.args,
                breakpoints: breakpoints,
                // Apply marker controllers
                eventTime: (startMarkerId !== NULL_MARKER_ID) 
                    ? saveState.markers[markerControl.startMarkerId].time 
                    : event.args.eventTime,
                endTime: (endMarkerId !== NULL_MARKER_ID) 
                    ? saveState.markers[markerControl.endMarkerId].time 
                    : event.args.endTime,
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
