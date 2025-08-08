import { Color, Dash } from "plotly.js";
import { getToday, REF_TIME } from "src/utils";
import { AccountDisplay, AccountJSON, EventDisplay, EventJSON } from "src/simulation/types";



export const defaultSaveState = () => {
    const today = getToday().time;
    const nAccounts = 2;
    return {
        // Accounts
        accounts: {
            // Accounts Sum Total
            [-1]: {
                args: { name: 'Total', openDate: REF_TIME },
                accountType: 'Account',
                eventIds: [],
                display: defaultAccountDisplay({color: 'rgb(255, 0, 0)', dash: 'dash'})
            },
            // Rest of the Accounts
            ...Object.fromEntries(
                Array.from({ length: nAccounts }, (_, n) => ([n, {
                    // Simulation Args
                    args: {
                        name: String(n),
                        openDate: 9000,
                        initialBal: 1.5 ** n,
                        interestRate: 0.25
                    },
                    accountType: 'Savings Account',
                    eventIds: [n, n + nAccounts],
                    display: defaultAccountDisplay({color: `hsl(${n / nAccounts * 255}, 100%, 50%)`})
                }]))
            )
        } as Record<number, AccountJSON>,
        // Events
        events: Object.fromEntries(
            Array.from({ length: nAccounts * 2 }, (_, n) => ([n, {
                args: {
                    eventTime: today + n * 8 + 1,
                    value: 1.2 ** n
                },
                eventType: 'Deposit',
                accountIds: [n % nAccounts],
                display: defaultEventDisplay
            }]))
        ) as Record<number, EventJSON>,
        //accountsDisplay: {
        //    [-1]: {
        //        visible: true,
        //        line: { color: 'hsl(0, 100%, 50%)', dash: 'dot' }
        //    },
        //    ...Object.fromEntries(
        //        Array.from({ length: nAccounts }, (_, n) => ([n, {
        //            visible: true,
        //            line: { color: `hsl(${n / nAccounts * 255}, 100%, 50%)` }
        //        }]))
        //    )
        //} as Record<number, AccountDisplay>,
        //eventsDisplay: Object.fromEntries(
        //    Array.from({ length: nAccounts * 2 }, (_, n) => ([n, {
        //        active: true
        //    }]))
        //),
        
        // Domain
        xDomain: {
            start: today,
            stop: today + 365,
            step: 1
        }
    };
};

//=================================================================================

export const defaultAccountDisplay = ({color, dash}: {color?: Color, dash?: Dash}) => ({
    visible: true,
    line: { color: color, dash: dash }
} as AccountDisplay);

export const defaultEventDisplay = {
    active: true
} as EventDisplay;

//=================================================================================

export const defaultSaveStructure = {
    accounts: {} as Record<number, AccountJSON>,
    events: {}
}