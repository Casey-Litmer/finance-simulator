import { Withdrawal } from "./Withdrawal";
import { EventArguments } from "./EventInterfaces";




export class PeriodicWithdrawal extends Withdrawal {
    constructor(kwargs: EventArguments) {
        super(kwargs);
        this.isPeriodic = true;
    }
};



