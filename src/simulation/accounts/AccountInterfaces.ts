import { DateFloat } from "../../utils/timeMethods";


///////////////////////////////////////

export interface AccountArguments {
    name?: string,
    initialBal?: number,
    openDate: DateFloat,
    prorate?: boolean,  
    id?: number,

    //Savings Account
    interestRate?: number,
    interestPeriod?: number,
    periodStart?: DateFloat
};


