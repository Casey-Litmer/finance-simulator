import { Account } from "../accounts";
import { AccountEvent } from "./Event";
import { EventArguments } from "./EventInterfaces";
import { AccountState } from "../sim";




export class Withdrawal extends AccountEvent {
    withdrawalAmount: number;
    percentMode: boolean;

    constructor({value = 0, percentMode = false, ...kwargs}: EventArguments) {
        super({_precedence_:3 }, kwargs);
        this.withdrawalAmount = value;
        this.percentMode = percentMode;
    };

    public Functor(E: AccountState, account: Account): boolean {
        const t1 = this.eventTime;
        const t0 = E.t0;

        //Value Mode 
        const withdrawalAmount = (this.percentMode) ?
            E.mulBal(this.withdrawalAmount / 100) : this.withdrawalAmount;
        
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