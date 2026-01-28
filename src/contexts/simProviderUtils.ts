import { UUID } from "crypto";
import { EventJSON, SaveState } from "src/types";


//=================================================================================

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

//=================================================================================
// API operations

/**Deletes an account and all linked events*/
export const _deleteAccount = (saveState: SaveState, accountId: UUID) => {
    const account = saveState.accounts[accountId];
    const accountEventIds = account.eventIds;
    accountEventIds.forEach((evId) => { _deleteEvent(saveState, evId) });
    delete saveState.accounts[accountId];
};

/**Deletes an event and removes it from all linked accounts*/
export const _deleteEvent = (saveState: SaveState, eventId: UUID) => {
    const event = saveState.events[eventId];
    const eventAccountIds = event.accountIds;
    eventAccountIds.forEach((accId) => { // Remove eventId in each linked account
        const accountEventIds = saveState.accounts[accId].eventIds;
        saveState.accounts[accId].eventIds = accountEventIds.filter((evId) => evId !== eventId);
    });
    delete saveState.events[eventId];
};