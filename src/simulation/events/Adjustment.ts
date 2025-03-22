import Account from "../accounts/Account";
import AccountState from "../sim/accountState";
import AccountEvent from "./Event";
import { EventArguments } from "./EventInterfaces";






export default class Adjustment extends AccountEvent {

    newBalance: number;

    constructor({value = 0, ...kwargs}: EventArguments) {
        super({_precedence_: 6}, kwargs);
        this.newBalance = value;
    };

    
    public Functor(E: AccountState, account: Account): boolean {
        //console.log('adj',E)
        E.bal = this.newBalance;

        return true;
    }

}