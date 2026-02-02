import { UUID } from "crypto";
import { NULL_MARKER_ID } from "src/globals";
import { BreakpointJSON, EventJSON, SaveState } from "src/types";


//=================================================================================

//TODO: Make these update ID functions have cleaner logic?

/**
   * Updates all accounts' eventIds with changes in event-account relations.
   * This ensures no duplicate or residual ids when an event references a new account.
   * @param saveState previous state (same signature as the reducer)
   * @param eventsPartial new partial: Record<UUID, EventJSON>
   */
export function updateAccountEventIds(saveState: SaveState, eventsPartial: Record<UUID, EventJSON>) {
    // For each event in the partial,
    Object.entries(eventsPartial).forEach(([_eventId, event]) => {
        const eventId = _eventId as UUID;
        // If the partial event includes accountId changes
        if (event.accountIds !== undefined) {
            const currentAccountIds = Object.keys(saveState.accounts) as UUID[];
            const newEventAccountIds = event.accountIds;
            // For all current accountsIds,
            for (const accId of currentAccountIds) {
                const currentAccount = saveState.accounts[accId];
                // If the new event references the accountId
                if (newEventAccountIds.includes(accId)) {
                    // Add the eventId to the account if not already included
                    if (!currentAccount.eventIds.includes(eventId))
                        currentAccount.eventIds.push(eventId);
                } else {
                    // Remove the eventId if it is in the account
                    if (currentAccount.eventIds.includes(eventId))
                        currentAccount.eventIds = currentAccount.eventIds.filter((id) => id !== eventId);
                };
            };
        };
    });
};

export function updateEventBreakpointIds(saveState: SaveState, breakpointsPartial: Record<UUID, BreakpointJSON>) {
    // For each event in the partial,
    Object.entries(breakpointsPartial).forEach(([_breakpointId, breakpoint]) => {
        if (breakpoint.eventId !== undefined) {
            const breakpointId = _breakpointId as UUID;
            const eventId = breakpoint.eventId;
            const event = saveState.events[eventId];
            if (!event.breakpointIds.includes(breakpointId))
                event.breakpointIds.push(breakpointId);
        };
    });
};

//=================================================================================
// API operations

/** Look here if anything breaks in deletion due to direct state mutations.
 *  This is a clear antipattern but given that
 *   - saveState doesn't require reactMemo or other optimizations (for now)
 *   - dispatchDelete manually triggers a UI update in SimProvider
 *   - any debugging difficulties can refer to this comment :)
 *  I say fuck it.
 */

/**Deletes an account and all linked events*/
export const _deleteAccount = (accountId: UUID, saveState: SaveState) => {
    const account = saveState.accounts[accountId];
    const accountEventIds = account.eventIds;
    accountEventIds.forEach((evId) => { _deleteEvent(evId, saveState) });
    delete saveState.accounts[accountId];
};

/**Deletes an event and removes it from all linked accounts*/
export const _deleteEvent = (eventId: UUID, saveState: SaveState) => {
    const event = saveState.events[eventId];
    event.accountIds.forEach((accId) => { // Remove eventId in each linked account
        const accountEventIds = saveState.accounts[accId].eventIds;
        saveState.accounts[accId].eventIds = accountEventIds.filter((evId) => evId !== eventId);
    });
    event.breakpointIds.forEach((bpId) => {
        delete saveState.breakpoints[bpId];
    });
    delete saveState.events[eventId];
};

/**Deletes an event and removes it from all linked accounts*/
export const _deleteBreakpoint = (breakpointId: UUID, saveState: SaveState) => {
    const eventId = saveState.breakpoints[breakpointId].eventId;
    const event = saveState.events[eventId];
    event.breakpointIds = event.breakpointIds.filter((id) => id !== breakpointId);
    delete saveState.breakpoints[breakpointId];
};

/**Deletes a marker and clears the marker control from all linked events*/
export const _deleteMarker = (markerId: UUID, saveState: SaveState) => {
    const linkedEventIds = Object.entries(saveState.events)
        .filter(([_, event]) => {
            return event.markerControl?.startMarkerId === markerId
                || event.markerControl?.endMarkerId === markerId;
        })
        .map(([id, _]) => id) as UUID[];
    const linkedBreakpointIds = Object.entries(saveState.breakpoints)
        .filter(([_, breakpoint]) => breakpoint.markerControlId === markerId)
        .map(([id, _]) => id) as UUID[];
    // Turn off control for linked events
    linkedEventIds.forEach(eventId => {
        const markerControl = saveState.events[eventId].markerControl;
        if (markerControl?.startMarkerId === markerId)
            saveState.events[eventId].markerControl.startMarkerId = NULL_MARKER_ID;
        if (markerControl?.endMarkerId === markerId)
            saveState.events[eventId].markerControl.endMarkerId = NULL_MARKER_ID;
    });
    // Turn off control for linked breakpoints
    linkedBreakpointIds.forEach(breakpointId => {
        saveState.breakpoints[breakpointId].markerControlId = NULL_MARKER_ID;
    });
    delete saveState.markers[markerId];
};