import AccountEvent, { EventConstructor } from "./events/Event";
import Deque from "./helpers/Deque";
import AccountState from "./sim/accountState";
import Account from "./accounts/Account";
import { AccountArguments } from "./accounts/AccountInterfaces";
import { EventArguments } from "./events/EventInterfaces";
import { DeepPartial } from "react-hook-form";
import { ScatterLine } from "plotly.js";



export type SaveState = {
    accounts: Record<number, AccountJSON>;
    events: Record<number, EventJSON>;
    accountsDisplay: Record<number, AccountDisplay>;
    xDomain: {start: number, stop: number, step: number};
};


export type AccountJSON = {
    args: AccountArguments;
    accountType: string;
    eventIds: number[];
};

export type EventJSON = {
    args: EventArguments;
    eventType: string;
    accountIds: number[]
};

export type AccountDisplay = {
    visible: boolean;
    line: Partial<ScatterLine>;
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

