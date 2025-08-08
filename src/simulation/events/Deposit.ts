import { Account } from "../accounts";
import { AccountEvent } from "./Event";
import { EventArguments } from "./EventInterfaces";
import { AccountState } from "../sim/accountState";


export class Deposit extends AccountEvent {

    depositAmount: number;

    constructor({value = 0, ...kwargs}: EventArguments) {
        super({_precedence_: 2}, kwargs);
        this.depositAmount = value;
    };

    public Functor(E: AccountState, account: Account): boolean {
        const t1 = this.eventTime;
        const t0 = E.t0;

        E.t0 = t1;
        E.accruedInterest = E.Accrue(t0, t1);
        E.bal = E.addBal(this.depositAmount);

        return true;
    };
};