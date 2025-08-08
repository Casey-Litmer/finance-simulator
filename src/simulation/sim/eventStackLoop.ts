import { Account } from "../accounts";
import { AccountEvent, OpenAccount } from "../events";
import { AccountState } from "./accountState";
import { Deque } from "src/utils";




export const READOUT_LIST = [];

export function eventStackLoop(pendingEvents: Deque<AccountEvent>, E: AccountState, account: Account): void {
    //A functor may return a bool to end the loop.  This can possibly be expanded on
    let loopState = true;

    while (pendingEvents && loopState) {
        const event = pendingEvents.popLeft();
        
        if (!event) break;

        //An AccountState must be open to use a functor (unless it is the OpenAccount functor)
        if ((E.open || event instanceof OpenAccount) && event.isActive) {
            loopState = event.Functor(E, account);
        }; 
        account.bundle.remainingEvents.popLeft();
    };
};
