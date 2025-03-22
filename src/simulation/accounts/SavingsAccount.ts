import { convertTime, REF_DATE } from "../helpers/timeMethods";
import { AccountArguments } from "./AccountInterfaces";
import Account from "./Account";




export default class SavingsAccount extends Account {
    constructor({
        interestRate = 0,
        interestPeriod = 1,
        periodStart = REF_DATE,
        ...kwargs}: AccountArguments) {
            super(kwargs);

            this.interestPeriod = interestPeriod;
            this.interestRate = interestRate;
            this.periodStart = convertTime(periodStart, 'DateTime');
        }
};