import AccountEvent from "./events/Event";
import { ScatterLine } from "plotly.js";
import AccountState from "./sim/accountState";
import Account from "./accounts/Account";
import { AccountArguments } from "./accounts/AccountInterfaces";
import { EventArguments } from "./events/EventInterfaces";
import Deque from "./helpers/Deque";



export type SaveState = {
    accounts: Record<number, AccountJSON>;
    events: Record<number, EventJSON>;
    accountsDisplay: Record<number, AccountDisplay>;
    eventsDisplay: Record<number, EventDisplay>;
    filter?: FilterJSON;                                   // TODO convert all to optional
    xDomain: {start: number, stop: number, step: number};  //  Then have fallbacks
};


export type AccountJSON = {
    args: AccountArguments;
    accountType: string;
    eventIds: number[];
};

export type EventJSON = {
    args: EventArguments;
    eventType: string;
    accountIds: number[];
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
    filter: boolean;
    filterBy: {
        //
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

