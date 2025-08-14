import { UUID } from "crypto";
import { Account } from "src/simulation/accounts";
import { AccountEvent } from "src/simulation/events";


/**
 * Creates a table indexed by account or event ids from an array and a function.
 * @param objects Account[] | AccountEvent[]
 * @param value function (Account | AccountEvent => any) that determines the value
 * @returns Record<UUID, any>
 */
export function makeIdTable<T, O extends Account | AccountEvent>(
    objects: O[], 
    value: (o: O) => T
): Record<UUID, T> {
    return Object.fromEntries(objects.map(o => [
        o.id,
        value(o)
    ]));
};
