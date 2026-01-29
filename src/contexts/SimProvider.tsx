import { UUID } from "crypto";
import { debounce } from "lodash";
import { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import { DeepPartial, deepPartialReducer } from "src/utils/deepPartial";
import { defaultEventDisplay, defaultSaveState, TODAY_MARKER_ID } from "src/globals";
import { runSim, simInitObjects } from "src/simulation";
import { getToday, newUUID } from "src/utils";
import { AccountJSON, EventJSON, MarkerJSON, SaveState, SimulationData } from "src/types";
import { _deleteAccount, _deleteEvent, _deleteMarker, updateAccountEventIds } from "./simProviderUtils";




type DispatchDeleteEvent = {
  type: 'account' | 'event' | 'marker';
  id: UUID;
};

type ContextProviderProps = {
  children: React.ReactNode;
};

type SimContextType = {
  saveState: SaveState;
  simData?: SimulationData;
  dispatchSaveState: React.Dispatch<SaveStateReducerAction>;
  addAccount: (account: AccountJSON) => void;
  addEvent: (event: EventJSON) => void;
  addMarker: (event: MarkerJSON) => void;
  deleteAccount: (accountId: UUID) => void;
  deleteEvent: (eventId: UUID) => void;
  deleteMarker: (markerId: UUID) => void;
  dispatchDelete: () => void;
  updateTodayMarker: () => void;
};

type SaveStateReducerAction = {
  partial: DeepPartial<SaveState>;
  init?: boolean;
};

export const simContext = createContext({} as SimContextType);

export const SimProvider = ({ children }: ContextProviderProps) => {
  const [simData, setSimData] = useState<SimulationData | undefined>();

  //Manually trigger a simRun
  const [forceRun, dispatchForceRun] = useReducer(x => 1 - x, 0);

  //=================================================================================

  ///////////////
  // simWorker //
  ///////////////

  const workerRef = useRef<Worker | null>(null);

  // Sim Worker Message
  const invokeSimWorker = (saveState: SaveState) => { workerRef.current?.postMessage({ saveState }) };

  //=================================================================================
  /**
   * Main dispatcher for updating saveState structure.
   * Any partial changes will be merged into the structure.
   * Automatically handles id reassignment on event change.
   */
  const reduceSaveState = (prev: SaveState, action: SaveStateReducerAction) => {
    const { partial, init } = action;
    if (init) {
      invokeSimWorker(partial as SaveState);
      return partial as SaveState;
    };
    
    //If the events change, update the eventIds in accounts
    if ('events' in partial) updateAccountEventIds(prev, partial.events as Record<number, EventJSON>);
    
    return deepPartialReducer(prev, partial);
  };
  
  const [saveState, dispatchSaveState] = useReducer(reduceSaveState, defaultSaveState());

  //=================================================================================

  //////////////////
  // Auto Sim Run //
  //////////////////

  // Mount 
  useEffect(() => {
    // Run with initial data bc worker takes a second to start
    const simParams = simInitObjects(saveState);
    const simData = runSim(simParams);
    setSimData(simData);
    // Update Today
    updateTodayMarker();
    // Start Worker
    workerRef.current = new Worker(new URL('./simWorker.ts', import.meta.url), { type: 'module' });
    workerRef.current.onmessage = (e) => setSimData(e.data.simData);
    return () => workerRef.current?.terminate();
  }, []);

  // Invoke the worker on parameter changes
  useEffect(
    debounce(() => {
      // Update today
      updateTodayMarker();
      // Run worker
      invokeSimWorker(saveState);
    }, 10),
  [
    saveState.accounts, 
    saveState.events, 
    // exclude today marker changes
    JSON.stringify({...saveState.markers, [TODAY_MARKER_ID]: null}), 
    saveState.xDomain, 
    forceRun
  ]);

  //=================================================================================

  /////////
  // API //
  /////////

  /**Creates a new Record key before dispatching new account*/
  const addAccount = (account: AccountJSON) => {
    dispatchSaveState({partial: {
      accounts: { [newUUID()]: {
        ...account,
        display : {
          visible: true,
          line: { color: `hsl(${Math.random() * 255}, 100%, 50%)`, dash: 'solid' }
        }
      } },
    }});
  };

  /**Creates a new Record key before dispatching new event*/
  const addEvent = (event: EventJSON) => {
    dispatchSaveState({ partial: { 
      events: { [newUUID()]: {
        ...event,
        display: defaultEventDisplay
      } },
    }});
  };

  /**Creates a new Record key before dispatching new marker*/
  const addMarker = (marker: MarkerJSON) => {
    dispatchSaveState({ partial: { 
      markers: { [newUUID()]: {
        ...marker,
        display: {
          visible: true,
          line: { color: `hsl(${Math.random() * 255}, 100%, 50%)`, dash: 'dash' }
        }
      }},
    }});
  };

  //=================================================================================
  //// Deletion ///

  const [deletionQueue, setDeletionQueue] = useState<DispatchDeleteEvent[]>([]);

  /**Deletes all accounts and events enqueued for deletion from saveState
   * This is to ensure that any component still relying on the saveState
   * as a dependency does not lose access until specified. */
  const dispatchDelete = () => {
    if (deletionQueue.length) { //fixes rerender.  Still need a way to keep zoom on plot
      deletionQueue.forEach(({ type, id }) => {
        if (type === 'account') _deleteAccount(id, saveState);
        if (type === 'event') _deleteEvent(id, saveState);
        if (type === 'marker') _deleteMarker(id, saveState);
      });
      setDeletionQueue([]);
      dispatchForceRun();
    };
  };

  /**Adds an account to be deleted to the queue*/
  const deleteAccount = (accountId: UUID): boolean => {
    deletionQueue.push({ type: 'account', id: accountId });
    return true;
  };

  /**Adds an event to be deleted to the queue*/
  const deleteEvent = (eventId: UUID): boolean => {
    deletionQueue.push({ type: 'event', id: eventId });
    return true;
  };

  /**Adds a marker to be deleted to the queue*/
  const deleteMarker = (markerId: UUID) => {
    deletionQueue.push({ type: 'marker', id: markerId });
    return true;
  };

  //=================================================================================
  // Automatically update today marker
  const updateTodayMarker = () => { 
    dispatchSaveState({ partial: { markers: { [TODAY_MARKER_ID]: { time: getToday().time } } } }) 
  };

  //=================================================================================
  return (
    <simContext.Provider
      value={{
        saveState,
        simData,
        dispatchSaveState,
        addAccount,
        addEvent,
        addMarker,
        deleteAccount,
        deleteEvent,
        deleteMarker,
        dispatchDelete,
        updateTodayMarker
      }}
    >
      {children}
    </simContext.Provider>
  );
};

//=================================================================================

export const useSim = () => {
  const context = useContext(simContext);
  // err handling pls
  return context;
};



