import { EventTable } from "../types";
import Account from "./Account";



export default class CheckingAccount extends Account {
    public generateInterestPeriods(time_domain: number[], step: number): EventTable {
        return this.events;
    }
};