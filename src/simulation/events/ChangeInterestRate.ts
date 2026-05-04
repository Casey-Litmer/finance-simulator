import { Account } from "../accounts";
import { AccountEvent } from "./Event";
import { EventArguments } from "./EventInterfaces";
import { AccountState } from "../sim/accountState";
import { AccountMetadata } from "src/types";



export class ChangeInterestRate extends AccountEvent {
    
    constructor({...kwargs}: EventArguments) {
        super({_precedence_: 1}, kwargs);
    };

    public Functor(E: AccountState, account: Account): AccountMetadata {
        const t1 = this.eventTime;
        const t0 = E.t0;

        E.t0 = t1;
        E.accruedInterest = E.Accrue(t0, t1);
        E.r = this.value;

        return { continue: true };
    };
};