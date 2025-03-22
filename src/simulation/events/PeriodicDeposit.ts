import Deposit from "./Deposit";
import { EventArguments } from "./EventInterfaces";




export default class PeriodicDeposit extends Deposit{
    constructor(kwargs: EventArguments) {
        super(kwargs);
        this.isPeriodic = true;
    }
};



