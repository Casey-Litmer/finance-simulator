import AccountEvent from "./Event";
import Account from "../accounts/Account";
import AccountState from "../sim/accountState";
import { EventArguments, } from "./EventInterfaces";






export default class Withdrawal extends AccountEvent {

    withdrawalAmount: number;

    
    constructor({value = 0, ...kwargs}: EventArguments) {
        super({_precedence_:3 }, kwargs);
        this.withdrawalAmount = value;
    };

    
    public Functor(E: AccountState, account: Account): boolean {
        const t1 = this.eventTime;
        const t0 = E.t0;

        if (E.addBal(-this.withdrawalAmount) >= 0) {
            E.t0 = t1;
            E.accruedInterest = E.Accrue(t0, t1);
            E.bal = E.addBal(-this.withdrawalAmount);
        } else {
            ///this.no_funds()
        }

        return true;
    }

}