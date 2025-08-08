import { Account } from "../accounts";
import { AccountEvent } from "./Event";
import { EventArguments } from "./EventInterfaces";
import { AccountState } from "../sim/accountState";



export class CompoundInterest extends AccountEvent {

    constructor(kwargs: EventArguments) {
        super({_precedence_: 1, isGenerated: true}, kwargs);
        this.isConsumable = false;
    };

    public Functor(E: AccountState, account: Account): boolean {
        const t1 = this.eventTime;
        const t0 = E.t0;

        const newAccruedInterest = E.Accrue(t0, t1);

        E.bal = E.addBal(newAccruedInterest);
        E.t0 = t1;
        E.accruedInterest = 0;

        return true;
    };
};