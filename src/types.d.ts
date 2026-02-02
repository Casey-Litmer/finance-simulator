import { ScatterLine } from "plotly.js";
import { Account, AccountArguments } from "src/simulation/accounts";
import { AccountEvent, EventArguments } from "src/simulation/events";
import { AccountState } from "src/simulation/sim";
import { Deque } from "src/utils";
import { UUID } from "crypto";




//Save State
////////////////////////////////

export type SaveState = {
    version: string;
    accounts: Record<UUID, AccountJSON>;
    events: Record<UUID, EventJSON>;
    breakpoints: Record<UUID, BreakpointJSON>
    markers: Record<UUID, MarkerJSON>;
    filter?: FilterJSON;                                   
    xDomain: {start: number, stop: number, step: number};  
};

// Data

export type AccountJSON = {
    args: AccountArguments;
    accountType: string;
    eventIds: UUID[];
    display: AccountDisplay;
};

export type EventJSON = {
    args: EventArguments;
    eventType: string;
    markerControl: { startMarkerId: UUID, endMarkerId: UUID };
    accountIds: UUID[];
    breakpointIds: UUID[];
    display: EventDisplay;
};

export type BreakpointJSON = {
    name?: string;
    time: number;
    value: number;
    eventId: UUID;
    markerControlId: UUID;
    display: BreakpointDisplay;
};

export type MarkerJSON = {
    time: number;
    name: string;
    display: MarkerDisplay;
};

// Display

export type AccountDisplay = {
    visible: boolean;
    line: Partial<ScatterLine>;
};

export type EventDisplay = {
    active: boolean;
};

export type BreakpointDisplay = {
    active: boolean;
};

export type MarkerDisplay = {
    visible: boolean;
    line: Partial<ScatterLine>;
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
    [key: UUID] : {
        bals: (number | null)[];
        account: Account;
    };
};

export type EventsData = {
    [key: UUID] : {
        event: AccountEvent;
    };
};

//Sim Usage
///////////////////////////////////

export type EventTable = {
    [key: number]: AccountEvent[];
};

export type SimulationBundle = {
    pendingEvents: Deque<AccountEvent>;
    remainingEvents: Deque<AccountEvent>;
    state: AccountState | null;
    times: number[];
};

