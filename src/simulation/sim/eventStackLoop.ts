import { AccountMetadata } from "src/types";
import { Account } from "../accounts";
import { AccountEvent, OpenAccount } from "../events";
import { AccountState } from "./accountState";
import { convertTime, Deque } from "src/utils";




export const READOUT_LIST = [];

export function eventStackLoop(pendingEvents: Deque<AccountEvent>, E: AccountState, account: Account): void {
    // continue - choose to continue or end the loop (useful for transfers)
    // balanceStatus - log any time a withdrawal/transfer bounces
    let loopState: AccountMetadata = { continue: true };

    while (pendingEvents && loopState.continue) {
        const event = pendingEvents.popLeft();
        
        if (!event) break;

        // An AccountState must be open to use a functor (unless it is the OpenAccount functor)
        if ((E.open || event instanceof OpenAccount) && event.isActive) {
            // && !event.skipFirstperiod()
            loopState = event.Functor(E, account);
            console.log(convertTime(event.eventTime, 'Date'), event.constructor.name, loopState, E.bal)
        }; 

        // Add response to metadata
        const eventTime = event.eventTime;
        if (!(eventTime in account.bundle.metadata))
            account.bundle.metadata[eventTime] = [];
        account.bundle.metadata[eventTime].push(loopState);

        // Pop from stack
        account.bundle.remainingEvents.popLeft();
    };
};
