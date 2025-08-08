import { Transfer } from "./Transfer";
import { EventArguments } from "./EventInterfaces";




export class PeriodicTransfer extends Transfer{
    kwargs: EventArguments;
    constructor(kwargs: EventArguments) {
        super(kwargs);
        this.isPeriodic = true;
        this.kwargs = kwargs;
    };
};



