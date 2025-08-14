import { Color, Dash } from "plotly.js";
import { getToday, newUUID, REF_TIME } from "src/utils";
import { ACC_SUM_TOTAL_ID } from "./CONSTANTS";
import { UUID } from "crypto";
import { AccountDisplay, AccountJSON, EventDisplay, EventJSON, FilterJSON, MarkerDisplay, MarkerJSON, SaveState } from "src/types";





export const defaultSaveState = () => {
    const today = getToday().time;
    const nAccounts = 2;
    const nEvents = 4;
    const accUUIDs = Array.from({length: nAccounts}, () => newUUID());
    const evtUUIDs = Array.from({length: nEvents}, () => newUUID());
    //=================================================================================
    return {
        //=================================================================================
        // Accounts
        //=================================================================================
        accounts: {
            // Accounts Sum Total
            [ACC_SUM_TOTAL_ID]: {
                args: { name: 'Total', openDate: REF_TIME },
                accountType: 'Account',
                eventIds: [],
                display: defaultAccountDisplay({ color: 'rgb(255, 0, 0)', dash: 'dash' })
            },
            // Rest of the Accounts
            ...Object.fromEntries(
                Array.from({ length: nAccounts }, (_, n) => ([accUUIDs[n], {
                    // Simulation Args
                    args: {
                        name: String(n),
                        openDate: 9000,
                        initialBal: 1.5 ** n,
                        interestRate: 0.25
                    },
                    accountType: 'Savings Account',
                    //eventIds: [n, n + nAccounts],
                    eventIds: [evtUUIDs[n], evtUUIDs[n + nAccounts]],
                    display: defaultAccountDisplay({ color: `hsl(${n / nAccounts * 255}, 100%, 50%)` })
                }]))
            )
        } as Record<UUID, AccountJSON>,
        //=================================================================================
        // Events
        //=================================================================================
        events: Object.fromEntries(
            Array.from({ length: nEvents }, (_, n) => ([evtUUIDs[n], {
                // Simulation Args
                args: {
                    eventTime: today + n * 8 + 1,
                    value: 1.2 ** n
                },
                eventType: 'Deposit',
                accountIds: [accUUIDs[n % nAccounts]],
                display: defaultEventDisplay
            }]))
        ) as Record<UUID, EventJSON>,
        //=================================================================================
        // Markers
        //=================================================================================
        markers: {} as Record<UUID, MarkerJSON>,
        //=================================================================================
        // Domain
        //=================================================================================
        xDomain: {
            start: today,
            stop: today + 365,
            step: 1
        }
    } as SaveState;
};

//=================================================================================

export const defaultAccountDisplay = ({ color, dash }: { color?: Color, dash?: Dash }) => ({
    visible: true,
    line: { color: color, dash: dash }
} as AccountDisplay);

export const defaultEventDisplay = {
    active: true
} as EventDisplay;

export const defaultMarkerDisplay = ({ color, dash }: { color?: Color, dash?: Dash }) => ({
    visible: true,
    line: { color: color, dash: dash }
} as MarkerDisplay);

//=================================================================================

export const defaultFilter = {
    deposit: true,
    withdrawal: true,
    transfer: true,
    closeAccount: true,
    changeInterestRate: true,
    adjustment: true,
    periodicDeposit: true,
    periodicWithdrawal: true,
    periodicTransfer: true,
    singular: true,
    periodic: true,
    name: '',
    range: {
        after: false,
        startTime: getToday().time,
        before: false,
        endTime: getToday().time + 365 * 2,
    }
} as FilterJSON;

//=================================================================================

export const defaultMarker = ({ color, dash }: { color?: Color, dash?: Dash }) => ({
    time: getToday().time,
    name: 'Today',
    display: defaultMarkerDisplay({color, dash})
} as MarkerJSON);
