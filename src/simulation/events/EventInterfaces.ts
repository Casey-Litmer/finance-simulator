import { UUID } from "crypto";
import { Account } from "../accounts";
import { DateFloat } from "src/utils";



export type EventBreakpoint = {
    name?: string;
    value: number;
    time: number;
};

export interface EventArguments {
    id?: UUID;
    eventTime: DateFloat;
    accounts?: Account[];
    name?: string;
    value?: number; //deposit_amount, etc...
    percentMode?: boolean;

    //periodic arguments
    eventPeriod?: number;
    periodMode?: string;
    endTime?: DateFloat;
    doesEnd?: boolean;

    //Toggle Active
    isActive?: boolean;

    //Breakpoints
    breakpoints?: Record<UUID, EventBreakpoint>;
    //TODO: where should this go?
    //markerBreakpointControls: { markerId: UUID; breakpointId: UUID; }[]; 
};

//Event children may have to pass settings at some point.  Maybe nest it inside EventArguments?
export interface EventSettings {
    _precedence_?: number;
    isGenerated?: boolean;
    isPeriodic?: boolean;
};



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