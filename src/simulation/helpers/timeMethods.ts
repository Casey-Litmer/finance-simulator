import { DateTime } from "luxon";



/**
 * Converts DateTime to number of DAYS past since 1/1/2000.
 * @param datetime : DateTime
 * @returns : number
 */
export function dateTimeToFloat(datetime: DateTime): number {
    //return (date.getTime() - REF_DATE.getTime()) / 1000 / (24 * 60 * 60);
    return (datetime.toSeconds() - REF_DATE.toSeconds()) / (24 * 60 * 60);
};

/**
 * Converts number of DAYS past since 1/1/2000 to DateTime.
 * #A year is just an increment of 365 days, not factoring for leap years
 * @param t : number
 * @returns : DateTime
 */
export function floatToDateTime(t: number): DateTime {
    return REF_DATE.plus({days: t});
};

/**
 * Converts Date to number of DAYS past since 1/1/2000.
 * @param date : Date
 * @returns : number
 */
export function jsDateToFloat(date: Date): number {
    return dateTimeToFloat(DateTime.fromJSDate(date).minus({days:1}));
};

/**
 * Converts number of DAYS past since 1/1/2000 to Date.
 * #A year is just an increment of 365 days, not factoring for leap years
 * @param t : number
 * @returns : Date
 */
export function floatToJsDate(t: number): Date {
    return floatToDateTime(t ? t+1 : REF_TIME+1).toJSDate();
};


//Overloads
export function convertTime(time: DateFloat | null, out: 'DateTime'): DateTime;
export function convertTime(time: DateFloat | null, out: 'number'): number;
export function convertTime(time: DateFloat | null, out: 'Date'): Date;

/**
 * Converts all time formats to 'out' type.
 * @param time : DateFloat | null
 * @param out : 'Date' | 'number' | 'DateTime'
 * @returns : DateFloat
 */
export function convertTime(
    time: DateFloat | null,
    out: 'Date' | 'number' | 'DateTime'
) {
    const time_ = time ?? REF_TIME;

    if (typeof time_ === 'number') {
        if (out === 'DateTime') return floatToDateTime(time_);
        if (out === 'Date') return floatToJsDate(time_);
        return time_ as number;
    };

    if (time_ instanceof DateTime) {
        if (out === 'number') return dateTimeToFloat(time_);
        if (out === 'Date') return time_.toJSDate();
        return time_ as DateTime;
    };

    if (time_ instanceof Date) {
        if (out === 'number') return jsDateToFloat(time_);
        if (out === 'DateTime') return DateTime.fromJSDate(time_);
        return time_ as Date;
    };

    throw new Error('Invalid input type for convertTime');
};



export const REF_DATE = DateTime.utc(2000, 1, 1);
export const REF_TIME = dateTimeToFloat(REF_DATE);
export type DateFloat = DateTime | number | Date;


/**
 * Alternate display for Date
 */
export function formatDatetime(date: DateFloat, mode: 'mdy' | 'ymd' | 'plot' = 'mdy'): string {
    const date_ = convertTime(date, 'DateTime');
    const month = date_.month;
    const day = date_.day;
    const year = date_.year;

    switch (mode) {
        case 'mdy': return `${month}/${day}/${year}`;
        case 'ymd': return `${year}/${month}/${day}`.padEnd(15, ' ');
        case 'plot': return `${year}-${month}-${day}`; 
    };
};




/**
 * Switches the behavior of adding a period `n` to a date (accepts float time).
 * Returns the date with the added interval.
 * 
 * @param date - The base date to which the interval will be added.
 * @param n - The period to be added. A float for constant mode, an integer for monthly mode.
 * @param mode - A string specifying the mode of adding the interval:
 *   - `'constant'`: Adds `n` days to the date. .
 *   - `'monthly'`: Adds `n` months to the date. Used for intervals that occur on the same day of each month.
 *     Can only be used if the day of the month is <= 28.
 * 
 * @returns A new date with the interval added according to the specified mode.
 */
export function addPeriod(t: number, n: number, mode = 'constant'): number {
    const _modes = ['constant', 'monthly'];

    const date = floatToDateTime(t);
    const month = date.month; 
    const day = date.day;
    const year = date.year;

    if (mode === 'constant') { 
        return dateTimeToFloat(date.plus({days: n}));

    } else if (mode === 'monthly') {
        const add_month = month + n - 1;
        const new_year = year + Math.floor(add_month/12);
        const new_month = add_month % 12 + 1;  //check for negative bullshits

        return dateTimeToFloat(DateTime.utc(new_year, new_month, day));

    } else {
        throw new Error(`
            ${mode} is not a mode! \n 
            Valid modes are: ${_modes}
            `);
    };
};