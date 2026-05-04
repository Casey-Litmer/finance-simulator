import { Account } from "../accounts";
import { AccountEvent } from "./Event";
import { EventArguments } from "./EventInterfaces";
import { AccountState } from "../sim/accountState";
import { AccountMetadata } from "src/types";



export class CloseAccount extends AccountEvent {
    
    constructor(kwargs: EventArguments) {
        super({_precedence_: 5}, kwargs)
    };
    
    public Functor(E: AccountState, account: Account): AccountMetadata {
        E.bal = null;
        E.open = false;

        return { continue: false };
    };
};