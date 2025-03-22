import { EventArguments, } from "./EventInterfaces";
import Withdrawal from "./Withdrawal";





export default class PeriodicWithdrawal extends Withdrawal{
    constructor(kwargs: EventArguments) {
        super(kwargs);
        this.isPeriodic = true;
    }
};



