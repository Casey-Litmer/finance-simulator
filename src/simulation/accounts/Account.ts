import { UUID } from 'crypto';
import { DateTime } from 'luxon';
import { AccountEvent, CompoundInterest } from '../events';
import { AccountArguments } from './AccountInterfaces';
import {
    REF_DATE,
    dateTimeToFloat,
    formatDatetime,
    convertTime,
    addToEventTable,
    Deque,
    newUUID
} from 'src/utils';
import { EventTable, SimulationBundle } from 'src/types';




//Meta constructor
export type AccountConstructor<A extends Account = Account> = new (...args: any[]) => A;


export class Account {
    id: UUID;
    name: string;
    initialBal: number;
    openDate: DateTime;
    interestRate: number;
    interestPeriod: number;
    periodStart: DateTime;
    prorate: boolean;
    events: EventTable;
    periodicEvents: EventTable;
    READOUT: boolean;
    bundle: SimulationBundle;

    constructor({
        name = undefined,
        initialBal = 0,
        openDate = REF_DATE,
        prorate = true,
        id
    }: AccountArguments) {
        
        this.id = id ?? newUUID(); 
        this.openDate = convertTime(openDate, 'DateTime');
        this.name = name ? name : 'Account ' + formatDatetime(this.openDate);
        this.initialBal = initialBal;
        this.prorate = prorate;
        this.READOUT = false;

        //Default interest parameters.  Accounts without interest will not generate
        //CompoundInterest events and will accrue $0
        this.interestRate = 0;
        this.interestPeriod = 365;
        this.periodStart = REF_DATE;

        // Events
        this.events = {};
        this.periodicEvents = {};

        //Data used in simulation
        this.bundle = {
            times: [],
            pendingEvents: new Deque<AccountEvent>(),
            remainingEvents: new Deque<AccountEvent>(),
            state: null
        };
    }


    /**
     * events: {t1:[event1, event2, ...], t2:[...]}
     *  events: EventTable
     *
     *  Add Event on date.  Joins and sorts lists by event precedence if
     *  multiple events land on the same day.
     *  The event dict is hashed by absolute (float) time.
     */
    public addEvent(event: AccountEvent): void {
        this.events = addToEventTable(this.events, event);
    };


    //Overwritten by CheckingAccount to do nothing :)
    public generateInterestPeriods(timeDomain: number[], step: number): EventTable {
        const Q = this.interestPeriod;
        const d = dateTimeToFloat(this.periodStart);

        const tMax = timeDomain[timeDomain.length - 1] + step;
        let tMin = dateTimeToFloat(this.openDate);
        tMin = tMin + (d - tMin) % Q;

        //Add all interest periods
        const interestPeriods: EventTable = {};

        for (let t = tMin; t < tMax; t += Q) {
            interestPeriods[t] = [
                new CompoundInterest({
                    eventTime: t,
                    accounts: [this]
                })
            ];
        };

        return addToEventTable(this.events, interestPeriods);
    };
};