import Account, { AccountConstructor } from "./accounts/Account"
import CheckingAccount from "./accounts/CheckingAccount"
import SavingsAccount from "./accounts/SavingsAccount"
import Adjustment from "./events/Adjustment"
import ChangeInterestRate from "./events/ChangeInterestRate"
import CloseAccount from "./events/CloseAccount"
import Deposit from "./events/Deposit"
import AccountEvent, { EventConstructor } from "./events/Event"
import PeriodicDeposit from "./events/PeriodicDeposit"
import PeriodicTransfer from "./events/PeriodicTransfer"
import PeriodicWithdrawal from "./events/PeriodicWithdrawal"
import Transfer from "./events/Transfer"
import Withdrawal from "./events/Withdrawal"



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