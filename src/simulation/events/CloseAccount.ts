import Account from "../accounts/Account";
import AccountState from "../sim/accountState";
import AccountEvent from "./Event";
import { EventArguments } from "./EventInterfaces";



export default class CloseAccount extends AccountEvent {
    
    constructor(kwargs: EventArguments) {
        super({_precedence_: 5}, kwargs)
    }
    
    public Functor(E: AccountState, account: Account): boolean {
        E.bal = null;
        E.open = false;

        return false;
    }

}