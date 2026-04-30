import { UUID } from "crypto";
import { addToEventTable, makeEventQueue } from "./sim";
import { AccountEvent } from "src/simulation/events/Event";
import { EventItem } from "src/menus/eventsmenu/EventItem";
import { EventsData, EventTable } from "src/types";


//TODO do not rely on this.  Create a precedence record that the events inherit from and rewrite the sim
// sorting algorithms for here.  Do not let the UI eat the shit out of its own ass, you will get problems...

/**
   * Uses event data from the simulation in order to make use of the sorting
   * of addToEventTable.
  */
export function eventDisplay(eventsData: EventsData, filteredEventIds: UUID[]) {
    // Get all objects from the sim that pass the filter (non active events included)
    const eventObjects = Object.values(eventsData)
      .map(evData => evData.event)
      .filter(ev => filteredEventIds.includes(ev.id));
  
    // Use eventTableMethods to order by time/precedence like in the sim
    let orderedEvents = {} as EventTable;
    for (const ev of eventObjects) {
      orderedEvents = addToEventTable(orderedEvents, ev as AccountEvent);
    };
  
    // Squash list and map back to ids, components...
    const orderedEventIds = makeEventQueue(orderedEvents).getItems().map((ev) => ev.id);
    return orderedEventIds.map((id) => <EventItem key={id} eventId={id} />);
};