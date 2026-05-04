import { Account } from "../accounts";
import { AccountEvent } from "./Event";
import { EventArguments } from "./EventInterfaces";
import { AccountState } from "../sim/accountState";
import { AccountMetadata } from "src/types";





export class Adjustment extends AccountEvent {

    constructor({...kwargs}: EventArguments) {
        super({_precedence_: 6}, kwargs);
    };

    public Functor(E: AccountState, account: Account): AccountMetadata {
        //console.log('adj',E)
        E.bal = this.value;

        return { continue: true };
    };
};