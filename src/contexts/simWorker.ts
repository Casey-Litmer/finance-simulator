/// <reference lib="webworker" />

declare const self: DedicatedWorkerGlobalScope;

import runSim  from "../simulation/sim/simulation";
import simInitObjects from "../simulation/sim/simInitObjects";

/* eslint-disable no-restricted-globals */

self.onmessage = (e) => {
    const saveState = e.data.saveState;
    const simParams = simInitObjects(saveState);
    const simData = runSim(simParams);
    self.postMessage({ simData });
};