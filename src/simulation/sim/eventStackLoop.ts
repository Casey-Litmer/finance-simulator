import AccountEvent from "../events/Event";
import AccountState from "./accountState";
import Account from "../accounts/Account";
import Deque from "../helpers/Deque";
import OpenAccount from "../events/OpenAccount";



export const READOUT_LIST = [];


function eventStackLoop(pendingEvents: Deque<AccountEvent>, E: AccountState, account: Account): void {
    //A functor may return a bool to end the loop.  This can possibly be expanded on
    let loopState = true;

    while (pendingEvents && loopState) {
        const event = pendingEvents.popLeft();
        
        if (!event) break;

        //An AccountState must be open to use a functor (unless it is the OpenAccount functor)
        if (E.open || event instanceof OpenAccount) {
            loopState = event.Functor(E, account);
        };
            
        account.bundle.remainingEvents.popLeft();
    };
};

export default eventStackLoop;