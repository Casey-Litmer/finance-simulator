import { UUID } from "crypto";
import { convertTime } from "./timeMethods";
import { EventJSON, FilterJSON } from "src/types";



//=================================================================================

export function filterEvents(events: Record<UUID, EventJSON>, settings?: FilterJSON): Record<UUID, EventJSON> {
  const result: Record<UUID, EventJSON> = {};

  if (!settings) return events;

  for (const [id, event] of Object.entries(events)) {
    const args = event.args;

    // Filter By Type
    const type = event.eventType;
    if (!settings[typeToFilterKey(type)]) continue;

    // Filter By Single/Periodic
    const isPeriodic = type.includes('Periodic');
    if (isPeriodic && !settings.periodic) continue;
    if (!isPeriodic && !settings.singular) continue;

    // Filter By Time Range
    const time = convertTime(args.eventTime, 'number');
    if (settings.range.after && time <= settings.range.startTime) continue;
    if (settings.range.before && time >= settings.range.endTime) continue;

    result[id as UUID] = event;
  };

  return result;
};

//=================================================================================

function typeToFilterKey(type: string): keyof FilterJSON {
  // Normalizes keys like "Periodic Deposit" to "periodicDeposit"
  return type
    .replace(/\s+/g, "")
    .replace(/^./, c => c.toLowerCase()) as keyof FilterJSON;
};

