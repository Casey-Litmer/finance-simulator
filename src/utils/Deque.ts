

/**
 * Double Ended Queue with O(1) popLeft and popRight.
 * Use .get(n) to retrieve values because ts can't reassign [n] 
 * Use getItems() to return a proper Array without empty spaces (O(n)).
 */
export class Deque<T> {
    public items: T[];
    public head: number;
    public tail: number;

    constructor(items: T[] = []) {
        this.items = [...items]; // Create a shallow copy of the provided array
        this.head = 0;
        this.tail = items.length;
    }

    get length(): number {
        return this.tail - this.head;
    }

    isEmpty(): boolean {
        return this.length === 0;
    }

    pushLeft(...items: T[]): void {
        for (let i = items.length - 1; i >= 0; i--) {
            if (this.head === 0) {
                this.items.unshift(items[i]);
                this.tail++;
            } else {
                this.head--;
                this.items[this.head] = items[i];
            }
        }
    }
    
    pushRight(...items: T[]): void {
        for (const item of items) {
            this.items[this.tail] = item;
            this.tail++;
        }
    }

    popLeft(): T | undefined {
        const item = this.items[this.head];
        delete this.items[this.head];
        this.head++;
        return item;
    }

    popRight(): T | undefined {
        this.tail--;
        const item = this.items[this.tail];
        delete this.items[this.tail];
        return item;
    }

    getItems(): T[] {
        return this.items.slice(this.head, this.tail);
    }

    // Allow array-like indexing
    get(index: number): T {
        if (this.head + index > this.tail) {   ///check these bounds
            throw Error(`head ${this.head} index ${index} length ${this.length}`);
        }
        return this.items[this.head + index];
    }

    slice(start: number = 0, end?: number): Deque<T> {
        const adjustedStart = this.head + start;
        const adjustedEnd = end !== undefined ? this.head + end : this.tail;
        return new Deque(this.items.slice(adjustedStart, adjustedEnd));
    }

    // Make the deque iterable
    [Symbol.iterator](): Iterator<T> {
        let index = this.head;
        const tail = this.tail;
        const items = this.items;

        return {
            next(): IteratorResult<T> {
                if (index < tail) {
                    return { value: items[index++], done: false };
                }
                return { value: undefined as any, done: true };
            },
        };
    }
}