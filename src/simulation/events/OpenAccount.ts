import { Account } from "../accounts";
import { AccountEvent } from "./Event";
import { EventArguments } from "./EventInterfaces";
import { AccountState } from "../sim/accountState";
import { AccountMetadata } from "src/types";



export class OpenAccount extends AccountEvent {
    
    constructor(kwargs: EventArguments) {
        super({_precedence_: 0, isGenerated: true}, kwargs);
        this.isConsumable = false;
    };
    
    public Functor(E: AccountState, account: Account): AccountMetadata {
        E.bal = account.initialBal;
        E.open = true;

        return { continue: true };
    };
};