import { isArray, isObject, mergeWith } from "lodash";



//Save in a module later
export type DeepPartial<T> = T extends object ? 
{[P in keyof T]?: DeepPartial<T[P]>} : T;

/*This is very cool.  Add to a library later with the DeepPartial type*/
export function deepPartialReducer<T extends object>(prevState: T, newPartial: DeepPartial<T>): T {
    return mergeWith({}, prevState, newPartial, (objValue, srcValue) => {
        if (isObject(objValue) && isObject(srcValue) && !isArray(srcValue)) {
            //return { ...objValue, ...srcValue }; // Ensure a new reference
            return deepPartialReducer(objValue, srcValue);
        }
        return srcValue ?? objValue;
    });
};