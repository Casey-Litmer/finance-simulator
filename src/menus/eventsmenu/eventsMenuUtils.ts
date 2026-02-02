import { EventJSON } from "src/types";
import { convertTime } from "src/utils";



export const valueLabelFromEventType = (eventType: string): string => {
    if (eventType === 'Change Interest Rate') return 'New Rate';
    if (eventType === 'Adjustment') return 'New Balance';
    return 'Amount';
};

//=================================================================================
// Validations
//=================================================================================

export const validateValueBounds = (valueLabel: string) => (value: any) => {
    return value < 0 ? `${valueLabel} must be positive` : true;
};

export const validatePercentValueBounds = (valueLabel: string) => (value: any) => {
    return (value < 0 || value > 100) ?
        `${valueLabel} must be in the range [0%, 100%]` : true;
};

export const validatePeriodBounds = (periodUnits?: string) => (value: any) => {
    return value < 1 ? `Event period must be >= 1 ${periodUnits}` : true;
};

export const validateInterestRateBounds = () => (value: any) => {
    return (value > 1 || value < 0) ?
        'Interest rate must be in the range [0, 100]' : true;
};

export const validateMonthlyCanUseDay = (currentState: EventJSON) => (_: any) => {
    const isMonthlyMode = currentState.args.periodMode === 'monthly';
    const isPeriodic = currentState.eventType.includes('Periodic');
    const dayOfMonth = convertTime(currentState.args.eventTime, 'DateTime').day;
    return (isMonthlyMode && isPeriodic && dayOfMonth >= 29 + 1) ?
        'Monthly mode can only be used on days up to the 28th of the month.' : true;
};

export const validateMonthlyPeriodIsInt = (currentState: EventJSON) => (_: any) => {
    const isMonthlyMode = currentState.args.periodMode === 'monthly';
    const isPeriodic = currentState.eventType.includes('Periodic');
    const period = currentState.args.eventPeriod;
    return (isMonthlyMode && isPeriodic && period !== Math.floor(period!)) ?
        'Monthly mode requires an integer number of months.' : true;
};
