import AccountEvent from "../events/Event";
import Profile from "../benchmarking/Profiler";
import Deque from "./Deque";
import { EventTable } from "../types";



/**
 * Adds event(s) to the event table.
 * 
 * @param table - An object representing the event table, where each key is a float representing a timestamp,
 *                and the value is an array of events that occurred at that time.
 * @param event - A single event or another event table to be added. If another event table is passed,
 *                its entries are merged into the current table.
 * 
 * The function joins and sorts events by precedence if multiple events occur on the same day.
 * The event dictionary is hashed by absolute (float) time.
 * 
 * @returns A new event table with the added event(s) without modifying the original table.
 */
 export function addToEventTable(table: EventTable, event: AccountEvent | EventTable): EventTable {
    const newEvents: EventTable = { ...table };

    if ('id' in event) {//typeguard
        const t = event.eventTime;                                      
        newEvents[t] = [...(newEvents[t] || []), event].sort((e1, e2) => {return e1._precedence_ - e2._precedence_});
    } else {
        for (const t of Object.keys(event).map(Number)) {
            const events = event[t];
            newEvents[t] = [...(newEvents[t] || []), ...events].sort((e1, e2) => e1._precedence_ - e2._precedence_);
        };
    };
    return newEvents
 };
 


/**
 * Converts an event table into an ordered list
 * @param table 
 */
 export function makeEventQueue(table: EventTable): Deque<AccountEvent> {
    const eventQueue = new Deque<AccountEvent>();
    const times = Object.keys(table).map(Number).sort((a, b) => a - b);
    for (const t of times) {
        eventQueue.pushRight(...(table[t] || []));  
    };
    return eventQueue;
 };
 

 export function sliceQueueBeforeT(eventQueue: Deque<AccountEvent>, t: number) {
    for (let n = 0; n < eventQueue.length; n++) {
        const e = eventQueue.get(n);
        const time = e.eventTime;
    
        if (time > t) {
          return eventQueue.slice(0, n);  
        };
      };
      return eventQueue.slice();
 };
 
 