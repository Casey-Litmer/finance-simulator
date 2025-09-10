import { Account } from "../accounts";
import { AccountEvent } from "./Event";
import { EventArguments } from "./EventInterfaces";
import { AccountState } from "../sim/accountState";
import { eventStackLoop } from "../sim";
import { convertTime } from "src/utils";



export class Transfer extends AccountEvent {
    transferAmount: number;
    percentMode: boolean;
    from: Account;
    to: Account;
    approveTransfer: boolean | null = null;  //maybe initialize in constructor?

    
    constructor({value = 0, percentMode = false, accounts = [], ...kwargs}: EventArguments) {
        super({_precedence_: 4}, {accounts, ...kwargs});
        this.transferAmount = value;
        this.percentMode = percentMode;
        this.from = accounts[0];
        this.to = accounts[1];
    };
    
    public Functor(E: AccountState, account: Account): boolean {
        
        //Value Mode 
        const transferAmount = (this.percentMode) ? 
            this.from.bundle.state!.mulBal(this.transferAmount / 100) : this.transferAmount;

        //Receiving account
        if (account === this.to) {
            const fromPendingEvents = this.from.bundle.pendingEvents;
            const from_E = this.from.bundle.state;

            //Apply Transfer if the sending account has approved
            if (this.approveTransfer === true) {
                this.applyTransfer(transferAmount);
                return false;
            //If it hasn't calculated yet, switch to sending account's stack
            } else if (this.approveTransfer === null) {
                this.approveTransfer = true;
                eventStackLoop(fromPendingEvents, from_E!, this.from);
                return true;
            };
        //Sending Account
        } else if (account === this.from) {
            if (E.addBal(-transferAmount) >= 0) {
                const toPendingEvents = this.to.bundle.pendingEvents;
                const to_E = this.to.bundle.state;

                //Apply Transfer if the receiving account has approved
                if (this.approveTransfer === true) {
                    this.applyTransfer(transferAmount);
                    return false;
                //Otherwise switch to receiving account's stack
                } else {
                    this.approveTransfer = true;
                    eventStackLoop(toPendingEvents, to_E!, this.to);
                    return true;
                };
            } else {
                const approved = this.approveTransfer;
                this.approveTransfer = false;
                return !approved;
            };
        };
        return true;
    };


    private applyTransfer(transferAmount: number): void {
        //Get states
        const to_E = this.to.bundle.state;
        const from_E = this.from.bundle.state;

        //Get last event times
        const t1 = this.eventTime;
        const to_t0 = to_E!.t0;
        const from_t0 = from_E!.t0;
        to_E!.t0 = from_E!.t0 = t1;

        //Accrue interests separately
        to_E!.accruedInterest = to_E!.Accrue(to_t0, t1)
        from_E!.accruedInterest = from_E!.Accrue(from_t0, t1)

        //Transfer balances
        to_E!.bal = to_E!.addBal(transferAmount);
        from_E!.bal = from_E!.addBal(-transferAmount);
    };
};