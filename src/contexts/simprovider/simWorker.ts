/// <reference lib="webworker" />

declare const self: DedicatedWorkerGlobalScope;

import { runSim, simInitObjects } from "src/simulation";

self.onmessage = (e) => {
    const saveState = e.data.saveState;
    const simParams = simInitObjects(saveState);
    const simData = runSim(simParams);
    self.postMessage({ simData });
};