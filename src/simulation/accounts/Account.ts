import AccountEvent from '../events/Event';
import {
    REF_DATE, 
    dateTimeToFloat, 
    formatDatetime,
    convertTime
} from '../helpers/timeMethods';
import { addToEventTable } from '../helpers/eventTableMethods';
import CompoundInterest from '../events/CompoundInterest';
import { DateTime } from 'luxon';
import Deque from '../helpers/Deque';
import { EventTable, SimulationBundle} from '../types';
import { AccountArguments } from './AccountInterfaces';




//manually create ids for accounts and increment value
export let LAST_ACCOUNT_ID = 0;
export function resetLastAccountID() {LAST_ACCOUNT_ID = 0}


//Meta constructor
export type AccountConstructor<A extends Account = Account> = new (...args: any[]) => A; 


export default class Account {
    name: string;
    initialBal: number;
    openDate: DateTime;
    prorate: boolean;
    interestRate: number;
    interestPeriod: number;
    periodStart: DateTime;
    events: EventTable;
    periodicEvents: EventTable;

    READOUT: boolean;
    id: number;

    bundle: SimulationBundle;

    constructor({
            name = undefined, 
            initialBal = 0, 
            openDate = REF_DATE, 
            prorate = true, 
            id
        }: AccountArguments) {

        this.openDate = convertTime(openDate, 'DateTime');
        this.name = name ? name : 'Account ' + formatDatetime(this.openDate);
        this.initialBal = initialBal;
        this.prorate = prorate;

        //Default interest parameters.  Accounts without interest will not generate
        //CompoundInterest events and will accrue $0
        this.interestRate = 0;
        this.interestPeriod = 365;
        this.periodStart = REF_DATE;

        this.events = {};
        this.periodicEvents = {};

        this.READOUT = false;

        if (id !== undefined) {
            this.id = id;
        } else {
            this.id = LAST_ACCOUNT_ID; 
            LAST_ACCOUNT_ID++;
        }
        
        //Data used in simulation
        this.bundle = {
            times: [], 
            pendingEvents: new Deque<AccountEvent>(), 
            remainingEvents: new Deque<AccountEvent>(), 
            state:null
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
    }


    //Overwritten by CheckingAccount to do nothing :)
    public generateInterestPeriods(timeDomain: number[], step: number): EventTable {
        const Q = this.interestPeriod;
        const d = dateTimeToFloat(this.periodStart);

        const tMax = timeDomain[timeDomain.length - 1] + step;
        let tMin = dateTimeToFloat(this.openDate);
        tMin = tMin + (d - tMin) % Q;

        //Add all interest periods
        const interestPeriods:EventTable = {};

        for (let t = tMin; t < tMax; t += Q) {
            interestPeriods[t] = [
                new CompoundInterest({
                    eventTime: t, 
                    accounts: [this]
            })];
        }

        return addToEventTable(this.events, interestPeriods);
    }
}