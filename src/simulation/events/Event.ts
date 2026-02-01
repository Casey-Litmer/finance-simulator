import { UUID } from 'crypto';
import { Account } from '../accounts';
import { EventArguments, EventBreakpoint, EventSettings } from './EventInterfaces';
import { AccountState } from '../sim/accountState';
import {
    REF_TIME, 
    addPeriod,
    convertTime,
    makeIdTable,
    newUUID
} from 'src/utils';
import { EventTable } from 'src/types';



export const EVENTS: AccountEvent[] = [];

//Meta constructor
export type EventConstructor<E extends AccountEvent = AccountEvent> = new (...args: any[]) => E; 

//=========================================================================================
export class AccountEvent {
    _precedence_: number; 
    id: UUID;
    name: string | undefined;
    eventTime: number;
    value: number;
    accounts: Record<number, Account>;
    eventPeriod: number;
    periodMode: string;
    endTime: number;
    breakpoints: Record<UUID, EventBreakpoint>;
    
    isGenerated: boolean;
    isConsumable: boolean = true;
    isActive: boolean;
    isPeriodic: boolean;
    
    constructor({
        _precedence_ = 10,
        isGenerated = false,
        isPeriodic = false,
    }: EventSettings, {
        id,
        name,
        eventTime = REF_TIME, 
        value = 0,
        accounts = [], 
        eventPeriod = 28,
        periodMode = 'constant',
        endTime = REF_TIME,
        doesEnd = false,
        isActive = true,
        breakpoints = {},
    }: EventArguments ) {      
        this.id = id ?? newUUID();; //Change later to be required?
        this.isActive = isActive;
        this.name = name;   
        this.eventTime = convertTime(eventTime, 'number');
        this.value = value;

        //Parent Accounts
        this.accounts = makeIdTable(accounts, acc => acc);
        this.isGenerated = isGenerated;

        //set precedence as passed argument so child class has immediate access
        this._precedence_ = _precedence_;

        if (!this.isGenerated) {
            this.addToParentAccounts();
            EVENTS.push(this);
        }

        //Periodic Events
        this.isPeriodic = isPeriodic;
        this.eventPeriod = eventPeriod;
        this.periodMode = periodMode;

        //End of period event.  If None, the event will not end...
        this.endTime = (doesEnd) ? convertTime(endTime, 'number') : 10**7; //...(in our lifetimes)

        //Breakpoints
        this.breakpoints = breakpoints;
    };

    //=========================================================================================
    /**
     * Takes a struct E containing:
     *  - the most recent balance
     *  - an attribute table consisting of
     *      - accrued interests
     *      - previous event time
     *      - interest rate, period, and other information
     *
     *  And the account that is calling it.
     *
     *  Mutates E and returns a bool that controls the stack loop running it.
     *
     *  (The return is necessary so the functor may break a nested loop to
     *  stay in sync with other cross dependent accounts)
     * @param E AccountState
     * @param account Account
     */
    public Functor(E: AccountState, account: Account): boolean {
        return true;
    };

    //=========================================================================================
    /**Some 'soft' events, like CompoundingInterest, will not appear in account event table*/
    private addToParentAccounts(): void {
        for (const id in this.accounts) this.accounts[id].addEvent(this);
    };

    //=========================================================================================
    /**Takes a list of times and a step size and returns an event table populated with
        generated periodic Events.*/
    public generatePeriodicEvents(timeDomain: number[], step: number): EventTable {
        //Placement of events decided by period mode
        const increment = (time: number) => addPeriod(time, this.eventPeriod, this.periodMode);
        const t_max = timeDomain[timeDomain.length - 1] + step;
        
        const generatedEvents: EventTable = {};
        let t = increment(this.eventTime);
        let currentValue = this.value;

        //Backwards sort breakpoints
        const breakpointsSorted = this.isPeriodic 
            ? Object.entries(this.breakpoints)
                .sort(([_, A], [__, B]) => B.time - A.time)
                .map(([_, breakpoint]) => breakpoint)
            : [];

        //Create 'generated' copies of the event at each reoccurence
        while (t <= t_max && t < this.endTime) {
            //Copy parent event
            const newEvent =  Object.assign(Object.create(Object.getPrototypeOf(this)), this) as typeof this;

            //Apply breakpoints / update time
            currentValue = this.applyBreakpoints(currentValue, t, breakpointsSorted);
            newEvent.value = currentValue;
            newEvent.isGenerated = true;
            newEvent.eventTime = t;

            //Round down days that don't fit into monthly mode
            if (this.periodMode === 'monthly') {
                newEvent.eventTime = Math.min(28, t);
            };

            //Add to generated events
            generatedEvents[t] = [newEvent];
            t = increment(t);   
        };
        return generatedEvents;
    };

    private applyBreakpoints(currentValue: number, t: number, breakpoints: EventBreakpoint[]): number {
        let newValue = currentValue;
        while (breakpoints.length && t >= breakpoints[breakpoints.length - 1].time) {
            const lastBreakpoint = breakpoints.pop()!;
            const { value } = lastBreakpoint;
            if (value !== undefined) newValue = value;
        };
        return newValue;
    };
};

