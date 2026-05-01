import { SaveState } from "src/types";
import { migrations } from "./migrations";
import { APP_VERSION } from "src/globals";


export function migrateData(data: SaveState): SaveState {
    const version = data.version;

    if (version === APP_VERSION) return data as SaveState;

    if (!version || !(version in migrations)) {
        console.warn(`Save state version ${version} is not supported. 
            Attempting to load with latest migration, but this may cause errors.`);
        return data as SaveState;
    };
    
    const migrationNumber = Object.keys(migrations).indexOf(version);

    for (const migration of Object.values(migrations).slice(migrationNumber)) {
        data = migration(data);
    };

    data.version = APP_VERSION;

    return data as SaveState;
}; 