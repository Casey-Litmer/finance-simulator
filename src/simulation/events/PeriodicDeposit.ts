import { Deposit } from "./Deposit";
import { EventArguments } from "./EventInterfaces";




export  class PeriodicDeposit extends Deposit {
    constructor(kwargs: EventArguments) {
        super(kwargs);
        this.isPeriodic = true;
    };
};



