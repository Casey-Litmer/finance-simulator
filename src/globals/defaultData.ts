import { getToday, REF_TIME } from "../simulation/helpers/timeMethods";
import { AccountDisplay, AccountJSON, EventJSON } from "../simulation/types";


export const defaultSaveState = () => {
    const today = getToday().time;
    const nAccounts = 2;
    return {
        accounts: {
            [-1]: {
                args: { name: 'Total', openDate: REF_TIME },
                accountType: 'Account',
                eventIds: [],
            },
            ...Object.fromEntries(
                Array.from({ length: nAccounts }, (_, n) => ([n, {
                    args: {
                        name: String(n),
                        openDate: 9000,
                        initialBal: 1.5 ** n,
                        interestRate: 0.25
                    },
                    accountType: 'Savings Account',
                    eventIds: [n, n + nAccounts],
                }]))
            )
        } as Record<number, AccountJSON>,
        events: Object.fromEntries(
            Array.from({ length: nAccounts * 2 }, (_, n) => ([n, {
                args: {
                    eventTime: today + n * 8 + 1,
                    value: 1.2 ** n
                },
                eventType: 'Deposit',
                accountIds: [n % nAccounts]
            }]))
        ) as Record<number, EventJSON>,
        accountsDisplay: {
            [-1]: {
                visible: true,
                line: { color: 'hsl(0, 100%, 50%)', dash: 'dot' }
            },
            ...Object.fromEntries(
                Array.from({ length: nAccounts }, (_, n) => ([n, {
                    visible: true,
                    line: { color: `hsl(${n / nAccounts * 255}, 100%, 50%)` }
                }]))
            )
        } as Record<number, AccountDisplay>,
        eventsDisplay: Object.fromEntries(
            Array.from({ length: nAccounts * 2 }, (_, n) => ([n, {
                active: true
            }]))
        ),
        xDomain: {
            start: today,
            stop: today + 365,
            step: 1
        }
    };
};

//=================================================================================

export const defaultAccountDisplay = {
    visible: true,
    line: 'solid'
};

export const defaultEventDisplay = {
    active: true
};

//=================================================================================

export const defaultSaveStructure = {
    accounts: {} as Record<number, AccountJSON>,
    events: {}
}