import Account from "../accounts/Account";
import AccountEvent from "../events/Event";


/**
 * Creates a table indexed by account or event ids from an array and a function.
 * @param objects Account[] | AccountEvent[]
 * @param value function (Account | AccountEvent => any) that determines the value
 * @returns Record<number, any>
 */
export default function makeIdTable<T, O extends Account | AccountEvent>(
    objects: O[], 
    value: (o: O) => T
): Record<number, T> {
    return Object.fromEntries(objects.map(o => [
        o.id,
        value(o)
    ]));
};
