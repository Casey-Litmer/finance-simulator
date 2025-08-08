import { Account } from '../accounts';
import { AccountEvent, OpenAccount } from '../events';
import { 
    addToEventTable, 
    dateTimeToFloat, 
    Deque, 
    makeEventQueue, 
    makeIdTable, 
    REF_DATE, 
    sliceQueueBeforeT 
} from 'src/utils';
import { AccountState } from './accountState';
import { eventStackLoop } from './eventStackLoop';
import {AccountsData, EventsData, SimParameters, SimulationData} from '../types';



export const ACCOUNTS: Account[] = [];

//=========================================================================================
//Main
export function runSim({xDomain, accounts, events}: SimParameters): SimulationData {
    //Get Raw Times
    const {start, stop, step} = xDomain;

    //Create a list of times to sample
    const roundErr = (x: number) => Math.round(x * 10 ** 6) / (10 ** 6);
    const timeDomain: number[] = [];
    for (let n = start; n <= stop + step; n += step) {
        timeDomain.push(roundErr(n));
    };

    //Initialize data
    const accountsData = makeIdTable(accounts, 
        (acc: Account) => ({
            account: acc,
            bals: [] as number[],
        })
    ) as AccountsData;
    const eventsData = makeIdTable(events,
        (ev: AccountEvent) => ({
            event: ev
        })
    ) as EventsData;

    //Initialize accounts for simulation
    prepAccounts(timeDomain, step, accounts, events);

    //Main Loop
    for (const n in timeDomain) {
        const t = timeDomain[n];

        //Set pending event queue for all accounts
        for (const account of accounts) {
            const remainingEvents = account.bundle.remainingEvents;
            account.bundle.pendingEvents = sliceQueueBeforeT(remainingEvents, t);
        };

        for (const account of accounts) {
            //Unpack
            const pendingEvents = account.bundle.pendingEvents;
            const E = account.bundle.state;

            if (!E) throw Error(`%Account {account} state has not been initialized!`);

            //Loop over current events
            eventStackLoop(pendingEvents, E, account);

            //Add final balance
            accountsData[account.id].bals.push(E.bal);
        };
    };

    const accountsTotal = new Account({name: "Total", openDate: REF_DATE, id:-1});
    //const DEFAULTDATA: SimulationData = {
    //    timeDomain:[0], 
    //    eventsData: {},
    //    accountsData: {
    //        '-1':{bals:[0], account: accountsTotal}
    //    }
    //};
    
    //add sum and other indicators here
    accountsData[-1] = {bals: accountsSumTotal(accountsData, timeDomain), account: accountsTotal};
    
    return {timeDomain, accountsData, eventsData} as SimulationData;
};


//=========================================================================================
/**
 * Builds a queue of all user-defined and generative events and
 * creates an initial AccountState object for each Account.
 * Initializes account.bundle as:
 * {
 *   'pending': [],
 *   'remaining': remainingEvents,
 *   'state': E_initial
 * }
 * 
 * @param timeDomain - The list of time points for events.
 * @param step - The time step used for calculations.
 */
function prepAccounts(timeDomain: number[], step: number, accounts: Account[], events: AccountEvent[]): void {
    for (const event of events) {
        if (event.isPeriodic) {
            //#Generate all reoccuring events FIRST
            const generatedEvents = event.generatePeriodicEvents(timeDomain, step)

            //#Update linked Accounts' generated event table
            for (const id in event.accounts) {
                const account = event.accounts[id];
                account.periodicEvents = addToEventTable(account.periodicEvents, generatedEvents);
            };
        };
    };

    for (const account of accounts) {
        //#Account event table merged with CompoundInterest events
        let totalEvents = account.generateInterestPeriods(timeDomain, step);
        totalEvents = addToEventTable(totalEvents, new OpenAccount({eventTime: account.openDate}));

        //#de facto table of events.  User defined + interest periods + periodic events
        totalEvents = addToEventTable(totalEvents, account.periodicEvents);
        account.periodicEvents = {};

        //#Set Initial Account State
        const E_initial = new AccountState({
            bal: null,
            t0: dateTimeToFloat(account.openDate),
            r: account.interestRate,
            Q: account.interestPeriod,
            d: dateTimeToFloat(account.periodStart),
            prorate: account.prorate
        });

        //#Squash events to ordered list
        const remainingEvents = makeEventQueue(totalEvents);

        //set bundle here
        account.bundle = {
            pendingEvents: new Deque<AccountEvent>(),
            remainingEvents: remainingEvents,
            state: E_initial,
            times: timeDomain
        };
    };
};

//=========================================================================================
//Refactor these into new file?
function accountsSumTotal(accountsData: AccountsData, timeDomain: number[]): number[] {
    let sumBals: number[] = [];

    for (const t in timeDomain) {
        let sumAtT = 0;
        for (const id in accountsData) {
            const bal = accountsData[id].bals[t];
            sumAtT += (bal === null) ? 0 : bal;
        };
        sumBals.push(sumAtT);
    };

    return sumBals;
};



