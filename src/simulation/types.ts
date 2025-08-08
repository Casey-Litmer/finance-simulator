import { ScatterLine } from "plotly.js";
import { Account, AccountArguments } from "./accounts";
import { AccountEvent, EventArguments } from "./events";
import { AccountState } from "./sim";
import { Deque } from "src/utils";




export type SaveState = {
    accounts: Record<number, AccountJSON>;
    events: Record<number, EventJSON>;
    filter?: FilterJSON;                                   // TODO convert all to optional
    xDomain: {start: number, stop: number, step: number};  //  Then have fallbacks
};


export type AccountJSON = {
    args: AccountArguments;
    accountType: string;
    eventIds: number[];
    display: AccountDisplay;
};

export type EventJSON = {
    args: EventArguments;
    eventType: string;
    accountIds: number[];
    display: EventDisplay;
};

export type AccountDisplay = {
    visible: boolean;
    line: Partial<ScatterLine>;
};

export type EventDisplay = {
    active: boolean;
};

// Sorting
export type FilterJSON = {
    singular: boolean;
    periodic: boolean;
    //
    name: string;
    // 
    deposit: boolean;
    withdrawal: boolean;
    transfer: boolean;
    closeAccount: boolean;
    changeInterestRate: boolean;
    adjustment: boolean;
    //
    periodicDeposit: boolean;
    periodicWithdrawal: boolean;
    periodicTransfer: boolean;
    //
    range: {
        after: boolean;
        startTime: number;
        before: boolean;
        endTime: number;
    };
};


//Sim Data
////////////////////////////////
// SimParameters -> SimulatonData

export type SimParameters = {
    xDomain: {start: number, stop: number, step: number};
    accounts: Account[];
    events: AccountEvent[];
};

export type SimulationData = {
    timeDomain: number[];
    accountsData: AccountsData;
    eventsData: EventsData;
};

export type AccountsData = {
    [key: number] : {
        bals: (number | null)[];
        account: Account;
    };
};

export type EventsData = {
    [key: number] : {
        event: AccountEvent;
    };
};



//Sim Usage
///////////////////////////////////

export type EventTable = {
    [key:number]: AccountEvent[];
};

export type SimulationBundle = {
    pendingEvents: Deque<AccountEvent>;
    remainingEvents: Deque<AccountEvent>;
    state: AccountState | null;
    times: number[];
};

