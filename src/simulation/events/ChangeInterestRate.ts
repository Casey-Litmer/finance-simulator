import { Account } from "../accounts";
import { AccountEvent } from "./Event";
import { EventArguments } from "./EventInterfaces";
import { AccountState } from "../sim/accountState";



export class ChangeInterestRate extends AccountEvent {

    newRate: number;
    
    constructor({value = 0,  ...kwargs}: EventArguments) {
        super({_precedence_: 1}, kwargs);
        this.newRate = value;
    };

    public Functor(E: AccountState, account: Account): boolean {
        const t1 = this.eventTime;
        const t0 = E.t0;

        E.t0 = t1;
        E.accruedInterest = E.Accrue(t0, t1);
        E.r = this.newRate;

        return true;
    };
};