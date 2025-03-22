import { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { AccountDisplay, AccountJSON, EventJSON, SaveState, SimulationData } from '../simulation/types';
import { useTime } from './TimeProvider';
import simInitObjects from '../simulation/sim/simInitObjects';
import runSim from '../simulation/sim/simulation';
import { DeepPartial, deepPartialReducer } from '../deepPartial';
import { debounce } from 'lodash';
import { REF_TIME } from '../simulation/helpers/timeMethods';





type DispatchDeleteEvent = {
    type: 'account' | 'event';
    id: number;
};

type ContextProviderProps = {
    children: React.ReactNode;
};

type SimContextType = {
    saveState: SaveState;
    dispatchSaveState: React.Dispatch<DeepPartial<SaveState>>;
    addAccount: (account: AccountJSON) => void;
    addEvent: (event: EventJSON) => void;
    deleteAccount: (accountId: number) => void;
    deleteEvent: (eventId: number) => void;
    dispatchDelete: () => void;
    getLastAccId: () => number;
    simData?: SimulationData;
};

export const simContext = createContext({} as SimContextType);

export const SimProvider = ({ children }: ContextProviderProps) => {
    const today = useTime().today;
    const [simData, setSimData] = useState<SimulationData | undefined>();

    //Manually trigger a simRun
    const [forceRun, dispatchForceRun] = useReducer(x => 1-x, 0);

    //=========================================================================================
    /**
     * Main dispatcher for updating saveState structure.
     * Any partial changes will be merged into the structure.
     * Automatically handles id reassignment on event change.
     */
    const reduceSaveState = (prev: SaveState, partial: DeepPartial<SaveState>) => {
        //If the events change, update the eventIds in accounts
        if ('events' in partial) updateAccountEventIds(prev, partial.events as Record<number, EventJSON>);
        return deepPartialReducer(prev, partial);
    };

    const nAccounts = 2;

    const [saveState, dispatchSaveState] = useReducer(reduceSaveState, {   
        accounts: {
            [-1]: {
                args: {name: 'Total', openDate: REF_TIME},
                accountType: 'Account',
                eventIds: [],
            },
            ...Object.fromEntries(
                Array.from({length: nAccounts}, (_, n) => ([n, {
                    args: {
                        name: String(n),
                        openDate:9000,
                        initialBal: 1.5**n,
                        interestRate: 0.25
                    },
                    accountType: 'Savings Account',
                    eventIds: [n, n + nAccounts],
                }]))
            )
        } as Record<number, AccountJSON>,
        events: Object.fromEntries(
            Array.from({length: nAccounts*2 }, (_, n) => ([n, {
                args: {
                    eventTime: today + n*8 + 1,
                    value: 1.2**n
                },
                eventType: 'Deposit',
                accountIds: [n%nAccounts]
            }]))
        ) as Record<number, EventJSON>,
        accountsDisplay: {
            [-1]: {                
                visible: true,
                line:{color:'hsl(0, 100%, 50%)', dash:'dot'}
            },
            ...Object.fromEntries(
                Array.from({length: nAccounts}, (_, n) => ([n, {
                    visible: true,
                    line: {color:`hsl(${n / nAccounts * 255}, 100%, 50%)`}
                }]))
            )
        } as Record<number, AccountDisplay>,
        xDomain: {
            start: today,
            stop: today + 365,
            step: 1
        }
    });

    //=========================================================================================

    ///////////////////////////////
    // Data Structure Management //
    ///////////////////////////////

    /**
     * Updates all accounts' eventIds with changes in events.
     * This ensures no duplicate or residual ids when an event references a new account.
     * @param saveState previous state (same signature as the reducer)
     * @param events new partial: Record<number, EventJSON>
     */
    function updateAccountEventIds(saveState: SaveState, events: Record<number, EventJSON>) {
        //For each event in the partial,
        Object.entries(events).forEach(([eventId, event]) => {
            const currentAccountIds = Object.keys(saveState.accounts).map(Number);
            const newEventAccountIds = event.accountIds;
            //For all current accountsIds,
            for (const accId of currentAccountIds) {
                const currentAccount = saveState.accounts[accId];
                //If the new event references the accountId
                if (newEventAccountIds.includes(accId)) {
                    //Add the eventId to the account if not already included
                    if (!currentAccount.eventIds.includes(Number(eventId)))
                        currentAccount.eventIds.push(Number(eventId));
                } else {
                    //Remove the eventId if it is in the account
                    if (currentAccount.eventIds.includes(Number(eventId))) 
                        currentAccount.eventIds = currentAccount.eventIds.filter((id) => id !== Number(eventId));
                };
            };
        });
    };

    const getLastAccId = () => {
        return Math.max(...Object.keys(saveState.accounts).map(Number), ...[0]);
    };

    /**Creates a new Record key before dispatching new account*/
    const addAccount = (account: AccountJSON) => {
        const lastId = Math.max(...Object.keys(saveState.accounts).map(Number), ...[0]);
        dispatchSaveState({
            accounts: {[lastId + 1]: account},
            accountsDisplay: {[lastId + 1]: {
                visible: true, 
                line:{color:`hsl(${Math.random()*255}, 100%, 50%)`, dash:'solid'}
            }}
        });
    };

    /**Creates a new Record key before dispatching new event*/
    const addEvent = (event: EventJSON) => {
        const lastId = Math.max(...Object.keys(saveState.events).map(Number), ...[0]);
        dispatchSaveState({events: {[lastId + 1]: event}});
    };

    //=========================================================================================
    //// Deletion ///

    const [deletionQueue, setDeletionQueue] = useState<DispatchDeleteEvent[]>([]);

    /**Deletes all accounts and events enqueued for deletion from saveState
     * This is to ensure that any component still relying on the saveState
     * as a dependency does not lose access untill it specifies. */
    const dispatchDelete = () => {
        if (deletionQueue.length) { //fixes rerender.  Still need a way to keep zoom on plot
            deletionQueue.forEach(({type, id}) => {
                if (type === 'account') _deleteAccount(id);
                if (type === 'event') _deleteEvent(id);
            });
            setDeletionQueue([]);
            dispatchForceRun();
        };
    };

    /**Deletes an account and all linked events*/
    const _deleteAccount = (accountId: number) => {
        const account = saveState.accounts[accountId];
        const accountEventIds = account.eventIds;
        accountEventIds.forEach((evId) => {_deleteEvent(evId)});
        delete saveState.accounts[accountId];
    };

    /**Deletes an event and removes it from all linked accounts*/
    const _deleteEvent = (eventId: number) => {
        const event = saveState.events[eventId];
        const eventAccountIds = event.accountIds;
        eventAccountIds.forEach((accId) => {//Remove eventId in each linked account
            const accountEventIds = saveState.accounts[accId].eventIds;
            saveState.accounts[accId].eventIds = accountEventIds.filter((evId) => evId !== Number(eventId));
        });
        delete saveState.events[eventId];
    };

    /**Adds an account to be deleted to the queue*/
    const deleteAccount = (accountId: number): boolean => {
        deletionQueue.push({type: 'account', id: accountId});
        return true;
    };

    /**Adds an event to be deleted to the queue*/
    const deleteEvent = (eventId: number): boolean => {
        deletionQueue.push({type: 'event', id: eventId});
        return true;
    };

    //=========================================================================================

    /////////////
    // runSim  //
    /////////////

    const workerRef = useRef<Worker | null>(null);

    //Simulation runs in a separate thread
    useEffect(() => {
        //Run with initial data bc worker takes a second to start
        const simParams = simInitObjects(saveState);
        const simData = runSim(simParams);
        setSimData(simData);
        //Start Worker
        workerRef.current = new Worker(new URL('./simWorker.ts', import.meta.url));
        workerRef.current.onmessage = (e) => setSimData(e.data.simData);
        return () => workerRef.current?.terminate();
    }, []);

    //Invoke the worker on parameter change
    useEffect(debounce(() => workerRef.current?.postMessage({saveState}), 10), 
        [saveState.accounts, saveState.events, saveState.xDomain, forceRun]);

    //=========================================================================================
    return (
        <simContext.Provider
            value={{
                saveState,
                simData,
                dispatchSaveState,
                addAccount,
                addEvent,
                deleteAccount,
                deleteEvent,
                dispatchDelete,
                getLastAccId, 
            }}
        >
            {children}
        </simContext.Provider>
    );
};

//=========================================================================================
export const useSim = () => {
    const context = useContext(simContext);
    // err handling pls
    return context;
};



