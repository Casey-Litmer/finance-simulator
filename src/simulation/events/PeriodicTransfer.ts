import { EventArguments,} from "./EventInterfaces";
import Transfer from "./Transfer";




export default class PeriodicTransfer extends Transfer{
    kwargs: EventArguments;
    constructor(kwargs: EventArguments) {
        super(kwargs);
        this.isPeriodic = true;
        this.kwargs = kwargs;
    }
};



