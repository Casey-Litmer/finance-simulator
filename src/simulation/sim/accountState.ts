

export class AccountState {
    bal: number | null = 0;
    t0: number = 0;
    r: number = 0;
    Q: number = 1;
    d: number = 0;

    prorate: boolean = true;
    accruedInterest: number = 0;
    open: boolean = false;


    constructor(init?: Partial<AccountState>) {
        if (init) Object.assign(this, init);
    }


    public Accrue(t0: number, t1: number): number {
        //#https://www.desmos.com/calculator/siyzokyahi

        const x = ( typeof this.bal === 'number') ? this.bal : 0;
        const r = this.r;
        const Q = this.Q;
        const d = this.d;
        const I = this.accruedInterest;

        if (this.prorate) {
            const delta = (t1 - d) / Q - (t0 - d) / Q;
            return (x + I) * (1 + r*Q/365) ** delta - x;
        } else {
            const delta = Math.floor((t1 - d) / Q) - Math.floor((t0 - d) / Q)  //This will be either 1 or 0 but the symmetry in equations is nice
            return x * (1 + r*Q/365) ** delta - x;
        }
    }

    public addBal(x: number): number {
        return typeof this.bal === 'number' ? this.bal + x : x
    }

    public mulBal(x: number): number {
        return typeof this.bal === 'number' ? this.bal * x : 0;
    }
}