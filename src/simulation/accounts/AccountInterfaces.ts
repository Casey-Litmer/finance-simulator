import { UUID } from "crypto";
import { DateFloat } from "../../utils/timeMethods";


///////////////////////////////////////

export interface AccountArguments {
    id?: UUID,
    name?: string,
    initialBal?: number,
    openDate: DateFloat,
    prorate?: boolean,  

    //Savings Account
    interestRate?: number,
    interestPeriod?: number,
    periodStart?: DateFloat
};


