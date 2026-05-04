import { Account } from "../accounts";
import { AccountEvent } from "./Event";
import { EventArguments } from "./EventInterfaces";
import { AccountState } from "../sim";
import { AccountMetadata } from "src/types";




export class Withdrawal extends AccountEvent {

    percentMode: boolean;

    constructor({percentMode = false, ...kwargs}: EventArguments) {
        super({_precedence_:3 }, kwargs);
        this.percentMode = percentMode;
    };

    public Functor(E: AccountState, account: Account): AccountMetadata {
        if (this.skipFirstPeriod()) return { continue: true };

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
            console.log(this.id)
            return { 
                continue: true,  
                balanceStatus: {
                    status: "Insufficient Funds",
                    eventId: this.id
                }
            };
        };

        return { continue: true };
    };
};