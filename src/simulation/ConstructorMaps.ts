import { Account, AccountConstructor, CheckingAccount, SavingsAccount } from "./accounts"
import { AccountEvent, 
    Adjustment, 
    ChangeInterestRate, 
    CloseAccount, 
    Deposit, 
    EventConstructor, 
    PeriodicDeposit, 
    PeriodicTransfer, 
    PeriodicWithdrawal, 
    Transfer, 
    Withdrawal 
} from "./events"


//=================================================================================

export const AccountConstructorMap = {
    'Account': Account,
    'Checking Account': CheckingAccount,
    'Savings Account': SavingsAccount
} as Record<string, AccountConstructor>


export const EventConstructorMap = {
    'Event': AccountEvent,
    'Deposit': Deposit,
    'Withdrawal': Withdrawal,
    'Transfer': Transfer,
    'Periodic Deposit': PeriodicDeposit,
    'Periodic Withdrawal': PeriodicWithdrawal,
    'Periodic Transfer': PeriodicTransfer,
    'Close Account': CloseAccount,
    'Change Interest Rate': ChangeInterestRate,
    'Adjustment': Adjustment
} as Record<string, EventConstructor>