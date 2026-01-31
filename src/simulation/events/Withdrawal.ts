import { Account } from "../accounts";
import { AccountEvent } from "./Event";
import { EventArguments } from "./EventInterfaces";
import { AccountState } from "../sim";




export class Withdrawal extends AccountEvent {

    percentMode: boolean;

    constructor({percentMode = false, ...kwargs}: EventArguments) {
        super({_precedence_:3 }, kwargs);
        this.percentMode = percentMode;
    };

    public Functor(E: AccountState, account: Account): boolean {
        const t1 = this.eventTime;
        const t0 = E.t0;

        //Value Mode 
        const withdrawalAmount = (this.percentMode) ?
            E.mulBal(this.value / 100) : this.value;
        
        if (E.addBal(-withdrawalAmount) >= 0) {
            E.t0 = t1;
            E.accruedInterest = E.Accrue(t0, t1);
            E.bal = E.addBal(-withdrawalAmount);
        } else {
            ///this.no_funds()
        };
        return true;
    };
};