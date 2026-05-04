import { Account } from "../accounts";
import { AccountEvent } from "./Event";
import { EventArguments } from "./EventInterfaces";
import { AccountState } from "../sim/accountState";
import { AccountMetadata } from "src/types";


export class Deposit extends AccountEvent {

    percentMode: boolean;

    constructor({percentMode = false, ...kwargs}: EventArguments) {
        super({_precedence_: 2}, kwargs);
        this.percentMode = percentMode;
    };

    public Functor(E: AccountState, account: Account): AccountMetadata {
        if (this.skipFirstPeriod()) return { continue: true };

        const t1 = this.eventTime;
        const t0 = E.t0;

        //Value Mode 
        const depositAmount = (this.percentMode) ?
            E.mulBal(this.value / 100) : this.value;

        E.t0 = t1;
        E.accruedInterest = E.Accrue(t0, t1);
        E.bal = E.addBal(depositAmount);

        return { continue: true };
    };
};