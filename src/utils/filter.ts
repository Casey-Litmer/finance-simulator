import { convertTime, DateFloat } from "./timeMethods";
import { EventJSON, FilterJSON } from "../simulation/types";




export function filterEvents(events: Record<number, EventJSON>, settings?: FilterJSON): Record<number, EventJSON> {
  if (!settings?.filter) return events;

  console.log(events)

  const result: Record<number, EventJSON> = {};
  const filterBy = settings.filterBy;

  for (const [id, event] of Object.entries(events)) {
    const args = event.args;

    // ========== 1. Type Filtering ==========
    const type = event.eventType;

    if (!filterBy[typeToFilterKey(type)]) continue;

    // ========== 2. Singular vs. Periodic Filtering ==========
    //const isPeriodic = args.eventPeriod !== undefined;
    const isPeriodic = type.includes('Periodic');
    if (isPeriodic && !filterBy.periodic) continue;
    if (!isPeriodic && !filterBy.singular) continue;

    console.log(event.args.name, event.eventType, isPeriodic)

    // ========== 3. Time Range Filtering ==========
    const time = convertTime(args.eventTime, 'number');
    if (filterBy.range.after && time < filterBy.range.startTime) continue;
    if (filterBy.range.before && time > filterBy.range.endTime) continue;

    result[+id] = event;
  };

  return result;
};

//=================================================================================

function typeToFilterKey(type: string): keyof FilterJSON["filterBy"] {
  // Normalizes keys like "Periodic Deposit" to "periodicDeposit"
  return type
    .replace(/\s+/g, "")
    .replace(/^./, c => c.toLowerCase()) as keyof FilterJSON["filterBy"];
};

