import 'crypto';


export function newUUID() {
    return crypto.randomUUID();
}