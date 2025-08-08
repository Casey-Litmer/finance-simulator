
// Create a table (object or map) to track function times
let functionTimeTable: { [key: string]: number } = {};

export default function Profile<T extends (...args: any[]) => any>(func: T): T {
    return function(...args: any[]) {
        const start = performance.now(); // Start time

        // Call the original function
        const result = func(...args);

        const end = performance.now(); // End time
        const timeTaken = (end - start) / 1000; // Calculate time difference

        // Update the table with the function name and execution time
        if (functionTimeTable[func.name]) {
            functionTimeTable[func.name] += timeTaken; // Add to existing time if it was already recorded
        } else {
            functionTimeTable[func.name] = timeTaken; // Initialize if not present
        };

        return result;
    } as T;
};


export function showProfile() {
    // You can log or return the time table if needed
    console.table(functionTimeTable); // Logs the current time table
};


export function clearProfile() {
    functionTimeTable = {};
};
