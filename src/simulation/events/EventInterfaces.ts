import Account from "../accounts/Account"
import { DateFloat } from "../helpers/timeMethods"



export interface EventArguments {
    eventTime: DateFloat;
    accounts?: Account[];
    id?: number;
    name?: string;
    value?: number; //deposit_amount, etc...

    //periodic arguments
    eventPeriod?: number;
    periodMode?: string;
    endTime?: DateFloat;
    doesEnd?: boolean
}

//Event children may have to pass settings at some point.  Maybe nest it inside EventArguments?
export interface EventSettings {
    _precedence_?: number;
    isGenerated?: boolean;
    isPeriodic?: boolean;
}



/////////////////////////////////////

/*
export interface DepositArguments {
    deposit_amount: number
}

export interface WithdrawalArguments {
    withdrawal_amount: number
}

export interface TransferArguments {
    transfer_amount: number
}

export interface ChangeInterestRateArguments {
    new_rate: number
}

export interface AdjustmentArguments {
    new_balance: number
}

*/