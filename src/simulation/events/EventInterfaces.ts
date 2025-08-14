import { UUID } from "crypto";
import { Account } from "../accounts";
import { DateFloat } from "src/utils";



export interface EventArguments {
    id?: UUID;
    eventTime: DateFloat;
    accounts?: Account[];
    name?: string;
    value?: number; //deposit_amount, etc...

    //periodic arguments
    eventPeriod?: number;
    periodMode?: string;
    endTime?: DateFloat;
    doesEnd?: boolean;

    //Visibility
    isActive?: boolean;
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