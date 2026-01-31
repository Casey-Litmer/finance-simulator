import { Account } from "../accounts";
import { AccountEvent } from "./Event";
import { EventArguments } from "./EventInterfaces";
import { AccountState } from "../sim/accountState";





export class Adjustment extends AccountEvent {

    constructor({...kwargs}: EventArguments) {
        super({_precedence_: 6}, kwargs);
    };

    public Functor(E: AccountState, account: Account): boolean {
        //console.log('adj',E)
        E.bal = this.value;

        return true;
    };
};