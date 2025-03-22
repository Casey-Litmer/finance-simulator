import Account from "../accounts/Account";
import AccountState from "../sim/accountState";
import AccountEvent from "./Event";
import { EventArguments } from "./EventInterfaces";



export default class OpenAccount extends AccountEvent {
    
    constructor(kwargs: EventArguments) {
        super({_precedence_: 0, isGenerated: true}, kwargs);
        this.isConsumable = false;
    }
    
    public Functor(E: AccountState, account: Account): boolean {
        E.bal = account.initialBal;
        E.open = true;

        return true;
    }

}