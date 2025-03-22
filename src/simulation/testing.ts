import { DateTime } from "luxon";
import CheckingAccount from "./accounts/CheckingAccount";
import SavingsAccount from "./accounts/SavingsAccount";
import Deposit from "./events/Deposit";
import PeriodicTransfer from "./events/PeriodicTransfer";
import PeriodicDeposit from "./events/PeriodicDeposit";
import PeriodicWithdrawal from "./events/PeriodicWithdrawal";
import Withdrawal from "./events/Withdrawal";
import Adjustment from "./events/Adjustment";
import Transfer from "./events/Transfer";
import { floatToDateTime, dateTimeToFloat, REF_DATE, REF_TIME, formatDatetime } from "./helpers/timeMethods";
import { SimulationData } from "./types";
import runSim, { ACCOUNTS } from "./sim/simulation";
import { showProfile } from "./benchmarking/Profiler";
//import createPlot from "./Plot";
import { makeEventQueue } from "./helpers/eventTableMethods";
import Account, { LAST_ACCOUNT_ID, resetLastAccountID } from "./accounts/Account";
import { EVENTS } from "./events/Event";
import CloseAccount from "./events/CloseAccount";






export default function SimulationTest(start:number, stop:number): SimulationData {

    resetLastAccountID()
    ACCOUNTS.length = 0;
    EVENTS.length = 0;

    const open_date_a = DateTime.utc(2024,10,1);
    const open_date_b = DateTime.utc(2024,10,18);
    const today = DateTime.utc(2025,1,7);


    const A = new CheckingAccount({name: "Checking", initialBal: 1000, openDate: open_date_a});
    const B = new SavingsAccount({name:"Savings", initialBal:0, interestRate:0.5, openDate:open_date_b});


    const initialTransfer = new Transfer({value:300, eventTime:open_date_b.plus({days:30}), accounts:[A, B]});
    const depositB = new Deposit({value:200, eventTime:open_date_b.plus({days:20}), accounts:[B]});

    const transferAB = new PeriodicTransfer({value:10, eventTime:open_date_b.plus({days:25}), eventPeriod:5, accounts:[B,A]});

    const closeB = new CloseAccount({eventTime:open_date_b.plus({days:120}), accounts:[B]});

    ACCOUNTS.push(...[A,B]);


    const bal_step = 1;
    const end_date = open_date_a.plus({days: 90});

    const SimData  = runSim({xDomain: {start, stop, step: bal_step}, accounts:ACCOUNTS, events:EVENTS});

    /*
    for (const id in AccountsData) {
        const account_data = AccountsData[id];

        console.log('\n');
        console.log(account_data.account.name);
        printBalances(account_data.timeDomain, account_data.bals);
    }
    */

    //console.log(dateToFloat(today));
    //console.log('A events:', makeEventQueue(A.events));

    console.log('simulation ran', start, stop);


    return SimData;
}



function printBalances(timeDomain: number[], balances: (number | null)[]): void {
    for (let i = 0; i < timeDomain.length; i++) {
        const t = timeDomain[i];
        const bal = balances[i];
        console.log(formatDatetime(floatToDateTime(t), 'ymd'),
                    '---', bal);
    }  
}




////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
if (require.main === module) {
    const data = Main();
    showProfile();

    createPlot(data);
}*/